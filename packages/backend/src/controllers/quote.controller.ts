import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  createQuoteSchema,
  updateQuoteSchema,
  calculateQuoteSchema,
  quoteFilterSchema,
  UserRole,
  QuoteStatus,
} from '@hiredesk/shared';
import { QuoteService } from '../services/quote.service';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';

const logger = createLogger('quote-controller');

export class QuoteController {
  static async calculate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = calculateQuoteSchema.parse(req.body);
      const calculation = await QuoteService.calculateQuote(validatedData);

      res.json({
        success: true,
        data: calculation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createQuoteSchema.parse(req.body);
      const userId = req.user!.id;

      const quote = await QuoteService.create(userId, validatedData);

      logger.info({ quoteId: quote.id, userId }, 'Quote created');

      res.status(201).json({
        success: true,
        data: quote,
        message: 'Quote created successfully',
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
      const validatedData = updateQuoteSchema.parse(req.body);
      const userId = req.user!.id;

      const quote = await QuoteService.update(id, userId, validatedData);

      logger.info({ quoteId: id, userId }, 'Quote updated');

      res.json({
        success: true,
        data: quote,
        message: 'Quote updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid input', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const quote = await QuoteService.findById(id);

      // Check permissions
      if (req.user!.role === UserRole.CUSTOMER && quote.userId !== req.user!.id) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to view this quote');
      }

      res.json({
        success: true,
        data: quote,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = quoteFilterSchema.parse(req.query);
      const userId = req.user!.id;

      const result = await QuoteService.findByUser(userId, {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        status: params.status as QuoteStatus | undefined,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid query parameters', error.errors));
      } else {
        next(error);
      }
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const quote = await QuoteService.submit(id, userId);

      logger.info({ quoteId: id, userId }, 'Quote submitted');

      res.json({
        success: true,
        data: quote,
        message: 'Quote submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  static async getAllQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Only accessible by HIRE_DESK and ADMIN roles
      if (![UserRole.HIRE_DESK, UserRole.ADMIN].includes(req.user!.role)) {
        throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions');
      }

      const params = quoteFilterSchema.parse(req.query);
      
      // TODO: Implement service method to get all quotes with filters
      // const result = await QuoteService.findAll(params);

      res.json({
        success: true,
        message: 'Not implemented yet',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid query parameters', error.errors));
      } else {
        next(error);
      }
    }
  }
} 