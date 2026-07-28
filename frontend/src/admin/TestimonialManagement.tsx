import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '../services/testimonial.service';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Star, User as UserIcon } from 'lucide-react';

const EMPTY = {
  name: '', role: '', roleAm: '', quote: '', quoteAm: '', imageUrl: '', rating: 5, order: 0, isActive: true,
};

export function TestimonialManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: testimonialService.getAll,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => testimonialService.create(data),
    onSuccess: () => { invalidate(); toast.success('Testimonial added!'); resetForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add testimonial'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => testimonialService.update(id, data),
    onSuccess: () => { invalidate(); toast.success('Testimonial updated!'); resetForm(); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update testimonial'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.remove(id),
    onSuccess: () => { invalidate(); toast.success('Testimonial deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const resetForm = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      name: item.name || '',
      role: item.role || '',
      roleAm: item.roleAm || '',
      quote: item.quote || '',
      quoteAm: item.quoteAm || '',
      imageUrl: item.imageUrl || '',
      rating: item.rating ?? 5,
      order: item.order ?? 0,
      isActive: item.isActive ?? true,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, imageUrl: res.data.data.url }));
      toast.success('Photo uploaded!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, rating: Number(form.rating) || 5, order: Number(form.order) || 0 };
    if (editingId) updateMutation.mutate({ id: editingId, data });
    else createMutation.mutate(data);
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none';
  const labelCls = 'block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-lidya-serif)' }}>Testimonials</h1>
          <p className="text-gray-500 mt-1">Manage the "What Our Guests Say" section.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-5 py-2.5 bg-[#c25e2a] text-[#f5efe6] font-medium rounded-lg hover:bg-[#a54c20] transition-colors shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo */}
            <div className="md:col-span-2 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Guest" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Guest Photo (optional)</h4>
                <p className="text-xs text-gray-500 mb-3">A square photo works best. If none, initials are shown.</p>
                <div className="relative inline-block">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
                  <span className={`px-4 py-2 inline-flex rounded-md text-sm font-medium ${uploading ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-colors`}>
                    {uploading ? 'Uploading...' : 'Choose Photo'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Guest Name</label>
              <input className={inputCls} placeholder="e.g. Abebe Girma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Role / Title (English)</label>
              <input className={inputCls} placeholder="e.g. Food Writer, Addis Fortune" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Role / Title (Amharic)</label>
              <input dir="auto" className={inputCls} placeholder="ለምሳሌ፦ የምግብ ጸሐፊ" value={form.roleAm} onChange={e => setForm({ ...form, roleAm: e.target.value })} />
            </div>
            <div className="hidden md:block" />

            <div className="md:col-span-2">
              <label className={labelCls}>Quote (English)</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="What the guest said..." value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Quote (Amharic)</label>
              <textarea dir="auto" className={`${inputCls} resize-none`} rows={3} placeholder="እንግዳው ያሉት..." value={form.quoteAm} onChange={e => setForm({ ...form, quoteAm: e.target.value })} />
            </div>

            <div>
              <label className={labelCls}>Rating</label>
              <select className={inputCls} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" min={0} className={inputCls} placeholder="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="sr-only" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 select-none">Show on website</span>
              </label>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || uploading}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#c25e2a] text-white font-medium rounded-lg hover:bg-[#a54c20] transition-colors disabled:opacity-50 shadow-sm"
              >
                {editingId ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">Loading testimonials…</div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-5 ${item.isActive ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}>
              <div className="flex items-start gap-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#c25e2a] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {item.name.trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('')}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    {!item.isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">Hidden</span>}
                  </div>
                  {item.role && <p className="text-xs text-gray-500 truncate">{item.role}</p>}
                  <div className="flex items-center gap-0.5 mt-1 text-amber-500">
                    {Array.from({ length: Math.min(Math.max(item.rating || 5, 1), 5) }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic mt-3 leading-relaxed line-clamp-3">"{item.quote}"</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { if (confirm(`Delete testimonial from ${item.name}?`)) deleteMutation.mutate(item.id); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</p>
          <p className="text-sm text-gray-500">Click "+ Add Testimonial" to feature a guest.</p>
        </div>
      )}
    </div>
  );
}
