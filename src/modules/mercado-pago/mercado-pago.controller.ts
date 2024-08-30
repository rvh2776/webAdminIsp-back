import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mercado Pagos')
@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  async createPreference(
    @Body()
    data: {
      invoiceId: string;
      userId: string;
      amount: number;
      description: string;
    },
  ) {
    const { invoiceId, userId } = data;

    const preference = await this.mercadoPagoService.createPreference(
      invoiceId,
      userId,
    );
    // console.log(preference);
    return { preference };
  }

  @Post('process-payment')
  async processPayment(@Body() paymentData: any): Promise<any> {
    return await this.mercadoPagoService.createPayment(paymentData);
  }

  @Post('notification')
  @HttpCode(200)
  async handleNotification(@Body() notificationData: any) {
    // console.log('Notificacion recibida:', notificationData);

    await this.mercadoPagoService.processPaymentNotification(notificationData);
    return { message: 'Notification processed successfully' };
  }
}
