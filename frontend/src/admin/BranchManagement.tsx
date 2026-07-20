import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService } from '../services/branch.service';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

export function BranchManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', label: '', address: '', phone: '', email: '', workingHours: '', note: '', capacity: '50',
  });

  const { data: branches, isLoading } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: branchService.getBranches,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => branchService.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create branch'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => branchService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated!');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update branch'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => branchService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete branch'),
  });

  const resetForm = () => {
    setForm({ name: '', label: '', address: '', phone: '', email: '', workingHours: '', note: '', capacity: '50' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (branch: any) => {
    setForm({
      name: branch.name,
      label: branch.label || '',
      address: branch.address,
      phone: branch.phone,
      email: branch.email || '',
      workingHours: branch.workingHours || '',
      note: branch.note || '',
      capacity: String(branch.capacity ?? 50),
    });
    setEditingId(branch.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, capacity: parseInt(form.capacity, 10) || 50 };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-lidya-serif)" }}>Branch Management</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2 bg-[#c25e2a] text-[#f5efe6] rounded hover:bg-[#a54c20] transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Branch'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-[#2a1a0e]/10 p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Branch Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Label (e.g., Flagship)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Full Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Working Hours" value={form.workingHours} onChange={e => setForm({ ...form, workingHours: e.target.value })} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Capacity" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
          <textarea className="border rounded px-3 py-2 text-sm md:col-span-2 resize-none" rows={2} placeholder="Note / Description" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2 bg-[#c25e2a] text-white rounded text-sm hover:bg-[#a54c20] transition-colors disabled:opacity-50"
            >
              {editingId ? 'Update Branch' : 'Create Branch'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-gray-400 col-span-2">Loading branches…</p>
        ) : branches && branches.length > 0 ? (
          branches.map((branch: any) => (
            <div key={branch.id} className="bg-white rounded-lg shadow-sm border border-[#2a1a0e]/10 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs text-[#c25e2a] font-medium uppercase tracking-wider">{branch.label}</span>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-lidya-serif)" }}>{branch.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(branch)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button 
                    onClick={() => { if (confirm('Delete this branch?')) deleteMutation.mutate(branch.id); }} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{branch.address}</p>
              <p className="text-sm text-gray-500 mb-1">{branch.phone}</p>
              <p className="text-sm text-gray-400">{branch.workingHours}</p>
              {branch.note && <p className="text-sm text-gray-400 italic mt-2">{branch.note}</p>}
              <p className="text-xs text-gray-300 mt-2">Capacity: {branch.capacity}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-2">No branches found. Click "Add Branch" to create one.</p>
        )}
      </div>
    </div>
  );
}
