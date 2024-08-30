import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocalidadeDto } from './dto/create-localidade.dto';
import { UpdateLocalidadeDto } from './dto/update-localidade.dto';
import { Localidad } from './entities/localidades.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from '../provincias/entities/provincia.entity';

@Injectable()
export class LocalidadesService {
  constructor(
    @InjectRepository(Localidad)
    private localidadesRepository: Repository<Localidad>,
    @InjectRepository(Provincia)
    private provinciasRepository: Repository<Provincia>,
  ) {}

  async create(createLocalidadeDto: CreateLocalidadeDto) {
    const { provinciaNombre, ...nombre } = createLocalidadeDto;

    let provincia = await this.provinciasRepository.findOne({
      where: { nombre: provinciaNombre },
    });

    if (!provincia) {
      provincia = this.provinciasRepository.create({ nombre: provinciaNombre });
      await this.provinciasRepository.save(provincia);
    }

    const localidadExistente = await this.localidadesRepository.findOne({
      where: {
        ...nombre,
        provincia: { id: provincia.id },
      },
      relations: ['provincia'],
    });

    if (!localidadExistente) {
      const localidad = this.localidadesRepository.create({
        ...nombre,
        provincia,
      });
      await this.localidadesRepository.save(localidad);
      return localidad;
    } else {
      return `La localidad ${nombre.nombre} ya existe en la provincia ${provinciaNombre}`;
    }
  }

  async findAll() {
    const localidades = await this.localidadesRepository.find();

    return localidades;
  }

  // async findAll(page: number, limit: number) {
  //   const [result, total] = await this.localidadesRepository.findAndCount({
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return {
  //     data: result,
  //     count: total,
  //     currentPage: page,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async findOne(id: string) {
    const localidad = await this.localidadesRepository.findOne({
      where: { id },
      relations: ['provincia'],
    });

    if (!localidad) {
      throw new NotFoundException(`La localidad con id: ${id} no existe`);
    }

    return localidad;
  }

  async update(id: string, updateLocalidadeDto: UpdateLocalidadeDto) {
    const localidad = await this.localidadesRepository.findOne({
      where: { id },
      relations: ['provincia'],
    });

    if (!localidad) {
      throw new NotFoundException(`La localidad con id: ${id} no existe`);
    }

    await this.localidadesRepository.update(id, updateLocalidadeDto);

    const localidadUpdated = await this.localidadesRepository.findOne({
      where: { id },
      relations: ['provincia'],
    });

    return localidadUpdated;
  }

  async remove(id: string) {
    const localidadDelete = await this.localidadesRepository.findOne({
      where: { id },
      relations: ['provincia'],
    });

    if (!localidadDelete) {
      throw new NotFoundException(`La localidad con id: ${id} no existe`);
    }

    await this.localidadesRepository.delete(localidadDelete.id);
    return localidadDelete;
  }
}
