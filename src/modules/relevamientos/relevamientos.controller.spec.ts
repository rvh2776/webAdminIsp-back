import { Test, TestingModule } from '@nestjs/testing';
import { RelevamientosController } from './relevamientos.controller';
import { RelevamientosService } from './relevamientos.service';

describe('RelevamientosController', () => {
  let controller: RelevamientosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelevamientosController],
      providers: [RelevamientosService],
    }).compile();

    controller = module.get<RelevamientosController>(RelevamientosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
