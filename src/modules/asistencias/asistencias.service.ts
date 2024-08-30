import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto, user: any) {
    let foundUser = null;
    if (createAsistenciaDto.userId) {
      foundUser = await this.usersRepository.findOne({
        where: { id: createAsistenciaDto.userId },
      });
      if (!foundUser) {
        throw new BadRequestException(
          `Usuario con id ${createAsistenciaDto.userId} no encontrado.`,
        );
      }
    }

    // Verificar que el user.nombre existe y no es nulo
    if (!user || !user.nombre) {
      throw new BadRequestException('Usuario autenticado no tiene nombre.');
    }

    const asistencia = this.asistenciaRepository.create({
      ...createAsistenciaDto,
      agente: user.nombre,
      user: foundUser,
      userId: createAsistenciaDto.userId,
    });

    //console.log('Creating Asistencia:', asistencia);

    return await this.asistenciaRepository.save(asistencia);
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.asistenciaRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async findOne(id: string) {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id: id },
    });

    if (asistencia) {
      return {
        ...asistencia,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedAsistenciaData: Partial<Asistencia>) {
    const oldAsistencia = await this.asistenciaRepository.findOneBy({ id: id });

    if (!oldAsistencia) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldAsistencia, updatedAsistenciaData);

    const updatedAsistencia =
      await this.asistenciaRepository.save(oldAsistencia);
    return updatedAsistencia;
  }

  async remove(id: string) {
    const oldAsistencia = await this.asistenciaRepository.findOne({
      where: { id },
    });

    if (!oldAsistencia) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    await this.asistenciaRepository.remove(oldAsistencia);

    return { success: `Asistencia con id: ${id} eliminado con éxito` };
  }
}
