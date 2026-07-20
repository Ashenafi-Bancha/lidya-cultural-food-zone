import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservation.service';
import { toast } from 'sonner';
import { Search, Filter, MessageSquare, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function ReservationManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: reservationService.getReservations,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      reservationService.updateStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      toast.success('Reservation status updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    return reservations.filter((r: any) => {
      const matchesSearch = 
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
    CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle2 },
    NO_SHOW: { bg: 'bg-gray-200', text: 'text-gray-600', icon: XCircle },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Reservations</h1>
          <p className="text-gray-500 mt-1">Manage all table bookings and customer requests.</p>
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-center">Party</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                       <svg className="animate-spin h-5 w-5 mr-3 text-[#d4a843]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                       Loading reservations...
                    </div>
                  </td>
                </tr>
              ) : filteredReservations.length > 0 ? (
                filteredReservations.map((r: any) => {
                  const hasSpecialRequest = r.specialRequest && r.specialRequest.trim().length > 0;
                  const StatusIcon = statusConfig[r.status]?.icon || Clock;
                  
                  return (
                    <React.Fragment key={r.id}>
                      <tr className={`hover:bg-gray-50 transition-colors ${expandedId === r.id ? 'bg-gray-50' : ''}`}>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{r.customerName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.phone}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-gray-900">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.time} • {r.branch?.name || 'All Branches'}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                            {r.partySize}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[r.status]?.bg} ${statusConfig[r.status]?.text}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {r.status}
                          </span>
                          {hasSpecialRequest && (
                            <button 
                              onClick={() => toggleExpand(r.id)}
                              className="ml-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                            >
                              <MessageSquare className="w-3.5 h-3.5 mr-1" />
                              Note {expandedId === r.id ? '▲' : '▼'}
                            </button>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {r.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => statusMutation.mutate({ id: r.id, status: 'CONFIRMED' })}
                                  disabled={statusMutation.isPending}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => statusMutation.mutate({ id: r.id, status: 'CANCELLED' })}
                                  disabled={statusMutation.isPending}
                                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {r.status === 'CONFIRMED' && (
                              <button
                                onClick={() => statusMutation.mutate({ id: r.id, status: 'COMPLETED' })}
                                disabled={statusMutation.isPending}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row for Special Requests */}
                      {expandedId === r.id && hasSpecialRequest && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-gray-200">
                            <div className="bg-amber-50/50 p-4 mx-4 mb-4 rounded-lg border border-amber-100 flex gap-3 text-sm">
                              <MessageSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-900 block mb-1">Special Request / Note:</strong>
                                <p className="text-amber-800/80 leading-relaxed">{r.specialRequest}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">No reservations found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Try adjusting your filters or search term.' 
                        : 'There are no reservations in the system yet.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
