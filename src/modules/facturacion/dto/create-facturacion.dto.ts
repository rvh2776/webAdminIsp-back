import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { addMinutes } from 'date-fns';
import { Transform } from 'class-transformer';

export class CreateFacturacionDto {
  @ApiProperty({ description: 'ID del usuario.' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsOptional({
    message: 'El agente es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El agente es cargado automáticamente' })
  @ApiHideProperty()
  agente: string;

  @ApiProperty({
    description: 'La fecha de creación de la factura.',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsDate({ message: 'fechaGen debe ser una instancia de Date' })
  @Transform(
    ({ value }) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    },
    { toClassOnly: true },
  )
  fechaGen: Date;

  @IsNotEmpty({
    message: 'El concepto es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El concepto lleva el nombre del servicio' })
  @ApiProperty({
    description: 'El servicio debe ser válido.',
    example: '6/2',
    type: String,
  })
  concepto: string;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  @ApiProperty({
    description: 'Las observaciones deben contener el mes de la factura.',
    example: 'Septiembre',
    type: String,
  })
  observaciones: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'El número de factura debe ser válido.',
    example: 12345,
    type: Number,
  })
  numFactura: number;

  @IsOptional()
  referenciaId: number;

  @IsOptional()
  fechaPago: string;

  @IsOptional()
  @IsString({ message: 'El tipo de pago debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El tipo de pago debe contener la forma de pago.',
    example: 'Contado',
    type: String,
  })
  tipoPago: string;

  @IsNotEmpty()
  @IsBoolean({ message: 'El tipo de pago debe ser un booleano.' })
  @ApiProperty({
    description: 'El campo pagado debe ser un booleano.',
    example: 'true',
    type: Boolean,
  })
  pagado: boolean;

  @ApiProperty({
    description: 'La fecha de vencimiento de la factura.',
    example: '2023-12-31T23:59:59.999Z',
  })
  @IsDate({ message: 'fechaVencimiento debe ser una instancia de Date' })
  @Transform(
    ({ value }) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return date;
    },
    { toClassOnly: true },
  )
  fechaVencimiento: Date;

  @IsNotEmpty()
  @ApiProperty({
    description: 'El número de factura debe ser válido.',
    example: 12345,
    type: Number,
  })
  importe: number;

  constructor() {
    this.fechaGen = this.getLocalDate();
    this.fechaVencimiento = this.fechaVencimiento || new Date();
  }

  private getLocalDate(): Date {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const fecha = addMinutes(now, -offsetInMinutes);
    return fecha;
  }
}
