import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createLogger } from './logger';
import { User } from '../entities/User';
import { UserProfile } from '../entities/UserProfile';
import { Category } from '../entities/Category';
import { Equipment } from '../entities/Equipment';
import { RateCard } from '../entities/RateCard';
import { Service } from '../entities/Service';
import { Quote } from '../entities/Quote';
import { QuoteItem } from '../entities/QuoteItem';
import { QuoteService } from '../entities/QuoteService';

// Load environment variables from env.local only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), 'env.local') });
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger('database');

// Check if we're using a Unix socket (Cloud SQL)
const isCloudSQL = process.env.DATABASE_HOST?.startsWith('/cloudsql/');

// Log all database environment variables (without password)
logger.info('Database configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_SSL: process.env.DATABASE_SSL,
  CLOUD_SQL_IP: process.env.CLOUD_SQL_IP,
  isCloudSQL,
  isProduction
});

// Build database connection options
const connectionOptions: any = {
  type: 'postgres',
  database: process.env.DATABASE_NAME || 'hiredesk_dev',
  username: process.env.DATABASE_USER || 'hiredesk_user',
  password: process.env.DATABASE_PASSWORD || 'hiredesk_pass',
  synchronize: false, // Never use true in production
  logging: true, // Enable logging to see what's happening
  entities: [
    User,
    UserProfile,
    Category,
    Equipment,
    RateCard,
    Service,
    Quote,
    QuoteItem,
    QuoteService
  ],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
  // Add connection timeout
  connectTimeoutMS: 30000,
  // Add extra options for better error handling
  extra: {
    max: 10, // connection pool size
    connectionTimeoutMillis: 30000,
    query_timeout: 30000,
    statement_timeout: 30000,
    idle_in_transaction_session_timeout: 30000
  }
};

// Configure connection based on environment
if (isProduction && isCloudSQL) {
  // For Cloud SQL Unix socket connection in Cloud Run
  // Try a different approach - use the socket path in host
  connectionOptions.host = process.env.DATABASE_HOST;
  // TypeORM with pg needs specific configuration for Unix sockets
  connectionOptions.extra = {
    ...connectionOptions.extra,
    host: process.env.DATABASE_HOST
  };
  logger.info(`Connecting to Cloud SQL via Unix socket: ${process.env.DATABASE_HOST}`);
} else if (isProduction && process.env.CLOUD_SQL_IP) {
  // For production in Cloud Run, use public IP
  connectionOptions.host = process.env.CLOUD_SQL_IP;
  connectionOptions.port = 5432;
  connectionOptions.ssl = false; // Cloud SQL doesn't require SSL for connections from Cloud Run
  logger.info(`Connecting to Cloud SQL via public IP: ${process.env.CLOUD_SQL_IP}:5432`);
} else {
  // For regular connections, use host and port
  connectionOptions.host = process.env.DATABASE_HOST || 'localhost';
  connectionOptions.port = parseInt(process.env.DATABASE_PORT || '5432', 10);
  
  // Add SSL for non-local connections
  if (process.env.DATABASE_SSL === 'true') {
    connectionOptions.ssl = {
      rejectUnauthorized: false
    };
  }
  logger.info(`Connecting to PostgreSQL at ${connectionOptions.host}:${connectionOptions.port}`);
}

export const dataSourceOptions: DataSourceOptions = connectionOptions;

export const AppDataSource = new DataSource(dataSourceOptions);

// Connection helper with better error handling
export async function initializeDatabase(retries = 3, delay = 5000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      logger.info(`Connection attempt ${i + 1} with options:`, {
        host: connectionOptions.host,
        port: connectionOptions.port,
        database: connectionOptions.database,
        username: connectionOptions.username,
        ssl: connectionOptions.ssl ? 'enabled' : 'disabled',
        type: connectionOptions.type,
        entities: connectionOptions.entities?.length,
        isCloudSQL: isCloudSQL,
        extraHost: connectionOptions.extra?.host
      });
      
      await AppDataSource.initialize();
      logger.info('Database connection established');
      
      // Test the connection
      const result = await AppDataSource.query('SELECT NOW()');
      logger.info('Database connection test successful:', result[0]);
      
      // Test if tables exist
      const tablesResult = await AppDataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      logger.info('Database tables:', tablesResult.map((t: any) => t.table_name));
      
      return;
    } catch (error: any) {
      logger.error(`Database connection attempt ${i + 1} failed:`, {
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname,
        detail: error.detail,
        hint: error.hint,
        position: error.position,
        internalPosition: error.internalPosition,
        internalQuery: error.internalQuery,
        where: error.where,
        schema: error.schema,
        table: error.table,
        column: error.column,
        dataType: error.dataType,
        constraint: error.constraint,
        file: error.file,
        line: error.line,
        routine: error.routine,
        stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
      });
      
      if (i === retries - 1) {
        throw new Error(`Database connection failed after all retries: ${error.message}`);
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

// Test database connection directly with pg client
export async function testDirectConnection(): Promise<any> {
  const { Client } = require('pg');
  
  const connectionConfig: any = {
    database: process.env.DATABASE_NAME || 'hiredesk_dev',
    user: process.env.DATABASE_USER || 'hiredesk_user',
    password: process.env.DATABASE_PASSWORD || 'hiredesk_pass',
  };

  // For Cloud SQL Unix socket
  if (process.env.DATABASE_HOST?.startsWith('/cloudsql/')) {
    connectionConfig.host = process.env.DATABASE_HOST;
  } else {
    connectionConfig.host = process.env.DATABASE_HOST || 'localhost';
    connectionConfig.port = parseInt(process.env.DATABASE_PORT || '5432', 10);
  }

  const client = new Client(connectionConfig);
  
  try {
    logger.info('Testing direct PostgreSQL connection with config:', {
      ...connectionConfig,
      password: '***' // Don't log password
    });
    
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();
    
    return {
      success: true,
      result: result.rows[0],
      config: {
        host: connectionConfig.host,
        port: connectionConfig.port,
        database: connectionConfig.database,
        user: connectionConfig.user
      }
    };
  } catch (error: any) {
    logger.error('Direct PostgreSQL connection failed:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
    
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      },
      config: {
        host: connectionConfig.host,
        port: connectionConfig.port,
        database: connectionConfig.database,
        user: connectionConfig.user
      }
    };
  }
}