import { api } from '../lib/api';
import { ApiResponse, Branch } from '../types/api';

export const branchService = {
  getBranches: async () => {
    const response = await api.get<ApiResponse<Branch[]>>('/branches');
    return response.data.data;
  },
  // Admin functions
  createBranch: async (data: Partial<Branch>) => {
    const response = await api.post<ApiResponse<Branch>>('/branches', data);
    return response.data.data;
  },
  updateBranch: async (id: string, data: Partial<Branch>) => {
    const response = await api.put<ApiResponse<Branch>>(`/branches/${id}`, data);
    return response.data.data;
  },
  deleteBranch: async (id: string) => {
    await api.delete(`/branches/${id}`);
  }
};
