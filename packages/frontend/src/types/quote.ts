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
  modelId: number;
  modelName: string;
  manufacturer: string;
  category: string;
  quantity: number;
  dates: DateRange[];
} 