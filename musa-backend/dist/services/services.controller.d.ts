import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './services.entity';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(body: CreateServiceDto): Promise<{
        success: boolean;
        data: Service;
    }>;
    findAll(): Promise<Service[]>;
    findOne(id: number): Promise<Service>;
    update(id: number, dto: UpdateServiceDto): Promise<Service>;
    remove(id: number): {
        success: boolean;
        data: Promise<void>;
    };
    createBulk(services: CreateServiceDto[]): Promise<Service[]>;
}
