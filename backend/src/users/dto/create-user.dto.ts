import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico única',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'secret123',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de identificación',
    example: 'https://minio/bucket/id.jpg',
  })
  @IsUrl()
  @IsOptional()
  identificacion_url?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://minio/bucket/perfiles/user.jpg',
  })
  @IsUrl()
  @IsOptional()
  foto_perfil_url?: string;
}
