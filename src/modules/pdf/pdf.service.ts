import { Injectable, InternalServerErrorException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';

@Injectable()
export class PdfService {
  private formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-AR');
  }

  async generateInvoice(user: User, factura: Factura): Promise<string> {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const baseDir = process.cwd();
      const directory = path.join(
        baseDir,
        'src',
        'modules',
        'facturacion',
        'invoices',
      );
      const filePath = path.join(directory, `factura_${factura.id}.pdf`);

      // Crear el directorio si no existe
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      return new Promise((resolve, reject) => {
        const stream = createWriteStream(filePath);
        doc.pipe(stream);

        // Encabezado
        doc
          .rect(0, 0, 612, 90)
          .fill('#2E86C1')
          .fillColor('white')
          .fontSize(30)
          .text('UltraNet', 50, 20)
          .fontSize(12)
          .text('www.ultranet.com', 50, 50, { align: 'left' })
          .text('Soporte: soporte@ultranet.com', 50, 65, { align: 'left' });

        doc.moveDown(2);

        // Marca de agua con imagen
        const watermarkPath = path.join(
          baseDir,
          'src',
          'modules',
          'facturacion',
          'invoices',
          'Logo02.png',
        ); // Ruta de la imagen de marca de agua

        doc.opacity(0.1); // Establecer la opacidad de la marca de agua
        doc.image(watermarkPath, doc.page.width / 4, doc.page.height / 4, {
          width: 300, // Ajustar el tamaño de la imagen
          height: 300,
        });

        doc.opacity(1); // Restaurar la opacidad a 1 para el contenido principal
        // Título
        doc
          .fillColor('#2E86C1')
          .fontSize(20)
          .text(`Pre factura: ${factura.observaciones}`, { align: 'center' });

        // Separador
        doc
          .moveDown(0.5)
          .strokeColor('#c9ced1')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        // Datos del Usuario
        doc
          .moveDown(0.5)
          .fontSize(12)
          .fillColor('gray')
          .text(`Nombre: ${user.nombre}`)
          .text(`Dirección: ${user.direccion}`)
          .text(`Teléfono: ${user.telefono}`)
          .text(`Servicio: ${factura.concepto}`);

        // Separador
        doc
          .moveDown(0.5)
          .strokeColor('#c9ced1')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc
          .moveDown(2)
          .fillColor('#105E91')
          .fontSize(14)
          .text('Detalles de la Factura:', 50, 290);

        // Separador
        doc
          .moveDown(0.5)
          .strokeColor('#c9ced1')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc.moveDown(0.5);
        doc.fontSize(13).fillColor('#145E8f').text('Descripción', 50, 320);
        doc.text('Importe', 160, 320);
        doc.text('Fecha de Pago', 280, 320);
        doc.text('Método de Pago', 440, 320);

        // Separador
        doc
          .moveDown(0.2)
          .strokeColor('#c9ced1')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc
          .moveDown(0.2)
          .fillColor('gray')
          .fontSize(12)
          .text(factura.concepto, 60, 350);
        doc.text(`$ ${factura.importe}`, 170, 350);
        doc.text(this.formatDate(factura.fechaPago), 290, 350);
        doc.text(factura.tipoPago, 450, 350);

        // Separador
        doc
          .moveDown(0.2)
          .strokeColor('#c9ced1')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        // Importe Total
        doc
          .moveDown(1)
          .fontSize(15)
          .fillColor('#2E86C1')
          .text(`Total a Pagar: $ ${factura.importe}`, 390, 380);

        // Separador
        doc
          .moveDown(0.2)
          .strokeColor('#c9ced1')
          .moveTo(380, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        // Pie de Página
        doc.moveDown(3).fontSize(10).fillColor('gray');
        doc.text('UltraNet - Proveedor de Servicios de Internet', 50, 700, {
          align: 'center',
          width: 500,
        });
        doc.text(
          'Dirección: Calle Falsa 123, Ciudad, País | Teléfono: (123) 456-7890',
          { align: 'center', width: 500 },
        );
        doc.text('www.ultranet.com | soporte@ultranet.com', {
          align: 'center',
          width: 500,
        });

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stream.on('error', (err) => {
          reject(new InternalServerErrorException('Error generating PDF'));
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new InternalServerErrorException('Error generating PDF');
    }
  }
}
