import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelevamientosMock } from './relevamientos.mock';
import { Relevamiento } from '../../modules/relevamientos/entities/relevamiento.entity';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';

@Injectable()
export class RelevamientosSeed {
  constructor(
    @InjectRepository(Relevamiento)
    private readonly relevamientosRepository: Repository<Relevamiento>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    @InjectRepository(Localidad)
    private readonly localidadRepository: Repository<Localidad>,
  ) {}

  async seed() {
    console.log('Seed relevamientos inicializado');
    
    const relevamientosExistentes = (await this.relevamientosRepository.find()).map(
      (relevamiento) => relevamiento.email,
    );

    for (const relevamientoData of RelevamientosMock) {
      if (!relevamientosExistentes.includes(relevamientoData.email)) {
        const fetchedProvincia = await this.provinciaRepository.findOne({
          where: { nombre: relevamientoData.provincia },
        });

        if (!fetchedProvincia) {
          console.log(`La provincia ${relevamientoData.provincia} no existe`);
          continue;
        }

        const fetchedLocalidad = await this.localidadRepository.findOne({
          where: { nombre: relevamientoData.localidad },
        });

        if (!fetchedLocalidad) {
          console.warn(`La localidad ${relevamientoData.localidad} no existe`);
          continue;
        }

        const relevamiento = new Relevamiento();
        relevamiento.agente = relevamientoData.agente;
        relevamiento.nombre = relevamientoData.nombre;
        relevamiento.email = relevamientoData.email;
        relevamiento.telefono = relevamientoData.telefono;
        relevamiento.razon = relevamientoData.razon;
        relevamiento.direccion = relevamientoData.direccion;
        relevamiento.latitud = relevamientoData.latitud;
        relevamiento.longitud = relevamientoData.longitud;
        relevamiento.provincia = fetchedProvincia;
        relevamiento.localidad = fetchedLocalidad;

        await this.relevamientosRepository.save(relevamiento);
      }
    }
  }
}
