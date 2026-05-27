import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Viaje } from '@/viajes/entities/viaje.entity';
import { User } from '@/users/entities/user.entity';

@Entity('boletos')
export class Boleto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Viaje, (viaje) => viaje.boletos, { nullable: false })
  @JoinColumn({ name: 'viaje_id' })
  viaje: Viaje;

  @Column({ name: 'viaje_id' })
  viaje_id: number;

  @Column()
  numero_asiento: number;

  @Column({
    type: 'enum',
    enum: ['disponible', 'reservado', 'pagado'],
    default: 'disponible',
  })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio: number;

  @Column({ type: 'timestamptz', nullable: true })
  bloqueado_hasta: Date | null;

  @Column({ type: 'uuid', nullable: true, unique: true })
  reserva_token: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User | null;

  @Column({ name: 'usuario_id', nullable: true })
  usuario_id: string | null;
}
