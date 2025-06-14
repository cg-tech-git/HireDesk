export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Equipment {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  specifications: Record<string, string | number>;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RateCard {
  id: string;
  equipmentId: string;
  durationMin: number; // minimum days
  durationMax: number; // maximum days
  dailyRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ServiceType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceType {
  DELIVERY = 'delivery',
  CLEANING = 'cleaning',
  INSURANCE = 'insurance',
  OPERATOR = 'operator',
  OTHER = 'other',
} 