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

  // Initialize Firebase
  initializeFirebase();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
} 