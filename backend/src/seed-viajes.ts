import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgrespassword',
  database: process.env.DB_DATABASE || 'chihuahuenos_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seedViajes() {
  await AppDataSource.initialize();
  console.log('✅ Conexión a base de datos establecida (Seed Viajes)');

  const rutaRepo = AppDataSource.getRepository('rutas');
  const viajeRepo = AppDataSource.getRepository('viajes');

  const rutas = await rutaRepo.find();

  if (rutas.length === 0) {
    console.log('⚠️  No hay rutas para asignar viajes. Ejecuta seed-rutas primero.');
    await AppDataSource.destroy();
    return;
  }

  // Generar viajes para el día de mañana con base en la fecha en la que se corre el seed
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);

  for (const ruta of rutas) {
    // Viaje 1 (Mañana a las 08:00 AM local)
    const fechaSalida1 = new Date(manana);
    fechaSalida1.setHours(8, 0, 0, 0);

    // Viaje 2 (Mañana a las 16:00 PM local)
    const fechaSalida2 = new Date(manana);
    fechaSalida2.setHours(16, 0, 0, 0);

    const viajesSeed = [
      {
        ruta_id: ruta.id,
        fecha_hora_salida: fechaSalida1,
        // Llegada aproximada 6 horas después
        fecha_hora_llegada: new Date(fechaSalida1.getTime() + 6 * 60 * 60 * 1000), 
        duracion: 360, // 360 minutos = 6 horas
        precio_boleto: 850.50, // Precio base de ejemplo
      },
      {
        ruta_id: ruta.id,
        fecha_hora_salida: fechaSalida2,
        fecha_hora_llegada: new Date(fechaSalida2.getTime() + 6 * 60 * 60 * 1000), 
        duracion: 360,
        precio_boleto: 950.00, // Precio diferente en la tarde
      }
    ];

    for (const v of viajesSeed) {
      // Evitar duplicados revisando ruta y la misma hora exacta
      const existing = await viajeRepo.findOne({ 
        where: { 
          ruta_id: v.ruta_id, 
          fecha_hora_salida: v.fecha_hora_salida 
        } 
      });

      if (!existing) {
        await viajeRepo.save(v);
        console.log(`🚌 Viaje creado: Ruta ${ruta.id} (${ruta.origen} - ${ruta.destino}) salida: ${v.fecha_hora_salida.toISOString()}`);
      } else {
        console.log(`⚠️  Viaje ya existe para la ruta ${ruta.id} con salida: ${v.fecha_hora_salida.toISOString()}`);
      }
    }
  }

  console.log(`🎉 Seed de viajes finalizado.`);
  await AppDataSource.destroy();
}

seedViajes().catch((err) => {
  console.error('❌ Error al crear viajes:', err);
  process.exit(1);
});
