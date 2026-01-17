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
exports.ProfessionalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const professionals_entity_1 = require("./professionals.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const availability_rule_entity_1 = require("../availability-rule/entities/availability-rule.entity");
let ProfessionalsService = class ProfessionalsService {
    professionalRepo;
    categoryRepo;
    availabilityRepo;
    dataSource;
    constructor(professionalRepo, categoryRepo, availabilityRepo, dataSource) {
        this.professionalRepo = professionalRepo;
        this.categoryRepo = categoryRepo;
        this.availabilityRepo = availabilityRepo;
        this.dataSource = dataSource;
    }
    async create(dto) {
        const { name, number, color, active = true, categories: categoryIds = [], } = dto;
        if (!name?.trim())
            throw new common_1.BadRequestException('name es requerido');
        if (!Array.isArray(categoryIds)) {
            throw new common_1.BadRequestException('categories debe ser un array de ids');
        }
        const uniqueIds = Array.from(new Set(categoryIds));
        const categories = uniqueIds.length > 0
            ? await this.categoryRepo.findBy({ id: (0, typeorm_2.In)(uniqueIds) })
            : [];
        if (uniqueIds.length > 0 && categories.length !== uniqueIds.length) {
            const found = new Set(categories.map((c) => c.id));
            const missing = uniqueIds.filter((id) => !found.has(id));
            throw new common_1.BadRequestException(`Category ids inválidos: ${missing.join(',')}`);
        }
        return await this.dataSource.transaction(async (manager) => {
            const profRepo = manager.getRepository(professionals_entity_1.Professional);
            const newProf = profRepo.create({
                name: name.trim(),
                number,
                color,
                active,
            });
            const saved = await profRepo.save(newProf);
            if (categories.length > 0) {
                await manager
                    .createQueryBuilder()
                    .relation(professionals_entity_1.Professional, 'categories')
                    .of(saved.id)
                    .add(categories.map((c) => c.id));
            }
            const prof = await profRepo.findOne({
                where: { id: saved.id },
                relations: ['categories'],
            });
            if (!prof)
                throw new common_1.NotFoundException(`Profesional ${saved.id} no encontrado tras creación`);
            return prof;
        });
    }
    async findAll() {
        const professionals = await this.professionalRepo.find({
            where: { active: true },
        });
        const ids = professionals.map((p) => p.id);
        if (ids.length === 0)
            return [];
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
        const categoriesByProfessional = {};
        rawCategories.forEach((row) => {
            const profId = row.professional_id;
            if (!categoriesByProfessional[profId])
                categoriesByProfessional[profId] = [];
            categoriesByProfessional[profId].push({
                id: row.id,
                name: row.name,
                number: row.number,
                description: row.description,
                active: row.active,
            });
        });
        const rules = await this.availabilityRepo.find({
            where: {
                professional: { id: (0, typeorm_2.In)(ids) },
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
        const rulesByProfessional = {};
        rules.forEach((r) => {
            const profId = r.professional.id;
            if (!rulesByProfessional[profId])
                rulesByProfessional[profId] = [];
            rulesByProfessional[profId].push({
                id: r.id,
                day: r.dayOfWeek,
                dayName: DAY_NAMES[r.dayOfWeek],
                start_time: r.startTime,
                end_time: r.endTime,
                active: r.active,
            });
        });
        return professionals.map((p) => ({
            id: p.id,
            name: p.name,
            number: p.number,
            color: p.color,
            active: p.active,
            categories: categoriesByProfessional[p.id] || [],
            availability_rules: rulesByProfessional[p.id] || [],
        }));
    }
    async findOne(id) {
        const professional = await this.professionalRepo.findOne({ where: { id } });
        if (!professional)
            throw new Error('Profesional no encontrado');
        return professional;
    }
    async update(id, dto) {
        const { name, number, color, active, categories: newCategoryIds, } = dto;
        if (name !== undefined && !String(name).trim()) {
            throw new common_1.BadRequestException('name no puede estar vacío');
        }
        return await this.dataSource.transaction(async (manager) => {
            const profRepo = manager.getRepository(professionals_entity_1.Professional);
            const existing = await profRepo.findOne({
                where: { id },
                relations: ['categories'],
            });
            if (!existing)
                throw new common_1.NotFoundException('Profesional no encontrado');
            const partial = {};
            if (name !== undefined)
                partial.name = String(name).trim();
            if (color !== undefined)
                partial.color = color;
            if (number !== undefined)
                partial.number = number;
            if (active !== undefined)
                partial.active = active;
            if (Object.keys(partial).length > 0) {
                await profRepo.update(id, partial);
            }
            if (!Array.isArray(newCategoryIds)) {
                const prof = await profRepo.findOne({
                    where: { id },
                    relations: ['categories'],
                });
                if (!prof)
                    throw new common_1.NotFoundException(`Profesional ${id} no encontrado`);
                return prof;
            }
            const uniqueIds = Array.from(new Set(newCategoryIds));
            if (uniqueIds.some((d) => typeof d !== 'number')) {
                throw new common_1.BadRequestException('categories debe ser array de ids numéricos');
            }
            const categories = uniqueIds.length > 0
                ? await this.categoryRepo.findBy({ id: (0, typeorm_2.In)(uniqueIds) })
                : [];
            if (categories.length !== uniqueIds.length) {
                const found = new Set(categories.map((c) => c.id));
                const missing = uniqueIds.filter((cid) => !found.has(cid));
                throw new common_1.BadRequestException(`Category ids inválidos: ${missing.join(',')}`);
            }
            const existingIds = (existing.categories || []).map((c) => c.id);
            const toAdd = uniqueIds.filter((id) => !existingIds.includes(id));
            const toRemove = existingIds.filter((id) => !uniqueIds.includes(id));
            const relationQB = manager
                .createQueryBuilder()
                .relation(professionals_entity_1.Professional, 'categories')
                .of(id);
            if (toAdd.length > 0)
                await relationQB.add(toAdd);
            if (toRemove.length > 0)
                await relationQB.remove(toRemove);
            const prof = await profRepo.findOne({
                where: { id },
                relations: ['categories'],
            });
            if (!prof)
                throw new common_1.NotFoundException(`Profesional ${id} no encontrado`);
            return prof;
        });
    }
    async remove(id) {
        await this.dataSource.transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .delete()
                .from('professional_categories')
                .where('professional_id = :id', { id })
                .execute();
            await manager.delete(professionals_entity_1.Professional, id);
            return { success: true };
        });
    }
};
exports.ProfessionalsService = ProfessionalsService;
exports.ProfessionalsService = ProfessionalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(professionals_entity_1.Professional)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(availability_rule_entity_1.AvailabilityRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProfessionalsService);
//# sourceMappingURL=professionals.service.js.map