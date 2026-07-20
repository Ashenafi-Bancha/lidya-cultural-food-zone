import { api } from '../lib/api';
import { ApiResponse, GalleryItem } from '../types/api';

export const galleryService = {
  getItems: async () => {
    const response = await api.get<ApiResponse<GalleryItem[]>>('/gallery');
    return response.data.data;
  },
  // Admin functions
  createItem: async (data: Partial<GalleryItem>) => {
    const response = await api.post<ApiResponse<GalleryItem>>('/gallery', data);
    return response.data.data;
  },
  updateItem: async (id: string, data: Partial<GalleryItem>) => {
    const response = await api.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, data);
    return response.data.data;
  },
  deleteItem: async (id: string) => {
    await api.delete(`/gallery/${id}`);
  }
};
