import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UsePipes,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
  UnauthorizedException,
  Req,
  Patch,
} from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Equipo } from './entities/equipo.entity';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from './../auths/roles.guard';
import { AuthGuard } from '../auths/auth.guards';
import { Request } from 'express';

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {
    console.log('EquiposController instantiated');
  }

  @Post()
  @ApiOperation({ summary: 'Agregar un equipo nuevo' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req: Request, @Body() createEquipoDto: CreateEquipoDto) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createEquipoDto.agente = agente;
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los equipos' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 5,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const allEquipos: Equipo[] = await this.equiposService.findAll(page, limit);
    return allEquipos;
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de equipos' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getEquiposStats() {
    const stats = await this.equiposService.getEquiposCount();
    return stats;
  }

  @Get('/available')
  @ApiOperation({ summary: 'Ver todos los equipos disponibles' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 5,
  })
  async findAvailable(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    // Obtener todos los equipos con paginación
    const allEquipos: Equipo[] = await this.equiposService.findAll(page, limit);

    // Filtrar solo aquellos equipos que tengan isAvailable: true
    const availableEquipos = allEquipos.filter((equipo) => equipo.isAvailable);

    return availableEquipos;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un equipo por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const equipo = await this.equiposService.findOne(id);
    if (!equipo) {
      return {
        error: 'No se encontró el equipo.',
      };
    }
    return equipo;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un equipo por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createEquipoDto: CreateEquipoDto,
  ) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createEquipoDto.agente = agente;
    return this.equiposService.update(id, createEquipoDto);
  }

  @Patch(':id/desasignar')
  @ApiOperation({ summary: 'Desasignar un equipo por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async unassignEquipo(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.equiposService.unassignEquipo(id);
  }
}
