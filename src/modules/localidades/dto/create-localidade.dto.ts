import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocalidadeDto {
  @IsOptional()
  @IsString({ message: 'El agente es cargado automaticamente' })
  // @ApiProperty({})
  @ApiHideProperty()
  agente?: string;

  @IsNotEmpty({
    message: 'Se debe ingresar el nombre de la provincia',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'Nombre de la provincia',
    example: 'Salta',
    type: String,
  })
  provinciaNombre: string;

  @IsNotEmpty({
    message: 'El nombre de la localidad es obligatorio.',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @ApiProperty({
    description: 'El nombre es una cadena de string.',
    example: 'San Carlos',
    type: String,
  })
  nombre: string;
}
