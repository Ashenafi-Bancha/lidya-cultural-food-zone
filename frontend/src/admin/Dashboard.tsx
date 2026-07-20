import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../services/reservation.service';
import { menuService } from '../services/menu.service';
import { contactService } from '../services/contact.service';
import { CalendarClock, CalendarCheck, Utensils, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export function Dashboard() {
  const { data: reservations, isLoading: isReservationsLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: reservationService.getReservations,
  });

  const { data: menuItems } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: menuService.getItems,
  });

  const { data: messages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: contactService.getMessages,
  });

  // Derived Metrics
  const pendingCount = reservations?.filter((r: any) => r.status === 'PENDING').length ?? 0;
  const confirmedCount = reservations?.filter((r: any) => r.status === 'CONFIRMED').length ?? 0;
  const menuCount = menuItems?.length ?? 0;
  const unreadCount = messages?.filter((m: any) => m.status === 'UNREAD').length ?? 0;

  // Chart Data Generation
  const chartData = useMemo(() => {
    if (!reservations) return [];
    
    // Group by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayRes = reservations.filter((r: any) => r.date === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        Reservations: dayRes.length,
        Guests: dayRes.reduce((sum: number, r: any) => sum + (r.partySize || 0), 0)
      };
    });
  }, [reservations]);

  const statusData = useMemo(() => {
    return [
      { name: 'Pending', value: pendingCount, color: '#f59e0b' },
      { name: 'Confirmed', value: confirmedCount, color: '#10b981' },
      { name: 'Completed', value: reservations?.filter((r: any) => r.status === 'COMPLETED').length ?? 0, color: '#3b82f6' },
      { name: 'Cancelled', value: reservations?.filter((r: any) => r.status === 'CANCELLED' || r.status === 'NO_SHOW').length ?? 0, color: '#ef4444' },
    ];
  }, [reservations, pendingCount, confirmedCount]);

  const stats = [
    { label: 'Pending Approvals', value: pendingCount, icon: CalendarClock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    { label: 'Confirmed (Upcoming)', value: confirmedCount, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    { label: 'Active Menu Items', value: menuCount, icon: Utensils, color: 'text-[#c25e2a]', bg: 'bg-[#c25e2a]/10', border: 'border-[#c25e2a]/20' },
    { label: 'Unread Inquiries', value: unreadCount, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
  ];

  // Action Items: Pending reservations (newest first)
  const pendingReservations = reservations?.filter((r: any) => r.status === 'PENDING').slice(0, 5) ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here's what's happening at Lidya Cultural Food Zone today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <Clock className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.bg.replace('bg-', 'bg-').replace('/10', '')} transition-all duration-300 group-hover:w-full group-hover:opacity-5`}></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} ${stat.border} border`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 relative z-10" style={{ fontFamily: "var(--font-lidya-sans)" }}>{stat.label}</h3>
              <div className="flex items-end gap-2 relative z-10">
                <p className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</p>
                {stat.label.includes('Pending') && stat.value > 0 && (
                  <span className="flex items-center text-xs font-medium text-amber-600 mb-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> Action needed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Reservation Activity (Last 7 Days)</h2>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            {isReservationsLoading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Loading chart data...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c25e2a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c25e2a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="Reservations" stroke="#c25e2a" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" activeDot={{ r: 6, strokeWidth: 0, fill: '#c25e2a' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No activity in the last 7 days.</div>
            )}
          </div>
        </div>

        {/* Action Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Pending Approvals</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{pendingCount} New</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {pendingReservations.length > 0 ? (
              <ul className="space-y-4">
                {pendingReservations.map((r: any) => (
                  <li key={r.id} className="p-4 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="font-semibold text-gray-900">{r.customerName}</strong>
                      <span className="text-xs font-medium text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> {r.partySize} guests
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <CalendarClock className="w-3.5 h-3.5 text-amber-600" /> 
                      <span className="font-medium text-amber-700">{new Date(r.date).toLocaleDateString()} at {r.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-60">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                  <CalendarCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-gray-500 text-sm font-medium">You're all caught up!</p>
                <p className="text-gray-400 text-xs mt-1">No pending reservations require your attention.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Secondary Row: Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-lidya-serif)" }}>Reservation Status</h2>
          <div className="h-[220px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} width={80} />
                 <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                   {statusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
