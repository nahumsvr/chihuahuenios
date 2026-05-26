import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesService } from '@/viajes/viajes.service';
import { ViajesController } from '@/viajes/viajes.controller';
import { Viaje } from '@/viajes/entities/viaje.entity';
import { Boleto } from '@/viajes/entities/boleto.entity';
import { Ruta } from '@/rutas/entities/ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje, Boleto, Ruta])],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule {}
