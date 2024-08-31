import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development' });

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: false,
  extra: {
    timezone: 'America/Buenos_Aires', // Establecer la zona horaria aquí
  },
  // ssl: {
  //   rejectUnauthorized: false, // Importante para Render, que utiliza certificados SSL autofirmados.
  // },
  // dropSchema: true,
  //logging: true,
  migrationsRun: true,
  logging: ['error'],
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
};

const connectionSource = new DataSource(config as DataSourceOptions);

connectionSource
  .initialize()
  .then(() => {
    console.log('DataSource has been initialized!');
  })
  .catch((err) => {
    console.error('Error during DataSource initialization:', err);
  });

export default registerAs('typeorm', () => config);
export { connectionSource };
