import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { StorageService } from '@/storage/storage.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  async register(registerDto: RegisterDto, file?: Express.Multer.File) {
    let identificacion_url: string | undefined;

    if (file) {
      identificacion_url = await this.storageService.upload(
        file,
        'identificaciones',
      );
    }

    const user = await this.usersService.create({
      ...registerDto,
      identificacion_url,
    });

    // Do not return password_hash in response
    const { password_hash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      foto_perfil_url: user.foto_perfil_url,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        identificacion_url: user.identificacion_url,
        foto_perfil_url: user.foto_perfil_url,
      },
    };
  }

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    const foto_perfil_url = await this.storageService.upload(
      file,
      'perfiles',
    );

    await this.usersService.update(userId, { foto_perfil_url });
    const user = await this.usersService.findOne(userId);

    const payload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      foto_perfil_url: user.foto_perfil_url,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto_perfil_url: user.foto_perfil_url,
      },
    };
  }
}
