import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityExceptionService } from './availability-exception.service';

describe('AvailabilityExceptionService', () => {
  let service: AvailabilityExceptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilityExceptionService],
    }).compile();

    service = module.get<AvailabilityExceptionService>(AvailabilityExceptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
