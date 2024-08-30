import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ImpuestosService } from './impuestos.service';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from '../auths/roles.guard';
import { AuthGuard } from '../auths/auth.guards';
import { Request } from 'express';

@ApiTags('Impuestos')
@Controller('impuestos')
export class ImpuestosController {
  constructor(private readonly impuestosService: ImpuestosService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo impuesto' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Req() req: Request,
    @Body() createImpuestoDto: CreateImpuestoDto,
  ) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    createImpuestoDto.agente = agente;
    return await this.impuestosService.create(createImpuestoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos los impuestos' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    return await this.impuestosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna un impuesto por ID' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return await this.impuestosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifica un impuesto por ID' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateImpuestoDto: CreateImpuestoDto,
  ) {
    const agente = req.user.nombre;

    if (!agente) {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    updateImpuestoDto.agente = agente;
    return await this.impuestosService.update(id, updateImpuestoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Modifica un impuesto por ID' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.impuestosService.remove(id);
  }
}
