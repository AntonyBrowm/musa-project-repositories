import { Repository } from 'typeorm';
import { Service } from './services.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category } from 'src/categories/entities/category.entity';
export declare class ServicesService {
    private readonly serviceRepo;
    private readonly categoryRepository;
    constructor(serviceRepo: Repository<Service>, categoryRepository: Repository<Category>);
    create(dto: CreateServiceDto): Promise<Service>;
    findAll(): Promise<Service[]>;
    findOne(id: number): Promise<Service>;
    update(id: number, dto: UpdateServiceDto): Promise<Service>;
    remove(id: number): Promise<void>;
    createBulk(dtos: CreateServiceDto[]): Promise<Service[]>;
}
