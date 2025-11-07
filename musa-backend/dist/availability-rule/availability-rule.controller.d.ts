import { AvailabilityRuleService } from './availability-rule.service';
import { CreateAvailabilityRuleDto } from './dto/create-availability-rule.dto';
import { UpdateAvailabilityRuleDto } from './dto/update-availability-rule.dto';
import { BulkAvailabilityDto } from './dto/bulk-availability.dto';
export declare class AvailabilityRuleController {
    private readonly availabilityRuleService;
    constructor(availabilityRuleService: AvailabilityRuleService);
    create(createAvailabilityRuleDto: CreateAvailabilityRuleDto): Promise<import("./entities/availability-rule.entity").AvailabilityRule>;
    bulk(dto: BulkAvailabilityDto): Promise<{
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
    findAll(): Promise<import("./entities/availability-rule.entity").AvailabilityRule[]>;
    findOne(id: string): Promise<import("./entities/availability-rule.entity").AvailabilityRule[]>;
    update(id: string, updateAvailabilityRuleDto: UpdateAvailabilityRuleDto): Promise<import("./entities/availability-rule.entity").AvailabilityRule>;
    remove(id: string): Promise<void>;
}
