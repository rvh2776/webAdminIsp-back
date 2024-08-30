import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Between, Repository } from 'typeorm';
import { RangoFecha } from './dto/rango-fecha.dto';
import { User } from '../users/entities/user.entity';
import { MapsService } from '../maps/maps.service';

@Injectable()
export class RelevamientosService {
  constructor(
    @InjectRepository(Relevamiento)
    private relevamientoRepository: Repository<Relevamiento>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
    @InjectRepository(Localidad)
    private localidadRepository: Repository<Localidad>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mapsService: MapsService,
  ) {}

  async create(createRelevamientoDto: CreateRelevamientoDto) {
    //* verifica mail duplicado (la entidad dice email:unique)
    const existingEmail = await this.relevamientoRepository.findOne({
      where: {
        email: createRelevamientoDto.email,
      },
    });

    if (existingEmail)
      throw new BadRequestException(
        `Ya existe un relevamiento para este email.Un agente se contactará.`,
      );

    //w localizar agente cercano y asignar(mock)
    const agente = 'asignar agente';

    //* Si no se tiene api de GoogleMaps.
    //* Descomentar: lat, lng y comentar toda la función que busca las coordenadas.
    //w localiza coordenadas domicilio(mock)
    // const lat = -58.3816;
    // const lng = -58.3816;

    //* Geocoding :obtiene coordenadas del domicilio declarado por guest
    // const { direccion, provincia, localidad } = createRelevamientoDto;
    // const domicilioCompleto = `${direccion}, ${localidad}, ${provincia}`;
    // const coordenadas =
    //   await this.mapsService.getCoordenadas(domicilioCompleto);
    //   console.log('COORDENADAS',coordenadas);
    // const { lat, lng } = coordenadas;

    const fetchedProvincia = await this.provinciaRepository.findOne({
      where: { nombre: createRelevamientoDto.provincia },
    });

    if (!fetchedProvincia) {
      throw new BadRequestException('La provincia no existe');
    }

    const fetchedLocalidad = await this.localidadRepository.findOne({
      where: { nombre: createRelevamientoDto.localidad },
    });

    if (!fetchedLocalidad) {
      throw new BadRequestException('La localidad no existe');
    }

    //* crea nuevo relevamiento con propiedades restantes
    const newRelevamiento = this.relevamientoRepository.create({
      ...createRelevamientoDto,
      agente,
      provincia: fetchedProvincia,
      localidad: fetchedLocalidad,
    });

    const savedRelevamiento =
      await this.relevamientoRepository.save(newRelevamiento);

    return {
      message: 'Nuevo relevamiento guardado exitosamente',
      savedRelevamiento,
    };
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;

    const [relevamientos, totlaItems] =
      await this.relevamientoRepository.findAndCount({
        skip: skippedItems,
        take: limit,
        relations: ['provincia', 'localidad'],
      });

    return {
      totlaItems,
      totalPages: Math.ceil(totlaItems / limit),
      currentPage: page,
      relevamientos,
    };
  }

  async findOne(id: string) {
    const relevamiento = await this.relevamientoRepository.findOne({
      where: { id },
    });

    if (!relevamiento) {
      throw new NotFoundException('Relevamiento no encontrado');
    }
    return {
      message: 'Relevamiento encontrado',
      relevamiento,
    };
  }

  async update(id: string, updateRelevamientoDto: CreateRelevamientoDto) {
    const fetchedRelevamiento = await this.relevamientoRepository.findOne({
      where: { id },
    });

    if (!fetchedRelevamiento) {
      throw new NotFoundException('Relevamiento no encontrado');
    }

    //* verifica provincia y localidad
    let provincia: Provincia;
    let localidad: Localidad;

    const fetchedProvincia = await this.provinciaRepository.findOne({
      where: { nombre: updateRelevamientoDto.provincia },
    });

    if (!fetchedProvincia) {
      throw new BadRequestException('La provincia no existe');
    }

    // eslint-disable-next-line prefer-const
    provincia = fetchedProvincia;

    const fetchedLocalidad = await this.localidadRepository.findOne({
      where: { nombre: updateRelevamientoDto.localidad },
    });

    if (!fetchedLocalidad) {
      throw new BadRequestException('La localidad no existe');
    }

    // eslint-disable-next-line prefer-const
    localidad = fetchedLocalidad;

    const updatedRelevamiento = {
      id,
      ...updateRelevamientoDto,
      provincia,
      localidad,
    };

    const savedRelevamiento =
      await this.relevamientoRepository.save(updatedRelevamiento);

    return {
      message: 'Relevamiento actualizado exitosamente',
      savedRelevamiento,
    };
  }

