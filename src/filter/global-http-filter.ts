import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Ocurrió un error inesperado.' };

    // Asegúrate de que el mensaje sea un objeto
    if (typeof errorResponse === 'string') {
      errorResponse = { message: errorResponse };
    }

    console.error('Exception caught in AllExceptionsFilter:', exception); // Agregar log para diagnósticos

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorResponse, // Desestructurar el mensaje para incluir todos los campos relevantes
    });
  }
}
