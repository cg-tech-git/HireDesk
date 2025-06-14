import { z } from 'zod';

export const quoteItemSchema = z.object({
  equipmentId: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
}).refine((data: any) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export const quoteServiceSchema = z.object({
  serviceId: z.string(),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const createQuoteSchema = z.object({
  items: z.array(quoteItemSchema).min(1, 'At least one equipment item is required'),
  services: z.array(quoteServiceSchema).optional().default([]),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const calculateQuoteSchema = createQuoteSchema;

export const updateQuoteSchema = z.object({
  items: z.array(quoteItemSchema).min(1, 'At least one equipment item is required').optional(),
  services: z.array(quoteServiceSchema).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const submitQuoteSchema = z.object({
  quoteId: z.string(),
});

export const reviewQuoteSchema = z.object({
  status: z.enum(['confirmed', 'rejected']),
  reviewNotes: z.string().optional(),
});

export const quoteFilterSchema = z.object({
  status: z.enum(['draft', 'submitted', 'in_review', 'confirmed', 'rejected', 'cancelled']).optional(),
  userId: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
export type QuoteServiceInput = z.infer<typeof quoteServiceSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type CalculateQuoteInput = z.infer<typeof calculateQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>;
export type ReviewQuoteInput = z.infer<typeof reviewQuoteSchema>;
export type QuoteFilterInput = z.infer<typeof quoteFilterSchema>; 