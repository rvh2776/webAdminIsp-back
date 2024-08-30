import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import { Factura } from './entities/facturacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../auths/auth.guards';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { requiresAuth } from 'express-openid-connect';
import { UsersController } from '../users/users.controller';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, User])],
  controllers: [FacturacionController, UsersController],
  providers: [
    FacturacionService,
    AuthGuard,
    Logger,
    UsersService,
    CloudinaryService,
  ],
})
export class FacturacionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
