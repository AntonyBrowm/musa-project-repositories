import { Injectable } from '@nestjs/common';
import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';

@Injectable()
export class AvailabilityExceptionService {
  create(createAvailabilityExceptionDto: CreateAvailabilityExceptionDto) {
    return 'This action adds a new availabilityException';
  }

  findAll() {
    return `This action returns all availabilityException`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availabilityException`;
  }

  update(id: number, updateAvailabilityExceptionDto: UpdateAvailabilityExceptionDto) {
    return `This action updates a #${id} availabilityException`;
  }

  remove(id: number) {
    return `This action removes a #${id} availabilityException`;
  }
}
