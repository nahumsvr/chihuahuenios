import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { nombre, email, password, identificacion_url, foto_perfil_url } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      nombre,
      email,
      password_hash,
      identificacion_url,
      foto_perfil_url,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { nombre, email, password, identificacion_url, foto_perfil_url } = updateUserDto;

    if (email && email !== user.email) {
      const existingUser = await this.findOneByEmail(email);
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      user.email = email;
    }

    if (nombre) {
      user.nombre = nombre;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password_hash = await bcrypt.hash(password, salt);
    }

    if (identificacion_url !== undefined) {
      user.identificacion_url = identificacion_url;
    }

    if (foto_perfil_url !== undefined) {
      user.foto_perfil_url = foto_perfil_url;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
