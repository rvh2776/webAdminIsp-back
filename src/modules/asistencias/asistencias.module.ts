import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { UsersController } from '../users/users.controller';
import { Asistencia } from './entities/asistencia.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CloudinaryService } from '../../common/cloudinary.service';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, User])],
  controllers: [AsistenciasController, UsersController],
  providers: [
    AsistenciasService,
    AuthGuard,
    Logger,
    UsersService,
    CloudinaryService,
  ],
})
export class AsistenciasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
