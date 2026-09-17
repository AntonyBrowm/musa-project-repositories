"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const professionals_entity_1 = require("../professionals/professionals.entity");
const availability_rule_entity_1 = require("./entities/availability-rule.entity");
let AvailabilityRuleService = class AvailabilityRuleService {
    ruleRepo;
    professionalRepo;
    dataSource;
    constructor(ruleRepo, professionalRepo, dataSource) {
        this.ruleRepo = ruleRepo;
        this.professionalRepo = professionalRepo;
        this.dataSource = dataSource;
    }
    normalizeTime(value) {
        if (!value)
            return value;
        const parts = value.split(':');
        if (parts.length === 2)
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
        if (parts.length === 3)
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
        throw new common_1.BadRequestException('Formato de hora inválido, use HH:mm o HH:mm:ss');
    }
    async bulkUpsert(dto) {
        const { professionalId, days, startTime: startIn = '09:00', endTime: endIn = '18:00', active = true, } = dto;
        if (!Array.isArray(days))
            throw new common_1.BadRequestException('days debe ser un array de números 0-6');
        if (days.some((d) => typeof d !== 'number' || d < 0 || d > 6))
            throw new common_1.BadRequestException('Cada day debe ser número entre 0 y 6');
        const professional = await this.professionalRepo.findOne({
            where: { id: professionalId },
        });
        if (!professional)
            throw new common_1.NotFoundException('Profesional no encontrado');
        const startTime = this.normalizeTime(startIn);
        const endTime = this.normalizeTime(endIn);
        if (startTime >= endTime)
            throw new common_1.BadRequestException('startTime debe ser menor que endTime');
        return await this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(availability_rule_entity_1.AvailabilityRule);
            const existing = await repo.find({
                where: { professional: { id: professionalId } },
            });
            const existingByDay = new Map();
            existing.forEach((r) => existingByDay.set(r.dayOfWeek, r));
            const toCreate = [];
            const toUpdate = [];
            const keptDays = new Set();
            for (const day of days) {
                const ex = existingByDay.get(day);
                if (ex) {
                    const payload = {
                        startTime,
                        endTime,
                        active,
                    };
                    if (ex.startTime !== startTime ||
                        ex.endTime !== endTime ||
                        ex.active !== active) {
                        toUpdate.push({ id: ex.id, payload });
                    }
                    keptDays.add(day);
                }
                else {
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
            const toRemove = existing.filter((r) => !keptDays.has(r.dayOfWeek));
            const created = [];
            const updated = [];
            const removed = [];
            if (toCreate.length > 0) {
                const saved = await repo.save(toCreate);
                created.push(...saved);
            }
            for (const u of toUpdate) {
                const rule = await repo.findOne({ where: { id: u.id } });
                if (!rule)
                    continue;
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
    async create(dto) {
        const professional = await this.professionalRepo.findOne({
            where: { id: dto.professionalId },
        });
        if (!professional) {
            throw new common_1.NotFoundException('Profesional no encontrado');
        }
        const startTime = this.normalizeTime(dto.startTime);
        const endTime = this.normalizeTime(dto.endTime);
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('startTime debe ser menor que endTime');
        }
        const rules = dto.days.map((day) => {
            if (day < 0 || day > 6) {
                throw new common_1.BadRequestException('dayOfWeek debe estar entre 0 y 6');
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
    async findAll() {
        return this.ruleRepo.find({
            relations: ['professional'],
            order: {
                professional: { id: 'ASC' },
                dayOfWeek: 'ASC',
                startTime: 'ASC',
            },
        });
    }
    async findOne(id) {
        const rule = await this.ruleRepo.findOne({
            where: { id },
            relations: ['professional'],
        });
        if (!rule)
            throw new common_1.NotFoundException('Regla no encontrada');
        return rule;
    }
    async findByProfessional(professionalId) {
        const rules = await this.ruleRepo.find({
            where: { professional: { id: professionalId } },
            relations: ['professional'],
            order: { dayOfWeek: 'ASC', startTime: 'ASC' },
        });
        if (!rules || rules.length === 0) {
            throw new common_1.NotFoundException(`No se encontraron reglas para el profesional ${professionalId}`);
        }
        return rules;
    }
    async update(id, dto) {
        const rule = await this.ruleRepo.findOne({
            where: { id },
            relations: ['professional'],
        });
        if (!rule)
            throw new common_1.NotFoundException('Regla no encontrada');
        if (dto.professionalId && dto.professionalId !== rule.professional.id) {
            const prof = await this.professionalRepo.findOne({
                where: { id: dto.professionalId },
            });
            if (!prof)
                throw new common_1.NotFoundException('Profesional (nuevo) no encontrado');
            rule.professional = prof;
        }
        if (dto.dayOfWeek !== undefined) {
            if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6)
                throw new common_1.BadRequestException('dayOfWeek debe estar entre 0 y 6');
            rule.dayOfWeek = dto.dayOfWeek;
        }
        if (dto.startTime !== undefined)
            rule.startTime = this.normalizeTime(dto.startTime);
        if (dto.endTime !== undefined)
            rule.endTime = this.normalizeTime(dto.endTime);
        if (rule.startTime >= rule.endTime)
            throw new common_1.BadRequestException('startTime debe ser menor que endTime');
        if (dto.active !== undefined)
            rule.active = dto.active;
        return this.ruleRepo.save(rule);
    }
    async remove(id) {
        const rule = await this.ruleRepo.findOne({ where: { id } });
        if (!rule)
            throw new common_1.NotFoundException('Regla no encontrada');
        await this.ruleRepo.remove(rule);
    }
};
exports.AvailabilityRuleService = AvailabilityRuleService;
exports.AvailabilityRuleService = AvailabilityRuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(availability_rule_entity_1.AvailabilityRule)),
    __param(1, (0, typeorm_1.InjectRepository)(professionals_entity_1.Professional)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AvailabilityRuleService);
//# sourceMappingURL=availability-rule.service.js.map