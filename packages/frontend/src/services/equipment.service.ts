import { api, apiEndpoints } from '@/lib/api';
import { 
  Equipment, 
  Category, 
  RateCard,
  PaginatedResponse,
  ApiResponse 
} from '@hiredesk/shared';

export const equipmentService = {
  async getEquipment(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Equipment>> {
    const response = await api.get<ApiResponse<Equipment[]>>(apiEndpoints.equipment.list, { params });
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch equipment');
    }
    
    return response.data as any; // Type assertion needed due to pagination being at root level
  },

  async getEquipmentById(id: string): Promise<Equipment> {
    const response = await api.get<ApiResponse<Equipment>>(apiEndpoints.equipment.get(id));
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch equipment');
    }
    
    return response.data.data;
  },

  async getRateCards(equipmentId: string): Promise<RateCard[]> {
    const response = await api.get<ApiResponse<RateCard[]>>(
      apiEndpoints.equipment.rateCards(equipmentId)
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch rate cards');
    }
    
    return response.data.data;
  },
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(apiEndpoints.categories.list);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch categories');
    }
    
    return response.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(apiEndpoints.categories.get(id));
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Failed to fetch category');
    }
    
    return response.data.data;
  },
}; 