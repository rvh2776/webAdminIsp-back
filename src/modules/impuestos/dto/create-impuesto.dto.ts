import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateImpuestoDto {
  @ApiProperty({
    example: 'Responsable Inscripto',
    description: 'Impuesto del servicio',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional({
    message: 'El agente es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El agente es cargado automaticamente' })
  @ApiHideProperty()
  agente: string;
}
