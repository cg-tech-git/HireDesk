import { Equipment, Service } from './equipment';

export enum QuoteStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface Quote {
  id: string;
  userId: string;
  quoteNumber: string; // e.g., HD-1024
  status: QuoteStatus;
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  equipmentId: string;
  equipment?: Equipment; // populated on fetch
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  dailyRate: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteService {
  id: string;
  quoteId: string;
  serviceId: string;
  service?: Service; // populated on fetch
  price: number;
  quantity: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[];
  services: QuoteService[];
}

export interface CreateQuoteRequest {
  items: Array<{
    equipmentId: string;
    startDate: string;
    endDate: string;
  }>;
  services: Array<{
    serviceId: string;
    quantity: number;
  }>;
  notes?: string;
}

export interface QuoteCalculation {
  items: Array<{
    equipmentId: string;
    equipmentName: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    dailyRate: number;
    total: number;
  }>;
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
} 