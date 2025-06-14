export const APP_NAME = 'HireDesk';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  EQUIPMENT: {
    LIST: '/equipment',
    DETAILS: '/equipment/:id',
    SEARCH: '/equipment/search',
    CATEGORIES: '/equipment/categories',
  },
  QUOTES: {
    LIST: '/quotes',
    CREATE: '/quotes',
    DETAILS: '/quotes/:id',
    CALCULATE: '/quotes/calculate',
    SUBMIT: '/quotes/:id/submit',
    DOWNLOAD: '/quotes/:id/download',
  },
  SERVICES: {
    LIST: '/services',
    DETAILS: '/services/:id',
  },
  ADMIN: {
    RATE_CARDS: '/admin/rate-cards',
    TEMPLATES: '/admin/templates',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
} as const;

export const VAT_RATE = 0.20; // 20% VAT

export const QUOTE_NUMBER_PREFIX = 'HD-';

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
} as const;

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENTS: ['application/pdf'],
} as const;

export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  
  // Business Logic
  EQUIPMENT_NOT_AVAILABLE: 'EQUIPMENT_NOT_AVAILABLE',
  QUOTE_ALREADY_SUBMITTED: 'QUOTE_ALREADY_SUBMITTED',
  RATE_NOT_FOUND: 'RATE_NOT_FOUND',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const; 