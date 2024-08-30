import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { Equipo } from './entities/equipo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../auths/auth.guards';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { requiresAuth } from 'express-openid-connect';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, User])],
  controllers: [EquiposController, UsersController],
  providers: [
    EquiposService,
    AuthGuard,
    Logger,
    UsersService,
    CloudinaryService,
  ],
})
export class EquiposModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
