import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RutasService } from '@/rutas/rutas.service';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';
import { Auth } from '@/auth/decorators/auth.decorator';

@ApiTags('Rutas')
@Controller('api/rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las rutas disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de rutas con id, origen y destino.',
  })
  findAll() {
    return this.rutasService.findAll();
  }

  @Post()
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva ruta de autobús (solo admin)' })
  @ApiResponse({ status: 201, description: 'Ruta creada exitosamente.' })
  @ApiResponse({ status: 401, description: 'Token JWT no proporcionado.' })
  @ApiResponse({ status: 403, description: 'Se requiere rol de administrador.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }
}
