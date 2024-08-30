// Pourpose: Interceptor para eliminar la propiedad "password" de los datos de respuesta
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si los datos son un array, mapear cada objeto y aplicar la lógica de manipulación
        if (Array.isArray(data)) {
          return data.map((item) => this.transformData(item));
        } else {
          // Si los datos son un objeto único, aplicar la lógica de manipulación directamente
          return this.transformData(data);
        }
      }),
    );
  }

  private transformData(data: any): any {
    if (!data) {
      return data;
    }
    if (typeof data === 'object' && data.hasOwnProperty('password')) {
      const { password, ...userData } = data;
      return userData;
    }
    return data;
  }
}
