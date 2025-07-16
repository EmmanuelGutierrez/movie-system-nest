import { Test, TestingModule } from '@nestjs/testing';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';

describe('ScreeningController', () => {
  let controller: ScreeningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreeningController],
      providers: [ScreeningService],
    }).compile();

    controller = module.get<ScreeningController>(ScreeningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
