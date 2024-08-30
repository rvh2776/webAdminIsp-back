import { User } from 'src/modules/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo) private equiposRepository: Repository<Equipo>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    const existingEquipo = await this.equiposRepository.findOne({
      where: { macEquipo: createEquipoDto.macEquipo },
    });
    if (existingEquipo) {
      throw new BadRequestException('El equipo ya existe');
    }

    let user = null;
    if (createEquipoDto.userId) {
      user = await this.usersRepository.findOne({
        where: { id: createEquipoDto.userId },
      });
      if (!user) {
        throw new BadRequestException(
          `Usuario con id ${createEquipoDto.userId} no encontrado.`,
        );
      }
    }

    const equipo = this.equiposRepository.create({
      ...createEquipoDto,
      user, // Asignamos el objeto User si existe
    });

    try {
      return await this.equiposRepository.save(equipo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el equipo.',
      );
    }
  }

  async getEquiposCount() {
    const totalEquipos = await this.equiposRepository
      .createQueryBuilder('equipo')
      .getCount();

    const totalDisponibles = await this.equiposRepository
      .createQueryBuilder('equipo')
      .where('equipo.isAvailable = :isAvailable', { isAvailable: true })
      .getCount();

    return {
      totalEquipos,
      totalDisponibles,
    };
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.equiposRepository.find({
      skip: skippedItems,
      take: limit,
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const equipo = await this.equiposRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (equipo) {
      return {
        ...equipo,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedEquipoData: UpdateEquipoDto) {
    const oldEquipo = await this.equiposRepository.findOneBy({ id: id });

    if (!oldEquipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldEquipo, updatedEquipoData);

    // busca el usuario por id
    const user = await this.usersRepository.findOneBy({
      id: updatedEquipoData.userId,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    //asigna el usuario > el objeto entero para la relacion
    oldEquipo.user = user;

    const updatedEquipo = await this.equiposRepository.save(oldEquipo);
    return updatedEquipo;
  }

  async remove(id: string) {
    const oldEquipo = await this.equiposRepository.findOne({
      where: { id },
    });

    if (!oldEquipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    await this.equiposRepository.remove(oldEquipo);

    return { success: `Equipo con id: ${id} eliminado con éxito` };
  }

  async unassignEquipo(id: string): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    equipo.isAvailable = true;
    equipo.user = null; // Desasignamos el equipo del usuario

    try {
      return await this.equiposRepository.save(equipo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al desasignar el equipo.',
      );
    }
  }
}
