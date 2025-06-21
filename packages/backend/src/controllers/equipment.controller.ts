import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  searchEquipmentSchema,
  UserRole,
} from '../types/local-shared';
import { EquipmentService } from '../services/equipment.service';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';

const logger = createLogger('equipment-controller');

// Mock equipment data for demo mode
const DEMO_EQUIPMENT = [
  {
    id: '1',
    name: 'Boom Lift JLG 1850SJ',
    description: 'Ultra boom with working height of 58.56m',
    category: { id: '1', name: 'Aerial Work Platforms' },
    manufacturer: 'JLG',
    model: '1850SJ',
    specifications: {
      workingHeight: '58.56m',
      platformCapacity: '450kg',
      horizontalOutreach: '24.38m'
    },
    dailyRate: 1200,
    weeklyRate: 5000,
    monthlyRate: 15000,
    isActive: true,
    images: ['/images/equipment/boom-lift.jpg'],
  },
  {
    id: '2',
    name: 'Scissor Lift Genie GS-4047',
    description: 'Electric scissor lift for indoor applications',
    category: { id: '1', name: 'Aerial Work Platforms' },
    manufacturer: 'Genie',
    model: 'GS-4047',
    specifications: {
      workingHeight: '13.7m',
      platformCapacity: '350kg',
      platformSize: '2.26m x 1.15m'
    },
    dailyRate: 400,
    weeklyRate: 1600,
    monthlyRate: 4800,
    isActive: true,
    images: ['/images/equipment/scissor-lift.jpg'],
  },
];

export class EquipmentController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (process.env.DEMO_MODE === 'true') {
        logger.info('Demo mode: Returning mock equipment data');
        res.json({
          success: true,
          data: DEMO_EQUIPMENT,
          pagination: {
            total: DEMO_EQUIPMENT.length,
            page: 1,
            pageSize: 10,
            totalPages: 1,
          },
        });
        return;
      }

      const params = searchEquipmentSchema.parse(req.query);
      
      const result = await EquipmentService.findAll({
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        categoryId: params.categoryId,
        search: params.query,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (process.env.DEMO_MODE === 'true') {
        const equipment = DEMO_EQUIPMENT.find(e => e.id === req.params.id);
        if (!equipment) {
          throw new ApiError(404, 'NOT_FOUND', 'Equipment not found');
        }
        res.json({
          success: true,
          data: equipment,
        });
        return;
      }

      const { id } = req.params;
      const equipment = await EquipmentService.findById(id);

      res.json({
        success: true,
        data: equipment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createEquipmentSchema.parse(req.body);
      const equipment = await EquipmentService.create(validatedData);

      logger.info({ equipmentId: equipment.id, userId: req.user?.id }, 'Equipment created');

      res.status(201).json({
        success: true,
        data: equipment,
        message: 'Equipment created successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateEquipmentSchema.parse(req.body);
      
      const equipment = await EquipmentService.update(id, validatedData);

      logger.info({ equipmentId: id, userId: req.user?.id }, 'Equipment updated');

      res.json({
        success: true,
        data: equipment,
        message: 'Equipment updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      await EquipmentService.delete(id);

      logger.info({ equipmentId: id, userId: req.user?.id }, 'Equipment deleted');

      res.json({
        success: true,
        message: 'Equipment deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRateCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const rateCards = await EquipmentService.getRateCards(id);
      
      res.json({
        success: true,
        data: rateCards,
      });
    } catch (error) {
      next(error);
    }
  }

  static async calculatePrice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { duration } = req.query;
      
      if (!duration || isNaN(Number(duration))) {
        throw new ApiError(400, 'INVALID_DURATION', 'Duration must be a valid number');
      }

      const durationDays = Number(duration);
      const rateCard = await EquipmentService.getAvailableRateCard(id, durationDays);

      if (!rateCard) {
        throw new ApiError(404, 'RATE_NOT_FOUND', `No rate card found for ${durationDays} days`);
      }

      res.json({
        success: true,
        data: {
          duration: durationDays,
          dailyRate: rateCard.dailyRate,
          totalPrice: rateCard.dailyRate * durationDays,
          rateCard: {
            id: rateCard.id,
            durationMin: rateCard.durationMin,
            durationMax: rateCard.durationMax,
            dailyRate: rateCard.dailyRate
          }
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async testDb(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { AppDataSource } = await import('../config/database');
      
      // First check if initialized
      const isInitialized = AppDataSource.isInitialized;
      
      if (!isInitialized) {
        res.json({
          success: false,
          message: 'Database not initialized',
          connectionInfo: {
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            isCloudSQL: process.env.DATABASE_HOST?.startsWith('/cloudsql/')
          }
        });
        return;
      }
      
      // Try a simple query
      const result = await AppDataSource.query('SELECT COUNT(*) as count FROM equipment');
      
      res.json({
        success: true,
        data: result,
        message: 'Database connection successful',
        connectionInfo: {
          host: process.env.DATABASE_HOST,
          database: process.env.DATABASE_NAME,
          user: process.env.DATABASE_USER,
          isCloudSQL: process.env.DATABASE_HOST?.startsWith('/cloudsql/')
        }
      });
    } catch (error: any) {
      logger.error('Database test failed:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
          errno: error.errno,
          syscall: error.syscall
        },
        connectionInfo: {
          host: process.env.DATABASE_HOST,
          database: process.env.DATABASE_NAME,
          user: process.env.DATABASE_USER,
          isCloudSQL: process.env.DATABASE_HOST?.startsWith('/cloudsql/')
        }
      });
    }
  }

  static async ping(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        message: 'Equipment controller is working',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
} 