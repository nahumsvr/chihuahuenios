import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ViajesService } from '@/viajes/viajes.service';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';
import { BuscarViajesQueryDto } from '@/viajes/dto/buscar-viajes-query.dto';
import { ViajeConDisponibilidadDto } from '@/viajes/dto/viaje-con-disponibilidad.dto';
import { ViajesDisponiblesQueryDto } from '@/viajes/dto/viajes-disponibles-query.dto';
import { Auth } from '@/auth/decorators/auth.decorator';

@ApiTags('Viajes')
@Controller('api/viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar viajes por origen, destino y fecha' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes con asientos disponibles.',
    type: [ViajeConDisponibilidadDto],
  })
  @ApiResponse({ status: 400, description: 'Query params inválidos.' })
  buscar(@Query() query: BuscarViajesQueryDto) {
    return this.viajesService.buscar(query);
  }

  @Get('disponibles')
  @ApiOperation({
    summary: 'Obtener todos los viajes futuros con su disponibilidad',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de todos los viajes a partir de la fecha y hora actual.',
    type: [ViajeConDisponibilidadDto],
  })
  obtenerDisponibles(@Query() query: ViajesDisponiblesQueryDto) {
    return this.viajesService.obtenerDisponibles(query);
  }

  @Get('all')
  @Auth('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los viajes (solo admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los viajes. Si se provee ruta_id, filtra por ruta.',
  })
  findAll(@Query('ruta_id') ruta_id?: string) {
    return this.viajesService.findAll(ruta_id ? Number(ruta_id) : undefined);
  }

  @Get(':id/boletos')
  @ApiOperation({
    summary: 'Obtener boletos de un viaje (con Lazy Expiration)',
  })
  @ApiParam({ name: 'id', description: 'ID del viaje', type: Number })
  @ApiResponse({
    status: 200,
    description:
      'Array de boletos. Las reservas expiradas se marcan como disponibles.',
  })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado.' })
  getBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getBoletosByViajeId(id);
  }

  @Post()
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo viaje con sus boletos (solo admin)' })
  @ApiResponse({
    status: 201,
    description: 'Viaje creado con sus boletos exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'Token JWT no proporcionado.' })
  @ApiResponse({ status: 403, description: 'Se requiere rol de administrador.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada.' })
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Delete(':id')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un viaje si no tiene boletos vendidos (solo admin)' })
  @ApiParam({ name: 'id', description: 'ID del viaje a eliminar', type: Number })
  @ApiResponse({ status: 204, description: 'Viaje eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El viaje tiene boletos vendidos.' })
  @ApiResponse({ status: 401, description: 'Token JWT no proporcionado.' })
  @ApiResponse({ status: 403, description: 'Se requiere rol de administrador.' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.delete(id);
  }
}
