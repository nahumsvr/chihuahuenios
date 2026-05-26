import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuscarViajesQueryDto {
  @ApiProperty({ description: 'Ciudad de origen', example: 'Oaxaca' })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({ description: 'Ciudad de destino', example: 'Puebla' })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({
    description: 'Fecha del viaje (YYYY-MM-DD)',
    example: '2026-06-01',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}
