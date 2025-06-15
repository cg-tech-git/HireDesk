import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';
import toast from 'react-hot-toast';

// Extend the request config to include our custom _retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          if (auth) {
            const user = auth.currentUser;
            if (user) {
              const token = await user.getIdToken();
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        
        // Retry with new token if 401
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && auth) {
          originalRequest._retry = true;
          
          try {
            const user = auth.currentUser;
            if (user) {
              const token = await user.getIdToken(true); // Force refresh
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client.request(originalRequest);
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
          }
        }

        // Show error message
        const errorData = error.response?.data as any;
        const message = errorData?.error?.message || errorData?.message || 'An error occurred';
        
        if (error.response?.status !== 401) {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  get get() {
    return this.client.get.bind(this.client);
  }

  get post() {
    return this.client.post.bind(this.client);
  }

  get put() {
    return this.client.put.bind(this.client);
  }

  get patch() {
    return this.client.patch.bind(this.client);
  }

  get delete() {
    return this.client.delete.bind(this.client);
  }
}

export const api = new ApiClient();

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