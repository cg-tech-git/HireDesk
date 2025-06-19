import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerDetails, QuoteItem } from '@/types/quote';

export interface QuoteState {
  items: QuoteItem[];
  customerDetails: CustomerDetails | null;
  pendingItem: QuoteItem | null; // Stores item while waiting for customer details
}

const initialState: QuoteState = {
  items: [],
  customerDetails: null,
  pendingItem: null,
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<QuoteItem>) => {
      state.items.push(action.payload);
      state.pendingItem = null; // Clear pending item after adding
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.modelId !== action.payload);
    },
    updateItem: (state, action: PayloadAction<QuoteItem>) => {
      const index = state.items.findIndex(item => item.modelId === action.payload.modelId);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setCustomerDetails: (state, action: PayloadAction<CustomerDetails | null>) => {
      state.customerDetails = action.payload;
    },
    setPendingItem: (state, action: PayloadAction<QuoteItem>) => {
      state.pendingItem = action.payload;
    },
    clearPendingItem: (state) => {
      state.pendingItem = null;
    },
    clearQuote: (state) => {
      state.items = [];
      state.customerDetails = null;
      state.pendingItem = null;
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  updateItem, 
  setCustomerDetails, 
  setPendingItem, 
  clearPendingItem, 
  clearQuote 
} = quoteSlice.actions;

export default quoteSlice.reducer; 