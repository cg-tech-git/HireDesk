import { api, apiEndpoints } from '@/lib/api';
import { 
  Quote,
  QuoteWithItems,
  CreateQuoteRequest,
  ApiResponse,
  PaginatedResponse,
  QuoteItem,
  QuoteService as QuoteServiceType
} from '@hiredesk/shared';

// Frontend-specific types for display
export interface QuoteItemDisplay {
  id: string;
  quoteId: string;
  equipmentId: string;
  equipment: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
  startDate: Date;
  endDate: Date;
  duration: number;
  dailyRate: number;
  totalPrice: number;
}

export interface QuoteServiceDisplay {
  id: string;
  service: {
    id: string;
    name: string;
  };
  totalPrice: number;
}

export interface QuoteWithFullDetails extends Quote {
  vatRate: number;
  items: QuoteItemDisplay[];
  services?: QuoteServiceDisplay[];
}

export const quoteService = {
  async createQuote(data: CreateQuoteRequest): Promise<Quote> {
    try {
      const response = await api.post<ApiResponse<Quote>>(apiEndpoints.quotes.create, data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to create quote');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getMyQuotes(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<QuoteWithItems>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<QuoteWithItems>>>(
        apiEndpoints.quotes.myQuotes,
        { params }
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch quotes');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getQuoteById(id: string): Promise<QuoteWithFullDetails> {
    try {
      const response = await api.get<ApiResponse<QuoteWithFullDetails>>(
        apiEndpoints.quotes.get(id)
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch quote');
      }
      
      // Mock VAT rate if not provided
      return {
        ...response.data.data,
        vatRate: response.data.data.vatRate || 0.20,
      };
    } catch (error) {
      // Mock data for development
      if (process.env.NODE_ENV === 'development') {
        return mockQuoteDetail(id);
      }
      throw error;
    }
  },

  async submitQuote(id: string): Promise<Quote> {
    try {
      const response = await api.post<ApiResponse<Quote>>(
        apiEndpoints.quotes.submit(id)
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to submit quote');
      }
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

// Mock data for development
function mockQuoteDetail(id: string): QuoteWithFullDetails {
  return {
    id,
    userId: 'user-1',
    quoteNumber: 'HD-2024-0001',
    status: 'submitted' as any,
    subtotal: 1000,
    vat: 200,
    total: 1200,
    vatRate: 0.20,
    notes: 'Please deliver before 9 AM',
    createdAt: new Date(),
    updatedAt: new Date(),
    submittedAt: new Date(),
    items: [
      {
        id: 'item-1',
        quoteId: id,
        equipmentId: 'eq-1',
        equipment: {
          id: 'eq-1',
          name: 'Excavator CAT 320',
          category: {
            id: 'cat-1',
            name: 'Excavators',
          },
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 7,
        dailyRate: 150,
        totalPrice: 1050,
      },
    ],
    services: [
      {
        id: 'service-1',
        service: {
          id: 'svc-1',
          name: 'Delivery & Collection',
        },
        totalPrice: 100,
      },
    ],
  };
} 