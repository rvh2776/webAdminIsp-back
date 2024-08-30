import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/facturacion.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectRepository(Factura) private facturasRepository: Repository<Factura>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createFacturacionDto: CreateFacturacionDto): Promise<Factura> {
    const existingFactura = await this.facturasRepository.findOne({
      where: { numFactura: createFacturacionDto.numFactura },
    });
    if (existingFactura) {
      throw new BadRequestException('La factura ya existe');
    }

    let user = null;
    if (createFacturacionDto.userId) {
      user = await this.usersRepository.findOne({
        where: { id: createFacturacionDto.userId },
      });
      if (!user) {
        throw new BadRequestException(
          `Usuario con id ${createFacturacionDto.userId} no encontrado.`,
        );
      }
    }

    const factura = this.facturasRepository.create({
      ...createFacturacionDto,
      user, // Asignamos el objeto User si existe
    });

    try {
      return await this.facturasRepository.save(factura);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el equipo.',
      );
    }
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    const factura = this.facturasRepository.find({
      skip: skippedItems,
      take: limit,
      relations: ['user'],
      select: {
        user: {
          nombre: true,
        },
      },
    });

    return factura;
  }

  async findOne(id: string) {
    const factura = await this.facturasRepository.findOne({
      where: { id: id },
      relations: ['user'],
      select: {
        user: {
          nombre: true,
        },
      },
    });

    if (factura) {
      return {
        ...factura,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedFacturacionData: Partial<Factura>) {
    const oldFactura = await this.facturasRepository.findOneBy({ id: id });

    if (!oldFactura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldFactura, updatedFacturacionData);

    const updatedFactura = await this.facturasRepository.save(oldFactura);
    return updatedFactura;
  }
}
