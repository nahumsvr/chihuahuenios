import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  BadRequestException,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('identificacion', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Tipo de archivo no permitido. Solo se aceptan PDF, PNG y JPG.',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de registro con documento de identidad',
    schema: {
      type: 'object',
      required: ['nombre', 'email', 'password', 'identificacion'],
      properties: {
        nombre: { type: 'string', example: 'Juan Pérez' },
        email: { type: 'string', example: 'juan.perez@example.com' },
        password: { type: 'string', example: 'secret123' },
        identificacion: {
          type: 'string',
          format: 'binary',
          description: 'Documento de identidad (PDF, PNG, JPG, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Datos de registro inválidos o correo ya registrado.',
  })
  register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('El documento de identidad es obligatorio para registrarse.');
    }
    return this.authService.register(registerDto, file);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa. Devuelve el access_token.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Auth()
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil devuelto exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token inválido.' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Auth()
  @ApiBearerAuth()
  @Patch('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Tipo de archivo no permitido. Solo se aceptan PNG y JPG.',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Subir o actualizar foto de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen para la foto de perfil',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Foto de perfil (PNG, JPG, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil actualizada exitosamente. Devuelve el nuevo access_token.',
  })
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { sub: string },
  ) {
    if (!file) {
      throw new BadRequestException('El archivo de imagen es obligatorio.');
    }
    return this.authService.uploadProfilePicture(user.sub, file);
  }
}