  async remove(id: string) {
    const relevamiento = await this.relevamientoRepository.findOne({
      where: { id },
    });

    if (!relevamiento) {
      throw new NotFoundException('El relevamiento no existe');
    }

    await this.relevamientoRepository.remove(relevamiento);
    return {
      message: 'Relevamiento eliminado exitosamente',
      relevamiento,
    };
  }

  //* ##############################
  //* ######## 'Busquedas' #########
  //* ##############################

  async getByDateRange(rangoFecha: RangoFecha) {
    const { fechaInicio, fechaFin } = rangoFecha;

    //* formatea fechas para coincidir con el TimeStamp en db
    const startDate = new Date(fechaInicio);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(fechaFin);
    endDate.setUTCHours(23, 59, 59, 999);

    const relevamientos = await this.relevamientoRepository.find({
      where: {
        fechaIngreso: Between(startDate, endDate),
      },
      relations: ['provincia', 'localidad'],
    });

    //* retorna excepcion si no encuentra relevamientos
    if (relevamientos.length === 0) {
      throw new NotFoundException(
        `No hay relevamientos entre ${fechaFin} y ${fechaInicio}`,
      );
    }

    return {
      message: `${relevamientos.length} relevamientos encontrados desde ${fechaInicio} hasta ${fechaFin}`,
      relevamientos,
    };
  }

  async getByAgente(agente: string) {
    //* busca al agente en tabla users
    const existingAgente = await this.userRepository.findOne({
      where: {
        isAdmin: true,
        nombre: agente,
      },
    });
    //* retorna exception si no encuentra al agente
    if (!existingAgente)
      throw new NotFoundException(`El agente ${agente} no existe`);

    //* busca relevamientos por agente verificado
    const relevamientos = await this.relevamientoRepository.find({
      where: { agente },
      relations: ['provincia', 'localidad'],
    });

    //* si el agente no tiene relevamientos lo informa
    if (!relevamientos.length)
      throw new NotFoundException(
        `No hay relevamientos para el agente ${agente}`,
      );

    return {
      message: `Relevamientos del agente ${agente}`,
      relevamientos,
    };
  }

  async getByProvincia(provincia: string) {
    //*busca la provincia
    const existingProvincia = await this.provinciaRepository.findOne({
      where: { nombre: provincia },
      relations: ['relevamiento'],
    });
    //* verifica existencia de provincia
    if (!existingProvincia)
      throw new NotFoundException('Provincia no encontrada');
    //* verifica si hay relevamientos en el array
    if (!existingProvincia.relevamiento.length)
      throw new NotFoundException(
        `No se encontraron relevamientos para ${provincia}`,
      );

    //* retorna todos los relevamientos segun la provincia
    return {
      message: `Relevamientos encontrados para ${provincia}`,
      relevamientos: existingProvincia.relevamiento,
    };
  }

  async getByLocalidad(localidad: string) {
    //* busca la localidad por nombre
    const existingLocalidad = await this.localidadRepository.findOne({
      where: { nombre: localidad },
      relations: ['relevamiento'],
    });

    //* verifica su existencia en db
    if (!existingLocalidad)
      throw new NotFoundException(`Localidad no encontrada`);
    //* verifica si hay relevamientos en el array
    if (!existingLocalidad.relevamiento.length)
      throw new NotFoundException(
        `No se encontraron relevamientos para ${localidad}`,
      );

    return {
      message: `Relevamientos para ${localidad}`,
      relevamientos: existingLocalidad.relevamiento,
    };
  }
}
