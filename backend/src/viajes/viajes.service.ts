import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Viaje } from '@/viajes/entities/viaje.entity';
import { Boleto } from '@/viajes/entities/boleto.entity';
import { Ruta } from '@/rutas/entities/ruta.entity';
import { CreateViajeDto } from '@/viajes/dto/create-viaje.dto';
import { BuscarViajesQueryDto } from '@/viajes/dto/buscar-viajes-query.dto';
import { ViajeConDisponibilidadDto } from '@/viajes/dto/viaje-con-disponibilidad.dto';
import { ViajesDisponiblesQueryDto } from '@/viajes/dto/viajes-disponibles-query.dto';

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(Viaje)
    private readonly viajeRepository: Repository<Viaje>,
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Buscar viajes por origen, destino y fecha.
   * Retorna cada viaje con un campo calculado `asientos_disponibles`.
   */
  async buscar(
    query: BuscarViajesQueryDto,
  ): Promise<ViajeConDisponibilidadDto[]> {
    const { origen, destino, fecha } = query;

    const fechaInicio = `${fecha}T00:00:00`;
    const fechaFin = `${fecha}T23:59:59`;

    const viajes = await this.viajeRepository
      .createQueryBuilder('viaje')
      .innerJoinAndSelect('viaje.ruta', 'ruta')
      .leftJoinAndSelect('viaje.boletos', 'boleto')
      .where('ruta.origen = :origen', { origen })
      .andWhere('ruta.destino = :destino', { destino })
      .andWhere('viaje.fecha_hora_salida BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .orderBy('viaje.fecha_hora_salida', 'ASC')
      .getMany();

    const now = new Date();

    return viajes.map((viaje) => {
      const ocupados = viaje.boletos.filter(
        (b) =>
          b.estado === 'pagado' ||
          (b.estado === 'reservado' &&
            b.bloqueado_hasta &&
            new Date(b.bloqueado_hasta) > now),
      ).length;

      const totalBoletos = viaje.boletos.length;

      return {
        id: viaje.id,
        ruta: {
          id: viaje.ruta.id,
          origen: viaje.ruta.origen,
          destino: viaje.ruta.destino,
        },
        fecha_hora_salida: viaje.fecha_hora_salida,
        fecha_hora_llegada: viaje.fecha_hora_llegada,
        duracion: viaje.duracion,
        precio_boleto: viaje.precio_boleto,
        asientos_disponibles: totalBoletos - ocupados,
        total_asientos: totalBoletos,
      };
    });
  }

  /**
   * Obtener todos los boletos de un viaje aplicando Lazy Expiration:
   * si un boleto está `reservado` pero su `bloqueado_hasta` ya expiró,
   * se envía al frontend marcado como `disponible`.
   */
  async getBoletosByViajeId(viajeId: number): Promise<Boleto[]> {
    const viaje = await this.viajeRepository.findOne({
      where: { id: viajeId },
    });
    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${viajeId} no encontrado`);
    }

    const boletos = await this.boletoRepository.find({
      where: { viaje_id: viajeId },
      order: { numero_asiento: 'ASC' },
    });

    const now = new Date();

    return boletos.map((boleto) => {
      if (
        boleto.estado === 'reservado' &&
        boleto.bloqueado_hasta &&
        new Date(boleto.bloqueado_hasta) <= now
      ) {
        // Lazy Expiration: reserva expirada → presentar como disponible
        return {
          ...boleto,
          estado: 'disponible' as const,
          bloqueado_hasta: null,
          usuario_id: null,
        };
      }
      return boleto;
    });
  }

  async create(createViajeDto: CreateViajeDto): Promise<Viaje> {
    const { ruta_id, fecha_hora_inicio, duracion, precio_boleto, capacidad } = createViajeDto;

    // Verificar que la ruta exista
    const ruta = await this.rutaRepository.findOne({ where: { id: ruta_id } });
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${ruta_id} no encontrada`);
    }

    const fechaHoraSalida = new Date(fecha_hora_inicio);
    const fechaHoraLlegada = new Date(fechaHoraSalida.getTime() + duracion * 60 * 1000);
    const precio = precio_boleto ?? (duracion / 60) * 120;

    // Transacción: crear viaje + bulk insert de boletos
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Insertar el viaje
      const viaje = queryRunner.manager.create(Viaje, {
        ruta_id,
        fecha_hora_salida: fechaHoraSalida,
        fecha_hora_llegada: fechaHoraLlegada,
        duracion,
        precio_boleto: precio,
      });
      const savedViaje = await queryRunner.manager.save(viaje);

      // Bulk Insert de boletos
      const boletos: Partial<Boleto>[] = [];
      for (let i = 1; i <= capacidad; i++) {
        boletos.push({
          viaje_id: savedViaje.id,
          numero_asiento: i,
          estado: 'disponible',
          bloqueado_hasta: null,
          usuario_id: null,
          precio: precio,
        });
      }
      await queryRunner.manager.save(Boleto, boletos);

      await queryRunner.commitTransaction();

      // Retornar viaje con boletos cargados
      return this.viajeRepository.findOne({
        where: { id: savedViaje.id },
        relations: { ruta: true, boletos: true },
      }) as Promise<Viaje>;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtener todos los viajes futuros con su disponibilidad (opcionalmente filtrado por ruta_id)
   */
  async obtenerDisponibles(
    query: ViajesDisponiblesQueryDto,
  ): Promise<ViajeConDisponibilidadDto[]> {
    const { ruta_id } = query;
    const now = new Date();

    const queryBuilder = this.viajeRepository
      .createQueryBuilder('viaje')
      .innerJoinAndSelect('viaje.ruta', 'ruta')
      .leftJoinAndSelect('viaje.boletos', 'boleto')
      .where('viaje.fecha_hora_salida >= :now', { now });

    if (ruta_id) {
      queryBuilder.andWhere('viaje.ruta_id = :ruta_id', { ruta_id });
    }

    const viajes = await queryBuilder
      .orderBy('viaje.fecha_hora_salida', 'ASC')
      .getMany();

    return viajes.map((viaje) => {
      const ocupados = viaje.boletos.filter(
        (b) =>
          b.estado === 'pagado' ||
          (b.estado === 'reservado' &&
            b.bloqueado_hasta &&
            new Date(b.bloqueado_hasta) > now),
      ).length;

      const totalBoletos = viaje.boletos.length;

      return {
        id: viaje.id,
        ruta: {
          id: viaje.ruta.id,
          origen: viaje.ruta.origen,
          destino: viaje.ruta.destino,
        },
        fecha_hora_salida: viaje.fecha_hora_salida,
        fecha_hora_llegada: viaje.fecha_hora_llegada,
        duracion: viaje.duracion,
        precio_boleto: viaje.precio_boleto,
        asientos_disponibles: totalBoletos - ocupados,
        total_asientos: totalBoletos,
      };
    });
  }

  /**
   * Eliminar un viaje y sus boletos, pero solo si ningún boleto ha sido vendido (estado = 'pagado')
   */
  async delete(id: number): Promise<void> {
    const viaje = await this.viajeRepository.findOne({
      where: { id },
      relations: { boletos: true },
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }

    // Verificar si algún boleto ha sido vendido (pagado)
    const hasSoldBoletos = viaje.boletos.some((b) => b.estado === 'pagado');
    if (hasSoldBoletos) {
      throw new BadRequestException(
        'No se puede eliminar el viaje porque ya se ha vendido al menos un boleto.',
      );
    }

    // Transacción para eliminar el viaje y todos sus boletos
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Eliminar boletos asociados
      await queryRunner.manager.delete(Boleto, { viaje_id: id });
      // Eliminar el viaje
      await queryRunner.manager.delete(Viaje, { id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
