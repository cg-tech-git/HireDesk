import { configureStore } from '@reduxjs/toolkit';
import quoteReducer from './quoteSlice';
import savedQuotesReducer from './savedQuotesSlice';

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
    savedQuotes: savedQuotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 