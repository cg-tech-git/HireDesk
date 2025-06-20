import api, { apiEndpoints } from '@/lib/api';
import { 
  Equipment, 
  EquipmentWithRelations,
  Category, 
  RateCard,
  PaginatedResponse,
  ApiResponse 
} from '@hiredesk/shared';
import { mockEquipment, mockCategories, mockRateCards } from '@/lib/mockData';

// Flag to enable demo mode
const DEMO_MODE = false;

export const equipmentService = {
  async getEquipment(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<EquipmentWithRelations>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<EquipmentWithRelations>>>(apiEndpoints.equipment.list, { params });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch equipment');
      }
      
      return response.data.data;
    } catch (error) {
      if (DEMO_MODE) {
        // Use mock data in demo mode
        let filteredEquipment = [...mockEquipment];
        
        // Apply category filter
        if (params?.categoryId) {
          filteredEquipment = filteredEquipment.filter(e => e.categoryId === params.categoryId);
        }
        
        // Apply search filter
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredEquipment = filteredEquipment.filter(e => 
            e.name.toLowerCase().includes(searchLower) ||
            e.description.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply pagination
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const start = (page - 1) * limit;
        const paginatedData = filteredEquipment.slice(start, start + limit);
        
        // Add category data to mock equipment
        const dataWithCategory = paginatedData.map(equipment => ({
          ...equipment,
          category: mockCategories.find(c => c.id === equipment.categoryId)
        }));
        
        return {
          data: dataWithCategory as EquipmentWithRelations[],
          pagination: {
            page,
            limit,
            total: filteredEquipment.length,
            totalPages: Math.ceil(filteredEquipment.length / limit),
          },
        };
      }
      throw error;
    }
  },

  async getEquipmentById(id: string): Promise<EquipmentWithRelations> {
    try {
      const response = await api.get<ApiResponse<EquipmentWithRelations>>(apiEndpoints.equipment.get(id));
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch equipment');
      }
      
      return response.data.data;
    } catch (error) {
      if (DEMO_MODE) {
        const equipment = mockEquipment.find(e => e.id === id);
        if (equipment) {
          return {
            ...equipment,
            category: mockCategories.find(c => c.id === equipment.categoryId),
            rateCards: mockRateCards.get(equipment.id) || []
          };
        }
        throw new Error('Equipment not found');
      }
      throw error;
    }
  },

  async getRateCards(equipmentId: string): Promise<RateCard[]> {
    try {
      const response = await api.get<ApiResponse<RateCard[]>>(
        apiEndpoints.equipment.rateCards(equipmentId)
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch rate cards');
      }
      
      return response.data.data;
    } catch (error) {
      if (DEMO_MODE) {
        return mockRateCards.get(equipmentId) || [];
      }
      throw error;
    }
  },
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<Category[]>>(apiEndpoints.categories.list);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch categories');
      }
      
      return response.data.data;
    } catch (error) {
      if (DEMO_MODE) {
        return mockCategories;
      }
      throw error;
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(apiEndpoints.categories.get(id));
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch category');
      }
      
      return response.data.data;
    } catch (error) {
      if (DEMO_MODE) {
        const category = mockCategories.find(c => c.id === id);
        if (category) {
          return category;
        }
        throw new Error('Category not found');
      }
      throw error;
    }
  },
}; 