import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './professionals.entity';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() dto: CreateProfessionalDto): Promise<Professional> {
    return this.professionalsService.create(dto);
  }

  @Get()
  findAll(): Promise<Professional[]> {
    return this.professionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Professional> {
    return this.professionalsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfessionalDto,
  ): Promise<Professional> {
    return this.professionalsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.professionalsService.remove(id);
  }
}
