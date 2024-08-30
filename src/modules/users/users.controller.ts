import { RolesGuard } from './../auths/roles.guard';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auths/roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '../auths/auth.guards';
import { UserToAdminDto } from './dto/user-to-admin.dto';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from 'src/pipes/fileValidator.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    console.log('UsersController instantiated');
  }
  @Get()
  @ApiOperation({ summary: 'Ver todos los usuarios' })
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
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const allUsers: User[] = await this.UsersService.getUsers(page, limit);
    return allUsers;
  }

  @ApiOperation({ summary: 'Asigna rol de administrador' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('admin/:id')
  async updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userToAdminDto: UserToAdminDto,
  ) {
    try {
      console.log(userToAdminDto);
      const response = await this.UsersService.updateAdmin(id, userToAdminDto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver un usuario por :id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.UsersService.getUserById(id);
    if (!user) {
      return {
        error: 'No se encontró el usuario.',
      };
    }
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.UsersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por :id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.UsersService.deleteUser(id);
  }

  //? Ejemplo de uso Auth0.
  @ApiExcludeEndpoint()
  @Get('auth0/callback')
  async getAuth0Protected(@Req() req: Request, @Res() res: Response) {
    // async getAuth0Protected(@Req() req: Request) {
    const auth0Data = req.oidc.user;
    console.log('Respuesta de auth0:', auth0Data);

    try {
      const tokenResponse = await this.UsersService.auth0Signin(auth0Data);

      const redirectUrl = `${process.env.REDIRECT_URL_AUTH0}/verifyAuth0?verify=true&token=${tokenResponse.token}&issuedAt=${tokenResponse.issuedAt}&expiresAt=${tokenResponse.expiresAt}&agente=${tokenResponse.agente}&userId=${tokenResponse.user.id}&userEmail=${tokenResponse.user.email}&userNombre=${tokenResponse.user.nombre}&userRole=${tokenResponse.user.roles}`;

      res.redirect(redirectUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const errorRedirectUrl = `${process.env.REDIRECT_URL_AUTH0}/verifyAuth0?verify=false`;

        res.redirect(errorRedirectUrl);
      } else {
        // Manejar otros tipos de errores si es necesario
        res.status(500).send('Internal Server Error');
      }
    }
  }

  @ApiOperation({ summary: 'Subir una imagen para el usuario' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The image to upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The URL of the uploaded image',
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(FileValidatorPipe)
  async uploadProuctImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return this.UsersService.updateUserImage(id, imageUrl.secure_url);
  }
}
