import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MapsService } from './maps.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapDomicilioDto } from './dto/mapdireccion.dto';
import { ReverseGeocodeDto } from './dto/reverse.geocode.dto';

@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}


  @Post('domicilio')
  @ApiOperation({ summary: 'Obtiene las coordenadas segun el domicilio recibido' })
  async getCoordenadas(@Body() mapDomicilio:MapDomicilioDto){
    const { direccion, provincia, localidad } = mapDomicilio;

    const domicilioCompleto = `${direccion}, ${localidad}, ${provincia}`;

    return await this.mapsService.getCoordenadas(domicilioCompleto);
  }


  @Post('coordenadas')
  @ApiOperation({ summary: 'Retorna la direccion' })
  async getAddress(@Body() reverseGeocodeDto: ReverseGeocodeDto) {
    const { lat, lng } = reverseGeocodeDto;
    return await this.mapsService.getDireccion(lat, lng);
  }


}
