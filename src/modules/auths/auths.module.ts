// import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { AuthGuard } from './auth.guards';
// import { Auth0Guard } from './auth0.guards';
// import { CompositeAuthGuard } from './compositeAuthGuard';
import { MailService } from '../mail/mail.service';
import { ImpuestosService } from '../impuestos/impuestos.service';
import { ImpuestosModule } from '../impuestos/impuestos.module';
import { Impuesto } from '../impuestos/entities/impuesto.entity';
import { EquiposService } from '../equipos/equipos.service';
import { EquiposModule } from '../equipos/equipos.module';

@Module({
  imports: [
    UsersModule,
    ImpuestosModule,
    EquiposModule,
    TypeOrmModule.forFeature([
      Provincia,
      Localidad,
      Equipo,
      Servicio,
      Impuesto,
    ]),
  ],
  controllers: [AuthsController],
  providers: [
    AuthsService,
    UsersService,
    ImpuestosService,
    EquiposService,
    MailService,
    AuthGuard,
    // Auth0Guard,
    // CompositeAuthGuard,
    Logger,
  ],
})
export class AuthsModule {}

// export class AuthsModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(requiresAuth()).forRoutes();
//   }
// }
