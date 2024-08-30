import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from '../../modules/servicios/entities/servicio.entity';
import { ServiciosMock } from './servicios.mock';

@Injectable()
export class ServiciosSeed {
  constructor(
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
  ) {}

  async seed() {
    console.log('Seed servicios inicializado');

    for (const element of ServiciosMock) {
      const nombre = element.nombre;

      const existe = await this.serviciosRepository.findOne({
        where: { nombre },
      });

      if (existe) {
        return;
      } else {
        const servicio = new Servicio();
        Object.assign(servicio, element);
        console.log('Creando servicio', servicio.nombre);
        await this.serviciosRepository.save(servicio);
      }
    }
  }
}
