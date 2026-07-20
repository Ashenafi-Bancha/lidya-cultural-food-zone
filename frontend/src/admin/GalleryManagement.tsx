import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../services/gallery.service';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

export function GalleryManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', span: 'col-span-1 row-span-1', alt: '',
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: galleryService.getItems,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => galleryService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item added!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add gallery item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => galleryService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item updated!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const resetForm = () => {
    setForm({ title: '', description: '', imageUrl: '', span: 'col-span-1 row-span-1', alt: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      span: item.span || 'col-span-1 row-span-1',
      alt: item.alt || '',
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
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, imageUrl: res.data.data.url }));
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error('Please upload an image first');
      return;
    }
    const data = { ...form };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const spanOptions = [
    { value: 'col-span-1 row-span-1', label: '1×1 (Standard)' },
    { value: 'col-span-2 row-span-1', label: '2×1 (Wide)' },
    { value: 'col-span-1 row-span-2', label: '1×2 (Tall)' },
    { value: 'col-span-2 row-span-2', label: '2×2 (Featured)' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Media & Gallery</h1>
          <p className="text-gray-500 mt-1">Upload and manage photos for the public gallery.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-5 py-2.5 bg-[#c25e2a] text-[#f5efe6] font-medium rounded-lg hover:bg-[#a54c20] transition-colors shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add Image'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-48 h-32 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Gallery Image</h4>
              <p className="text-xs text-gray-500 mb-3">Upload a high-quality photo. Landscape images work best.</p>
              <div className="relative inline-block">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={uploading} 
                />
                <span className={`px-4 py-2 inline-flex rounded-md text-sm font-medium ${uploading ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-colors`}>
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
            <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. Traditional Coffee Ceremony" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Alt Text (For SEO/Accessibility)</label>
            <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. Woman pouring coffee" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Grid Span (Size)</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" value={form.span} onChange={e => setForm({ ...form, span: e.target.value })}>
              {spanOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Description (Optional)</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none resize-none" rows={2} placeholder="A short description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || uploading}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#c25e2a] text-white font-medium rounded-lg hover:bg-[#a54c20] transition-colors disabled:opacity-50 shadow-sm"
            >
              {editingId ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-[#c25e2a]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative aspect-square w-full bg-gray-100">
                <img
                  src={item.imageUrl || item.thumbUrl}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.title || 'Untitled Image'}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.description || 'No description'}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium tracking-wide mb-3">
                    {spanOptions.find(opt => opt.value === item.span)?.label || '1×1'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => { if (confirm('Are you sure you want to delete this image?')) deleteMutation.mutate(item.id); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">No gallery items yet</p>
          <p className="text-sm text-gray-500">Click "+ Add Image" to upload your first photo.</p>
        </div>
      )}
    </div>
  );
}
