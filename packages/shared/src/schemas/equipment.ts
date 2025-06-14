import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createEquipmentSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(2, 'Equipment name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specifications: z.record(z.union([z.string(), z.number()])),
  images: z.array(z.string().url('Invalid image URL')),
  isActive: z.boolean().default(true),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

const rateCardBaseSchema = z.object({
  equipmentId: z.string(),
  durationMin: z.number().int().positive('Minimum duration must be positive'),
  durationMax: z.number().int().positive('Maximum duration must be positive'),
  dailyRate: z.number().positive('Daily rate must be positive'),
  isActive: z.boolean().default(true),
});

export const createRateCardSchema = rateCardBaseSchema.refine((data: any) => data.durationMax >= data.durationMin, {
  message: 'Maximum duration must be greater than or equal to minimum duration',
  path: ['durationMax'],
});

export const updateRateCardSchema = rateCardBaseSchema.partial();

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['delivery', 'cleaning', 'insurance', 'operator', 'other']),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const searchEquipmentSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
export type CreateRateCardInput = z.infer<typeof createRateCardSchema>;
export type UpdateRateCardInput = z.infer<typeof updateRateCardSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type SearchEquipmentInput = z.infer<typeof searchEquipmentSchema>; 