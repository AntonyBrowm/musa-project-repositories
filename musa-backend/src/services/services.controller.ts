import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './services.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() body: CreateServiceDto) {
    const created = await this.servicesService.create(body);

    return {
      success: true,
      data: created,
    };
  }

  @Get()
  findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.servicesService.remove(id);
    return {
      success: true,
      data: deleted,
    };
  }

  @Post('bulk')
  async createBulk(@Body() services: CreateServiceDto[]) {
    return this.servicesService.createBulk(services);
  }
}
