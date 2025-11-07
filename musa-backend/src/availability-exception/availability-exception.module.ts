import { Module } from '@nestjs/common';
import { AvailabilityExceptionService } from './availability-exception.service';
import { AvailabilityExceptionController } from './availability-exception.controller';

@Module({
  controllers: [AvailabilityExceptionController],
  providers: [AvailabilityExceptionService],
})
export class AvailabilityExceptionModule {}
