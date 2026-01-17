import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './services.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateServiceDto) {
    const category = await this.categoryRepository.findOneBy({
      id: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

    const servicio = this.serviceRepo.create({
      ...dto,
      category,
    });
    const saved = await this.serviceRepo.save(servicio);
    return saved;
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({ where: { active: true } });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new Error('Servicio no encontrado');
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    await this.serviceRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.serviceRepo.delete(id);
  }

  // services.service.ts
  async createBulk(dtos: CreateServiceDto[]) {
    const created: Service[] = [];

    for (const dto of dtos) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category ${dto.categoryId} not found`);
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
}
