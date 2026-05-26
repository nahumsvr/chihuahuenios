import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ruta } from '@/rutas/entities/ruta.entity';
import { CreateRutaDto } from '@/rutas/dto/create-ruta.dto';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
  ) {}

  async findAll(): Promise<Ruta[]> {
    return this.rutaRepository.find({
      select: { id: true, origen: true, destino: true },
      order: { origen: 'ASC', destino: 'ASC' },
    });
  }

  async create(createRutaDto: CreateRutaDto): Promise<Ruta> {
    const ruta = this.rutaRepository.create(createRutaDto);
    return this.rutaRepository.save(ruta);
  }
}
