import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { RutasModule } from '@/rutas/rutas.module';
import { ViajesModule } from '@/viajes/viajes.module';
import { BoletosModule } from '@/boletos/boletos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgrespassword'),
        database: configService.get<string>('DB_DATABASE', 'chihuahuenos_db'),
        autoLoadEntities: true,
        synchronize: true, // only for local development/simplification
      }),
    }),
    AuthModule,
    UsersModule,
    RutasModule,
    ViajesModule,
    BoletosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
