import { DataSource, Repository } from 'typeorm';
import { CreateAvailabilityRuleDto } from './dto/create-availability-rule.dto';
import { UpdateAvailabilityRuleDto } from './dto/update-availability-rule.dto';
import { Professional } from '../professionals/professionals.entity';
import { AvailabilityRule } from './entities/availability-rule.entity';
import { BulkAvailabilityDto } from './dto/bulk-availability.dto';
export declare class AvailabilityRuleService {
    private readonly ruleRepo;
    private readonly professionalRepo;
    private readonly dataSource;
    constructor(ruleRepo: Repository<AvailabilityRule>, professionalRepo: Repository<Professional>, dataSource: DataSource);
    private normalizeTime;
    bulkUpsert(dto: BulkAvailabilityDto): Promise<{
        success: boolean;
        created: {
            id: number;
            dayOfWeek: number;
        }[];
        updated: {
            id: number;
            dayOfWeek: number;
        }[];
        removed: {
            id: number;
            dayOfWeek: number;
        }[];
    }>;
    create(dto: CreateAvailabilityRuleDto): Promise<AvailabilityRule>;
    findAll(): Promise<AvailabilityRule[]>;
    findOne(id: number): Promise<AvailabilityRule>;
    findByProfessional(professionalId: number): Promise<AvailabilityRule[]>;
    update(id: number, dto: UpdateAvailabilityRuleDto): Promise<AvailabilityRule>;
    remove(id: number): Promise<void>;
}
