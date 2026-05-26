import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Boleto } from '@/viajes/entities/boleto.entity';
import { User } from '@/users/entities/user.entity';
import { StorageService } from '@/storage/storage.service';
import { ConfirmarBoletoDto } from '@/boletos/dto/confirmar-boleto.dto';

@Injectable()
export class BoletosService {
  private readonly logger = new Logger(BoletosService.name);

  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Reservar un boleto usando bloqueo pesimista (SELECT ... FOR UPDATE).
   * Implementa Lazy Expiration: si la reserva anterior expiró, permite re-reservar.
   */
  async reservar(boletoId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. SELECT ... FOR UPDATE (bloqueo pesimista)
      const boleto = await queryRunner.manager
        .createQueryBuilder(Boleto, 'boleto')
        .setLock('pessimistic_write')
        .where('boleto.id = :id', { id: boletoId })
        .getOne();

      if (!boleto) {
        throw new NotFoundException(`Boleto con ID ${boletoId} no encontrado`);
      }

      // 2. Validar disponibilidad
      const now = new Date();

      if (boleto.estado === 'pagado') {
        throw new ConflictException('Este asiento ya fue comprado');
      }

      if (
        boleto.estado === 'reservado' &&
        boleto.bloqueado_hasta &&
        new Date(boleto.bloqueado_hasta) > now
      ) {
        throw new ConflictException(
          'Este asiento está reservado por otro usuario. Intente de nuevo más tarde.',
        );
      }

      // 3. Generar token y calcular expiración
      const reservaToken = uuidv4();
      const expiraEn = new Date(now.getTime() + 10 * 60 * 1000); // NOW + 10 minutos

      // 4. Actualizar boleto
      boleto.estado = 'reservado';
      boleto.bloqueado_hasta = expiraEn;
      boleto.reserva_token = reservaToken;

      await queryRunner.manager.save(boleto);
      await queryRunner.commitTransaction();

      this.logger.log(`Boleto ${boletoId} reservado con token ${reservaToken}`);

      return {
        mensaje: 'Asiento bloqueado',
        reserva_token: reservaToken,
        expira_en: expiraEn.toISOString(),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Confirmar la compra de un boleto:
   * valida el token de reserva, sube la identificación a MinIO, y actualiza el estado.
   */
  async confirmar(
    confirmarDto: ConfirmarBoletoDto,
    file: Express.Multer.File,
    usuarioId: string,
  ) {
    // 1. Buscar boleto por reserva_token
    const boleto = await this.boletoRepository.findOne({
      where: { reserva_token: confirmarDto.token },
    });

    if (!boleto) {
      throw new BadRequestException(
        'Token de reserva inválido o no encontrado',
      );
    }

    // 2. Validar que la reserva no haya expirado
    const now = new Date();
    if (!boleto.bloqueado_hasta || new Date(boleto.bloqueado_hasta) < now) {
      throw new BadRequestException(
        'La reserva ha expirado. Por favor, reserve el asiento nuevamente.',
      );
    }

    // 3. Subir archivo a MinIO
    const identificacionUrl = await this.storageService.upload(
      file,
      'identificaciones',
    );

    // 4. Transacción: actualizar boleto + usuario
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar boleto: pagado, limpiar token, vincular usuario
      boleto.estado = 'pagado';
      boleto.reserva_token = null;
      boleto.usuario_id = usuarioId;
      await queryRunner.manager.save(boleto);

      // Actualizar usuario: guardar URL de identificación
      await queryRunner.manager.update(User, usuarioId, {
        identificacion_url: identificacionUrl,
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `Boleto ${boleto.id} confirmado por usuario ${usuarioId}`,
      );

      return {
        mensaje: 'Compra exitosa',
        boleto_id: boleto.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
