import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  searchEquipmentSchema,
  UserRole,
} from '@hiredesk/shared';
import { EquipmentService } from '../services/equipment.service';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';

const logger = createLogger('equipment-controller');

export class EquipmentController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = searchEquipmentSchema.parse(req.query);
      
      const result = await EquipmentService.findAll({
        ...params,
        isActive: req.user?.role === UserRole.ADMIN ? undefined : true,
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
} 