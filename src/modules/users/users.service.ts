import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../auths/roles.enum';
import { UserToAdminDto } from './dto/user-to-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async auth0Signin(auth0Data: Record<string, any>) {
    const email = auth0Data.email;

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`El usuario con email: ${email} no existe`);
    }

    const userPayload = {
      sub: user.id,
      id: user.id,
      agente: user.agente,
      email: user.email,
      nombre: user.nombre,
      roles: [user.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);

    const decodedToken = this.jwtService.decode(token);

    // console.log(decodedToken);

    // const iat = new Date(decodedToken.iat * 1000).toLocaleString();
    const iat = decodedToken.iat;
    // const exp = new Date(decodedToken.exp * 1000).toLocaleString();
    const exp = decodedToken.exp;

    return {
      succes: 'User logged in successfully',
      token,
      issuedAt: iat,
      expiresAt: exp,
      agente: user.agente,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        roles: [user.isAdmin ? Role.Admin : Role.User],
      },
    };
  }

  async getUsers(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.usersRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['facturas', 'equipos', 'servicios', 'asistencias'],
    });

    if (!user) throw new NotFoundException('Usuario No Encontrado');

    return {
      message: 'Usuario Encontrado',
      ...user,
    };
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(id: string, updatedUserData: Partial<User>) {
    const oldUser = await this.usersRepository.findOneBy({ id: id });

    if (!oldUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Merge de datos: copiar las propiedades actualizadas al usuario existente
    Object.assign(oldUser, updatedUserData);

    const updatedUser = await this.usersRepository.save(oldUser);
    return updatedUser;
  }

  async updateAdmin(id: string, userToAdminDto: UserToAdminDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new BadRequestException(`El usuario no existe`);

    for (const key in userToAdminDto) {
      if (userToAdminDto.hasOwnProperty(key)) {
        user[key] = userToAdminDto[key];
      }
    }

    const response = await this.usersRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = response;

    return {
      message: `Usuario ${updatedUser.nombre} es ahora Administrador`,
      updatedUser,
    };
  }

  async deleteUser(id: string) {
    const oldUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!oldUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usersRepository.remove(oldUser);

    return { success: `User with id: ${id} deleted successfully` };
  }

  async updateUserImage(id: string, secure_url: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }

    user.imgUrl = secure_url;
    await this.usersRepository.save(user);

    return user;
  }
}
