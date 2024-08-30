import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalidadesService } from './localidades.service';
import { CreateLocalidadeDto } from './dto/create-localidade.dto';
import { UpdateLocalidadeDto } from './dto/update-localidade.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import { RolesGuard } from '../auths/roles.guard';
import { Request } from 'express';
import { AuthGuard } from '../auths/auth.guards';

@ApiTags('Localidades')
@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create locality' })
  @ApiResponse({
    status: 201,
    description: 'The locality has been successfully created.',
    type: CreateLocalidadeDto,
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  create(
    @Req() req: Request & { oidc?: any; user?: any },
    @Body() createLocalidadeDto: CreateLocalidadeDto,
  ) {
    let agente: string;

    //* propiedad user existe tanto en auth interna como externa
    //* solo difiere el acceso al nombre (name > Auth0, agente > Interna)
    if (req.user) {
      agente = req.user.name || req.user.agente;
    } else {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    //* agrega al agente al dto y lo pasa al servicio
    createLocalidadeDto.agente = agente;

    return this.localidadesService.create(createLocalidadeDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Get all localities' })
  @ApiResponse({
    status: 200,
    description: 'The locality has been successfully retrieved.',
    example: {
      data: [
        {
          id: '1e0ce1b8-869f-4d43-b7e3-0815885d7ee1',
          nombre: 'Mendoza',
        },
        {
          id: 'fe08027c-6f70-4fc8-ae80-80c716a78029',
          nombre: 'Godoy Cruz',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.localidadesService.findAll();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Get locality by Id' })
  @ApiResponse({
    status: 200,
    description: 'The locality has been successfully retrieved.',
    example: {
      id: '59ba50d7-1212-4bd0-a50a-304098519e2b',
      nombre: 'San Carlos',
      provincia: {
        id: '3706c2bb-4d83-4aa7-b9bd-6ce8f8f9fefc',
        nombre: 'Mendoza',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.localidadesService.findOne(id);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Update locality' })
  @ApiBody({
    schema: {
      type: 'string',
      example: { nombre: 'San Carlos' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The locality has been successfully updated.',
    example: {
      id: '59ba50d7-1212-4bd0-a50a-304098519e2b',
      nombre: 'San Carlos',
      provincia: {
        id: '3706c2bb-4d83-4aa7-b9bd-6ce8f8f9fefc',
        nombre: 'Mendoza',
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Req() req: Request & { oidc?: any; user?: any },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocalidadeDto: UpdateLocalidadeDto,
  ) {
    let agente: string;

    //* propiedad user existe tanto en auth interna como externa
    //* solo difiere el acceso al nombre (name > Auth0, agente > Interna)
    if (req.user) {
      agente = req.user.name || req.user.agente;
    } else {
      throw new UnauthorizedException('No se pudo determinar el agente');
    }

    //* agrega al agente al dto y lo pasa al servicio
    updateLocalidadeDto.agente = agente;
    return this.localidadesService.update(id, updateLocalidadeDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Delete locality' })
  @ApiResponse({
    status: 200,
    description: 'Delete a locality.',
    schema: {
      type: 'string',
      example: {
        id: '5a44f35e-d1e2-4430-b299-ddd42cf5f3fb',
        nombre: 'San Carlos',
        provincia: {
          id: '004147cb-ad76-40ff-81b5-cb8f6a5d5359',
          nombre: 'Salta',
        },
      },
    },
  })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.localidadesService.remove(id);
  }
}
