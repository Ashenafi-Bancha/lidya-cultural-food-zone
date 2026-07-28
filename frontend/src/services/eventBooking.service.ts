import { api } from '../lib/api';
import { ApiResponse, EventBooking } from '../types/api';

export const eventBookingService = {
  create: async (data: Partial<EventBooking>) => {
    const response = await api.post<ApiResponse<EventBooking>>('/event-bookings', data);
    return response.data.data;
  },
  getBookings: async () => {
    const response = await api.get<ApiResponse<EventBooking[]>>('/event-bookings?limit=100');
    return response.data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put<ApiResponse<EventBooking>>(`/event-bookings/${id}/status`, { status });
    return response.data.data;
  },
};
