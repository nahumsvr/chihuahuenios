/**
 * Seed: Crear primer administrador del sistema
 *
 * Uso:
 *   npx ts-node -r tsconfig-paths/register src/seed-admin.ts
 *
 * Variables de entorno requeridas (o valores por defecto del .env):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

async function seedAdmin() {
  await AppDataSource.initialize();
  console.log('✅ Conexión a base de datos establecida');

  const email = process.env.ADMIN_EMAIL || 'admin@chihuahuenos.com';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const nombre = process.env.ADMIN_NOMBRE || 'Administrador';

  const userRepo = AppDataSource.getRepository('usuarios');

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    console.log(`⚠️  Ya existe un usuario con el email: ${email}`);
    await AppDataSource.destroy();
    return;
  }

  const salt = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(password, salt);

  await userRepo.save({
    nombre,
    email,
    password_hash,
    rol: 'admin',
  });

  console.log(`🎉 Admin creado exitosamente:`);
  console.log(`   Email: ${email}`);
  console.log(`   Contraseña: ${password}`);
  console.log(`   ⚠️  Cambia la contraseña en producción!`);

  await AppDataSource.destroy();
}

seedAdmin().catch((err) => {
  console.error('❌ Error al crear admin:', err);
  process.exit(1);
});
