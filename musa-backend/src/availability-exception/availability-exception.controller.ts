import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvailabilityExceptionService } from './availability-exception.service';
import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';

@Controller('availability-exception')
export class AvailabilityExceptionController {
  constructor(private readonly availabilityExceptionService: AvailabilityExceptionService) {}

  @Post()
  create(@Body() createAvailabilityExceptionDto: CreateAvailabilityExceptionDto) {
    return this.availabilityExceptionService.create(createAvailabilityExceptionDto);
  }

  @Get()
  findAll() {
    return this.availabilityExceptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityExceptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvailabilityExceptionDto: UpdateAvailabilityExceptionDto) {
    return this.availabilityExceptionService.update(+id, updateAvailabilityExceptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityExceptionService.remove(+id);
  }
}
