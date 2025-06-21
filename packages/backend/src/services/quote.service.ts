import { differenceInDays } from 'date-fns';
import { AppDataSource } from '../config/database';
import { Quote } from '../entities/Quote';
import { QuoteItem } from '../entities/QuoteItem';
import { QuoteService as QuoteServiceEntity } from '../entities/QuoteService';
import { Equipment } from '../entities/Equipment';
import { Service } from '../entities/Service';
import { RateCard } from '../entities/RateCard';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';
import { EquipmentService } from './equipment.service';
import {
  QuoteStatus,
  CreateQuoteInput,
  UpdateQuoteInput,
  QuoteCalculation,
  VAT_RATE,
  QUOTE_NUMBER_PREFIX,
  PaginatedResponse,
  PaginationParams,
} from '../types/local-shared';

const logger = createLogger('quote-service');

export class QuoteService {
  private static get quoteRepository() {
    if (!AppDataSource.isInitialized) {
      throw new ApiError(500, 'DATABASE_NOT_INITIALIZED', 'Database connection not initialized');
    }
    return AppDataSource.getRepository(Quote);
  }
  
  private static get quoteItemRepository() {
    if (!AppDataSource.isInitialized) {
      throw new ApiError(500, 'DATABASE_NOT_INITIALIZED', 'Database connection not initialized');
    }
    return AppDataSource.getRepository(QuoteItem);
  }
  
  private static get quoteServiceRepository() {
    if (!AppDataSource.isInitialized) {
      throw new ApiError(500, 'DATABASE_NOT_INITIALIZED', 'Database connection not initialized');
    }
    return AppDataSource.getRepository(QuoteServiceEntity);
  }
  
  private static get equipmentRepository() {
    if (!AppDataSource.isInitialized) {
      throw new ApiError(500, 'DATABASE_NOT_INITIALIZED', 'Database connection not initialized');
    }
    return AppDataSource.getRepository(Equipment);
  }
  
  private static get serviceRepository() {
    if (!AppDataSource.isInitialized) {
      throw new ApiError(500, 'DATABASE_NOT_INITIALIZED', 'Database connection not initialized');
    }
    return AppDataSource.getRepository(Service);
  }

  static async calculateQuote(input: CreateQuoteInput): Promise<QuoteCalculation> {
    const items = [];
    const services = [];
    let subtotal = 0;

    // Calculate equipment items
    for (const item of input.items) {
      const equipment = await this.equipmentRepository.findOne({
        where: { id: item.equipmentId, isActive: true },
      });

      if (!equipment) {
        throw new ApiError(400, 'EQUIPMENT_NOT_FOUND', `Equipment ${item.equipmentId} not found or inactive`);
      }

      // Calculate duration
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const duration = differenceInDays(endDate, startDate) + 1; // +1 because rental includes both start and end dates

      if (duration < 1) {
        throw new ApiError(400, 'INVALID_DATE_RANGE', 'End date must be after or equal to start date');
      }

      // Get applicable rate card
      const rateCard = await EquipmentService.getAvailableRateCard(equipment.id, duration);
      
      if (!rateCard) {
        throw new ApiError(400, 'RATE_NOT_FOUND', `No rate card found for ${equipment.name} for ${duration} days`);
      }

      const itemTotal = rateCard.dailyRate * duration;
      subtotal += itemTotal;

      items.push({
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        startDate,
        endDate,
        duration,
        dailyRate: rateCard.dailyRate,
        total: itemTotal,
      });
    }

    // Calculate services
    if (input.services) {
      for (const svc of input.services) {
        const service = await this.serviceRepository.findOne({
          where: { id: svc.serviceId, isActive: true },
        });

        if (!service) {
          throw new ApiError(400, 'SERVICE_NOT_FOUND', `Service ${svc.serviceId} not found or inactive`);
        }

        const serviceTotal = service.price * svc.quantity;
        subtotal += serviceTotal;

        services.push({
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          quantity: svc.quantity,
          total: serviceTotal,
        });
      }
    }

    // Calculate VAT and total
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;

    return {
      items,
      services,
      subtotal,
      vat,
      total,
    };
  }

