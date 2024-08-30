import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from '../facturacion/entities/facturacion.entity';
import { User } from '../users/entities/user.entity';
import { FacturacionController } from '../facturacion/facturacion.controller';
import { FacturacionService } from '../facturacion/facturacion.service';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, User])],
  controllers: [PdfController, UsersController, FacturacionController],
  providers: [
    PdfService,
    UsersService,
    FacturacionService,
    AuthGuard,
    Logger,
    CloudinaryService,
  ],
})
export class PdfModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
