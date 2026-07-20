import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../services/menu.service';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Pencil, Trash2, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';

export function MenuManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', tag: '', categoryId: '', isAvailable: true, imageUrl: ''
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: menuService.getItems,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: menuService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => menuService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item created!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => menuService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item updated!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete item'),
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', tag: '', categoryId: '', isAvailable: true, imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      tag: item.tag || '',
      categoryId: item.categoryId || '',
      isAvailable: item.isAvailable ?? true,
      imageUrl: item.imageUrl || '',
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
    const data = { ...form };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Menu Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, and organize your dishes.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-5 py-2.5 bg-[#c25e2a] text-[#f5efe6] font-medium rounded-lg hover:bg-[#a54c20] transition-colors shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Upload Area */}
            <div className="md:col-span-2 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Menu Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Item Image</h4>
                <p className="text-xs text-gray-500 mb-3">Upload a high-quality photo of this dish.</p>
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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Item Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. Doro Wat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Price</label>
              <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. 350 ETB" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">Select Category...</option>
                {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Tag (Optional)</label>
              <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. Signature, Fasting, New" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none resize-none" rows={3} placeholder="A short description of the dish..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="sr-only" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900 transition-colors">Currently Available</span>
              </label>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || uploading}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#c25e2a] text-white font-medium rounded-lg hover:bg-[#a54c20] transition-colors disabled:opacity-50 shadow-sm"
              >
                {editingId ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider w-16">Image</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Price</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                       <svg className="animate-spin h-5 w-5 mr-3 text-[#c25e2a]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                       Loading menu...
                    </div>
                  </td>
                </tr>
              ) : items && items.length > 0 ? (
                items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.tag && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c25e2a]/10 text-[#c25e2a] mt-1">{item.tag}</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {item.category?.name || '—'}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">
                      {item.price}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => { if (confirm(`Are you sure you want to delete ${item.name}?`)) deleteMutation.mutate(item.id); }} 
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <p className="text-gray-500 font-medium">No menu items found.</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add New Item" to create one.</p>
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
