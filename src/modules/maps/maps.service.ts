import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
config();

@Injectable()
export class MapsService {

  async getCoordenadas(domicilioCompleto: string){
    //w google api url > encodeURIComponent formatea espacios vacios, etc
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(domicilioCompleto)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    
    //* solicitud a google maps api
    const response = await axios.get(url);
    // console.log(response)
    const data = response.data;
    // console.log(data)
    //* arroja error si no encuentra la locacion
    if(!data || data.status === 'ZERO_RESULTS') {
      throw new NotFoundException(`No pudimos encontrar una locación para esta dirección`)
    }
    //* las coordenadas estan en propiedad > .geometry.location
    const coordenadas = await data.results[0].geometry.location;
    console.log('COORDENADAS PASADAS AL CONTROLLER>', coordenadas)

    // return coordenadas
    return {
      lat: coordenadas.lat,
      lng: coordenadas.lng,
    };
  }

  async getDireccion(lat: number, lng: number): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
      throw new NotFoundException(`No pudimos encontrar una dirección para estas coordenadas`);
    }
    //* la direccion esta en propiedad > .formatted_address
    const address = data.results[0];
    return { address };
  }

}
