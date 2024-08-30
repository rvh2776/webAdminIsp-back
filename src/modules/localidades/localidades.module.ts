import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';
import { LocalidadesController } from './localidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from './entities/localidades.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { AuthGuard } from '../auths/auth.guards';
import { requiresAuth } from 'express-openid-connect';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Localidad, Provincia])],
  controllers: [LocalidadesController],
  providers: [LocalidadesService, AuthGuard, Logger],
  exports: [],
})
export class LocalidadesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requiresAuth()).forRoutes();
  }
}
