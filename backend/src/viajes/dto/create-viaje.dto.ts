import { IsDateString, IsInt, IsNotEmpty, Min, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateViajeDto {
  @ApiProperty({ description: 'ID de la ruta asociada', example: 1 })
  @IsInt()
  @IsNotEmpty()
  ruta_id: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio en formato ISO 8601',
    example: '2026-06-01T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha_hora_inicio: string;

  @ApiProperty({
    description: 'Duración del viaje en minutos',
    example: 120,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duracion: number;

  @ApiProperty({
    description: 'Precio del boleto. Si no se especifica, se calcula a 120 pesos por hora de duración.',
    required: false,
    example: 240.00,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_boleto?: number;

  @ApiProperty({
    description: 'Capacidad total del viaje (número de asientos)',
    example: 40,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidad: number;
}
