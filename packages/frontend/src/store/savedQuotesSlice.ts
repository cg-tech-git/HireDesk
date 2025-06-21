import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
  rate?: number;
  period?: string;
  amount?: number;
}

interface QuoteItem {
  modelId: string; // Changed from number to string to support UUIDs
  modelName: string;
  manufacturer: string;
  category: string;
  quantity: number;
  dates: DateRange[];
}

export interface SavedQuote {
  id: string;
  quoteNumber: string;
  projectRef?: string;
  createdAt: string;
  items: QuoteItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  totals: {
    subtotal: number;
    vat: number;
    total: number;
  };
  status: 'draft' | 'sent' | 'viewed';
}

export interface SavedQuotesState {
  quotes: SavedQuote[];
}

const getInitialQuotes = (): SavedQuote[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const saved = localStorage.getItem('savedQuotes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: SavedQuotesState = {
  quotes: getInitialQuotes(),
};

export const savedQuotesSlice = createSlice({
  name: 'savedQuotes',
  initialState,
  reducers: {
    saveQuote: (state, action: PayloadAction<SavedQuote>) => {
      state.quotes.unshift(action.payload); // Add to beginning for most recent first
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('savedQuotes', JSON.stringify(state.quotes));
        } catch (e) {
          console.error('Failed to save quotes to localStorage:', e);
        }
      }
    },
    deleteQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(quote => quote.id !== action.payload);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('savedQuotes', JSON.stringify(state.quotes));
        } catch (e) {
          console.error('Failed to save quotes to localStorage:', e);
        }
      }
    },
    updateQuoteStatus: (state, action: PayloadAction<{ id: string; status: SavedQuote['status'] }>) => {
      const quote = state.quotes.find(q => q.id === action.payload.id);
      if (quote) {
        quote.status = action.payload.status;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('savedQuotes', JSON.stringify(state.quotes));
          } catch (e) {
            console.error('Failed to save quotes to localStorage:', e);
          }
        }
      }
    },
  },
});

export const { saveQuote, deleteQuote, updateQuoteStatus } = savedQuotesSlice.actions;
export default savedQuotesSlice.reducer; 