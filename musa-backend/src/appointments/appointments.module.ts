import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointments.entity';
import { Service as ServiceEntity } from '../services/services.entity';
import { Professional } from '../professionals/professionals.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';
import { AvailabilityException } from 'src/availability-exception/entities/availability-exception.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      ServiceEntity,
      Professional,
      AvailabilityRule,
      AvailabilityException,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
