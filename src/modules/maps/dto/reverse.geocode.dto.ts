import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReverseGeocodeDto {
  @ApiProperty({
    description: 'Latitud',
    example: -32.8433517,
    type: Number,
  })
  @IsNotEmpty({
    message: 'La latitud es obligatoria',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitud',
    example: -68.8320765,
    type: Number,
  })
  @IsNotEmpty({
    message: 'La longitud es obligatoria',
  })
  @IsNumber()
  lng: number;
}
