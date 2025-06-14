import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createLogger } from './logger';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const logger = createLogger('database');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'hiredesk_user',
  password: process.env.DATABASE_PASSWORD || 'hiredesk_pass',
  database: process.env.DATABASE_NAME || 'hiredesk_dev',
  synchronize: false, // Never use true in production
  logging: isDevelopment,
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);

// Connection helper
export async function initializeDatabase(retries = 3, delay = 5000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      logger.info('Database connection established');
      return;
    } catch (error) {
      logger.error(`Database connection attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        logger.error('Database connection failed after all retries. Running in demo mode without database.');
        // Instead of throwing, we'll continue running without database
        return;
      }
      
      logger.info(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function closeDatabase(): Promise<void> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }
} 