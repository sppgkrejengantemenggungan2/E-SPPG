import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Layers,
  ArrowUpDown,
  Laptop
} from 'lucide-react';
import { ActivityLog } from '../../types';
import logoImg from '../../assets/images/badan_gizi_logo_1785799692960.jpg';

export const ActivityLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedModule !== 'All') params.append('modul', selectedModule);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/v1/logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLogs(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
      showToast('Gagal memuat log aktivitas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedModule, selectedStatus]);

  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast('Tidak ada data log untuk diekspor.', 'info');
      return;
    }

    const headers = ['ID', 'Tanggal', 'Jam', 'User', 'Modul', 'Aktivitas', 'Detail', 'Status', 'IP Address', 'Browser'];
    const rows = logs.map(l => [
      l.id,
      l.tanggal,
      l.jam,
      `"${l.namaUser}"`,
      `"${l.modul}"`,
      `"${l.aktivitas}"`,
      `"${l.detail || '-'}"`,
      l.status,
      l.ipAddress,
      `"${l.browser}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Log_Aktivitas_SPPG_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Log aktivitas berhasil diekspor ke CSV.');
  };

  const totalLogs = logs.length;
  const successLogs = logs.filter(l => l.status === 'Sukses').length;
  const uniqueUsers = Array.from(new Set(logs.map(l => l.namaUser))).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success' ? 'bg-emerald-900 border-emerald-700 text-emerald-100' : 'bg-blue-900 border-blue-700 text-blue-100'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Audit Trail & Keamanan Sistem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Log Aktivitas Central
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Rekam jejak seluruh mutasi data, login pengguna, penerimaan barang, tugas divisi, dan transaksi operasional dapur SPPG HAFSHAWATY2 secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Log</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Entri Log</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalLogs}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tingkat Keberhasilan</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {totalLogs > 0 ? `${Math.round((successLogs / totalLogs) * 100)}%` : '100%'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pengguna Terlibat</div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{uniqueUsers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="hidden print:block font-sans text-slate-900 p-4">
        <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo BGN" className="w-14 h-14 object-cover rounded-full" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">BADAN GIZI NASIONAL REPUBLIK INDONESIA</div>
              <h1 className="text-base font-extrabold uppercase text-slate-900">SPPG HAFSHAWATY2 PROBOLINGGO</h1>
              <p className="text-[10px] text-slate-600">Dokumen Berita Acara & Audit Trail Log Aktivitas</p>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <div className="font-bold">AUDIT TRAIL RESMI</div>
            <div>Dicetak: {new Date().toLocaleString('id-ID')}</div>
          </div>
        </div>

        <table className="w-full text-[10px] border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-200 text-left font-bold">
              <th className="border border-slate-400 p-1.5 text-center w-8">No</th>
              <th className="border border-slate-400 p-1.5 w-24">Waktu</th>
              <th className="border border-slate-400 p-1.5">Pengguna</th>
              <th className="border border-slate-400 p-1.5">Modul</th>
              <th className="border border-slate-400 p-1.5">Aktivitas</th>
              <th className="border border-slate-400 p-1.5">Rincian & IP</th>
              <th className="border border-slate-400 p-1.5 text-center w-14">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={l.id}>
                <td className="border border-slate-400 p-1.5 text-center">{idx + 1}</td>
                <td className="border border-slate-400 p-1.5">{l.tanggal} {l.jam}</td>
                <td className="border border-slate-400 p-1.5 font-semibold">{l.namaUser}</td>
                <td className="border border-slate-400 p-1.5">{l.modul}</td>
                <td className="border border-slate-400 p-1.5">{l.aktivitas}</td>
                <td className="border border-slate-400 p-1.5">
                  <div>{l.detail || '-'}</div>
                  <div className="text-[8px] text-slate-500 font-mono">IP: {l.ipAddress}</div>
                </td>
                <td className="border border-slate-400 p-1.5 text-center font-bold">
                  {l.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari user, aksi, rincian, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Semua Modul</option>
            <option value="Auth">Autentikasi & Login</option>
            <option value="e-Surat">e-Surat Digital</option>
            <option value="Stock Opname">Stock Opname</option>
            <option value="Penerima Manfaat">Penerima Manfaat</option>
            <option value="Tugas Divisi">Tugas Divisi</option>
            <option value="Perencanaan Bahan">Perencanaan Bahan</option>
            <option value="Purchase Order">Purchase Order (PO)</option>
            <option value="Barang Datang">Barang Datang</option>
            <option value="Distribusi">Distribusi</option>
            <option value="Menu Dinamis">Menu Dinamis</option>
            <option value="User Management">Manajemen User</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Sukses">Sukses</option>
            <option value="Gagal">Gagal / Ditolak</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
            title="Refresh Log"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-slate-500 font-medium">
            {logs.length} catatan log
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-32">Waktu</th>
                <th className="p-3.5">Pengguna</th>
                <th className="p-3.5">Modul</th>
                <th className="p-3.5">Aktivitas</th>
                <th className="p-3.5">Rincian & Informasi Teknis</th>
                <th className="p-3.5 text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada aktivitas yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.tanggal}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{item.jam}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.namaUser}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.userId}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.modul}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {item.aktivitas}
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-600 dark:text-slate-300 max-w-md truncate">
                        {item.detail || '-'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3 mt-0.5 font-mono">
                        <span>IP: {item.ipAddress}</span>
                        <span>Browser: {item.browser}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Sukses'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
