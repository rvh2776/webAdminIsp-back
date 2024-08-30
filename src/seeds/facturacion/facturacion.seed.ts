import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { FacturacionMock } from './facturacion.mock';
import { Factura } from '../../modules/facturacion/entities/facturacion.entity';

@Injectable()
export class FacturacionSeed {
  constructor(
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
  ) {}

  async seed() {
    console.log('Seed facturación inicializado');
    // Seed facturación
  }
}
