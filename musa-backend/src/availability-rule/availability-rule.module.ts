import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityRuleService } from './availability-rule.service';
import { AvailabilityRuleController } from './availability-rule.controller';
import { AvailabilityRule } from './entities/availability-rule.entity';
import { Professional } from '../professionals/professionals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityRule, Professional])],
  controllers: [AvailabilityRuleController],
  providers: [AvailabilityRuleService],
  exports: [AvailabilityRuleService],
})
export class AvailabilityRuleModule {}
