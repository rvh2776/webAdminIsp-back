import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { addMinutes } from 'date-fns';

export class CreateUserDto {
  @ApiHideProperty()
  @IsOptional()
  @IsBoolean({ message: 'isAdmin debe ser un valor booleano.' })
  isAdmin: boolean;

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean({ message: 'activo debe ser un valor booleano.' })
  activo: boolean;

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

  @ApiProperty({
    description: 'imgUrl debe ser un enlace valido a una imagen',
    example: 'https://exmple-image.webp',
    default: 'https://exmple-image.webp',
    required: true,
  })
  @IsString()
  imgUrl: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio y no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 80 caracteres.' })
  @ApiProperty({
    description:
      'El nombre del usuario debe ser válido y contener al menos 3 caracteres.',
    example: 'Juan Pérez',
  })
  nombre: string;

  @IsNotEmpty({ message: 'El código de area es obligatorio.' })
  @IsString()
  @ApiProperty({
    description: 'El código de area debe ser un string.',
    example: 1234567,
    type: String,
  })
  codArea: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
  @IsString()
  @ApiProperty({
    description: 'El número de teléfono debe ser un string.',
    example: 1234567,
    type: String,
  })
  telefono: string;

  @IsNotEmpty({
    message: 'La dirección es obligatoria y no puede estar vacía.',
  })
  @Length(10, 80, {
    message: 'La dirección debe tener entre 10 y 80 caracteres.',
  })
  @ApiProperty({
    description: 'La dirección del usuario debe ser válida.',
    example: 'Calle Falsa 123',
    type: String,
  })
  direccion: string;

  @IsNotEmpty({ message: 'La latitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @ApiProperty({
    description: 'La latitud debe ser válida.',
    example: '-28.978690147764837',
    type: Number,
  })
  latitud: number;

  @IsNotEmpty({ message: 'La longitud es obligatoria y no puede estar vacía.' })
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @ApiProperty({
    description: 'La longitud debe ser válida.',
    example: '-61.48905321096909',
    type: Number,
  })
  longitud: number;

  @IsNotEmpty({
    message: 'El tipo de documento es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El documento debe ser un juego de caracteres.' })
  @ApiProperty({
    description: 'El tipo de documento debe ser válido.',
    example: 'DNI',
    type: String,
  })
  tipoDocum: string;

  @IsNotEmpty({
    message: 'El documento es obligatorio y no puede estar vacío.',
  })
  @IsString({
    message: 'El documento puede ser una combinación de números y letras.',
  })
  @ApiProperty({
    description: 'El documento debe ser válido.',
    example: '45123456',
    type: String,
  })
  documento: string;

  @IsNotEmpty({ message: 'El email es obligatorio y no puede estar vacío.' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @ApiProperty({
    description: 'El email del usuario debe ser un email válido.',
    example: 'jperez@mail.com',
    type: String,
  })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
    },
  )
  @ApiProperty({
    description:
      'La contraseña del usuario debe contener al menos una letra minúscula, una mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*. Debe tener entre 8 y 15 caracteres.',
    example: 'P@ssw0rd',
    type: String,
  })
  password: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'La razón social debe ser una cadena de texto.' })
  @Length(8, 40, {
    message: 'La razón social debe tener entre 8 y 40 caracteres.',
  })
  razonSocial: string;

  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  @IsNotEmpty({
    message:
      'El id del impuesto es obligatorio y debe ser un id UUID válido. El default es el id de consumidor final',
  })
  // @ApiProperty({
  //   description: 'El id del impuesto debe ser un id UUID válido.',
  //   example: '2583ff4d-bb01-4dc7-90bb-281fa554f141',
  // })
  impuestoId: string;

  @IsUUID()
  @IsNotEmpty({
    message:
      'El id de la provincia es obligatorio y debe ser un id UUID válido.',
  })
  @ApiProperty({
    description: 'El id de la provincia debe ser un id UUID válido.',
    example: 'e003af0a-f7f4-4d99-868e-931ee12b538b',
  })
  provinciaId: string;

  @IsUUID()
  @IsNotEmpty({
    message:
      'El id de la localidad es obligatorio y debe ser un id UUID válido.',
  })
  @ApiProperty({
    description: 'El id de la localidad debe ser un id UUID válido.',
    example: 'cbcc03a5-a1fe-4e49-b040-95adfb0afb80',
  })
  localidadId: string;

  @IsNotEmpty({
    message: 'El código postal es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El código postal debe ser una cadena de texto.' })
  @Length(4, 8, {
    message: 'El código postal debe tener entre 4 y 8 caracteres.',
  })
  @ApiProperty({
    description: 'El código postal debe ser válido.',
    example: 'X5180FKA',
    type: String,
  })
  codigoPostal: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString({
    message: 'El domicilio de instalación debe ser una cadena de texto.',
  })
  domicilioInstal: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString({
    message: 'La localidad de instalación debe ser una cadena de texto.',
  })
  localidadInstal: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber(
    {},
    { message: 'El teléfono de instalación debe ser un número entero.' },
  )
  telefonoInstal: string;

  @ApiHideProperty()
  @IsOptional()
  @IsEmail(
    {},
    { message: 'El correo electrónico de instalación no es válido.' },
  )
  emailInstal: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observaciones: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'La señal de conexión debe ser una cadena de texto.' })
  senalConexion: string;

  @ApiHideProperty()
  @IsUUID()
  @IsOptional()
  @IsString()
  equipoId: string;

  @ApiHideProperty()
  @IsUUID()
  @IsOptional()
  @IsString()
  servicioId: string;

  @ApiHideProperty()
  @IsUUID()
  @IsOptional()
  @IsString()
  facturasId: string;

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
