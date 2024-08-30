import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Impuesto } from '../../modules/impuestos/entities/impuesto.entity';
import { ImpuestosMock } from './impuestos.mock';

@Injectable()
export class ImpuestosSeed {
  constructor(
    @InjectRepository(Impuesto)
    private readonly impuestosRepository: Repository<Impuesto>,
  ) {}

  async seed() {
    console.log('Seed impuestos inicializado');
    const existingImpuestosNames = (await this.impuestosRepository.find()).map(
      (impuesto) => impuesto.nombre,
    );

    for (const impuestosData of ImpuestosMock) {
      if (!existingImpuestosNames.includes(impuestosData.nombre)) {
        const impuesto = new Impuesto();
        impuesto.nombre = impuestosData.nombre;
        impuesto.agente = impuestosData.agente;
        console.log('Creando impuesto: ', impuesto.nombre);
        await this.impuestosRepository.save(impuesto);
      }
    }
  }
}
