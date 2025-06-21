// Temporary local types to replace shared package for alpha deployment

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  OPERATOR = 'operator',
  HIRE_DESK = 'hire_desk'
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum ServiceType {
  DELIVERY = 'delivery',
  CLEANING = 'cleaning',
  INSURANCE = 'insurance',
  OPERATOR = 'operator',
  OTHER = 'other'
}

// Constants
export const VAT_RATE = 0.20; // 20% VAT
export const QUOTE_NUMBER_PREFIX = 'HD-';

// Schema types (simplified for alpha)
export interface LoginSchema {
  email: string;
  password: string;
}

export interface RegisterSchema {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
}

// Basic validation functions
export const loginSchema = {
  parse: (data: any): LoginSchema => ({
    email: data.email,
    password: data.password
  })
};

export const registerSchema = {
  parse: (data: any): RegisterSchema => ({
    email: data.email,
    password: data.password,
    name: data.name,
    company: data.company,
    phone: data.phone
  })
};

// Equipment schemas (simplified)
export const createEquipmentSchema = {
  parse: (data: any): CreateEquipmentInput => data
};

export const updateEquipmentSchema = {
  parse: (data: any): UpdateEquipmentInput => data
};

export const searchEquipmentSchema = {
  parse: (data: any): SearchEquipmentInput => ({
    query: data.query,
    categoryId: data.categoryId,
    page: Number(data.page) || 1,
    limit: Number(data.limit) || 20,
    sortBy: data.sortBy,
    sortOrder: data.sortOrder
  })
};

// Quote schemas (simplified)
export const createQuoteSchema = {
  parse: (data: any): CreateQuoteInput => data
};

export const updateQuoteSchema = {
  parse: (data: any): UpdateQuoteInput => data
};

export const calculateQuoteSchema = {
  parse: (data: any): CreateQuoteInput => data
};

export const quoteFilterSchema = {
  parse: (data: any): QuoteFilterInput => ({
    status: data.status,
    userId: data.userId,
    startDate: data.startDate,
    endDate: data.endDate,
    page: Number(data.page) || 1,
    limit: Number(data.limit) || 20,
    sortBy: data.sortBy,
    sortOrder: data.sortOrder
  })
};

// Other types needed
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export interface SearchEquipmentInput {
  query?: string;
  categoryId?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEquipmentInput {
  categoryId: string;
  name: string;
  description: string;
  specifications: Record<string, string | number>;
  images: string[];
  isActive?: boolean;
}

export interface UpdateEquipmentInput extends Partial<CreateEquipmentInput> {}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface CreateQuoteInput {
  items: Array<{
    equipmentId: string;
    startDate: string;
    endDate: string;
  }>;
  services: Array<{
    serviceId: string;
    quantity: number;
  }>;
  notes?: string;
}

export interface UpdateQuoteInput extends Partial<CreateQuoteInput> {}

export interface QuoteCalculation {
  items: Array<{
    equipmentId: string;
    equipmentName: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    dailyRate: number;
    total: number;
  }>;
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
}

export interface QuoteFilterInput {
  status?: QuoteStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 