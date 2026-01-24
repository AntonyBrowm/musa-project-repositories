import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAvailabilityRuleDto } from './dto/create-availability-rule.dto';
import { UpdateAvailabilityRuleDto } from './dto/update-availability-rule.dto';
import { Professional } from '../professionals/professionals.entity';
import { AvailabilityRule } from './entities/availability-rule.entity';
import { BulkAvailabilityDto } from './dto/bulk-availability.dto';

@Injectable()
export class AvailabilityRuleService {
  constructor(
    @InjectRepository(AvailabilityRule)
    private readonly ruleRepo: Repository<AvailabilityRule>,
    @InjectRepository(Professional)
    private readonly professionalRepo: Repository<Professional>,
    private readonly dataSource: DataSource, // inyecta DataSource para transacciones
  ) {}

  private normalizeTime(value: string): string {
    // espera "HH:mm" o "HH:mm:ss" y devuelve "HH:mm:ss"
    if (!value) return value;
    const parts = value.split(':');
    if (parts.length === 2)
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
    if (parts.length === 3)
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
    throw new BadRequestException(
      'Formato de hora inválido, use HH:mm o HH:mm:ss',
    );
  }
  async bulkUpsert(dto: BulkAvailabilityDto) {
    const {
      professionalId,
      days,
      startTime: startIn = '09:00',
      endTime: endIn = '18:00',
      active = true,
    } = dto;

    if (!Array.isArray(days))
      throw new BadRequestException('days debe ser un array de números 0-6');
    if (days.some((d) => typeof d !== 'number' || d < 0 || d > 6))
      throw new BadRequestException('Cada day debe ser número entre 0 y 6');

    const professional = await this.professionalRepo.findOne({
      where: { id: professionalId },
    });
    if (!professional) throw new NotFoundException('Profesional no encontrado');

    const startTime = this.normalizeTime(startIn);
    const endTime = this.normalizeTime(endIn);
    if (startTime >= endTime)
      throw new BadRequestException('startTime debe ser menor que endTime');

    // Ejecutar todo en transacción
    return await this.dataSource.transaction(async (manager) => {
      // usar manager para queries atómicas
      const repo = manager.getRepository(AvailabilityRule);

      // obtener reglas existentes para el profesional
      const existing = await repo.find({
        where: { professional: { id: professionalId } },
      });

      // Map dayOfWeek -> rule
      const existingByDay = new Map<number, AvailabilityRule>();
      existing.forEach((r) => existingByDay.set(r.dayOfWeek, r));

      const toCreate: Partial<AvailabilityRule>[] = [];
      const toUpdate: { id: number; payload: Partial<AvailabilityRule> }[] = [];
      const keptDays = new Set<number>();

      for (const day of days) {
        const ex = existingByDay.get(day);
        if (ex) {
          // si existe, verificar si hay cambios y actualizar
          const payload: Partial<AvailabilityRule> = {
            startTime,
            endTime,
            active,
          };
          // solo actualizar si hay cambio (opcional)
          if (
            ex.startTime !== startTime ||
            ex.endTime !== endTime ||
            ex.active !== active
          ) {
            toUpdate.push({ id: ex.id, payload });
          }
          keptDays.add(day);
        } else {
          // crear nueva regla
          toCreate.push({
            professional,
            dayOfWeek: day,
            startTime,
            endTime,
            active,
          });
          keptDays.add(day);
        }
      }

      // días a eliminar: existentes que no están en payload.days
      const toRemove = existing.filter((r) => !keptDays.has(r.dayOfWeek));

      // Ejecutar operaciones
      const created: AvailabilityRule[] = [];
      const updated: AvailabilityRule[] = [];
      const removed: { id: number; dayOfWeek: number }[] = [];

      if (toCreate.length > 0) {
        const saved = await repo.save(toCreate as AvailabilityRule[]);
        created.push(...saved);
      }

      for (const u of toUpdate) {
        const rule = await repo.findOne({ where: { id: u.id } });
        if (!rule) continue;
        Object.assign(rule, u.payload);
        const saved = await repo.save(rule);
        updated.push(saved);
      }

      for (const r of toRemove) {
        await repo.remove(r);
        removed.push({ id: r.id, dayOfWeek: r.dayOfWeek });
      }

      return {
        success: true,
        created: created.map((c) => ({ id: c.id, dayOfWeek: c.dayOfWeek })),
        updated: updated.map((c) => ({ id: c.id, dayOfWeek: c.dayOfWeek })),
        removed,
      };
    });
  }
async create(dto: CreateAvailabilityRuleDto): Promise<AvailabilityRule[]> {
  const professional = await this.professionalRepo.findOne({
    where: { id: dto.professionalId },
  });

  if (!professional) {
    throw new NotFoundException('Profesional no encontrado');
  }

  const startTime = this.normalizeTime(dto.startTime);
  const endTime = this.normalizeTime(dto.endTime);

  if (startTime >= endTime) {
    throw new BadRequestException('startTime debe ser menor que endTime');
  }

  const rules = dto.days.map((day) => {
    if (day < 0 || day > 6) {
      throw new BadRequestException('dayOfWeek debe estar entre 0 y 6');
    }

    return this.ruleRepo.create({
      professional,
      dayOfWeek: day,
      startTime,
      endTime,
      active: dto.active ?? true,
    });
  });

  return this.ruleRepo.save(rules);
}


  async findAll(): Promise<AvailabilityRule[]> {
    return this.ruleRepo.find({
      relations: ['professional'],
      order: {
        professional: { id: 'ASC' },
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<AvailabilityRule> {
    const rule = await this.ruleRepo.findOne({
      where: { id },
      relations: ['professional'],
    });
    if (!rule) throw new NotFoundException('Regla no encontrada');
    return rule;
  }
  async findByProfessional(
    professionalId: number,
  ): Promise<AvailabilityRule[]> {
    const rules = await this.ruleRepo.find({
      where: { professional: { id: professionalId } },
      relations: ['professional'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
    if (!rules || rules.length === 0) {
      throw new NotFoundException(
        `No se encontraron reglas para el profesional ${professionalId}`,
      );
    }
    return rules;
  }

  async update(
    id: number,
    dto: UpdateAvailabilityRuleDto,
  ): Promise<AvailabilityRule> {
    const rule = await this.ruleRepo.findOne({
      where: { id },
      relations: ['professional'],
    });
    if (!rule) throw new NotFoundException('Regla no encontrada');

    if (dto.professionalId && dto.professionalId !== rule.professional.id) {
      const prof = await this.professionalRepo.findOne({
        where: { id: dto.professionalId },
      });
      if (!prof)
        throw new NotFoundException('Profesional (nuevo) no encontrado');
      rule.professional = prof;
    }

    if (dto.dayOfWeek !== undefined) {
      if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6)
        throw new BadRequestException('dayOfWeek debe estar entre 0 y 6');
      rule.dayOfWeek = dto.dayOfWeek;
    }

    if (dto.startTime !== undefined)
      rule.startTime = this.normalizeTime(dto.startTime);
    if (dto.endTime !== undefined)
      rule.endTime = this.normalizeTime(dto.endTime);
    if (rule.startTime >= rule.endTime)
      throw new BadRequestException('startTime debe ser menor que endTime');

    if (dto.active !== undefined) rule.active = dto.active;

    return this.ruleRepo.save(rule);
  }

  async remove(id: number): Promise<void> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Regla no encontrada');
    await this.ruleRepo.remove(rule);
  }
}
