import { In, FindOptionsWhere, ILike, FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Equipment } from '../entities/Equipment';
import { Category } from '../entities/Category';
import { RateCard } from '../entities/RateCard';
import { AppDataSource } from '../config/database';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';
import {
  PaginatedResponse,
  PaginationParams,
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from '@hiredesk/shared';

const logger = createLogger('equipment-service');

export class EquipmentService {
  private static equipmentRepository = AppDataSource.getRepository(Equipment);
  private static categoryRepository = AppDataSource.getRepository(Category);
  private static rateCardRepository = AppDataSource.getRepository(RateCard);

  static async findAll(
    params: PaginationParams & { categoryId?: string; search?: string; isActive?: boolean }
  ): Promise<PaginatedResponse<Equipment>> {
    const { page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc', categoryId, search, isActive } = params;

    const where: FindOptionsWhere<Equipment> = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const queryOptions: FindManyOptions<Equipment> = {
      where,
      relations: ['category', 'rateCards'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      },
    };

    // Add search condition if provided
    if (search) {
      queryOptions.where = [
        { ...where, name: ILike(`%${search}%`) },
        { ...where, description: ILike(`%${search}%`) },
      ];
    }

    const [data, total] = await this.equipmentRepository.findAndCount(queryOptions);

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

  static async findById(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['category', 'rateCards'],
    });

    if (!equipment) {
      throw new ApiError(404, 'EQUIPMENT_NOT_FOUND', 'Equipment not found');
    }

    return equipment;
  }

  static async create(data: CreateEquipmentInput): Promise<Equipment> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(400, 'INVALID_CATEGORY', 'Category not found');
    }

    const equipment = this.equipmentRepository.create(data);
    await this.equipmentRepository.save(equipment);

    logger.info({ equipmentId: equipment.id }, 'Equipment created');

    return equipment;
  }

  static async update(id: string, data: UpdateEquipmentInput): Promise<Equipment> {
    const equipment = await this.findById(id);

    // If updating category, verify it exists
    if (data.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new ApiError(400, 'INVALID_CATEGORY', 'Category not found');
      }
    }

    Object.assign(equipment, data);
    await this.equipmentRepository.save(equipment);

    logger.info({ equipmentId: id }, 'Equipment updated');

    return equipment;
  }

  static async delete(id: string): Promise<void> {
    const equipment = await this.findById(id);

    // Soft delete by setting isActive to false
    equipment.isActive = false;
    await this.equipmentRepository.save(equipment);

    logger.info({ equipmentId: id }, 'Equipment deactivated');
  }

  static async getAvailableRateCard(equipmentId: string, duration: number): Promise<RateCard | null> {
    const rateCard = await this.rateCardRepository.findOne({
      where: {
        equipmentId,
        isActive: true,
        durationMin: LessThanOrEqual(duration),
        durationMax: MoreThanOrEqual(duration),
      },
      order: {
        dailyRate: 'ASC',
      },
    });

    return rateCard;
  }

  static async getRateCards(equipmentId: string): Promise<RateCard[]> {
    return await this.rateCardRepository.find({
      where: {
        equipmentId,
        isActive: true,
      },
      order: {
        durationMin: 'ASC',
      },
    });
  }
} 