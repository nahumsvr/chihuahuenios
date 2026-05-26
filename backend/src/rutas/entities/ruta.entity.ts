import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Viaje } from '@/viajes/entities/viaje.entity';

@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @OneToMany(() => Viaje, (viaje) => viaje.ruta)
  viajes: Viaje[];
}
