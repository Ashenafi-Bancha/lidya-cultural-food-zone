import { api } from '../lib/api';
import { ApiResponse, User } from '../types/api';

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    return response.data.data;
  },
  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return response.data.data;
  },
};
