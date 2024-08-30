import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ImpuestosService } from './impuestos.service';
import { ImpuestosController } from './impuestos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';
import { Impuesto } from './entities/impuesto.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Impuesto]), UsersModule],
  controllers: [ImpuestosController],
  providers: [ImpuestosService, UsersService, AuthGuard, Logger],
})
export class ImpuestosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth());
  }
}
