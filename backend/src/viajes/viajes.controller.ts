import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiSecurity, ApiParam } from '@nestjs/swagger';
import { ViajesService } from '@/viajes/viajes.service';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';
import { BuscarViajesQueryDto } from '@/viajes/dto/buscar-viajes-query.dto';
import { ViajeConDisponibilidadDto } from '@/viajes/dto/viaje-con-disponibilidad.dto';
import { ApiKeyGuard } from '@/auth/guards/api-key.guard';

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

  @Get(':id/boletos')
  @ApiOperation({ summary: 'Obtener boletos de un viaje (con Lazy Expiration)' })
  @ApiParam({ name: 'id', description: 'ID del viaje', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Array de boletos. Las reservas expiradas se marcan como disponibles.',
  })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado.' })
  getBoletos(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.getBoletosByViajeId(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Crear un nuevo viaje con sus boletos' })
  @ApiHeader({ name: 'x-api-key', description: 'Clave de administración', required: true })
  @ApiResponse({ status: 201, description: 'Viaje creado con sus boletos exitosamente.' })
  @ApiResponse({ status: 401, description: 'API Key inválida o no proporcionada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Ruta no encontrada.' })
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajesService.create(createViajeDto);
  }
}
