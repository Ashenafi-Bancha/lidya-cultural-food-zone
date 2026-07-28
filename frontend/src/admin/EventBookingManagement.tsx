import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventBookingService } from '../services/eventBooking.service';
import { toast } from 'sonner';
import { Search, Filter, ChevronDown, CheckCircle2, XCircle, Clock, CalendarClock, Users, MapPin, MessageSquare } from 'lucide-react';

const SERVICE_LABELS: Record<string, string> = {
  WEDDING: 'Wedding',
  ENGAGEMENT: 'Engagement / Melse',
  HALL_RENTAL: 'Event Hall Rental',
  CATERING: 'Full-Service Catering',
  CORPORATE: 'Corporate Event',
  BIRTHDAY: 'Birthday / Milestone',
  VIP: 'VIP Experience',
  VVIP: 'VVIP Experience',
  OTHER: 'Other',
};

const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle2 },
  NO_SHOW: { bg: 'bg-gray-200', text: 'text-gray-600', icon: XCircle },
};

export function EventBookingManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-event-bookings'],
    queryFn: eventBookingService.getBookings,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => eventBookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-bookings'] });
      toast.success('Booking status updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b: any) => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-lidya-serif)' }}>Event Bookings</h1>
          <p className="text-gray-500 mt-1">Weddings, catering, hall rentals & VIP/VVIP experiences.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843]"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading bookings…</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b: any) => {
            const StatusIcon = statusConfig[b.status]?.icon || Clock;
            return (
              <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#c25e2a]/10 text-[#c25e2a] mb-1">
                      {SERVICE_LABELS[b.serviceType] || b.serviceType}
                    </span>
                    <h3 className="font-semibold text-gray-900 truncate">{b.customerName}</h3>
                    <p className="text-xs text-gray-500">{b.phone}{b.email ? ` • ${b.email}` : ''}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[b.status]?.bg} ${statusConfig[b.status]?.text}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {b.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5"><CalendarClock className="w-4 h-4 text-gray-400" />{b.eventDate}</span>
                  {b.guestCount ? <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" />{b.guestCount} guests</span> : null}
                  {b.branch?.name ? <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{b.branch.name}</span> : null}
                </div>

                {b.message ? (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 flex gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{b.message}</p>
                  </div>
                ) : null}

                {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <div className="flex gap-2 mt-4">
                    {b.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => statusMutation.mutate({ id: b.id, status: 'CONFIRMED' })}
                          disabled={statusMutation.isPending}
                          className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => statusMutation.mutate({ id: b.id, status: 'CANCELLED' })}
                          disabled={statusMutation.isPending}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: b.id, status: 'COMPLETED' })}
                        disabled={statusMutation.isPending}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">No event bookings found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'New booking requests will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
}
