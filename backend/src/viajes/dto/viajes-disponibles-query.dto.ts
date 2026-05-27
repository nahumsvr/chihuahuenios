import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ViajesDisponiblesQueryDto {
  @ApiProperty({
    description: 'ID de la ruta para filtrar los viajes (opcional)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ruta_id?: number;
}
