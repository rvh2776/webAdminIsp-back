import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';
import { requiresAuth } from 'express-openid-connect';
import { FacturacionService } from '../facturacion/facturacion.service';
import { PdfService } from '../pdf/pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, User])],
  providers: [
    NotificationsService,
    MailService,
    UsersService,
    FacturacionService,
    PdfService,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
