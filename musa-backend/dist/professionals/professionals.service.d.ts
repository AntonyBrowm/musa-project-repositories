import { DataSource, Repository } from 'typeorm';
import { Professional } from './professionals.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Category } from 'src/categories/entities/category.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';
export declare class ProfessionalsService {
    private readonly professionalRepo;
    private readonly categoryRepo;
    private readonly availabilityRepo;
    private readonly dataSource;
    constructor(professionalRepo: Repository<Professional>, categoryRepo: Repository<Category>, availabilityRepo: Repository<AvailabilityRule>, dataSource: DataSource);
    create(dto: CreateProfessionalDto): Promise<Professional>;
    findAll(): Promise<{
        id: number;
        name: string;
        number: string;
        color: string | undefined;
        active: boolean;
        categories: any[];
        availability_rules: any[];
    }[]>;
    findOne(id: number): Promise<Professional>;
    update(id: number, dto: UpdateProfessionalDto): Promise<Professional>;
    remove(id: number): Promise<void>;
}
