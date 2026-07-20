import { api } from '../lib/api';
import { ApiResponse, ContactMessage } from '../types/api';

export const contactService = {
  sendMessage: async (data: Omit<ContactMessage, 'id' | 'status'>) => {
    const response = await api.post<ApiResponse<ContactMessage>>('/contact', data);
    return response.data.data;
  },
  // Admin functions
  getMessages: async () => {
    const response = await api.get<ApiResponse<ContactMessage[]>>('/contact');
    return response.data.data;
  },
  updateStatus: async (id: string, status: ContactMessage['status']) => {
    const response = await api.put<ApiResponse<ContactMessage>>(`/contact/${id}/status`, { status });
    return response.data.data;
  }
};
