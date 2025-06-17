import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface QuoteItem {
  modelId: number;
  modelName: string;
  manufacturer: string;
  category: string;
  quantity: number;
  dates: DateRange[];
}

interface QuoteState {
  items: QuoteItem[];
}

const initialState: QuoteState = {
  items: [],
};

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<QuoteItem>) => {
      state.items.push(action.payload);
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
    clearQuote: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateItem, clearQuote } = quoteSlice.actions;
export default quoteSlice.reducer; 