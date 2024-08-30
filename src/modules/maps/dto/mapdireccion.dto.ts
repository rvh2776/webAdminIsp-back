import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MapDomicilioDto {
    @ApiProperty({
        description: 'calle y numero',
        example: 'Juan Cornelio Moyano 195',
        type: String,
      })
    @IsNotEmpty({
        message: 'La direccion es obligatoria',
      })
      @IsString()
    direccion:string;


    @ApiProperty({
        description: 'Provincia',
        example: 'Mendoza',
        type: String,
      })
    @IsNotEmpty({
        message: 'La provincia es obligatoria',
      })
      @IsString()
    provincia:string;


    @ApiProperty({
        description: 'Localidad',
        example: 'Las Heras',
        type: String,
      })
    @IsNotEmpty({
        message: 'La localidad  es obligatoria',
      })
    @IsString()
    localidad:string;
}