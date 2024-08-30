import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.error('Error capturado por el interceptor:', err);

        if (
          err instanceof UnauthorizedException ||
          err instanceof ForbiddenException ||
          err instanceof HttpException
        ) {
          return throwError(() => err);
        }
        return throwError(
          () =>
            new InternalServerErrorException('Ocurrió un error inesperado.'),
        );
      }),
    );
  }
}
