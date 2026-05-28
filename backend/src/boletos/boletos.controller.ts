import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { BoletosService } from '@/boletos/boletos.service';
import { ConfirmarBoletoDto } from '@/boletos/dto/confirmar-boleto.dto';

@ApiTags('Boletos')
@Controller('api/boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Get('mis-compras')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todas las compras del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletos pagados con información del viaje y ruta.',
  })
  @ApiResponse({ status: 401, description: 'Token JWT no proporcionado o inválido.' })
  getMisCompras(@CurrentUser() user: { sub: string }) {
    return this.boletosService.getMisCompras(user.sub);
  }

  @Post(':id/reservar')
  @Auth()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reservar un asiento (bloqueo pesimista de 10 minutos)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del boleto a reservar',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Asiento bloqueado exitosamente.',
    schema: {
      example: {
        mensaje: 'Asiento bloqueado',
        reserva_token: '550e8400-e29b-41d4-a716-446655440000',
        expira_en: '2026-06-01T10:10:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT no proporcionado o inválido.',
  })
  @ApiResponse({ status: 404, description: 'Boleto no encontrado.' })
  @ApiResponse({ status: 409, description: 'Asiento ya reservado o comprado.' })
  reservar(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.reservar(id);
  }

  @Post('confirmar')
  @Auth()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar compra de boleto' })
  @ApiBody({
    description: 'Datos de confirmación',
    schema: {
      type: 'object',
      required: ['nombre', 'token'],
      properties: {
        nombre: {
          type: 'string',
          description: 'Nombre del comprador',
          example: 'Juan Pérez',
        },
        token: {
          type: 'string',
          format: 'uuid',
          description: 'Token UUID de la reserva',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Compra confirmada exitosamente.',
    schema: {
      example: {
        mensaje: 'Compra exitosa',
        boleto_id: 123,
        codigo_boleto: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, reserva expirada, o archivo no válido.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT no proporcionado o inválido.',
  })
  confirmar(
    @Body() confirmarDto: ConfirmarBoletoDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.boletosService.confirmar(confirmarDto, undefined, user.sub);
  }
}
