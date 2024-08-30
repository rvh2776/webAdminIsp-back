import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auths/roles.guard';
import { Role } from '../auths/roles.enum';
import { Servicio } from './entities/servicio.entity';
import { AuthGuard } from '../auths/auth.guards';
import { Request } from 'express';

@ApiTags('Servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un servicio nuevo' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Req() req: Request, @Body() createServicioDto: CreateServicioDto) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createServicioDto.agente = agente;
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los servicios' })
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
    const allServicios: Servicio[] = await this.serviciosService.findAll(
      page,
      limit,
    );
    return allServicios;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un servicio por :id' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const servicio = await this.serviciosService.findOne(id);
    if (!servicio) {
      return {
        error: 'No se encontró el servicioo.',
      };
    }
    return servicio;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un servicio por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createServicioDto: CreateServicioDto,
  ) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createServicioDto.agente = agente;
    return this.serviciosService.update(id, createServicioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un servicio por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.serviciosService.remove(id);
  }
}
