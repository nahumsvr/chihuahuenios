import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Boleto, (boleto) => boleto.viaje)
  boletos: Boleto[];
}
