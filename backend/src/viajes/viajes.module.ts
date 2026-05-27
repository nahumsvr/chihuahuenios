import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ViajesService } from '@/viajes/viajes.service';
import { ViajesController } from '@/viajes/viajes.controller';
import { Viaje } from '@/viajes/entities/viaje.entity';
import { Boleto } from '@/viajes/entities/boleto.entity';
import { Ruta } from '@/rutas/entities/ruta.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Viaje, Boleto, Ruta]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'super-secret-key-change-in-prod',
        ),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [ViajesController],
  providers: [ViajesService, AuthGuard, RolesGuard],
  exports: [ViajesService],
})
export class ViajesModule {}
