import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Put,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auths/auth.guards';
import { Request } from 'express';
import { Asistencia } from './entities/asistencia.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from '../auths/roles.guard';

@ApiTags('Asistencias')
@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Dar de alta un pedido o asistencia' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateAsistenciaDto })
  async create(
    @Body() createAsistenciaDto: CreateAsistenciaDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    //console.log('Authenticated User:', user);
    return await this.asistenciasService.create(createAsistenciaDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todas las asistencias' })
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
    const allAsistencias: Asistencia[] = await this.asistenciasService.findAll(
      page,
      limit,
    );
    return allAsistencias;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver una asistencia por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const asistencia = await this.asistenciasService.findOne(id);
    if (!asistencia) {
      return {
        error: 'No se encontró la asistencia.',
      };
    }
    return asistencia;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asistencia por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createAsistenciaDto: CreateAsistenciaDto,
  ) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createAsistenciaDto.agente = agente;
    //console.log('agente cargado automáticamente al dto');
    return this.asistenciasService.update(id, createAsistenciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asistencia por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.asistenciasService.remove(id);
  }
}
