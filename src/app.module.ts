import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleInterceptor } from './interceptors/role.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthErrorsInterceptor } from './interceptors/authErrorsInterceptor';
import { AllExceptionsFilter } from './filter/global-http-filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { AuthsModule } from './modules/auths/auths.module';
import { ProvinciasModule } from './modules/provincias/provincias.module';
import { SeedsModule } from './seeds/seeds.module';
import { LocalidadesModule } from './modules/localidades/localidades.module';
import { EquiposModule } from './modules/equipos/equipos.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { ImpuestosModule } from './modules/impuestos/impuestos.module';
import { RelevamientosModule } from './modules/relevamientos/relevamientos.module';
import { MailModule } from './modules/mail/mail.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FacturacionModule } from './modules/facturacion/facturacion.module';
import { MapsModule } from './modules/maps/maps.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { FilesModule } from './modules/files/files.module';
import { AsistenciasModule } from './modules/asistencias/asistencias.module';
import { MercadoPagoModule } from './modules/mercado-pago/mercado-pago.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    UsersModule,
    AuthsModule,
    SeedsModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    AuthsModule,
    UsersModule,
    ProvinciasModule,
    LocalidadesModule,
    EquiposModule,
    ServiciosModule,
    ImpuestosModule,
    RelevamientosModule,
    MailModule,
    NotificationsModule,
    FacturacionModule,
    MapsModule,
    PdfModule,
    FilesModule,
    AsistenciasModule,
    MercadoPagoModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthErrorsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
  ],
})
export class AppModule {}
