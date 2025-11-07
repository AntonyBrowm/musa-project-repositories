import { AvailabilityExceptionService } from './availability-exception.service';
import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';
export declare class AvailabilityExceptionController {
    private readonly availabilityExceptionService;
    constructor(availabilityExceptionService: AvailabilityExceptionService);
    create(createAvailabilityExceptionDto: CreateAvailabilityExceptionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAvailabilityExceptionDto: UpdateAvailabilityExceptionDto): string;
    remove(id: string): string;
}
