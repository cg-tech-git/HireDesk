import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// No auth interceptors needed in demo mode

export default api;

// Type-safe API endpoints
export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    me: '/api/v1/auth/me',
  },
  equipment: {
    list: '/api/v1/equipment',
    get: (id: string) => `/api/v1/equipment/${id}`,
    rateCards: (id: string) => `/api/v1/equipment/${id}/rate-cards`,
  },
  categories: {
    list: '/api/v1/categories',
    get: (id: string) => `/api/v1/categories/${id}`,
  },
  quotes: {
    calculate: '/api/v1/quotes/calculate',
    create: '/api/v1/quotes',
    myQuotes: '/api/v1/quotes/my-quotes',
    get: (id: string) => `/api/v1/quotes/${id}`,
    update: (id: string) => `/api/v1/quotes/${id}`,
    submit: (id: string) => `/api/v1/quotes/${id}/submit`,
    download: (id: string) => `/api/v1/quotes/${id}/download`,
  },
  services: {
    list: '/api/v1/services',
    get: (id: string) => `/api/v1/services/${id}`,
  },
} as const; 