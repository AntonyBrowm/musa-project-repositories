import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Professional } from './professionals.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Category } from 'src/categories/entities/category.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepo: Repository<Professional>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(AvailabilityRule)
    private readonly availabilityRepo: Repository<AvailabilityRule>,
    private readonly dataSource: DataSource, // <-- inyectar DataSource
  ) {}

  async create(dto: CreateProfessionalDto): Promise<Professional> {
    const {
      name,
      number,
      email,
      color,
      active = true,
      categories: categoryIds = [],
    } = dto;

    if (!name?.trim()) throw new BadRequestException('name es requerido');

    if (!Array.isArray(categoryIds)) {
      throw new BadRequestException('categories debe ser un array de ids');
    }

    const uniqueIds = Array.from(new Set(categoryIds));
    const categories =
      uniqueIds.length > 0
        ? await this.categoryRepo.findBy({ id: In(uniqueIds) })
        : [];

    if (uniqueIds.length > 0 && categories.length !== uniqueIds.length) {
      const found = new Set(categories.map((c) => c.id));
      const missing = uniqueIds.filter((id) => !found.has(id));
      throw new BadRequestException(
        `Category ids inválidos: ${missing.join(',')}`,
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      const profRepo = manager.getRepository(Professional);
      const newProf = profRepo.create({
        name: name.trim(),
        number,
        email,
        color,
        active,
      });
      const saved = await profRepo.save(newProf);

      if (categories.length > 0) {
        await manager
          .createQueryBuilder()
          .relation(Professional, 'categories')
          .of(saved.id)
          .add(categories.map((c) => c.id));
      }

      // recargar el profesional con relaciones y validar no-null explícitamente
      const prof = await profRepo.findOne({
        where: { id: saved.id },
        relations: ['categories'],
      });
      if (!prof)
        throw new NotFoundException(
          `Profesional ${saved.id} no encontrado tras creación`,
        );
      return prof;
    });
  }

  async findAll() {

    const professionals = await this.professionalRepo.find({
      where: { active: true },
    });
    const ids = professionals.map((p) => p.id);
    if (ids.length === 0) return [];

    const rawCategories = await this.dataSource
      .createQueryBuilder()
      .select('pc.professional_id', 'professional_id')
      .addSelect('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.description', 'description')
      .addSelect('c.active', 'active')
      .from('professional_categories', 'pc')
      .innerJoin('categories', 'c', 'c.id = pc.category_id')
      .where('pc.professional_id IN (:...ids)', { ids })
      .getRawMany();

    const categoriesByProfessional: Record<number, any[]> = {};
    rawCategories.forEach((row) => {
      const profId = row.professional_id;
      if (!categoriesByProfessional[profId])
        categoriesByProfessional[profId] = [];
      categoriesByProfessional[profId].push({
        id: row.id,
        name: row.name,
        number: row.number,
        email: row.email,
        description: row.description,
        active: row.active,
      });
    });

    const rules = await this.availabilityRepo.find({
      where: {
        professional: { id: In(ids) },
      },
      relations: ['professional'],
    });

    const DAY_NAMES = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];

    const rulesByProfessional: Record<number, any[]> = {};
    rules.forEach((r) => {
      const profId = r.professional.id;
      if (!rulesByProfessional[profId]) rulesByProfessional[profId] = [];
      rulesByProfessional[profId].push({
        id: r.id,
        day: r.dayOfWeek,
        dayName: DAY_NAMES[r.dayOfWeek],
        start_time: r.startTime,
        end_time: r.endTime,
        active: r.active,
      });
    });

    // 4. Armar respuesta final
    return professionals.map((p) => ({
      id: p.id,
      name: p.name,
      number: p.number,
      email: p.email,
      color: p.color,
      active: p.active,
      categories: categoriesByProfessional[p.id] || [],
      availability_rules: rulesByProfessional[p.id] || [],
    }));
  }

  async findOne(id: number): Promise<Professional> {
    const professional = await this.professionalRepo.findOne({ where: { id } });
    if (!professional) throw new Error('Profesional no encontrado');
    return professional;
  }

  async update(id: number, dto: UpdateProfessionalDto): Promise<Professional> {
    const {
      name,
      number,
      email,
      color,
      active,
      categories: newCategoryIds,
    } = dto as any;

    if (name !== undefined && !String(name).trim()) {
      throw new BadRequestException('name no puede estar vacío');
    }

    return await this.dataSource.transaction(async (manager) => {
      const profRepo = manager.getRepository(Professional);

      const existing = await profRepo.findOne({
        where: { id },
        relations: ['categories'],
      });
      if (!existing) throw new NotFoundException('Profesional no encontrado');

      const partial: Partial<Professional> = {};
      if (name !== undefined) partial.name = String(name).trim();
      if (color !== undefined) partial.color = color;
      if (number !== undefined) partial.number = number;
      if (email !== undefined) partial.email = email;
      if (active !== undefined) partial.active = active;

      if (Object.keys(partial).length > 0) {
        await profRepo.update(id, partial);
      }

      if (!Array.isArray(newCategoryIds)) {
        const prof = await profRepo.findOne({
          where: { id },
          relations: ['categories'],
        });
        if (!prof)
          throw new NotFoundException(`Profesional ${id} no encontrado`);
        return prof;
      }

      const uniqueIds = Array.from(new Set(newCategoryIds));
      if (uniqueIds.some((d) => typeof d !== 'number')) {
        throw new BadRequestException(
          'categories debe ser array de ids numéricos',
        );
      }

      const categories =
        uniqueIds.length > 0
          ? await this.categoryRepo.findBy({ id: In(uniqueIds) })
          : [];
      if (categories.length !== uniqueIds.length) {
        const found = new Set(categories.map((c) => c.id));
        const missing = uniqueIds.filter((cid) => !found.has(cid));
        throw new BadRequestException(
          `Category ids inválidos: ${missing.join(',')}`,
        );
      }

      const existingIds = (existing.categories || []).map((c) => c.id);
      const toAdd = uniqueIds.filter((id) => !existingIds.includes(id));
      const toRemove = existingIds.filter((id) => !uniqueIds.includes(id));

      const relationQB = manager
        .createQueryBuilder()
        .relation(Professional, 'categories')
        .of(id);
      if (toAdd.length > 0) await relationQB.add(toAdd);
      if (toRemove.length > 0) await relationQB.remove(toRemove);

      const prof = await profRepo.findOne({
        where: { id },
        relations: ['categories'],
      });
      if (!prof) throw new NotFoundException(`Profesional ${id} no encontrado`);
      return prof;
    });
  }

  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 2. Borrar relaciones en professional_categories
      await manager
        .createQueryBuilder()
        .delete()
        .from('professional_categories') // tabla intermedia
        .where('professional_id = :id', { id })
        .execute();

      // 3. Borrar el profesional
      await manager.delete(Professional, id);
      return { success: true };
    });
  }
}
