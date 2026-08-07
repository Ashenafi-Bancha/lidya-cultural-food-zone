import React, { useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../services/menu.service';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Pencil, Trash2, Image as ImageIcon, CheckCircle2, XCircle, Search, ChevronDown } from 'lucide-react';
import { useConfirm, scrollToForm } from './ui';

export function MenuManagement() {
  const queryClient = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', description: '', descriptionAm: '', price: '', tag: '', categoryId: '', isAvailable: true, imageUrl: ''
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
      toast.success('Menu item created');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create item'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => menuService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Changes saved');
      resetForm();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Item removed from the menu');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete item'),
  });

  const resetForm = () => {
    setForm({ name: '', nameAm: '', description: '', descriptionAm: '', price: '', tag: '', categoryId: '', isAvailable: true, imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      name: item.name,
      nameAm: item.nameAm || '',
      description: item.description || '',
      descriptionAm: item.descriptionAm || '',
      price: item.price,
      tag: item.tag || '',
      categoryId: item.categoryId || '',
      isAvailable: item.isAvailable ?? true,
      imageUrl: item.imageUrl || '',
    });
    setEditingId(item.id);
    setShowForm(true);
    // The form renders above the list; without this the click appears to do
    // nothing when the admin is scrolled down in a long menu.
    scrollToForm(formRef);
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
      toast.success('Image uploaded — remember to save the item');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const norm = (s: string) => (s || '').trim().toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
      return;
    }
    // Duplicate guard: the same dish (by English or Amharic name) must not be
    // created twice — offer to edit the existing entry instead.
    const dup = (items ?? []).find((i: any) =>
      norm(i.name) === norm(form.name) ||
      (form.nameAm && norm(i.nameAm) === norm(form.nameAm))
    );
    if (dup) {
      const editIt = await confirm({
        title: 'This item already exists',
        message: `"${dup.name}"${dup.nameAm ? ` (${dup.nameAm})` : ''} is already on the menu under ${dup.category?.name || 'a category'}. Duplicates are not allowed — would you like to edit the existing item instead?`,
        confirmLabel: 'Edit Existing Item',
        cancelLabel: 'Keep Typing',
        variant: 'warning',
      });
      if (editIt) handleEdit(dup);
      return;
    }
    createMutation.mutate(data);
  };

  const handleDelete = async (item: any) => {
    const ok = await confirm({
      title: `Delete “${item.name}”?`,
      message: 'This permanently removes the item from the website menu, the QR menu and the printed menu. This cannot be undone.',
      confirmLabel: 'Delete Permanently',
      cancelLabel: 'Keep Item',
      variant: 'danger',
    });
    if (ok) deleteMutation.mutate(item.id);
  };

  // ── Search + grouping ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return items ?? [];
    return (items ?? []).filter((i: any) =>
      norm(i.name).includes(q) ||
      norm(i.nameAm).includes(q) ||
      norm(i.tag).includes(q) ||
      norm(i.category?.name).includes(q)
    );
  }, [items, query]);

  /** Categories flattened in menu order, each with its matching dishes. */
  const groups = useMemo(() => {
    const tree = [...(categories ?? [])].sort((a: any, b: any) => a.order - b.order);
    const ordered: Array<{ id: string; label: string; labelAm?: string }> = [];
    for (const p of tree) {
      const kids = [...(p.children ?? [])].sort((a: any, b: any) => a.order - b.order);
      for (const c of kids) ordered.push({ id: c.id, label: c.name, labelAm: c.nameAm });
      ordered.push({ id: p.id, label: p.name, labelAm: p.nameAm });
    }
    const byCat = new Map<string, any[]>();
    for (const i of filtered) {
      const k = i.categoryId || 'other';
      byCat.set(k, [...(byCat.get(k) ?? []), i]);
    }
    const out: Array<{ id: string; label: string; labelAm?: string; dishes: any[] }> = [];
    for (const c of ordered) {
      const dishes = byCat.get(c.id);
      if (dishes?.length) { out.push({ ...c, dishes }); byCat.delete(c.id); }
    }
    const leftovers = [...byCat.values()].flat();
    if (leftovers.length) out.push({ id: 'other', label: 'Other', dishes: leftovers });
    return out;
  }, [filtered, categories]);

  const toggleGroup = (id: string) => setCollapsed(s => ({ ...s, [id]: !s[id] }));

  const GroupHeader = ({ g }: { g: any }) => (
    <button
      type="button"
      onClick={() => toggleGroup(g.id)}
      className="w-full flex items-center gap-3 px-4 py-3 bg-[#f8f3ea] border-y border-[#d4a843]/25 text-left"
    >
      <ChevronDown className={`w-4 h-4 text-[#b7852e] transition-transform ${collapsed[g.id] ? '-rotate-90' : ''}`} />
      <span className="font-semibold text-[#1e1008]" style={{ fontFamily: 'var(--font-lidya-serif)' }}>{g.label}</span>
      {g.labelAm && <span className="text-sm text-[#b7852e]">{g.labelAm}</span>}
      <span className="ml-auto text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-0.5">{g.dishes.length}</span>
    </button>
  );

  const Row = ({ item }: { item: any }) => (
    <tr className="hover:bg-gray-50 transition-colors">
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
        {item.nameAm && <div className="text-sm text-[#b7852e]" dir="auto">{item.nameAm}</div>}
        {item.tag && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c25e2a]/10 text-[#c25e2a] mt-1">{item.tag}</span>}
      </td>
      <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{item.price}</td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
          {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => handleDelete(item)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const Card = ({ item }: { item: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
      <div className="shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            {item.nameAm && <p className="text-sm text-[#b7852e] truncate" dir="auto">{item.nameAm}</p>}
          </div>
          <span className="shrink-0 text-sm font-semibold text-gray-900">{item.price}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {item.tag && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#c25e2a]/10 text-[#c25e2a]">{item.tag}</span>}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
            {item.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {dialog}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-lidya-serif)" }}>Menu Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, and organize your dishes.</p>
        </div>
        <button
          onClick={() => { const opening = !showForm; resetForm(); setShowForm(opening); if (opening) scrollToForm(formRef); }}
          className="px-5 py-2.5 bg-[#c25e2a] text-[#f5efe6] font-medium rounded-lg hover:bg-[#a54c20] transition-colors shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {showForm && (
        <form ref={formRef} onSubmit={handleSubmit} className="scroll-mt-20 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {editingId && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#f8f3ea] border border-[#d4a843]/30 text-sm text-[#1e1008]">
              Editing <span className="font-semibold">{form.name}</span>{form.nameAm ? ` · ${form.nameAm}` : ''}
            </div>
          )}
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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Item Name (Amharic)</label>
              <input dir="auto" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="ለምሳሌ፦ ዶሮ ወጥ" value={form.nameAm} onChange={e => setForm({ ...form, nameAm: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Price</label>
              <input className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" placeholder="e.g. 350 ETB" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">Select Category...</option>
                {categories?.map((cat: any) =>
                  cat.children && cat.children.length > 0 ? (
                    <optgroup key={cat.id} label={cat.nameAm ? `${cat.name} · ${cat.nameAm}` : cat.name}>
                      {cat.children.map((child: any) => (
                        <option key={child.id} value={child.id}>
                          {child.nameAm ? `${child.name} · ${child.nameAm}` : child.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAm ? `${cat.name} · ${cat.nameAm}` : cat.name}
                    </option>
                  )
                )}
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

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Description (Amharic)</label>
              <textarea dir="auto" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none resize-none" rows={3} placeholder="የምግቡ አጭር መግለጫ..." value={form.descriptionAm} onChange={e => setForm({ ...form, descriptionAm: e.target.value })} />
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search dishes by name, Amharic name, tag or category…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#c25e2a]/50 focus:border-[#c25e2a] outline-none bg-white"
        />
      </div>

      {/* Desktop grouped table (md and up) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading menu…</div>
        ) : groups.length ? (
          groups.map(g => (
            <div key={g.id}>
              <GroupHeader g={g} />
              {!collapsed[g.id] && (
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-gray-100">
                    {g.dishes.map((item: any) => <Row key={item.id} item={item} />)}
                  </tbody>
                </table>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium">{query ? `No dishes match “${query}”.` : 'No menu items found.'}</p>
            {!query && <p className="text-sm text-gray-400 mt-1">Click "Add New Item" to create one.</p>}
          </div>
        )}
      </div>

      {/* Mobile grouped card list (below md) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">Loading menu…</div>
        ) : groups.length ? (
          groups.map(g => (
            <div key={g.id} className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-[#d4a843]/25"><GroupHeader g={g} /></div>
              {!collapsed[g.id] && g.dishes.map((item: any) => <Card key={item.id} item={item} />)}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 font-medium">{query ? `No dishes match “${query}”.` : 'No menu items found.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
