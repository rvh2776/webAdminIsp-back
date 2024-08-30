import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Repository } from 'typeorm';
import { ProvinciasMock } from './provincias.mock';

@Injectable()
export class ProvinciasSeed {
  constructor(
    @InjectRepository(Provincia)
    private readonly provinciasRepository: Repository<Provincia>,
  ) {}

  // async onModuleInit() {
  //   console.log('Seed provincias inicializado');
  //   await this.seed();
  // }

  async seed() {
    // Obtener todos los nombres de Provincia existentes de una vez
    console.log('Seed provincias inicializado');
    const existingProvinciasNames = (
      await this.provinciasRepository.find()
    ).map((provincia) => provincia.nombre);

    for (const provinciasData of ProvinciasMock) {
      if (!existingProvinciasNames.includes(provinciasData.nombre)) {
        const provincia = new Provincia();
        provincia.nombre = provinciasData.nombre;
        await this.provinciasRepository.save(provincia);
      }
    }
  }
}
