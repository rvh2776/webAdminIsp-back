import { Test, TestingModule } from '@nestjs/testing';
import { LocalidadesService } from './localidades.service';

describe('LocalidadesService', () => {
  let service: LocalidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalidadesService],
    }).compile();

    service = module.get<LocalidadesService>(LocalidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
