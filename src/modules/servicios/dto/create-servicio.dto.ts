import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServicioDto {
  @IsOptional()
  @IsString({ message: 'El agente es cargado automaticamente' })
  // @ApiProperty({})
  @ApiHideProperty()
  agente?: string;

  @IsNotEmpty({
    message: 'La velocidad de bajada es obligatoria y no puede estar vacía..',
  })
  @IsString({ message: 'La velocidad de bajada debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La velocidad de bajada debe ser válida.',
    example: '6 megas',
    type: String,
  })
  velocidadBajada: string;

  @IsNotEmpty({
    message: 'La velocidad de subida es obligatoria y no puede estar vacía.',
  })
  @IsString({ message: 'La velocidad de subida debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'La velocidad de subida debe ser válida.',
    example: '2 megas',
    type: String,
  })
  velocidadSubida: string;

  @IsNotEmpty({
    message: 'El costo de conexión es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El costo de conexión debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El costo de conexión debe ser válido.',
    example: '30000',
    type: String,
  })
  costoConexion: string;

  @IsNotEmpty({
    message: 'El abono es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'La puerta de enlace debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El abono debe ser válido.',
    example: '9000',
    type: String,
  })
  abono: string;

  @IsNotEmpty({
    message: 'El nombre es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El nombre debe ser válido' })
  @ApiProperty({
    description: 'El nombre debe ser válido.',
    example: '100/35',
    type: String,
  })
  nombre: string;

  @ApiHideProperty()
  @IsUUID()
  @IsOptional({})
  // @ApiProperty({
  //   description: 'El id del user, debe ser un id UUID valido',
  //   example: 'e24dfa7e-8474-4b69-b974-34bf6f3cb69a',
  // })
  userId?: string;
}
