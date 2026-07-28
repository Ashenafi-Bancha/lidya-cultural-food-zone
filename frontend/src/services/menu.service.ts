import { api } from '../lib/api';
import { ApiResponse, MenuItem, Category } from '../types/api';

export const menuService = {
  getItems: async () => {
    // Fetch a high limit so the public menu shows every item (the API paginates
    // at 20 by default).
    const response = await api.get<ApiResponse<MenuItem[]>>('/menus?limit=500');
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
