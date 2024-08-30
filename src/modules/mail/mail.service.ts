import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
// import * as fs from 'fs';
import * as path from 'path';

dotenvConfig({ path: '.env.development' });

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos Utiliza STARTTLS
      auth: {
        user: process.env.SMTP_USER, // Tu correo electrónico
        pass: process.env.SMTP_PASSWORD, // Tu contraseña de aplicación de Google
      },
    });
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
    attachments?: { filename: string; path: string }[],
  ) {
    const mailOptions = {
      from: '"UltraNet" <tu-correo@gmail.com>', // remitente
      to, // destinatario
      subject, // asunto
      text, // texto plano
      html, // HTML
      attachments, // adjuntos
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new InternalServerErrorException('Error sending email.');
    }
  }

  async sendRegistrationConfirmation(email: string, username: string) {
    const subject = 'Confirmación de Registro';
    const text = `Hola ${username}, gracias por registrarte en nuestro servicio UltraNet.`;
    const html = `<p>Hola ${username},</p><p>Gracias por registrarte en nuestro servicio UltraNet.</p>`;

    await this.sendMail(email, subject, text, html);
  }

  // Método para enviar notificaciones de Mercado Pago con archivo adjunto
  async sendNotificationMPagoWithAttachment(
    email: string,
    username: string,
    factura,
    // filePath: string,
  ) {
    const subject = `Confirmación de pago`;

    const html = `
    <hr <font color=#2E86C1>
    <h2><font color=#2E86C1>Hola, ${username}.</h2>
    <p><font color=#2E86C1>Gracias por tu pago.</p>
    <p><font color=#2E86C1>Aquí tienes los detalles de tu factura:</p>
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
      <tr style="background-color: #DAD9DB;">
        <th style="color: #2E86C1; text-align: center;">Tu Plan</th>
        <th style="color: #2E86C1; text-align: center;">Mes Abonado</th>
        <th style="color: #2E86C1; text-align: center;">Monto</th>
        <th style="color: #2E86C1; text-align: center;">Fecha de Pago</th>
        <th style="color: #2E86C1; text-align: center;">Medio de Pago</th>
      </tr>
      <tr>
        <td style="text-align: center;">Velocidad: ${factura.concepto}</td>
        <td style="text-align: center;">${factura.observaciones}</td>
        <td style="text-align: center;">$${factura.importe}</td>
        <td style="text-align: center;">${factura.fechaPago}</td>
        <td style="text-align: center;">${factura.tipoPago}</td>
      </tr>
    </table>
    <p><font color=#2E86C1><b>Recuerda que puedes ver y descargar tus facturas en: <a target='blank' href="https://frontend-swart-sigma.vercel.app/login/1">UltraNet</a></b></p>
    <br>
    <h3 align="center"><font color=#2E86C1><b>¡Gracias por elegir nuestros servicios!</b></h3>
    <hr <font color=#2E86C1>
  `;
    const text = `Hola ${username},\n\nLe confirmamos que el pago de su factura, se realizo con exito.\n\nSaludos,\nUltraNet`;

    // const attachments = [{ filename: path.basename(filePath), path: filePath }];
    // await this.sendMail(email, subject, text, html, attachments);
    await this.sendMail(email, subject, text, html);
  }

  async sendBillingAlert(email: string, amount: number) {
    const subject = 'Alerta de Facturación';
    const text = `Tienes una factura pendiente de $${amount}.`;
    const html = `<p>Tienes una factura pendiente de <strong>$${amount}</strong>.</p>`;

    await this.sendMail(email, subject, text, html);
  }

  async sendServiceUpdate(email: string, update: string) {
    const subject = 'Actualización de Servicio';
    const text = `Hay una nueva actualización de servicio: ${update}.`;
    const html = `<p>Hay una nueva actualización de servicio:</p><p>${update}</p>`;

    await this.sendMail(email, subject, text, html);
  }

  // Método para enviar notificaciones mensuales
  async sendMonthlyNotification(email: string, username: string) {
    const subject = 'Recordatorio y Pre-factura Mensual';
    const text = `Hola ${username},\n\nEste es tu recordatorio y pre-factura del mes.\n\nSaludos,\nEl Equipo`;
    const html = `<p>Hola ${username},</p><p>Este es tu recordatorio y pre-factura del mes.</p><p>Saludos,<br>El Equipo</p>`;

    await this.sendMail(email, subject, text, html);
  }

  // Método para enviar notificaciones mensuales con archivo adjunto
  async sendMonthlyNotificationWithAttachment(
    email: string,
    username: string,
    filePath: string,
  ) {
    const subject = 'Recordatorio y Pre-factura Mensual';
    const text = `Hola ${username},\n\nEste es tu recordatorio y pre-factura del mes.\n\nSaludos,\nEl Equipo`;
    const html = `<p>Hola ${username},</p><p>Este es tu recordatorio y pre-factura del mes.</p><p>Saludos,<br>El Equipo</p>`;
    const attachments = [{ filename: path.basename(filePath), path: filePath }];

    await this.sendMail(email, subject, text, html, attachments);
  }
}
