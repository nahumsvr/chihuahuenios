import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Ruta } from '@/rutas/entities/ruta.entity';
import { Boleto } from '@/viajes/entities/boleto.entity';

@Entity('viajes')
export class Viaje {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ruta, (ruta) => ruta.viajes, { nullable: false })
  @JoinColumn({ name: 'ruta_id' })
  ruta: Ruta;

  @Column({ name: 'ruta_id' })
  ruta_id: number;

  @Column({ type: 'timestamptz' })
  fecha_hora_salida: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_hora_llegada: Date;

  @Column({ type: 'int', nullable: true })
  duracion: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_boleto: number;

  @OneToMany(() => Boleto, (boleto) => boleto.viaje)
  boletos: Boleto[];
}
