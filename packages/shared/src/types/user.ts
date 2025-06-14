export enum UserRole {
  CUSTOMER = 'customer',
  HIRE_DESK = 'hire_desk',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  company?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface AuthToken {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
} 