import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { initializeFirebase } from './config/firebase';

// Import routes
import authRoutes from './routes/auth.routes';
import equipmentRoutes from './routes/equipment.routes';
import quoteRoutes from './routes/quotes.routes';
// import adminRoutes from './routes/admin.routes';

export function createApp(): Express {
  const app = express();

  // Trust proxy for Cloud Run
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', true);
  }

  // Initialize Firebase only if not in demo mode
  if (!process.env.DEMO_MODE) {
    try {
      initializeFirebase();
    } catch (error) {
      logger.warn('Firebase initialization failed, running in demo mode');
    }
  } else {
    logger.info('Running in demo mode - Firebase initialization skipped');
  }

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'https://hiredesk-frontend-544256061771.us-central1.run.app',
      'http://localhost:3001' // For local development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Skip IP check for Cloud Run
    skip: (req) => process.env.NODE_ENV === 'production',
  });
  app.use('/api/', limiter);

  // Request logging
  app.use(pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/health',
    },
  }));

  // Body parsing middleware
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Database debug endpoint (remove in production)
  app.get('/api/v1/debug/database', async (req, res) => {
    const { AppDataSource } = await import('./config/database');
    const options = AppDataSource.options as any; // Type assertion for debugging
    res.json({
      isInitialized: AppDataSource.isInitialized,
      options: {
        type: options.type,
        database: options.database,
        host: options.host,
        port: options.port,
        username: options.username,
        // Don't expose password
        entities: options.entities?.length || 0,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_USER: process.env.DATABASE_USER,
        isCloudSQL: process.env.DATABASE_HOST?.startsWith('/cloudsql/'),
      }
    });
  });

  // Test direct database connection endpoint
  app.get('/api/v1/debug/test-connection', async (req, res) => {
    const { testDirectConnection } = await import('./config/database');
    const result = await testDirectConnection();
    res.json(result);
  });

  // API version
  app.get('/api/v1', (req, res) => {
    res.json({
      version: '1.0.0',
      endpoints: {
        auth: '/api/v1/auth',
        equipment: '/api/v1/equipment',
        quotes: '/api/v1/quotes',
        services: '/api/v1/services',
        admin: '/api/v1/admin',
      },
    });
  });

  // Mount routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/equipment', equipmentRoutes);
  app.use('/api/v1/quotes', quoteRoutes);
  // app.use('/api/v1/admin', adminRoutes);
  
  // Also mount routes without /v1 for backward compatibility
  app.use('/api/auth', authRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/quotes', quoteRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
} 