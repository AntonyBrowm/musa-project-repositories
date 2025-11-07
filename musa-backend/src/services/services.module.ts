import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './services.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Category])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [TypeOrmModule],
})
export class ServicesModule {}
