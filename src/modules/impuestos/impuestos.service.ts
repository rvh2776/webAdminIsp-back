import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Impuesto } from './entities/impuesto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImpuestosService {
  constructor(
    @InjectRepository(Impuesto)
    private impuestoRepository:Repository<Impuesto>
  ) {}


  async create(createImpuestoDto: CreateImpuestoDto) {
    //* busca impuesto en db
    const existingImpuesto = await this.impuestoRepository.findOne({
      where: {nombre:createImpuestoDto.nombre }
    })
    //* verifica si existe
    if(existingImpuesto) throw new BadRequestException(`El impuesto ${createImpuestoDto.nombre} ya existe`)

      //* crea y guarda el impuesto
    const newImpuesto = await this.impuestoRepository.save(createImpuestoDto);

    return {
      message: `Impuesto - ${newImpuesto.nombre} - agregado exitosamente`,
      newImpuesto
    }
  }

  async findAll() {
    const impuestos = await this.impuestoRepository.find();
    if(!impuestos.length) throw new NotFoundException('No hay impuestos que mostrar')

      return {
        message: 'Todos los impuestos', 
        impuestos
      }
  }

  //* usado en signUp
  async findImpuestoDefault(nombre:string){
    const impuesto = await this.impuestoRepository.findOne({where:{nombre}});
    return impuesto
  }

  async findOne(id: string) {
    const impuesto = await this.impuestoRepository.findOneBy({id})
    
    if(!impuesto) throw new NotFoundException('Impuesto no encontrado')

      return {
        message: 'Impuesto encontrado', 
        impuesto
      }
  }

  async update(id: string, updateImpuestoDto: CreateImpuestoDto) {
    const existingImpuesto = await this.impuestoRepository.findOneBy({id});

    if(!existingImpuesto) throw new NotFoundException('Impuesto No Encontrado');

    const updatedImpuesto = {
      id,
      ...existingImpuesto,
      ...updateImpuestoDto
    }

    const savedImpuesto = await this.impuestoRepository.save(updatedImpuesto);

    return {
      message: `El impuesto ${savedImpuesto.nombre} fue actualizado exitosamente`,
      savedImpuesto
    }
  }

  async remove(id: string) {
    const impuesto = await this.impuestoRepository.findOneBy({id});

    if(!impuesto) throw new NotFoundException('Impuesto No Encontrado');

    const removedImpuesto = await this.impuestoRepository.remove(impuesto);

    return {
      message: `Impuesto Eliminado`,
      removedImpuesto
    }
  }
}
