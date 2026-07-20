import { api } from '../lib/api';
import { ApiResponse, MenuItem, Category } from '../types/api';

export const menuService = {
  getItems: async () => {
    const response = await api.get<ApiResponse<MenuItem[]>>('/menus');
    return response.data.data;
  },
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },
  // Admin functions
  createItem: async (data: Partial<MenuItem>) => {
    const response = await api.post<ApiResponse<MenuItem>>('/menus', data);
    return response.data.data;
  },
  updateItem: async (id: string, data: Partial<MenuItem>) => {
    const response = await api.put<ApiResponse<MenuItem>>(`/menus/${id}`, data);
    return response.data.data;
  },
  deleteItem: async (id: string) => {
    await api.delete(`/menus/${id}`);
  }
};
