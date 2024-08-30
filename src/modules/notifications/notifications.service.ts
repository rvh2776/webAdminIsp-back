import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service'; // Importar el servicio de PDF

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    private readonly mailService: MailService,
    private readonly pdfService: PdfService, // Inyectar el servicio de PDF
  ) {}

  onModuleInit() {
    this.scheduleTasks();
  }

  private scheduleTasks() {
    // Programar una tarea para enviar recordatorios y pre-facturas el primer día de cada mes a las 9 AM
    cron.schedule('10 21 23 * *', async () => {
      await this.sendMonthlyNotificationsWithAttachments();
    });
  }

  public async sendMonthlyNotificationsWithAttachments() {
    const usersWithUnpaidInvoices = await this.getUsersWithUnpaidInvoices();

    for (const user of usersWithUnpaidInvoices) {
      for (const factura of user.facturas) {
        const filePath = await this.pdfService.generateInvoice(user, factura);
        await this.sendNotificationWithAttachment(user, filePath);
      }
    }
  }

  private async getUsersWithUnpaidInvoices(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.facturas', 'factura')
      .where('factura.pagado = :pagado', { pagado: false })
      .getMany();
  }

  private async sendNotificationWithAttachment(user: User, filePath: string) {
    const email = user.email;
    const username = user.nombre;
    await this.mailService.sendMonthlyNotificationWithAttachment(
      email,
      username,
      filePath,
    );
  }
}
