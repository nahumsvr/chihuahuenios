import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RutasService } from '@/rutas/rutas.service';
import { RutasController } from '@/rutas/rutas.controller';
import { Ruta } from '@/rutas/entities/ruta.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ruta]),
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
  controllers: [RutasController],
  providers: [RutasService, AuthGuard, RolesGuard],
  exports: [RutasService],
})
export class RutasModule {}
