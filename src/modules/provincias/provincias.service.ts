import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinciasService {
  constructor(
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
  ) {}

  async create(createProvinciaDto: CreateProvinciaDto) {
    //*busca la provincia por nombre
    const existingProvincia = await this.provinciaRepository.findOne({
      where: { nombre: createProvinciaDto.nombre },
    });
    //* si la encuentra previene el duplicado
    if (existingProvincia)
      throw new BadRequestException(
        `${createProvinciaDto.nombre} ya existe en la base de datos`,
      );

    //* guarda la nueva provincia
    const newProvincia =
      await this.provinciaRepository.save(createProvinciaDto);
    return newProvincia;
  }

  async findAll() {
    const provincias = await this.provinciaRepository.find({
      relations: ['localidades'],
    });

    return provincias;
  }

  async findOne(id: string) {
    return await this.provinciaRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProvinciaDto: CreateProvinciaDto) {
    const existingProvincia = await this.provinciaRepository.findOne({
      where: { id },
    });

    if (!existingProvincia)
      throw new NotFoundException('La provincia no existe');

    const updatedProvincia = {
      ...existingProvincia,
      ...updateProvinciaDto,
    };

    const savedProvincia =
      await this.provinciaRepository.save(updatedProvincia);

    return {
      message: 'Provincia actualizada',
      savedProvincia,
    };
  }

  async remove(id: string) {
    const provincia = await this.provinciaRepository.findOne({ where: { id } });
    if (!provincia) throw new NotFoundException('Provincia no encontrada');

    await this.provinciaRepository.remove(provincia);

    return {
      message: 'Provincia eliminada exitosamente',
      provincia,
    };
  }
}
