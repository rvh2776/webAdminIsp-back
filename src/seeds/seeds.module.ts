import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from '../modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';
import { User } from '../modules/users/entities/user.entity';
import { UsersSeed } from './users/users.seed';
import { Equipo } from '../modules/equipos/entities/equipo.entity';
import { EquiposSeed } from './equipos/equipos.seed';
import { Impuesto } from '../modules/impuestos/entities/impuesto.entity';
import { ImpuestosSeed } from './impuestos/impuestos.seed';
import { Servicio } from '../modules/servicios/entities/servicio.entity';
import { ServiciosSeed } from './servicios/servicios.seed';
import { FacturacionSeed } from './facturacion/facturacion.seed';
import { Factura } from '../modules/facturacion/entities/facturacion.entity';
import { Relevamiento } from 'src/modules/relevamientos/entities/relevamiento.entity';
import { RelevamientosSeed } from './relevamientos/relevamientos.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Provincia,
      Localidad,
      User,
      Equipo,
      Impuesto,
      Servicio,
      Factura,
      Relevamiento,
    ]),
  ],
  providers: [
    ProvinciasSeed,
    LocalidadesSeed,
    UsersSeed,
    EquiposSeed,
    ImpuestosSeed,
    ServiciosSeed,
    FacturacionSeed,
    RelevamientosSeed,
  ],
  exports: [
    ProvinciasSeed,
    LocalidadesSeed,
    UsersSeed,
    EquiposSeed,
    ImpuestosSeed,
    ServiciosSeed,
    FacturacionSeed,
  ],
})
// export class SeedsModule {}
export class SeedsModule implements OnModuleInit {
  constructor(
    private readonly provinciasSeed: ProvinciasSeed,
    private readonly localidadesSeed: LocalidadesSeed,
    private readonly equiposSeed: EquiposSeed,
    private readonly impuestosSeed: ImpuestosSeed,
    private readonly serviciosSeed: ServiciosSeed,
    private readonly usersSeed: UsersSeed,
    private readonly facturacionSeed: FacturacionSeed,
    private readonly relevamientosSeed: RelevamientosSeed,
  ) {}

  async onModuleInit() {
    await this.provinciasSeed.seed();
    await this.localidadesSeed.seed();
    await this.equiposSeed.seed();
    await this.impuestosSeed.seed();
    await this.serviciosSeed.seed();
    await this.facturacionSeed.seed();
    await this.usersSeed.seed();
    await this.relevamientosSeed.seed();
  }
}
