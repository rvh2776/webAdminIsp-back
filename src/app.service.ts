import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return 'El servidor del Proyecto Final está funcionando correctamente';
  }
}
