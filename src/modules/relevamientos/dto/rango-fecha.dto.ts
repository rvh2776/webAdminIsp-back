// src/modules/relevamientos/dto/date-range.dto.ts
import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RangoFecha {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2024-01-01' })
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2024-12-31' })
  fechaFin: string;
}