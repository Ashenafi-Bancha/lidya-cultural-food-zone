import { api } from '../lib/api';
import { ApiResponse, Reservation } from '../types/api';

export const reservationService = {
  // Public function
  createReservation: async (data: Omit<Reservation, 'id' | 'status'>) => {
    const response = await api.post<ApiResponse<Reservation>>('/reservations', data);
    return response.data.data;
  },
  // Admin functions
  getReservations: async () => {
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations');
    return response.data.data;
  },
  updateStatus: async (id: string, status: Reservation['status']) => {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
    return response.data.data;
  }
};
