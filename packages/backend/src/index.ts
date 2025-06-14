import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createApp } from './app';
import { initializeDatabase } from './config/database';
import { createLogger } from './config/logger';

const logger = createLogger('server');
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Try to initialize database but don't fail if it's not available
    logger.info('Initializing database connection...');
    await initializeDatabase();
    
    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Log available endpoints
      logger.info('Available endpoints:');
      logger.info(`  GET  http://localhost:${PORT}/api/v1/health`);
      logger.info(`  POST http://localhost:${PORT}/api/v1/auth/register`);
      logger.info(`  POST http://localhost:${PORT}/api/v1/auth/login`);
      logger.info(`  GET  http://localhost:${PORT}/api/v1/equipment`);
      logger.info(`  GET  http://localhost:${PORT}/api/v1/quotes`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, closing server...');
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Handle unhandled errors
    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ reason, promise }, 'Unhandled Rejection');
    });

    process.on('uncaughtException', (error) => {
      logger.error({ error }, 'Uncaught Exception');
      process.exit(1);
    });

  } catch (error: any) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server
startServer(); 