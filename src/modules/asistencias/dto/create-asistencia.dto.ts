import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { addMinutes } from 'date-fns';

export class CreateAsistenciaDto {
  @ApiHideProperty()
  @IsDate({ message: 'createdAt debe ser una instancia de Date' })
  @Transform(
    ({ value }) => {
      if (value) {
        return new Date(value);
      }
      return new Date();
    },
    { toClassOnly: true },
  )
  @IsOptional()
  // @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
  // @ApiProperty({
  //   description: 'La fecha de creación del usuario.',
  //   example: '2023-12-31T23:59:59.999Z',
  // })
  createdAt: Date;

  @IsOptional({ message: 'El agente es cargado automaticamente' })
  @IsString({ message: 'El agente debe ser una cadena de texto.' })
  @Length(3, 50, { message: 'El agente debe tener entre 3 y 80 caracteres.' })
  // @ApiProperty({
  //   description: 'El nombre del agente debe ser válido y contener al menos 3 caracteres.',
  //   example: 'Agente Pérez',
  // })
  @ApiHideProperty()
  agente?: string;

  @ApiProperty({ description: 'ID del usuario.' })
  @IsUUID()
  @IsNotEmpty()
  userId?: string;

  @IsOptional()
  @IsString({ message: 'El día en que el cliente está disponible.' })
  @ApiProperty({
    description: 'El día debe ser válido.',
    example: '6/12',
    type: String,
  })
  diaCliente: string;

  @IsOptional()
  @IsString({ message: 'El horario en que el cliente está disponible.' })
  @ApiProperty({
    description: 'El horario debe ser válido.',
    example: '15:30',
    type: String,
  })
  horarios: string;

  @IsNotEmpty()
  @IsString({ message: 'El problema o pedido del cliente.' })
  @ApiProperty({
    description: 'Debe ser un grupo de caracteres.',
    example: 'Quiero cambiar de plan',
    type: String,
  })
  problema: string;

  @IsOptional()
  @IsString({ message: 'Observaciones que aclaren más el pedido.' })
  @ApiProperty({
    description: 'Debe ser un grupo de caracteres.',
    example: 'Llamar al teléfono 1234567890 para coordinar',
    type: String,
  })
  observaciones: string;

  constructor(createdAt?: number) {
    this.createdAt = createdAt ? new Date(createdAt) : this.getLocalDate();
  }

  private getLocalDate(): Date {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const fecha = addMinutes(now, -offsetInMinutes);
    return fecha;
  }
}
