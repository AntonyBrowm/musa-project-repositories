import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityRuleService } from './availability-rule.service';

describe('AvailabilityRuleService', () => {
  let service: AvailabilityRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilityRuleService],
    }).compile();

    service = module.get<AvailabilityRuleService>(AvailabilityRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
