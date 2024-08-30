import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquiposMock } from './equipos.mock';
import { Equipo } from '../../modules/equipos/entities/equipo.entity';

@Injectable()
export class EquiposSeed {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  async seed() {
    // Ver si hay equipos cargados
    console.log('Seed equipos inicializado');
    // Obtener todos los nombres de localidades existentes de una vez
    const hayEquipos = (await this.equiposRepository.find()).map(
      (equipo) => equipo.macEquipo,
    );

    for (const equiposData of EquiposMock) {
      if (!hayEquipos.includes(equiposData.macEquipo)) {
        const equipo = new Equipo();
        equipo.nombre = equiposData.nombre;
        equipo.agente = equiposData.agente;
        equipo.equipo = equiposData.equipo;
        equipo.macEquipo = equiposData.macEquipo;
        equipo.isInstalled = equiposData.isInstalled;
        equipo.isAvailable = equiposData.isAvailable;
        await this.equiposRepository.save(equipo);
        console.log(`Equipo ${equipo.nombre} guardado en la DB`);
      }
    }
  }
}
