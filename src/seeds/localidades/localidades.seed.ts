import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Repository } from 'typeorm';
import { LocalidadesMock } from './localidades.mock';

@Injectable()
export class LocalidadesSeed {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    @InjectRepository(Provincia)
    private readonly provinciasRepository: Repository<Provincia>,
  ) {}

  async seed() {
    // Obtener la provincia de Mendoza
    console.log('Seed localidades inicializado');
    const provinciaMendoza = await this.provinciasRepository.findOne({
      where: { nombre: 'Mendoza' },
    });

    if (!provinciaMendoza) {
      console.error('No se encontró la provincia de Mendoza');
      return;
    }

    // Obtener todos los nombres de localidades existentes de una vez
    const existingLocalidadesNames = (
      await this.localidadesRepository.find()
    ).map((localidad) => localidad.nombre);

    for (const localidadesData of LocalidadesMock) {
      if (!existingLocalidadesNames.includes(localidadesData.nombre)) {
        const localidad = new Localidad();
        localidad.nombre = localidadesData.nombre;
        localidad.provincia = provinciaMendoza; // Vincular a la provincia de Mendoza
        await this.localidadesRepository.save(localidad);
        console.log(
          `Localidad ${localidad.nombre} guardada en provincia ${provinciaMendoza.nombre}`,
        );
      }
    }
  }
}
