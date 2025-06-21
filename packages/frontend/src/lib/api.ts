import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// No auth interceptors needed in demo mode

export default api;

// Type-safe API endpoints
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  equipment: {
    list: '/equipment',
    get: (id: string) => `/equipment/${id}`,
    rateCards: (id: string) => `/equipment/${id}/rate-cards`,
  },
  categories: {
    list: '/categories',
    get: (id: string) => `/categories/${id}`,
  },
  quotes: {
    calculate: '/quotes/calculate',
    create: '/quotes',
    myQuotes: '/quotes/my-quotes',
    get: (id: string) => `/quotes/${id}`,
    update: (id: string) => `/quotes/${id}`,
    submit: (id: string) => `/quotes/${id}/submit`,
    download: (id: string) => `/quotes/${id}/download`,
  },
  services: {
    list: '/services',
    get: (id: string) => `/services/${id}`,
  },
} as const; 