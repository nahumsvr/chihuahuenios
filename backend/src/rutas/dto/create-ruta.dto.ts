import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRutaDto {
  @ApiProperty({
    description: 'Ciudad de origen de la ruta',
    example: 'Oaxaca',
  })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({
    description: 'Ciudad de destino de la ruta',
    example: 'Puebla',
  })
  @IsString()
  @IsNotEmpty()
  destino: string;
}
