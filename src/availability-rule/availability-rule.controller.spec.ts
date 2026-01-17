import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityRuleController } from './availability-rule.controller';
import { AvailabilityRuleService } from './availability-rule.service';

describe('AvailabilityRuleController', () => {
  let controller: AvailabilityRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityRuleController],
      providers: [AvailabilityRuleService],
    }).compile();

    controller = module.get<AvailabilityRuleController>(AvailabilityRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
