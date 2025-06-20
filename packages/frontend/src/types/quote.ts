export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectRef: string;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface QuoteItem {
  modelId: string; // Changed from number to string to support UUIDs
  modelName: string;
  manufacturer: string;
  category: string;
  quantity: number;
  dates: DateRange[];
} 