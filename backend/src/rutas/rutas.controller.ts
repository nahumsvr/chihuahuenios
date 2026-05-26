import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { RutasService } from '@/rutas/rutas.service';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';
import { ApiKeyGuard } from '@/auth/guards/api-key.guard';

@ApiTags('Rutas')
@Controller('api/rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las rutas disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de rutas con id, origen y destino.' })
  findAll() {
    return this.rutasService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Crear una nueva ruta de autobús' })
  @ApiHeader({ name: 'x-api-key', description: 'Clave de administración', required: true })
  @ApiResponse({ status: 201, description: 'Ruta creada exitosamente.' })
  @ApiResponse({ status: 401, description: 'API Key inválida o no proporcionada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() createRutaDto: CreateRutaDto) {
    return this.rutasService.create(createRutaDto);
  }
}
