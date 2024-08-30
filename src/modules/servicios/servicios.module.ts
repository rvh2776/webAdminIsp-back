import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { AuthGuard } from '../auths/auth.guards';
import { UsersService } from '../users/users.service';
import { requiresAuth } from 'express-openid-connect';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, User])],
  controllers: [ServiciosController, UsersController],
  providers: [
    ServiciosService,
    AuthGuard,
    Logger,
    UsersService,
    CloudinaryService,
  ],
})
export class ServiciosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
