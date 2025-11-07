import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityExceptionController } from './availability-exception.controller';
import { AvailabilityExceptionService } from './availability-exception.service';

describe('AvailabilityExceptionController', () => {
  let controller: AvailabilityExceptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityExceptionController],
      providers: [AvailabilityExceptionService],
    }).compile();

    controller = module.get<AvailabilityExceptionController>(AvailabilityExceptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
