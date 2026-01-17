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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const services_entity_1 = require("./services.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let ServicesService = class ServicesService {
    serviceRepo;
    categoryRepository;
    constructor(serviceRepo, categoryRepository) {
        this.serviceRepo = serviceRepo;
        this.categoryRepository = categoryRepository;
    }
    async create(dto) {
        const category = await this.categoryRepository.findOneBy({
            id: dto.categoryId,
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${dto.categoryId} not found`);
        }
        const servicio = this.serviceRepo.create({
            ...dto,
            category,
        });
        const saved = await this.serviceRepo.save(servicio);
        return saved;
    }
    async findAll() {
        return this.serviceRepo.find({ where: { active: true } });
    }
    async findOne(id) {
        const service = await this.serviceRepo.findOne({ where: { id } });
        if (!service)
            throw new Error('Servicio no encontrado');
        return service;
    }
    async update(id, dto) {
        await this.serviceRepo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.serviceRepo.delete(id);
    }
    async createBulk(dtos) {
        const created = [];
        for (const dto of dtos) {
            const category = await this.categoryRepository.findOne({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category ${dto.categoryId} not found`);
            }
            const service = this.serviceRepo.create({
                name: dto.name,
                description: dto.description,
                durationMin: dto.durationMin,
                price: dto.price,
                active: dto.active ?? true,
                category,
            });
            created.push(service);
        }
        return this.serviceRepo.save(created);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(services_entity_1.Service)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map