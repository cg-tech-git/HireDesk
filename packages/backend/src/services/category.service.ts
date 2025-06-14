import { IsNull, FindOptionsWhere, TreeRepository } from 'typeorm';
import { Category } from '../entities/Category';
import { AppDataSource } from '../config/database';
import { ApiError } from '../middleware/error-handler';
import { createLogger } from '../config/logger';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@hiredesk/shared';

const logger = createLogger('category-service');

export class CategoryService {
  private static categoryRepository = AppDataSource.getRepository(Category);
  private static treeRepository = AppDataSource.getTreeRepository(Category);

  static async findAll(includeInactive = false): Promise<Category[]> {
    const where: FindOptionsWhere<Category> = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }

    return await this.categoryRepository.find({
      where,
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  static async findRootCategories(includeInactive = false): Promise<Category[]> {
    const where: FindOptionsWhere<Category> = {
      parentId: IsNull(),
    };
    
    if (!includeInactive) {
      where.isActive = true;
    }

    return await this.categoryRepository.find({
      where,
      relations: ['children'],
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  static async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'equipment'],
    });

    if (!category) {
      throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    }

    return category;
  }

  static async findWithChildren(id: string): Promise<Category> {
    const category = await this.findById(id);
    
    // Load full tree of descendants
    const descendants = await this.treeRepository.findDescendantsTree(category);
    
    return descendants;
  }

  static async create(data: CreateCategoryInput): Promise<Category> {
    // If parent is specified, verify it exists
    if (data.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new ApiError(400, 'INVALID_PARENT', 'Parent category not found');
      }
    }

    const category = this.categoryRepository.create(data);
    await this.categoryRepository.save(category);

    logger.info({ categoryId: category.id }, 'Category created');

    return category;
  }

  static async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const category = await this.findById(id);

    // If updating parent, verify it exists and prevent circular references
    if (data.parentId !== undefined) {
      if (data.parentId === id) {
        throw new ApiError(400, 'INVALID_PARENT', 'Category cannot be its own parent');
      }

      if (data.parentId) {
        const parent = await this.categoryRepository.findOne({
          where: { id: data.parentId },
        });

        if (!parent) {
          throw new ApiError(400, 'INVALID_PARENT', 'Parent category not found');
        }

        // Check if the new parent is a descendant of this category
        const descendants = await this.treeRepository.findDescendants(category);
        if (descendants.some(d => d.id === data.parentId)) {
          throw new ApiError(400, 'CIRCULAR_REFERENCE', 'Cannot set a descendant as parent');
        }
      }
    }

    Object.assign(category, data);
    await this.categoryRepository.save(category);

    logger.info({ categoryId: id }, 'Category updated');

    return category;
  }

  static async delete(id: string): Promise<void> {
    const category = await this.findById(id);

    // Check if category has active equipment
    if (category.equipment && category.equipment.some(e => e.isActive)) {
      throw new ApiError(400, 'CATEGORY_HAS_EQUIPMENT', 'Cannot delete category with active equipment');
    }

    // Soft delete by setting isActive to false
    category.isActive = false;
    await this.categoryRepository.save(category);

    // Also deactivate all child categories
    const descendants = await this.treeRepository.findDescendants(category);
    for (const descendant of descendants) {
      if (descendant.id !== id) {
        descendant.isActive = false;
        await this.categoryRepository.save(descendant);
      }
    }

    logger.info({ categoryId: id }, 'Category and descendants deactivated');
  }

  static async getCategoryPath(id: string): Promise<Category[]> {
    const category = await this.findById(id);
    const ancestors = await this.treeRepository.findAncestors(category);
    
    // Return in order from root to current category
    return ancestors.reverse();
  }

  static async reorderCategories(
    categoryOrders: Array<{ id: string; displayOrder: number }>
  ): Promise<void> {
    for (const { id, displayOrder } of categoryOrders) {
      await this.categoryRepository.update(id, { displayOrder });
    }

    logger.info('Categories reordered');
  }
} 