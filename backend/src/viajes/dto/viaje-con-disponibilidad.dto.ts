import { ApiProperty } from '@nestjs/swagger';

class RutaResumenDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Oaxaca' })
  origen: string;

  @ApiProperty({ example: 'Puebla' })
  destino: string;
}

export class ViajeConDisponibilidadDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: RutaResumenDto })
  ruta: RutaResumenDto;

  @ApiProperty({ example: '2026-06-01T10:00:00.000Z' })
  fecha_hora_salida: Date;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z', description: 'Fecha y hora de llegada calculada' })
  fecha_hora_llegada: Date;

  @ApiProperty({ example: 120, description: 'Duración del viaje en minutos' })
  duracion: number;

  @ApiProperty({
    description: 'Asientos no ocupados ni reservados activamente',
    example: 35,
  })
  asientos_disponibles: number;

  @ApiProperty({ description: 'Total de asientos del viaje', example: 40 })
  total_asientos: number;
}