  static async create(userId: string, input: CreateQuoteInput): Promise<Quote> {
    // Calculate quote
    const calculation = await this.calculateQuote(input);

    // Generate quote number
    const quoteNumber = await this.generateQuoteNumber();

    // Start transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create quote
      const quote = queryRunner.manager.create(Quote, {
        userId,
        quoteNumber,
        status: QuoteStatus.DRAFT,
        subtotal: calculation.subtotal,
        vat: calculation.vat,
        total: calculation.total,
        notes: input.notes,
      });
      await queryRunner.manager.save(quote);

      // Create quote items
      for (const item of calculation.items) {
        const quoteItem = queryRunner.manager.create(QuoteItem, {
          quoteId: quote.id,
          equipmentId: item.equipmentId,
          startDate: item.startDate,
          endDate: item.endDate,
          duration: item.duration,
          dailyRate: item.dailyRate,
          total: item.total,
        });
        await queryRunner.manager.save(quoteItem);
      }

      // Create quote services
      for (const service of calculation.services) {
        const quoteService = queryRunner.manager.create(QuoteServiceEntity, {
          quoteId: quote.id,
          serviceId: service.serviceId,
          price: service.price,
          quantity: service.quantity,
          total: service.total,
        });
        await queryRunner.manager.save(quoteService);
      }

      await queryRunner.commitTransaction();

      logger.info({ quoteId: quote.id, userId }, 'Quote created');

      // Return with relations
      return await this.findById(quote.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async update(id: string, userId: string, input: UpdateQuoteInput): Promise<Quote> {
    const quote = await this.findById(id);

    // Check ownership
    if (quote.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to update this quote');
    }

    // Check if quote can be updated
    if (quote.status !== QuoteStatus.DRAFT) {
      throw new ApiError(400, 'QUOTE_NOT_DRAFT', 'Only draft quotes can be updated');
    }

    // If items or services are being updated, recalculate
    if (input.items || input.services) {
      const calculateInput: CreateQuoteInput = {
        items: input.items || quote.items.map(item => ({
          equipmentId: item.equipmentId,
          startDate: item.startDate.toISOString().split('T')[0],
          endDate: item.endDate.toISOString().split('T')[0],
        })),
        services: input.services || quote.services.map(svc => ({
          serviceId: svc.serviceId,
          quantity: svc.quantity,
        })),
        notes: input.notes !== undefined ? input.notes : quote.notes,
      };

      // Delete existing items and services and create new ones
      await this.quoteItemRepository.delete({ quoteId: id });
      await this.quoteServiceRepository.delete({ quoteId: id });

      // Recalculate and update
      const calculation = await this.calculateQuote(calculateInput);

      quote.subtotal = calculation.subtotal;
      quote.vat = calculation.vat;
      quote.total = calculation.total;
      quote.notes = calculateInput.notes;

      await this.quoteRepository.save(quote);

      // Create new items
      for (const item of calculation.items) {
        const quoteItem = this.quoteItemRepository.create({
          quoteId: quote.id,
          equipmentId: item.equipmentId,
          startDate: item.startDate,
          endDate: item.endDate,
          duration: item.duration,
          dailyRate: item.dailyRate,
          total: item.total,
        });
        await this.quoteItemRepository.save(quoteItem);
      }

      // Create new services
      for (const service of calculation.services) {
        const quoteService = this.quoteServiceRepository.create({
          quoteId: quote.id,
          serviceId: service.serviceId,
          price: service.price,
          quantity: service.quantity,
          total: service.total,
        });
        await this.quoteServiceRepository.save(quoteService);
      }
    } else if (input.notes !== undefined) {
      // Just update notes
      quote.notes = input.notes;
      await this.quoteRepository.save(quote);
    }

    logger.info({ quoteId: id, userId }, 'Quote updated');

    return await this.findById(id);
  }

  static async submit(id: string, userId: string): Promise<Quote> {
    const quote = await this.findById(id);

    // Check ownership
    if (quote.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to submit this quote');
    }

    // Check if quote can be submitted
    if (quote.status !== QuoteStatus.DRAFT) {
      throw new ApiError(400, 'QUOTE_ALREADY_SUBMITTED', 'Quote has already been submitted');
    }

    // Update status
    quote.status = QuoteStatus.SUBMITTED;
    quote.submittedAt = new Date();
    await this.quoteRepository.save(quote);

    logger.info({ quoteId: id, userId }, 'Quote submitted');

    // TODO: Send email notification to hire desk

    return quote;
  }

  static async findById(id: string): Promise<Quote> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.equipment', 'services', 'services.service'],
    });

    if (!quote) {
      throw new ApiError(404, 'QUOTE_NOT_FOUND', 'Quote not found');
    }

    return quote;
  }

  static async findByUser(
    userId: string,
    params: PaginationParams & { status?: QuoteStatus }
  ): Promise<PaginatedResponse<Quote>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status } = params;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [data, total] = await this.quoteRepository.findAndCount({
      where,
      relations: ['items', 'services'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      },
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private static async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastQuote = await this.quoteRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    let sequence = 1;
    if (lastQuote && lastQuote.quoteNumber.includes(year.toString())) {
      const lastSequence = parseInt(lastQuote.quoteNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `${QUOTE_NUMBER_PREFIX}${year}-${sequence.toString().padStart(4, '0')}`;
  }
} 