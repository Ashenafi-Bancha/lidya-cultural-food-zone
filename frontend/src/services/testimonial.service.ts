import { api } from '../lib/api';
import { ApiResponse, Testimonial } from '../types/api';

export const testimonialService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Testimonial[]>>('/testimonials');
    return response.data.data;
  },
  create: async (data: Partial<Testimonial>) => {
    const response = await api.post<ApiResponse<Testimonial>>('/testimonials', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<Testimonial>) => {
    const response = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, data);
    return response.data.data;
  },
  remove: async (id: string) => {
    await api.delete(`/testimonials/${id}`);
  },
};
