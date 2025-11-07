import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './professionals.entity';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { Category } from 'src/categories/entities/category.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional, Category, AvailabilityRule]),
  ],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [TypeOrmModule],
})
export class ProfessionalsModule {}
