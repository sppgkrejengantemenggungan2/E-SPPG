import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { 
  Menu, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  RefreshCw, 
  Check, 
  X, 
  ExternalLink,
  Shield, 
  Sparkles,
  Eye,
  Printer
} from 'lucide-react';
import { MenuItem, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/badan_gizi_logo_1785799692960.jpg';

const availableIcons = [
  'LayoutDashboard', 'Mail', 'Boxes', 'PackagePlus', 'Users', 'ClipboardCheck',
  'UtensilsCrossed', 'Utensils', 'FileCheck', 'Truck', 'Fuel', 'Database',
  'Menu', 'FileText', 'FileSignature', 'Settings', 'Archive', 'HeartPulse',
  'Calculator', 'BookOpen', 'Shield', 'Carrot', 'ChefHat', 'Layers', 'Inbox'
];

const availableRoles: UserRole[] = [
  'Admin Penuh', 'Super Admin', 'Admin', 'Staff Kantor', 'Distribusi', 
  'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'
];

export const DynamicMenuView: React.FC = () => {
  const { refreshMenus, user } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    path: string;
    icon: string;
    color: string;
    order: number;
    targetModule: 'portal' | 'esurat' | 'stock' | 'po' | 'barangDatang' | 'external';
    requiredRole: UserRole[];
    isActive: boolean;
  }>({
    title: '',
    path: '',
    icon: 'Menu',
    color: '#3B82F6',
    order: 10,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Super Admin'],
    isActive: true
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/menus');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMenus(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch menus', err);
      showToast('Gagal memuat daftar menu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      path: '',
      icon: 'LayoutDashboard',
      color: '#3B82F6',
      order: menus.length + 1,
      targetModule: 'portal',
      requiredRole: ['Admin Penuh', 'Super Admin'],
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (menu: MenuItem) => {
    setEditingId(menu.id);
    setFormData({
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
      color: menu.color || '#3B82F6',
      order: menu.order,
      targetModule: menu.targetModule,
      requiredRole: menu.requiredRole || [],
      isActive: menu.isActive
    });
    setIsModalOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/v1/menus/${editingId}` : '/api/v1/menus';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success) {
        showToast(editingId ? 'Menu berhasil diperbarui.' : 'Menu baru berhasil ditambahkan.');
        setIsModalOpen(false);
        fetchMenus();
        refreshMenus();
      } else {
        showToast(json.message || 'Gagal menyimpan menu.', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan.', 'error');
    }
  };

  const handleDeleteMenu = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus menu "${title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/menus/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast(`Menu "${title}" berhasil dihapus.`, 'info');
        fetchMenus();
        refreshMenus();
      } else {
        showToast(json.message || 'Gagal menghapus menu.', 'error');
      }
    } catch (err) {
      showToast('Gagal menghapus menu.', 'error');
    }
  };

  const handleToggleStatus = async (menu: MenuItem) => {
    try {
      const res = await fetch(`/api/v1/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !menu.isActive })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Status menu "${menu.title}" diperbarui.`);
        fetchMenus();
        refreshMenus();
      }
    } catch (err) {
      showToast('Gagal mengubah status menu.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredMenus.length) return;

    const currentItem = filteredMenus[index];
    const targetItem = filteredMenus[targetIndex];

    const currentOrder = currentItem.order;
    const targetOrder = targetItem.order;

    try {
      const res = await fetch('/api/v1/menus/reorder/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: currentItem.id, order: targetOrder },
            { id: targetItem.id, order: currentOrder }
          ]
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Urutan menu berhasil diperbarui.');
        fetchMenus();
        refreshMenus();
      }
    } catch (err) {
      showToast('Gagal mengubah urutan menu.', 'error');
    }
  };

  const renderIconComp = (iconName: string, className = 'w-4 h-4') => {
    const IconComp = (Icons as any)[iconName] || Icons.Circle;
    return <IconComp className={className} />;
  };

  const filteredMenus = menus.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = filterModule === 'all' || m.targetModule === filterModule;
    return matchSearch && matchModule;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success' ? 'bg-emerald-900 border-emerald-700 text-emerald-100' : 'bg-rose-900 border-rose-700 text-rose-100'
        }`}>
          {toastMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
            <Menu className="w-3.5 h-3.5" />
            <span>Pengaturan Navigasi Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Builder Menu Dinamis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Kelola tata letak, modul tujuan, urutan prioritas, dan hak akses visibilitas menu sidebar portal SPPG HAFSHAWATY2 secara realtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Daftar Menu</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* Printable Report Only */}
      <div className="hidden print:block font-sans text-slate-900 p-4">
        <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo BGN" className="w-14 h-14 object-cover rounded-full" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">BADAN GIZI NASIONAL REPUBLIK INDONESIA</div>
              <h1 className="text-base font-extrabold uppercase text-slate-900">SPPG HAFSHAWATY2 PROBOLINGGO</h1>
              <p className="text-[10px] text-slate-600">Dokumen Daftar Menu Dinamis & Hak Akses Portal</p>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <div className="font-bold">ADMINISTRATOR UTAMA</div>
            <div>Dicetak: {new Date().toLocaleDateString('id-ID')}</div>
          </div>
        </div>

        <table className="w-full text-xs border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-200 text-left font-bold">
              <th className="border border-slate-400 p-2 text-center w-10">No</th>
              <th className="border border-slate-400 p-2">Judul Menu</th>
              <th className="border border-slate-400 p-2">Path URL</th>
              <th className="border border-slate-400 p-2">Modul Target</th>
              <th className="border border-slate-400 p-2">Hak Akses Role</th>
              <th className="border border-slate-400 p-2 text-center w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m, idx) => (
              <tr key={m.id}>
                <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                <td className="border border-slate-400 p-2 font-semibold">{m.title}</td>
                <td className="border border-slate-400 p-2 font-mono text-[11px]">{m.path}</td>
                <td className="border border-slate-400 p-2">{m.targetModule}</td>
                <td className="border border-slate-400 p-2 text-[10px]">
                  {m.requiredRole?.join(', ') || 'Semua Role'}
                </td>
                <td className="border border-slate-400 p-2 text-center font-bold">
                  {m.isActive ? 'Aktif' : 'Nonaktif'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul menu atau URL path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Semua Modul</option>
            <option value="portal">Modul Portal Utama</option>
            <option value="esurat">Modul e-Surat</option>
            <option value="stock">Modul Stock Opname</option>
            <option value="barangDatang">Modul Kedatangan Barang</option>
            <option value="po">Modul Purchase Order</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMenus}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
            title="Refresh Data Menu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total {filteredMenus.length} Menu
          </span>
        </div>
      </div>

      {/* Menu Table List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 text-center w-12">Urutan</th>
                <th className="p-3.5">Ikon & Judul Menu</th>
                <th className="p-3.5">Path URL</th>
                <th className="p-3.5">Modul Target</th>
                <th className="p-3.5">Hak Akses Role</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada menu ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMenus.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-400">
                      <div className="flex items-center justify-center gap-1">
                        <span>{item.order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 hover:text-cyan-500 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filteredMenus.length - 1}
                            className="p-0.5 hover:text-cyan-500 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs shrink-0"
                          style={{ backgroundColor: item.color || '#3B82F6' }}
                        >
                          {renderIconComp(item.icon, 'w-4 h-4')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.title}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                              {item.id}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Ikon: {item.icon}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                        {item.path}
                      </code>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.targetModule}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.requiredRole && item.requiredRole.length > 0 ? (
                          item.requiredRole.map(r => (
                            <span key={r} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Semua Role</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition cursor-pointer"
                          title="Edit Menu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(item.id, item.title)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 rounded-lg transition cursor-pointer"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Menu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                  <Menu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Menu Dinamis' : 'Tambah Menu Dinamis Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Menu</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Laporan Kendali Mutu"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Path URL (/...)</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: /kendali-mutu"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilihan Ikon Lucide</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {availableIcons.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Warna Aksen</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-9 h-9 rounded-xl border-0 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Urut</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseFloat(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Modul Target</label>
                <select
                  value={formData.targetModule}
                  onChange={(e) => setFormData({ ...formData, targetModule: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="portal">Portal Utama (Default)</option>
                  <option value="esurat">e-Surat Digital</option>
                  <option value="stock">Stock Opname</option>
                  <option value="barangDatang">Input Kedatangan Barang</option>
                  <option value="po">Purchase Order (PO)</option>
                  <option value="external">External Link</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hak Akses Role (Bisa pilih lebih dari satu)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {availableRoles.map(role => {
                    const isChecked = formData.requiredRole.includes(role);
                    return (
                      <label key={role} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, requiredRole: [...formData.requiredRole, role] });
                            } else {
                              setFormData({ ...formData, requiredRole: formData.requiredRole.filter(r => r !== role) });
                            }
                          }}
                          className="rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{role}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="isActive" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Aktifkan Menu di Navigasi Sidebar
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Tambah Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
