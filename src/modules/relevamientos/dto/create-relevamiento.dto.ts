import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRelevamientoDto {

  @ApiHideProperty()
  @IsOptional()
  agente: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del interesado' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  nombre: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email del interesado',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @ApiProperty({ example: 1234567890, description: 'Telefono del interesado' })
  @IsNotEmpty({
    message: 'El número de teléfono de instalación es obligatorio.',
  })
  @IsNumber(
    {},
    { message: 'El teléfono de instalación debe ser un número entero.' },
  )
  @Min(1000000, {
    message: 'El teléfono de instalación debe tener al menos 7 dígitos.',
  })
  @Max(999999999999999, {
    message: 'El teléfono de instalación debe tener como máximo 15 dígitos.',
  })
  @Transform(({ value }) => parseInt(value, 10))
  telefono: number;

  @ApiProperty({
    example: 'Solicitud de instalación de servico',
    description: 'Motivo del contacto',
  })
  @IsOptional()
  @IsString()
  @Length(1, 60)
  razon: string;

  @ApiProperty({
    example: 'Calle Falsa 123',
    description: 'Domicilio del interesado',
  })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiProperty({
    example: 'Mendoza',
    description: 'Provincia del interesado',
  })
  @IsNotEmpty()
  @IsString()
  provincia: string;

  @ApiProperty({
    example: 'Las Heras',
    description: 'Localidad del interesado',
  })
  @IsNotEmpty()
  @IsString()
  localidad: string;

  @ApiProperty({ 
    example: -34.6037, 
    description: 'Latitude of the location' 
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90, { message: 'Latitude must be greater than or equal to -90' })
  @Max(90, { message: 'Latitude must be less than or equal to 90' })
  latitud: number;

  @ApiProperty({ 
    example: -58.3816, 
    description: 'Longitude of the location' 
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180, { message: 'Longitude must be greater than or equal to -180' })
  @Max(180, { message: 'Longitude must be less than or equal to 180' })
  longitud: number;

  // @ApiProperty({ required: false, example: 'Lunes', description: 'Día preferido para visita' })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  diaCliente?: string;

  // @ApiProperty({
  //   example: '10hs - 15hs',
  //   description: 'Franja horaria de contacto' })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  @Length(1, 60)
  horarios: string;

  //  @ApiProperty({ required: false, example: 'Calle Falsa 456', description: 'Domicilio del Instalador' })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  domicilioInstal?: string;

  //  @ApiProperty({ required: false, example: 'Las Heras', description: 'Localidad de Instalador' })
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  localidadInstal?: string;

  //  @ApiProperty({ required: false, example: 'jperez@example.com', description: 'Email de instalador' })
  @ApiHideProperty()
  @IsOptional()
  @IsEmail()
  emailInstal?: string;

  //  @ApiProperty({ required: false, example: 'Calle sin número, 1° timbre', description: 'Observaciones adicionales'})
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  observaciones?: string;
}
