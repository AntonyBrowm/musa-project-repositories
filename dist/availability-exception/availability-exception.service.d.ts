import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';
export declare class AvailabilityExceptionService {
    create(createAvailabilityExceptionDto: CreateAvailabilityExceptionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAvailabilityExceptionDto: UpdateAvailabilityExceptionDto): string;
    remove(id: number): string;
}
