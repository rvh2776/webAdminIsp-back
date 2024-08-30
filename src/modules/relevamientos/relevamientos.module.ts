import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RelevamientosService } from './relevamientos.service';
import { RelevamientosController } from './relevamientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { MapsService } from '../maps/maps.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Relevamiento, Provincia, Localidad, User]),
  ],
  controllers: [RelevamientosController],
  providers: [
    RelevamientosService,
    UsersService,
    MapsService,
    AuthGuard,
    Logger,
  ],
})
export class RelevamientosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes();
  }
}
