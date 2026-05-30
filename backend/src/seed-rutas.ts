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

async function seedRutas() {
  await AppDataSource.initialize();
  console.log('✅ Conexión a base de datos establecida (Seed Rutas)');

  // Utilizamos el nombre de la tabla en lugar de importar la entidad 
  // para evitar problemas de dependencias circulares si las hay.
  const rutaRepo = AppDataSource.getRepository('rutas');

  const rutasSeed = [
    { origen: 'Oaxaca', destino: 'Puebla' },
    { origen: 'Chihuahua', destino: 'Nuevo León' },
    { origen: 'Baja California Norte', destino: 'Baja California Sur' },
    { origen: 'Chihuahua', destino: 'CDMX' },
  ];

  for (const r of rutasSeed) {
    const existing = await rutaRepo.findOne({ where: { origen: r.origen, destino: r.destino } });
    if (!existing) {
      await rutaRepo.save(r);
      console.log(`🛣️  Ruta creada: ${r.origen} - ${r.destino}`);
    } else {
      console.log(`⚠️  Ruta ya existe: ${r.origen} - ${r.destino}`);
    }
  }

  console.log(`🎉 Seed de rutas finalizado.`);
  await AppDataSource.destroy();
}

seedRutas().catch((err) => {
  console.error('❌ Error al crear rutas:', err);
  process.exit(1);
});
