import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const existingServicio = await this.serviciosRepository.findOne({
      where: { nombre: createServicioDto.nombre },
    });
    if (existingServicio) {
      throw new BadRequestException('El servicio ya existe');
    }

    let user = null;
    if (createServicioDto.userId) {
      user = await this.usersRepository.findOne({
        where: { id: createServicioDto.userId },
      });
      if (!user) {
        throw new BadRequestException(
          `Usuario con id ${createServicioDto.userId} no encontrado.`,
        );
      }
    }

    const servicio = this.serviciosRepository.create({
      ...createServicioDto,
      user, // Asignamos el objeto User si existe
    });

    try {
      return await this.serviciosRepository.save(servicio);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el servicio.',
      );
    }
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.serviciosRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async findOne(id: string) {
    const servicio = await this.serviciosRepository.findOne({
      where: { id: id },
    });

    if (servicio) {
      return {
        ...servicio,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedServicioData: CreateServicioDto) {
    const oldServicio = await this.serviciosRepository.findOneBy({ id: id });

    if (!oldServicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    console.log(updatedServicioData);

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldServicio, updatedServicioData);

    const userId = await this.usersRepository.findOneBy({
      id: updatedServicioData.userId,
    });

    console.log(userId);

    if (!userId) throw new NotFoundException('Usuario no encontrado');

    oldServicio.user = userId;

    const updatedServicio = await this.serviciosRepository.save(oldServicio);
    return updatedServicio;
  }

  async remove(id: string) {
    const oldServicio = await this.serviciosRepository.findOne({
      where: { id },
    });

    if (!oldServicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    await this.serviciosRepository.remove(oldServicio);

    return { success: `Servicio con id: ${id} eliminado con éxito` };
  }
}
