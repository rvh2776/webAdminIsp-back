import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Repository } from 'typeorm';
import { UsersMock } from './users.mock';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Impuesto } from '../../modules/impuestos/entities/impuesto.entity';
import { Equipo } from '../../modules/equipos/entities/equipo.entity';
import { Servicio } from '../../modules/servicios/entities/servicio.entity';
import { Factura } from '../../modules/facturacion/entities/facturacion.entity';
import { FacturacionMock } from '../facturacion/facturacion.mock';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    @InjectRepository(Provincia)
    private readonly provinciasRepository: Repository<Provincia>,
    @InjectRepository(Impuesto)
    private readonly impuestosRepository: Repository<Impuesto>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
  ) {}

  async seed() {
    console.log('Seed users inicializado');
    const provinciaSeed = await this.provinciasRepository.findOne({
      where: { nombre: 'Mendoza' },
    });

    if (!provinciaSeed) {
      console.error('No se encontró la provincia de Mendoza');
      return;
    }

    const localidadSeed = await this.localidadesRepository.findOne({
      where: { nombre: 'Maipú' },
    });

    if (!localidadSeed) {
      console.error('No se encontró la localidad Maipú');
      return;
    }

    const impuestoSeed = await this.impuestosRepository.findOne({
      where: { nombre: 'Monotributo' },
    });

    if (!impuestoSeed) {
      console.error('No se encontró el impuesto: Monotributo');
      return;
    }

    const equiposSeed = await this.equiposRepository.find();
    const serviciosSeed = await this.serviciosRepository.find();

    if (equiposSeed.length === 0) {
      console.error('No se encontraron equipos');
      return;
    }

    if (serviciosSeed.length === 0) {
      console.error('No se encontraron servicios');
      return;
    }

    // Eliminar facturas con userId nulo
    await this.facturasRepository.delete({ user: null });

    for (const userMock of UsersMock) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userMock.email },
      });

      if (existingUser) {
        console.log(
          `Usuario ${existingUser.email} ya existe, saltando creación.`,
        );
        continue;
      }

      const hashedPassword = await bcrypt.hash(userMock.password, 10);
      const user = new User();
      Object.assign(user, userMock);
      user.password = hashedPassword;
      user.provincia = provinciaSeed;
      user.localidad = localidadSeed;
      user.impuesto = impuestoSeed;

      const equiposDisponibles = equiposSeed
        .filter((equipo) => !equipo.isAvailable)
        .slice(0, 3);

      if (equiposDisponibles.length < 3) {
        console.error(
          'No se encontraron suficientes equipos disponibles (isAvailable: false)',
        );
        return;
      }

      // Asignar un equipo aleatorio
      user.equipos = equiposDisponibles;

      // Asignar el servicio específico basado en el nombre
      if (userMock.email === 'jperez@mail.com') {
        const servicio = serviciosSeed.find((serv) => serv.nombre === '6/2');
        if (servicio) {
          user.servicios = [servicio];
        } else {
          console.error('No se encontró el servicio 6/2');
          return;
        }
      } else if (userMock.email === 'aperez@mail.com') {
        const servicio = serviciosSeed.find((serv) => serv.nombre === '30/7.5');
        if (servicio) {
          user.servicios = [servicio];
        } else {
          console.error('No se encontró el servicio 30/7.5');
          return;
        }
      }

      // Guardar el usuario antes de asignar facturas
      await this.usersRepository.save(user);

      // Crear y asignar instancias de Factura a Juan Pérez y Alberto Pérez
      let facturas;
      if (userMock.email === 'jperez@mail.com') {
        facturas = FacturacionMock.juanPerez.map((facturaData) => {
          const factura = new Factura();
          Object.assign(factura, facturaData);
          factura.user = user;
          return factura;
        });
      } else if (userMock.email === 'aperez@mail.com') {
        facturas = FacturacionMock.albertoPerez.map((facturaData) => {
          const factura = new Factura();
          Object.assign(factura, facturaData);
          factura.user = user;
          return factura;
        });
      } else {
        facturas = [];
      }

      for (const factura of facturas) {
        const existingFactura = await this.facturasRepository.findOne({
          where: { numFactura: factura.numFactura, user: { id: user.id } },
        });

        if (existingFactura) {
          console.log(
            `Factura ${existingFactura.numFactura} ya existe para el usuario ${user.email}, saltando creación.`,
          );
          continue;
        }

        await this.facturasRepository.save(factura);
        console.log(
          `Factura ${factura.numFactura} guardada en la DB para el usuario ${user.email}`,
        );
      }

      console.log('Usuario creado: ', user.nombre);
    }
  }
}
