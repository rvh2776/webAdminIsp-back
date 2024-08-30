// Pourpose: Este es el módulo para el manejo de usuarios
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PasswordInterceptor } from '../../interceptors/password.interceptor';
import { RoleInterceptor } from '../../interceptors/role.interceptor';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';
import { CloudinaryService } from '../../common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PasswordInterceptor,
    },
    UsersService,
    AuthGuard,
    Logger,
    CloudinaryService,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes('users/auth0/callback');
  }
}
