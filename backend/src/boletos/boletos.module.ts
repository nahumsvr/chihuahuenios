import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoletosController } from '@/boletos/boletos.controller';
import { BoletosService } from '@/boletos/boletos.service';
import { Boleto } from '@/viajes/entities/boleto.entity';
import { User } from '@/users/entities/user.entity';
import { StorageModule } from '@/storage/storage.module';
import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleto, User]),
    StorageModule,
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
  controllers: [BoletosController],
  providers: [BoletosService, AuthGuard, RolesGuard],
})
export class BoletosModule {}
