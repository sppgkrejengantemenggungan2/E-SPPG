import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Activity,
  DollarSign,
  BookOpen,
  Printer,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  PieChart,
  ShoppingBag,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  MasterMenuGiziItem,
  PlogDailyMenuItem,
  PlogGiziCalculation,
  PlogFoodCostCalculation
} from '../../types';

interface LaporanPlogViewProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const LaporanPlogView: React.FC<LaporanPlogViewProps> = ({ currentPath = '/laporan-plog', onNavigate }) => {
  // Determine active tab from URL path
  const activeTab = useMemo(() => {
    if (currentPath.includes('informasi-gizi')) return 'gizi';
    if (currentPath.includes('food-cost')) return 'food-cost';
    if (currentPath.includes('master-menu-gizi')) return 'master';
    return 'input-menu';
  }, [currentPath]);

  const setActiveTab = (tab: 'input-menu' | 'gizi' | 'food-cost' | 'master') => {
    const pathToTab: Record<string, string> = {
      'input-menu': '/laporan-plog/input-menu',
      'gizi': '/laporan-plog/informasi-gizi',
      'food-cost': '/laporan-plog/food-cost',
      'master': '/laporan-plog/master-menu-gizi',
    };
    if (onNavigate) {
      onNavigate(pathToTab[tab]);
    }
  };

  // Shared state: Date filter
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Data states
  const [beneficiaryContext, setBeneficiaryContext] = useState<any>(null);
  const [dailyMenu, setDailyMenu] = useState<PlogDailyMenuItem>({
    id: '',
    tanggal: selectedDate,
    namaMenuHarian: '',
    makananPokok: 'Nasi Putih Pulen',
    laukHewani: 'Ayam Goreng Lengkuas',
    laukNabati: 'Tempe Bacem Tradisional',
    sayur: 'Sayur Sop Wortel Bakso',
    buah: 'Pisang Ambon Segar',
    ekstra: 'Susu UHT Plain 200ml',
    jumlahPenerimaManfaat: 0,
    porsiBesar: 0,
    porsiKecil: 0,
    totalJumlahPorsi: 0,
    jumlahPorsiHarian: 0,
    waktuDistribusi: '10:30 WIB',
    penanggungJawabGizi: 'Rina Wijaya, S.Gz (Ahli Gizi SPPG)',
    statusApproval: 'Diverifikasi Ahli Gizi'
  });

  const [giziData, setGiziData] = useState<PlogGiziCalculation | null>(null);
  const [foodCostData, setFoodCostData] = useState<PlogFoodCostCalculation | null>(null);
  const [masterList, setMasterList] = useState<MasterMenuGiziItem[]>([]);
  const [masterCategoryFilter, setMasterCategoryFilter] = useState('Semua');
  const [masterSearch, setMasterSearch] = useState('');

  // Portion division tabs for Gizi & Food Cost
  const [giziPortionTab, setGiziPortionTab] = useState<'besar' | 'kecil' | 'semua'>('besar');
  const [foodCostPortionTab, setFoodCostPortionTab] = useState<'semua' | 'besar' | 'kecil'>('semua');

  // Master menu modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<Partial<MasterMenuGiziItem>>({
    namaMenu: '',
    kategori: 'Makanan Pokok',
    porsiGram: 100,
    energiKkal: 150,
    proteinGram: 5,
    lemakGram: 2,
    karbohidratGram: 30,
    seratGram: 1.5,
    kalsiumMg: 20,
    zatBesiMg: 1,
    estimasiBiayaPorsi: 2000,
    standarKecukupan: 'Standar TKPI Kemenkes RI',
    keterangan: ''
  });

  // Fetch all initial and contextual data
  const fetchData = async () => {
    setLoading(true);
    setAlertMsg(null);
    try {
      // 1. Context & Beneficiary (Direct live sync with Penerima Manfaat menu)
      const ctxRes = await fetch(`/api/v1/plog/context/${selectedDate}`);
      const ctxJson = await ctxRes.json();
      if (ctxJson.success && ctxJson.data) {
        setBeneficiaryContext(ctxJson.data);
        const ben = ctxJson.data.beneficiary;
        const pBesar = ben.porsiBesar || 0;
        const pKecil = ben.porsiKecil || 0;
        const pTotal = pBesar + pKecil || ben.totalJumlahPorsi || ben.totalPenerima;

        if (ctxJson.data.dailyMenu) {
          setDailyMenu({
            ...ctxJson.data.dailyMenu,
            jumlahPenerimaManfaat: ben.totalPenerima,
            porsiBesar: pBesar,
            porsiKecil: pKecil,
            totalJumlahPorsi: pTotal,
            jumlahPorsiHarian: pTotal,
            rincianSasaran: ben.breakdown
          });
        } else {
          setDailyMenu(prev => ({
            ...prev,
            tanggal: selectedDate,
            jumlahPenerimaManfaat: ben.totalPenerima,
            porsiBesar: pBesar,
            porsiKecil: pKecil,
            totalJumlahPorsi: pTotal,
            jumlahPorsiHarian: pTotal,
            rincianSasaran: ben.breakdown
          }));
        }
      }

      // 2. Gizi Calculation
      const giziRes = await fetch(`/api/v1/plog/gizi-calculation/${selectedDate}`);
      const giziJson = await giziRes.json();
      if (giziJson.success) {
        setGiziData(giziJson.data);
      }

      // 3. Food Cost Calculation
      const fcRes = await fetch(`/api/v1/plog/food-cost-calculation/${selectedDate}`);
      const fcJson = await fcRes.json();
      if (fcJson.success) {
        setFoodCostData(fcJson.data);
      }

      // 4. Master Menu List
      const mRes = await fetch('/api/v1/plog/master-menu');
      const mJson = await mRes.json();
      if (mJson.success) {
        setMasterList(mJson.data);
      }
    } catch (err: any) {
      console.error('Error fetching PLOG data:', err);
      setAlertMsg({ type: 'error', text: 'Gagal memuat data dari server: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // Handle Save Daily Menu (Sub Menu 1)
  const handleSaveDailyMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalPorsiBesar = Number(dailyMenu.porsiBesar) || 0;
      const finalPorsiKecil = Number(dailyMenu.porsiKecil) || 0;
      const finalTotalPorsi = finalPorsiBesar + finalPorsiKecil;

      const payload = {
        ...dailyMenu,
        tanggal: selectedDate,
        jumlahPenerimaManfaat: Number(dailyMenu.jumlahPenerimaManfaat) || finalTotalPorsi,
        porsiBesar: finalPorsiBesar,
        porsiKecil: finalPorsiKecil,
        totalJumlahPorsi: finalTotalPorsi,
        jumlahPorsiHarian: finalTotalPorsi,
      };

      const res = await fetch('/api/v1/plog/daily-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setAlertMsg({ type: 'success', text: json.message || 'Menu harian & porsi berhasil disimpan dan disinkronkan!' });
        // Refresh calculations
        fetchData();
      } else {
        setAlertMsg({ type: 'error', text: json.message || 'Gagal menyimpan menu' });
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: 'Terjadi kesalahan sistem: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Master Menu Save / Edit
  const handleSaveMasterItem = async () => {
    if (!modalItem.namaMenu || !modalItem.kategori) {
      alert('Nama menu dan kategori wajib diisi!');
      return;
    }
    setSaving(true);
    try {
      const isEdit = Boolean(modalItem.id);
      const url = isEdit ? `/api/v1/plog/master-menu/${modalItem.id}` : '/api/v1/plog/master-menu';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalItem)
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setAlertMsg({ type: 'success', text: json.message });
        fetchData();
      } else {
        alert(json.message || 'Gagal menyimpan master menu');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Master Menu Delete
  const handleDeleteMasterItem = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus ${name} dari master menu & kandungan gizi?`)) return;
    try {
      const res = await fetch(`/api/v1/plog/master-menu/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAlertMsg({ type: 'info', text: json.message });
        fetchData();
      }
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  // Filtered master items
  const filteredMasterItems = useMemo(() => {
    return masterList.filter(item => {
      if (masterCategoryFilter !== 'Semua' && item.kategori !== masterCategoryFilter) return false;
      if (masterSearch) {
        const q = masterSearch.toLowerCase();
        return item.namaMenu.toLowerCase().includes(q) || (item.standarKecukupan && item.standarKecukupan.toLowerCase().includes(q));
      }
      return true;
    });
  }, [masterList, masterCategoryFilter, masterSearch]);

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* SCREEN HEADER (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Modul Perencanaan & Pelaporan
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">BGN - SPPG HAFSHAWATY2</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-purple-600" />
            Laporan PLOG (Perencanaan Logistik & Operasional Gizi)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sistem terintegrasi otomatis antara Input Menu, Angka Kecukupan Gizi (AKG), Food Cost PO Harian, dan Master Database Gizi.
          </p>
        </div>

        {/* Global Date & Sync Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-slate-500" />
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tanggal Menu:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
            title="Sinkronisasi Data Real-time"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sinkronisasi
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Dokumen Resmi
          </button>
        </div>
      </div>

      {/* ALERT NOTIFICATION */}
      {alertMsg && (
        <div className={`print:hidden p-4 rounded-xl flex items-center justify-between text-sm ${
          alertMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
            : alertMsg.type === 'error'
            ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
            : 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            {alertMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{alertMsg.text}</span>
          </div>
          <button onClick={() => setAlertMsg(null)} className="text-xs font-bold hover:underline">Tutup</button>
        </div>
      )}

      {/* SUB-MENU NAVIGATION TABS (Hidden in Print) */}
      <div className="print:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('input-menu')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'input-menu'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          1. Input Menu & Porsi
        </button>

        <button
          onClick={() => setActiveTab('gizi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'gizi'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          2. Informasi Kandungan Gizi
          <span className="ml-1 px-1.5 py-0.2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded text-[10px] font-extrabold">
            Auto
          </span>
        </button>

        <button
          onClick={() => setActiveTab('food-cost')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'food-cost'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          3. Informasi Food Cost Menu
          <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded text-[10px] font-extrabold">
            PO Link
          </span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'master'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          4. Master Menu & Kandungan Gizi
          <span className="ml-1 px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px]">
            {masterList.length}
          </span>
        </button>
      </div>

      {/* PRINT-ONLY OFFICIAL KOP SURAT */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4 text-center">
        <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
          BADAN GIZI NASIONAL (BGN) REPUBLIK INDONESIA
        </h2>
        <h3 className="text-sm font-bold uppercase text-slate-800">
          SATUAN PELAYANAN PEMENUHAN GIZI (SPPG) HAFSHAWATY 2
        </h3>
        <p className="text-[10px] text-slate-600">
          Kecamatan Krejengan, Kabupaten Probolinggo, Jawa Timur • Email: sppgkrejengantemenggungan2@gmail.com
        </p>
        <div className="mt-2 text-xs font-black uppercase bg-slate-100 p-1.5 rounded border border-slate-300">
          {activeTab === 'input-menu' && 'DOKUMEN PERENCANAAN MENU & ALOKASI PORSI HARIAN (PLOG)'}
          {activeTab === 'gizi' && 'LEMBAR EVALUASI & INFORMASI KANDUNGAN GIZI HARIAN (AKG MBG)'}
          {activeTab === 'food-cost' && 'LAPORAN ANALISIS REALISASI FOOD COST MENU TERHADAP PO HARIAN'}
          {activeTab === 'master' && 'KATALOG DATABASE STANDAR MENU & KANDUNGAN GIZI (TKPI KEMENKES)'}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2 text-left text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Tanggal Pelaksanaan:</span>
            <span className="font-bold text-slate-900">{selectedDate}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Jumlah Penerima Manfaat:</span>
            <span className="font-bold text-purple-700">{dailyMenu.jumlahPenerimaManfaat?.toLocaleString('id-ID')} Orang</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Pembagian Porsi:</span>
            <span className="font-bold text-slate-800">Besar: {(dailyMenu.porsiBesar || 0).toLocaleString('id-ID')} | Kecil: {(dailyMenu.porsiKecil || 0).toLocaleString('id-ID')}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Total Jumlah Porsi:</span>
            <span className="font-bold text-emerald-700">{((dailyMenu.porsiBesar || 0) + (dailyMenu.porsiKecil || 0)).toLocaleString('id-ID')} Porsi</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: INPUT MENU & PORSI HARIAN */}
      {/* ========================================================= */}
      {activeTab === 'input-menu' && (
        <div className="space-y-6">
          {/* Beneficiary Integration KPI Cards: Divided into Penerima, Porsi Besar, Porsi Kecil, Total Porsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jumlah Penerima Manfaat */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-4 text-white shadow-xs">
              <div className="flex items-center justify-between opacity-85 mb-1">
                <span className="text-xs font-semibold">Penerima Manfaat</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{dailyMenu.jumlahPenerimaManfaat?.toLocaleString('id-ID')} Orang</div>
              <div className="flex items-center gap-1.5 text-[11px] opacity-85 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Otomatis dari menu Penerima Manfaat</span>
              </div>
            </div>

            {/* Card 2: Porsi Besar */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xs">
              <div className="flex items-center justify-between opacity-85 mb-1">
                <span className="text-xs font-semibold">Alokasi Porsi Besar</span>
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{(dailyMenu.porsiBesar || 0).toLocaleString('id-ID')} Porsi</div>
              <p className="text-[11px] opacity-85 mt-1">SMP, SMA, Bumil/Busui, Guru & Staf</p>
            </div>

            {/* Card 3: Porsi Kecil */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-xs">
              <div className="flex items-center justify-between opacity-85 mb-1">
                <span className="text-xs font-semibold">Alokasi Porsi Kecil</span>
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{(dailyMenu.porsiKecil || 0).toLocaleString('id-ID')} Porsi</div>
              <p className="text-[11px] opacity-85 mt-1">Siswa SD / MI, PAUD & Balita</p>
            </div>

            {/* Card 4: Total Jumlah Porsi */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-4 text-white shadow-xs">
              <div className="flex items-center justify-between opacity-85 mb-1">
                <span className="text-xs font-semibold">Total Jumlah Porsi</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">
                {((dailyMenu.porsiBesar || 0) + (dailyMenu.porsiKecil || 0)).toLocaleString('id-ID')} Porsi
              </div>
              <p className="text-[11px] opacity-85 mt-1">Total Porsi Besar + Porsi Kecil</p>
            </div>
          </div>

          {/* Form Input Menu */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-purple-600" />
                  Formulir Perencanaan Menu Harian
                </h3>
                <p className="text-xs text-slate-500">
                  Data menu yang diisi di sini akan otomatis mengalir ke Informasi Kandungan Gizi dan Food Cost Menu.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Form
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveDailyMenu} className="space-y-5">
              {/* Nama Menu Harian Utama */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Menu Harian Lengkap:
                </label>
                <input
                  type="text"
                  value={dailyMenu.namaMenuHarian}
                  onChange={(e) => setDailyMenu({ ...dailyMenu, namaMenuHarian: e.target.value })}
                  placeholder="Contoh: Nasi Putih Pulen, Ayam Goreng Lengkuas, Tempe Bacem, Sayur Sop & Buah Pisang"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Grid 6 Komponen Makanan */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Makanan Pokok */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">1. Makanan Pokok</label>
                    <span className="text-[10px] text-purple-600 font-bold">100g</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.makananPokok}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, makananPokok: e.target.value })}
                    list="pokok-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Pilih atau ketik makanan pokok..."
                    required
                  />
                  <datalist id="pokok-options">
                    {masterList.filter(m => m.kategori === 'Makanan Pokok').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>

                {/* 2. Lauk Hewani */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">2. Lauk Hewani</label>
                    <span className="text-[10px] text-purple-600 font-bold">80g</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.laukHewani}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, laukHewani: e.target.value })}
                    list="hewani-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Pilih atau ketik lauk hewani..."
                    required
                  />
                  <datalist id="hewani-options">
                    {masterList.filter(m => m.kategori === 'Lauk Hewani').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>

                {/* 3. Lauk Nabati */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">3. Lauk Nabati</label>
                    <span className="text-[10px] text-purple-600 font-bold">50g</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.laukNabati}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, laukNabati: e.target.value })}
                    list="nabati-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Pilih atau ketik lauk nabati..."
                    required
                  />
                  <datalist id="nabati-options">
                    {masterList.filter(m => m.kategori === 'Lauk Nabati').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>

                {/* 4. Sayuran */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">4. Sayuran</label>
                    <span className="text-[10px] text-purple-600 font-bold">100g</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.sayur}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, sayur: e.target.value })}
                    list="sayur-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Pilih atau ketik sayuran..."
                    required
                  />
                  <datalist id="sayur-options">
                    {masterList.filter(m => m.kategori === 'Sayuran').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>

                {/* 5. Buah */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">5. Buah Segar</label>
                    <span className="text-[10px] text-purple-600 font-bold">100g</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.buah}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, buah: e.target.value })}
                    list="buah-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Pilih atau ketik buah..."
                    required
                  />
                  <datalist id="buah-options">
                    {masterList.filter(m => m.kategori === 'Buah').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>

                {/* 6. Ekstra / Minuman */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">6. Ekstra / Minuman</label>
                    <span className="text-[10px] text-purple-600 font-bold">200ml</span>
                  </div>
                  <input
                    type="text"
                    value={dailyMenu.ekstra || ''}
                    onChange={(e) => setDailyMenu({ ...dailyMenu, ekstra: e.target.value })}
                    list="ekstra-options"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Contoh: Susu UHT Plain 200ml..."
                  />
                  <datalist id="ekstra-options">
                    {masterList.filter(m => m.kategori === 'Ekstra / Minuman').map(m => (
                      <option key={m.id} value={m.namaMenu} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Data Porsi & Penerima Manfaat Form Fields - Otomatis dari Penerima Manfaat */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Alokasi Porsi & Data Penerima Manfaat
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Menyesuaikan otomatis dengan data harian menu Penerima Manfaat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Jumlah Penerima Manfaat */}
                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 rounded-xl space-y-1">
                    <label className="block text-[11px] font-bold text-purple-900 dark:text-purple-300">
                      1. Jumlah Penerima Manfaat:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={dailyMenu.jumlahPenerimaManfaat}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDailyMenu({ ...dailyMenu, jumlahPenerimaManfaat: val });
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 rounded-lg text-sm font-black text-purple-900 dark:text-purple-200 outline-none"
                        required
                      />
                      <Users className="w-3.5 h-3.5 text-purple-500 absolute left-2.5 top-3" />
                    </div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-medium">
                      Total sasaran harian SPPG
                    </span>
                  </div>

                  {/* 2. Porsi Besar */}
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-1">
                    <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-300">
                      2. Porsi Besar:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={dailyMenu.porsiBesar}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total = val + (dailyMenu.porsiKecil || 0);
                          setDailyMenu({
                            ...dailyMenu,
                            porsiBesar: val,
                            totalJumlahPorsi: total,
                            jumlahPorsiHarian: total,
                          });
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-700 rounded-lg text-sm font-black text-blue-900 dark:text-blue-200 outline-none"
                        required
                      />
                      <Utensils className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-3" />
                    </div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-medium">
                      SMP, SMA, Bumil/Busui & Staf
                    </span>
                  </div>

                  {/* 3. Porsi Kecil */}
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1">
                    <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300">
                      3. Porsi Kecil:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={dailyMenu.porsiKecil}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total = (dailyMenu.porsiBesar || 0) + val;
                          setDailyMenu({
                            ...dailyMenu,
                            porsiKecil: val,
                            totalJumlahPorsi: total,
                            jumlahPorsiHarian: total,
                          });
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700 rounded-lg text-sm font-black text-amber-900 dark:text-amber-200 outline-none"
                        required
                      />
                      <Utensils className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">
                      SD, MI, PAUD & Balita Nutrisi
                    </span>
                  </div>

                  {/* 4. Total Jumlah Porsi */}
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                      4. Total Jumlah Porsi:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={(dailyMenu.porsiBesar || 0) + (dailyMenu.porsiKecil || 0)}
                        readOnly
                        className="w-full pl-8 pr-3 py-2 bg-emerald-100/60 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg text-sm font-black text-emerald-900 dark:text-emerald-200 outline-none cursor-not-allowed"
                      />
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-3" />
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">
                      Porsi Besar + Porsi Kecil
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Waktu Pengiriman / Distribusi:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dailyMenu.waktuDistribusi || '10:30 WIB'}
                        onChange={(e) => setDailyMenu({ ...dailyMenu, waktuDistribusi: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 outline-none"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Jadwal armada keluar dari SPPG</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Penanggung Jawab Nutrisiis / Ahli Gizi:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dailyMenu.penanggungJawabGizi || 'Siti Rahmawati, S.Tr.Gz'}
                        onChange={(e) => setDailyMenu({ ...dailyMenu, penanggungJawabGizi: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 outline-none"
                      />
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Verifikator standar gizi harian</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="print:hidden flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {saving ? 'Menyimpan & Mensinkronkan...' : 'Simpan & Sinkronisasikan Menu Harian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INFORMASI KANDUNGAN GIZI (AUTO-CALCULATED) */}
      {/* ========================================================= */}
      {activeTab === 'gizi' && (() => {
        const activeProfile = giziPortionTab === 'kecil'
          ? (giziData?.porsiKecilDetail || null)
          : (giziData?.porsiBesarDetail || null);
        const besarProfile = giziData?.porsiBesarDetail;
        const kecilProfile = giziData?.porsiKecilDetail;

        return (
          <div className="space-y-6">
            {/* Header Banner with Automatic Menu Name */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 backdrop-blur-xs rounded-full text-xs font-semibold text-purple-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Kandungan Gizi Dihitung Otomatis per Klasifikasi Porsi (Standar TKPI & AKG BGN)
                  </div>
                  <h2 className="text-xl font-black">
                    {giziData?.namaMenuHarian || dailyMenu.namaMenuHarian || 'Menu Makan Bergizi Gratis (MBG)'}
                  </h2>
                  <p className="text-xs text-purple-200">
                    Tanggal Pelaksanaan: <span className="font-bold text-white">{selectedDate}</span> • Penerima Manfaat: <span className="font-bold text-white">{(dailyMenu.jumlahPenerimaManfaat || giziData?.jumlahPenerimaManfaat || 0).toLocaleString('id-ID')} Orang</span> • Pembagian Porsi: <span className="font-bold text-white">Besar {(dailyMenu.porsiBesar || giziData?.porsiBesar || 0).toLocaleString('id-ID')} | Kecil {(dailyMenu.porsiKecil || giziData?.porsiKecil || 0).toLocaleString('id-ID')} | Total {((dailyMenu.porsiBesar || 0) + (dailyMenu.porsiKecil || 0) || dailyMenu.jumlahPorsiHarian || 0).toLocaleString('id-ID')} Porsi</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm ${
                    (activeProfile?.statusEvaluasi || giziData?.statusEvaluasi) === 'Sesuai Standar AKG'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                    {activeProfile?.statusEvaluasi || giziData?.statusEvaluasi || 'Sesuai Standar AKG'}
                  </span>

                  <button
                    onClick={handlePrint}
                    className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak Evaluasi Gizi
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-selector for Porsi: Porsi Besar vs Porsi Kecil vs Komparasi */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Klasifikasi Porsi:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGiziPortionTab('besar')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      giziPortionTab === 'besar'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    Porsi Besar ({(dailyMenu.porsiBesar || giziData?.porsiBesar || 0).toLocaleString('id-ID')} Porsi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiziPortionTab('kecil')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      giziPortionTab === 'kecil'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    Porsi Kecil ({(dailyMenu.porsiKecil || giziData?.porsiKecil || 0).toLocaleString('id-ID')} Porsi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiziPortionTab('semua')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      giziPortionTab === 'semua'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Komparasi Besar vs Kecil
                  </button>
                </div>
              </div>

              <span className="text-xs text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                {giziPortionTab === 'besar' && 'Sasaran: SMP, SMA, Ibu Hamil & Menyusui, Guru & Staf'}
                {giziPortionTab === 'kecil' && 'Sasaran: Siswa SD, MI, PAUD & Balita Nutrisi'}
                {giziPortionTab === 'semua' && 'Menampilkan Perbandingan AKG Porsi Besar & Porsi Kecil'}
              </span>
            </div>

            {/* 4 Nutrient KPI Cards vs AKG Standard (Kalsium & Zat Besi Ditiadakan) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 1. Energi / Kalori */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Energi (Kalori)</span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded">
                    {giziPortionTab === 'kecil' ? 'Porsi Kecil' : 'Porsi Besar'}
                  </span>
                </div>
                <div className="text-2xl font-black text-purple-600 mt-1">
                  {activeProfile?.totalEnergiKkal || giziData?.totalEnergiKkal || 0} kkal
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Standar AKG BGN:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeProfile?.standarAKG ? `${activeProfile.standarAKG.energiMin} - ${activeProfile.standarAKG.energiMax} kkal` : '650 - 750 kkal'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (((activeProfile?.totalEnergiKkal || 0) / (activeProfile?.standarAKG?.energiMax || 750)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* 2. Protein */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Protein</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                    {giziPortionTab === 'kecil' ? 'Porsi Kecil' : 'Porsi Besar'}
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {activeProfile?.totalProteinGram || giziData?.totalProteinGram || 0} g
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Standar AKG BGN:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeProfile?.standarAKG ? `${activeProfile.standarAKG.proteinMin} - ${activeProfile.standarAKG.proteinMax} g` : '20 - 25 g'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (((activeProfile?.totalProteinGram || 0) / (activeProfile?.standarAKG?.proteinMax || 25)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* 3. Lemak */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Lemak</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                    {giziPortionTab === 'kecil' ? 'Porsi Kecil' : 'Porsi Besar'}
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {activeProfile?.totalLemakGram || giziData?.totalLemakGram || 0} g
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Standar AKG BGN:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeProfile?.standarAKG ? `${activeProfile.standarAKG.lemakMin} - ${activeProfile.standarAKG.lemakMax} g` : '18 - 25 g'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (((activeProfile?.totalLemakGram || 0) / (activeProfile?.standarAKG?.lemakMax || 25)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* 4. Karbohidrat */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Karbohidrat</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                    {giziPortionTab === 'kecil' ? 'Porsi Kecil' : 'Porsi Besar'}
                  </span>
                </div>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {activeProfile?.totalKarbohidratGram || giziData?.totalKarbohidratGram || 0} g
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Standar AKG BGN:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeProfile?.standarAKG ? `${activeProfile.standarAKG.karboMin} - ${activeProfile.standarAKG.karboMax} g` : '85 - 105 g'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (((activeProfile?.totalKarbohidratGram || 0) / (activeProfile?.standarAKG?.karboMax || 105)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Rincian Komponen Menu & Kandungan Gizi (Kolom Kalsium & Zat Besi Ditiadakan) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  {giziPortionTab === 'semua'
                    ? 'Tabel Perbandingan Kandungan Gizi Porsi Besar vs Porsi Kecil'
                    : `Tabel Kandungan Gizi ${giziPortionTab === 'kecil' ? 'Porsi Kecil (SD/MI, PAUD, Balita)' : 'Porsi Besar (SMP, SMA, Bumil, Guru)'}`}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  Standar TKPI Kemenkes RI • Energi, Protein, Lemak, Karbohidrat & Serat
                </span>
              </div>

              {/* Tampilan Standar (Porsi Besar / Porsi Kecil) */}
              {giziPortionTab !== 'semua' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">No</th>
                        <th className="py-3 px-3">Komponen / Kategori</th>
                        <th className="py-3 px-3">Nama Menu Hidangan</th>
                        <th className="py-3 px-3 text-right">Gramasi (g)</th>
                        <th className="py-3 px-3 text-right">Energi (kkal)</th>
                        <th className="py-3 px-3 text-right">Protein (g)</th>
                        <th className="py-3 px-3 text-right">Lemak (g)</th>
                        <th className="py-3 px-3 text-right">Karbo (g)</th>
                        <th className="py-3 px-3 text-right">Serat (g)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {activeProfile?.items && activeProfile.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-purple-700 dark:text-purple-400">{item.kategori}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{item.namaMenu}</td>
                          <td className="py-2.5 px-3 text-right font-medium">{item.porsiGram} g</td>
                          <td className="py-2.5 px-3 text-right font-bold text-purple-600">{item.energiKkal}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{item.proteinGram}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600">{item.lemakGram}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-600">{item.karbohidratGram}</td>
                          <td className="py-2.5 px-3 text-right font-medium">{item.seratGram}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-purple-50 dark:bg-purple-950/40 border-t-2 border-purple-300 dark:border-purple-800 font-extrabold text-slate-900 dark:text-slate-100">
                        <td colSpan={3} className="py-3 px-3 text-purple-900 dark:text-purple-300 uppercase">
                          Total Akumulasi per {giziPortionTab === 'kecil' ? 'Porsi Kecil' : 'Porsi Besar'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {activeProfile?.items?.reduce((s, i) => s + i.porsiGram, 0)} g
                        </td>
                        <td className="py-3 px-3 text-right text-purple-700 dark:text-purple-300 text-sm">
                          {activeProfile?.totalEnergiKkal} kkal
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-300 text-sm">
                          {activeProfile?.totalProteinGram} g
                        </td>
                        <td className="py-3 px-3 text-right text-amber-700 dark:text-amber-300 text-sm">
                          {activeProfile?.totalLemakGram} g
                        </td>
                        <td className="py-3 px-3 text-right text-blue-700 dark:text-blue-300 text-sm">
                          {activeProfile?.totalKarbohidratGram} g
                        </td>
                        <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200">
                          {activeProfile?.totalSeratGram} g
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                /* Tampilan Komparasi Keduanya (Porsi Besar vs Porsi Kecil) */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                        <th rowSpan={2} className="py-3 px-3 border-r border-slate-200 dark:border-slate-700">Komponen</th>
                        <th rowSpan={2} className="py-3 px-3 border-r border-slate-200 dark:border-slate-700">Nama Menu Hidangan</th>
                        <th colSpan={2} className="py-2 px-2 text-center bg-purple-100/60 dark:bg-purple-950/40 border-r border-slate-200 dark:border-slate-700">Gramasi (g)</th>
                        <th colSpan={2} className="py-2 px-2 text-center bg-indigo-100/60 dark:bg-indigo-950/40 border-r border-slate-200 dark:border-slate-700">Energi (kkal)</th>
                        <th colSpan={2} className="py-2 px-2 text-center bg-emerald-100/60 dark:bg-emerald-950/40 border-r border-slate-200 dark:border-slate-700">Protein (g)</th>
                        <th colSpan={2} className="py-2 px-2 text-center bg-amber-100/60 dark:bg-amber-950/40 border-r border-slate-200 dark:border-slate-700">Lemak (g)</th>
                        <th colSpan={2} className="py-2 px-2 text-center bg-blue-100/60 dark:bg-blue-950/40">Karbohidrat (g)</th>
                      </tr>
                      <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        <th className="py-1.5 px-2 text-right text-purple-700 dark:text-purple-300">Besar</th>
                        <th className="py-1.5 px-2 text-right text-purple-700 dark:text-purple-300 border-r border-slate-200 dark:border-slate-700">Kecil</th>
                        <th className="py-1.5 px-2 text-right text-indigo-700 dark:text-indigo-300">Besar</th>
                        <th className="py-1.5 px-2 text-right text-indigo-700 dark:text-indigo-300 border-r border-slate-200 dark:border-slate-700">Kecil</th>
                        <th className="py-1.5 px-2 text-right text-emerald-700 dark:text-emerald-300">Besar</th>
                        <th className="py-1.5 px-2 text-right text-emerald-700 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-700">Kecil</th>
                        <th className="py-1.5 px-2 text-right text-amber-700 dark:text-amber-300">Besar</th>
                        <th className="py-1.5 px-2 text-right text-amber-700 dark:text-amber-300 border-r border-slate-200 dark:border-slate-700">Kecil</th>
                        <th className="py-1.5 px-2 text-right text-blue-700 dark:text-blue-300">Besar</th>
                        <th className="py-1.5 px-2 text-right text-blue-700 dark:text-blue-300">Kecil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {besarProfile?.items && besarProfile.items.map((bItem, idx) => {
                        const kItem = kecilProfile?.items?.[idx];
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                            <td className="py-2.5 px-3 font-semibold text-purple-700 dark:text-purple-400 border-r border-slate-100 dark:border-slate-800">{bItem.kategori}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">{bItem.namaMenu}</td>
                            <td className="py-2.5 px-2 text-right font-medium">{bItem.porsiGram}g</td>
                            <td className="py-2.5 px-2 text-right font-medium border-r border-slate-100 dark:border-slate-800 text-slate-500">{kItem?.porsiGram || 0}g</td>
                            <td className="py-2.5 px-2 text-right font-bold text-purple-600">{bItem.energiKkal}</td>
                            <td className="py-2.5 px-2 text-right font-medium border-r border-slate-100 dark:border-slate-800 text-purple-500">{kItem?.energiKkal || 0}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-emerald-600">{bItem.proteinGram}</td>
                            <td className="py-2.5 px-2 text-right font-medium border-r border-slate-100 dark:border-slate-800 text-emerald-500">{kItem?.proteinGram || 0}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-amber-600">{bItem.lemakGram}</td>
                            <td className="py-2.5 px-2 text-right font-medium border-r border-slate-100 dark:border-slate-800 text-amber-500">{kItem?.lemakGram || 0}</td>
                            <td className="py-2.5 px-2 text-right font-bold text-blue-600">{bItem.karbohidratGram}</td>
                            <td className="py-2.5 px-2 text-right font-medium text-blue-500">{kItem?.karbohidratGram || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-purple-50 dark:bg-purple-950/40 border-t-2 border-purple-300 dark:border-purple-800 font-extrabold text-slate-900 dark:text-slate-100">
                        <td colSpan={2} className="py-3 px-3 uppercase text-purple-900 dark:text-purple-300 border-r border-purple-200 dark:border-purple-800">
                          Total Akumulasi Nutrisi
                        </td>
                        <td className="py-3 px-2 text-right">{besarProfile?.items?.reduce((s, i) => s + i.porsiGram, 0)}g</td>
                        <td className="py-3 px-2 text-right border-r border-purple-200 dark:border-purple-800 text-slate-600 dark:text-slate-400">{kecilProfile?.items?.reduce((s, i) => s + i.porsiGram, 0)}g</td>
                        <td className="py-3 px-2 text-right text-purple-700 dark:text-purple-300">{besarProfile?.totalEnergiKkal}</td>
                        <td className="py-3 px-2 text-right border-r border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400">{kecilProfile?.totalEnergiKkal}</td>
                        <td className="py-3 px-2 text-right text-emerald-700 dark:text-emerald-300">{besarProfile?.totalProteinGram}g</td>
                        <td className="py-3 px-2 text-right border-r border-purple-200 dark:border-purple-800 text-emerald-600 dark:text-emerald-400">{kecilProfile?.totalProteinGram}g</td>
                        <td className="py-3 px-2 text-right text-amber-700 dark:text-amber-300">{besarProfile?.totalLemakGram}g</td>
                        <td className="py-3 px-2 text-right border-r border-purple-200 dark:border-purple-800 text-amber-600 dark:text-amber-400">{kecilProfile?.totalLemakGram}g</td>
                        <td className="py-3 px-2 text-right text-blue-700 dark:text-blue-300">{besarProfile?.totalKarbohidratGram}g</td>
                        <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">{kecilProfile?.totalKarbohidratGram}g</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Evaluasi Gizi & Rekomendasi */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Catatan & Evaluasi Ahli Gizi:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeProfile?.rekomendasi || giziData?.rekomendasi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* TAB 3: INFORMASI FOOD COST MENU (LINKED WITH PO HARIAN) */}
      {/* ========================================================= */}
      {activeTab === 'food-cost' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-200">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  Food Cost & Rincian Belanja Dihitung per Klasifikasi Porsi (Besar & Kecil)
                </div>
                <h2 className="text-xl font-black">
                  {foodCostData?.namaMenuHarian || dailyMenu.namaMenuHarian || 'Menu Makan Bergizi Gratis (MBG)'}
                </h2>
                <p className="text-xs text-emerald-200">
                  No. PO Belanja: <span className="font-mono font-bold text-white">{foodCostData?.poNumber}</span> • Penerima Manfaat: <span className="font-bold text-white">{(foodCostData?.jumlahPenerimaManfaat || dailyMenu.jumlahPenerimaManfaat || 0).toLocaleString('id-ID')} Orang</span> • Alokasi Porsi: <span className="font-bold text-white">Besar {(foodCostData?.porsiBesar || dailyMenu.porsiBesar || 0).toLocaleString('id-ID')} | Kecil {(foodCostData?.porsiKecil || dailyMenu.porsiKecil || 0).toLocaleString('id-ID')} | Total {(foodCostData?.totalJumlahPorsi || dailyMenu.totalJumlahPorsi || 0).toLocaleString('id-ID')} Porsi</span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  {foodCostData?.statusBiaya || 'Efisien / Surplus'}
                </span>

                <button
                  onClick={handlePrint}
                  className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Food Cost
                </button>
              </div>
            </div>
          </div>

          {/* Sub-selector for Food Cost Portions */}
          <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tampilan Pembagian Food Cost:</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFoodCostPortionTab('semua')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    foodCostPortionTab === 'semua'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Semua Alokasi (Besar & Kecil)
                </button>
                <button
                  type="button"
                  onClick={() => setFoodCostPortionTab('besar')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    foodCostPortionTab === 'besar'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Rincian Porsi Besar ({(foodCostData?.porsiBesar || dailyMenu.porsiBesar || 0).toLocaleString('id-ID')} Porsi)
                </button>
                <button
                  type="button"
                  onClick={() => setFoodCostPortionTab('kecil')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    foodCostPortionTab === 'kecil'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Rincian Porsi Kecil ({(foodCostData?.porsiKecil || dailyMenu.porsiKecil || 0).toLocaleString('id-ID')} Porsi)
                </button>
              </div>
            </div>

            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Alokasi bahan baku & belanja PO dihitung proporsional sesuai standar porsi BGN
            </span>
          </div>

          {/* Food Cost Financial Metrics - Divided into Porsi Besar & Porsi Kecil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Food Cost Porsi Besar */}
            <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Food Cost Porsi Besar</span>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200">
                  {(foodCostData?.porsiBesar || 0).toLocaleString('id-ID')} Porsi
                </span>
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                Rp {foodCostData?.porsiBesarDetail?.foodCostPerPorsi?.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">/ porsi</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                <div className="flex justify-between">
                  <span>Total Alokasi Biaya:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Rp {foodCostData?.porsiBesarDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Plafon Rp 11.000:</span>
                  <span>Surplus Rp {foodCostData?.porsiBesarDetail?.selisihEfisiensi?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Food Cost Porsi Kecil */}
            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Food Cost Porsi Kecil</span>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200">
                  {(foodCostData?.porsiKecil || 0).toLocaleString('id-ID')} Porsi
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                Rp {foodCostData?.porsiKecilDetail?.foodCostPerPorsi?.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">/ porsi</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                <div className="flex justify-between">
                  <span>Total Alokasi Biaya:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Rp {foodCostData?.porsiKecilDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Plafon Rp 8.000:</span>
                  <span>Surplus Rp {foodCostData?.porsiKecilDetail?.selisihEfisiensi?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Realisasi Belanja PO */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Belanja PO Harian</span>
                <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {(foodCostData?.totalJumlahPorsi || 0).toLocaleString('id-ID')} Total Porsi
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Rp {foodCostData?.totalBelanjaPO?.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>Rata-Rata Gabungan:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Rp {foodCostData?.foodCostPerPorsi?.toLocaleString('id-ID')} / porsi
                </span>
              </div>
            </div>

            {/* Card 4: Total Efisiensi SPPG */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 shadow-xs bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Efisiensi / Penghematan</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                Rp {foodCostData?.selisihEfisiensi?.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1">
                {foodCostData?.persentaseFoodCost}% realisasi dari batas pagu anggaran
              </div>
            </div>
          </div>

          {/* Tabel Rincian Belanja Bahan Baku dari PO Harian (Dibagi Porsi Besar & Porsi Kecil) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                {foodCostPortionTab === 'semua' && 'Rincian Belanja Bahan Baku PO: Pembagian Porsi Besar & Porsi Kecil'}
                {foodCostPortionTab === 'besar' && `Rincian Belanja Bahan Baku PO: Alokasi Porsi Besar (${(foodCostData?.porsiBesar || 0).toLocaleString('id-ID')} Porsi)`}
                {foodCostPortionTab === 'kecil' && `Rincian Belanja Bahan Baku PO: Alokasi Porsi Kecil (${(foodCostData?.porsiKecil || 0).toLocaleString('id-ID')} Porsi)`}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Sesuai Purchase Order SPPG Hafshawaty 2
              </span>
            </div>

            {/* TABEL 1: SEMUA ALOKASI (KOMPARASI LENGKAP PORSI BESAR & KECIL) */}
            {foodCostPortionTab === 'semua' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                      <th rowSpan={2} className="py-3 px-3 border-r border-slate-200 dark:border-slate-700">No</th>
                      <th rowSpan={2} className="py-3 px-3 border-r border-slate-200 dark:border-slate-700">Nama Bahan Baku</th>
                      <th rowSpan={2} className="py-3 px-3 border-r border-slate-200 dark:border-slate-700">Kategori</th>
                      <th rowSpan={2} className="py-3 px-3 text-right border-r border-slate-200 dark:border-slate-700">Harga (Rp/Kg)</th>
                      <th colSpan={2} className="py-2 px-2 text-center bg-slate-100 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700">Total PO Harian</th>
                      <th colSpan={3} className="py-2 px-2 text-center bg-blue-50 dark:bg-blue-950/40 border-r border-slate-200 dark:border-slate-700 text-blue-900 dark:text-blue-300">
                        Alokasi Porsi Besar ({(foodCostData?.porsiBesar || 0).toLocaleString('id-ID')} Porsi)
                      </th>
                      <th colSpan={3} className="py-2 px-2 text-center bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">
                        Alokasi Porsi Kecil ({(foodCostData?.porsiKecil || 0).toLocaleString('id-ID')} Porsi)
                      </th>
                    </tr>
                    <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-1.5 px-2 text-right">Kebutuhan (Kg)</th>
                      <th className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-700">Total (Rp)</th>
                      <th className="py-1.5 px-2 text-right text-blue-700 dark:text-blue-300">Kg</th>
                      <th className="py-1.5 px-2 text-right text-blue-700 dark:text-blue-300">Biaya (Rp)</th>
                      <th className="py-1.5 px-2 text-right text-blue-700 dark:text-blue-300 border-r border-slate-200 dark:border-slate-700">/Porsi</th>
                      <th className="py-1.5 px-2 text-right text-amber-700 dark:text-amber-300">Kg</th>
                      <th className="py-1.5 px-2 text-right text-amber-700 dark:text-amber-300">Biaya (Rp)</th>
                      <th className="py-1.5 px-2 text-right text-amber-700 dark:text-amber-300">/Porsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {foodCostData?.rincianBahanPO && foodCostData.rincianBahanPO.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-400 border-r border-slate-100 dark:border-slate-800">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">{item.namaBahan}</td>
                        <td className="py-2.5 px-3 font-medium text-emerald-700 dark:text-emerald-400 border-r border-slate-100 dark:border-slate-800">{item.kategori}</td>
                        <td className="py-2.5 px-3 text-right font-medium border-r border-slate-100 dark:border-slate-800">Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                        
                        {/* Total PO */}
                        <td className="py-2.5 px-2 text-right font-semibold">{item.kebutuhanKg} Kg</td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                          Rp {item.totalBiaya.toLocaleString('id-ID')}
                        </td>

                        {/* Porsi Besar */}
                        <td className="py-2.5 px-2 text-right text-blue-700 dark:text-blue-300 font-medium">{item.kebutuhanKgBesar} Kg</td>
                        <td className="py-2.5 px-2 text-right font-bold text-blue-700 dark:text-blue-300">Rp {item.biayaBesar.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-blue-600 border-r border-slate-100 dark:border-slate-800">Rp {item.biayaPerPorsiBesar.toLocaleString('id-ID')}</td>

                        {/* Porsi Kecil */}
                        <td className="py-2.5 px-2 text-right text-amber-700 dark:text-amber-300 font-medium">{item.kebutuhanKgKecil} Kg</td>
                        <td className="py-2.5 px-2 text-right font-bold text-amber-700 dark:text-amber-300">Rp {item.biayaKecil.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-amber-600">Rp {item.biayaPerPorsiKecil.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-50 dark:bg-emerald-950/40 border-t-2 border-emerald-300 dark:border-emerald-800 font-extrabold text-slate-900 dark:text-slate-100">
                      <td colSpan={4} className="py-3 px-3 uppercase text-emerald-900 dark:text-emerald-300 border-r border-emerald-200 dark:border-emerald-800">
                        Total Realisasi Belanja Bahan PO
                      </td>
                      <td className="py-3 px-2 text-right font-bold">
                        {foodCostData?.rincianBahanPO?.reduce((s, i) => s + i.kebutuhanKg, 0).toFixed(1)} Kg
                      </td>
                      <td className="py-3 px-2 text-right text-slate-900 dark:text-white text-sm border-r border-emerald-200 dark:border-emerald-800 font-black">
                        Rp {foodCostData?.totalBelanjaPO?.toLocaleString('id-ID')}
                      </td>
                      
                      {/* Subtotal Porsi Besar */}
                      <td className="py-3 px-2 text-right text-blue-800 dark:text-blue-300">
                        {foodCostData?.rincianBahanPO?.reduce((s, i) => s + i.kebutuhanKgBesar, 0).toFixed(1)} Kg
                      </td>
                      <td className="py-3 px-2 text-right text-blue-800 dark:text-blue-300 text-sm font-black">
                        Rp {foodCostData?.porsiBesarDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-2 text-right text-blue-700 dark:text-blue-300 text-sm font-black border-r border-emerald-200 dark:border-emerald-800">
                        Rp {foodCostData?.porsiBesarDetail?.foodCostPerPorsi?.toLocaleString('id-ID')}
                      </td>

                      {/* Subtotal Porsi Kecil */}
                      <td className="py-3 px-2 text-right text-amber-800 dark:text-amber-300">
                        {foodCostData?.rincianBahanPO?.reduce((s, i) => s + i.kebutuhanKgKecil, 0).toFixed(1)} Kg
                      </td>
                      <td className="py-3 px-2 text-right text-amber-800 dark:text-amber-300 text-sm font-black">
                        Rp {foodCostData?.porsiKecilDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-2 text-right text-amber-700 dark:text-amber-300 text-sm font-black">
                        Rp {foodCostData?.porsiKecilDetail?.foodCostPerPorsi?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* TABEL 2: FOKUS PORSI BESAR */}
            {foodCostPortionTab === 'besar' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">No</th>
                      <th className="py-3 px-3">Nama Bahan Baku</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3 text-right">Harga Satuan (Rp)</th>
                      <th className="py-3 px-3 text-right">Kebutuhan Porsi Besar (Kg)</th>
                      <th className="py-3 px-3 text-right">Total Biaya Porsi Besar (Rp)</th>
                      <th className="py-3 px-3 text-right">Biaya / Porsi Besar (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {foodCostData?.rincianBahanPO && foodCostData.rincianBahanPO.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{item.namaBahan}</td>
                        <td className="py-2.5 px-3 font-medium text-blue-700 dark:text-blue-300">{item.kategori}</td>
                        <td className="py-2.5 px-3 text-right font-medium">Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-800 dark:text-blue-300">{item.kebutuhanKgBesar} Kg</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">Rp {item.biayaBesar.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-black text-blue-600">Rp {item.biayaPerPorsiBesar.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-100/60 dark:bg-blue-950/60 border-t-2 border-blue-300 dark:border-blue-800 font-extrabold text-blue-950 dark:text-blue-100">
                      <td colSpan={4} className="py-3 px-3 uppercase text-blue-900 dark:text-blue-200">
                        Total Alokasi Belanja Porsi Besar ({(foodCostData?.porsiBesar || 0).toLocaleString('id-ID')} Porsi)
                      </td>
                      <td className="py-3 px-3 text-right font-black text-blue-900 dark:text-blue-200">
                        {foodCostData?.rincianBahanPO?.reduce((s, i) => s + i.kebutuhanKgBesar, 0).toFixed(1)} Kg
                      </td>
                      <td className="py-3 px-3 text-right text-blue-950 dark:text-white text-sm font-black">
                        Rp {foodCostData?.porsiBesarDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right text-blue-700 dark:text-blue-300 text-sm font-black">
                        Rp {foodCostData?.porsiBesarDetail?.foodCostPerPorsi?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* TABEL 3: FOKUS PORSI KECIL */}
            {foodCostPortionTab === 'kecil' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">No</th>
                      <th className="py-3 px-3">Nama Bahan Baku</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3 text-right">Harga Satuan (Rp)</th>
                      <th className="py-3 px-3 text-right">Kebutuhan Porsi Kecil (Kg)</th>
                      <th className="py-3 px-3 text-right">Total Biaya Porsi Kecil (Rp)</th>
                      <th className="py-3 px-3 text-right">Biaya / Porsi Kecil (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {foodCostData?.rincianBahanPO && foodCostData.rincianBahanPO.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{item.namaBahan}</td>
                        <td className="py-2.5 px-3 font-medium text-amber-700 dark:text-amber-300">{item.kategori}</td>
                        <td className="py-2.5 px-3 text-right font-medium">Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-800 dark:text-amber-300">{item.kebutuhanKgKecil} Kg</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">Rp {item.biayaKecil.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-600">Rp {item.biayaPerPorsiKecil.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-100/60 dark:bg-amber-950/60 border-t-2 border-amber-300 dark:border-amber-800 font-extrabold text-amber-950 dark:text-amber-100">
                      <td colSpan={4} className="py-3 px-3 uppercase text-amber-900 dark:text-amber-200">
                        Total Alokasi Belanja Porsi Kecil ({(foodCostData?.porsiKecil || 0).toLocaleString('id-ID')} Porsi)
                      </td>
                      <td className="py-3 px-3 text-right font-black text-amber-900 dark:text-amber-200">
                        {foodCostData?.rincianBahanPO?.reduce((s, i) => s + i.kebutuhanKgKecil, 0).toFixed(1)} Kg
                      </td>
                      <td className="py-3 px-3 text-right text-amber-950 dark:text-white text-sm font-black">
                        Rp {foodCostData?.porsiKecilDetail?.totalAlokasiBiaya?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right text-amber-700 dark:text-amber-300 text-sm font-black">
                        Rp {foodCostData?.porsiKecilDetail?.foodCostPerPorsi?.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MASTER MENU & KANDUNGAN GIZI (CATALOG DATABASE) */}
      {/* ========================================================= */}
      {activeTab === 'master' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari menu atau standar..."
                  value={masterSearch}
                  onChange={(e) => setMasterSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none w-52"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={masterCategoryFilter}
                  onChange={(e) => setMasterCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Makanan Pokok">Makanan Pokok</option>
                  <option value="Lauk Hewani">Lauk Hewani</option>
                  <option value="Lauk Nabati">Lauk Nabati</option>
                  <option value="Sayuran">Sayuran</option>
                  <option value="Buah">Buah</option>
                  <option value="Ekstra / Minuman">Ekstra / Minuman</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalItem({
                    namaMenu: '',
                    kategori: 'Makanan Pokok',
                    porsiGram: 100,
                    energiKkal: 150,
                    proteinGram: 5,
                    lemakGram: 2,
                    karbohidratGram: 30,
                    seratGram: 1.5,
                    kalsiumMg: 20,
                    zatBesiMg: 1,
                    estimasiBiayaPorsi: 2000,
                    standarKecukupan: 'Standar TKPI Kemenkes RI',
                    keterangan: ''
                  });
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Tambah Menu Baru
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Katalog
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Katalog Master Menu & Kandungan Gizi (Standar TKPI Kemenkes RI)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Kode</th>
                    <th className="py-3 px-3">Nama Menu Hidangan</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-right">Porsi (g)</th>
                    <th className="py-3 px-3 text-right">Energi (kkal)</th>
                    <th className="py-3 px-3 text-right">Protein (g)</th>
                    <th className="py-3 px-3 text-right">Lemak (g)</th>
                    <th className="py-3 px-3 text-right">Karbo (g)</th>
                    <th className="py-3 px-3 text-right">Est. Biaya / Porsi</th>
                    <th className="py-3 px-3 print:hidden text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredMasterItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-mono text-purple-600 font-semibold">{item.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {item.namaMenu}
                        {item.standarKecukupan && (
                          <span className="block text-[10px] text-slate-400 font-normal">{item.standarKecukupan}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{item.kategori}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{item.porsiGram} g</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-600">{item.energiKkal}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{item.proteinGram}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-600">{item.lemakGram}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-600">{item.karbohidratGram}</td>
                      <td className="py-2.5 px-3 text-right font-semibold">
                        Rp {item.estimasiBiayaPorsi?.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 print:hidden text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setModalItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded"
                            title="Edit Menu"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMasterItem(item.id, item.namaMenu)}
                            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 rounded"
                            title="Hapus Menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY OFFICIAL SIGNATURES BLOCK (Every Sub-Menu) */}
      <div className="hidden print:block pt-8 mt-6 border-t border-slate-300">
        <div className="flex justify-between items-start text-xs text-slate-800">
          <div className="text-center w-52">
            <p className="font-semibold">Diverifikasi & Dihitung Oleh,</p>
            <p className="font-bold">Ahli Gizi SPPG</p>
            <div className="h-16"></div>
            <p className="font-bold underline">Rina Wijaya, S.Gz., M.Gizi</p>
            <p className="text-[10px] text-slate-500">NIP. 19920814 201903 2 008</p>
          </div>

          <div className="text-center w-52">
            <p className="font-semibold">Penanggung Jawab Logistik,</p>
            <p className="font-bold">Petugas Pengadaan & PO</p>
            <div className="h-16"></div>
            <p className="font-bold underline">Muhammad Fadil, S.Akun</p>
            <p className="text-[10px] text-slate-500">NIP. 19940321 202012 1 005</p>
          </div>

          <div className="text-center w-52">
            <p className="font-semibold">Mengetahui & Menyetujui,</p>
            <p className="font-bold">Kepala SPPG HAFSHAWATY 2</p>
            <div className="h-16"></div>
            <p className="font-bold underline">Sri Rohayu, S.Pd</p>
            <p className="text-[10px] text-slate-500">Kepala Satuan Pelayanan</p>
          </div>
        </div>
      </div>

      {/* MODAL: ADD / EDIT MASTER MENU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                {modalItem.id ? 'Edit Master Menu Gizi' : 'Tambah Master Menu Gizi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Menu:</label>
                <input
                  type="text"
                  value={modalItem.namaMenu}
                  onChange={(e) => setModalItem({ ...modalItem, namaMenu: e.target.value })}
                  placeholder="Contoh: Ayam Goreng Lengkuas"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori:</label>
                  <select
                    value={modalItem.kategori}
                    onChange={(e) => setModalItem({ ...modalItem, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  >
                    <option value="Makanan Pokok">Makanan Pokok</option>
                    <option value="Lauk Hewani">Lauk Hewani</option>
                    <option value="Lauk Nabati">Lauk Nabati</option>
                    <option value="Sayuran">Sayuran</option>
                    <option value="Buah">Buah</option>
                    <option value="Ekstra / Minuman">Ekstra / Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Porsi Standar (Gram):</label>
                  <input
                    type="number"
                    value={modalItem.porsiGram}
                    onChange={(e) => setModalItem({ ...modalItem, porsiGram: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Energi (kkal):</label>
                  <input
                    type="number"
                    value={modalItem.energiKkal}
                    onChange={(e) => setModalItem({ ...modalItem, energiKkal: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none font-bold text-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Protein (g):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modalItem.proteinGram}
                    onChange={(e) => setModalItem({ ...modalItem, proteinGram: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lemak (g):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modalItem.lemakGram}
                    onChange={(e) => setModalItem({ ...modalItem, lemakGram: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none font-bold text-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Karbo (g):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modalItem.karbohidratGram}
                    onChange={(e) => setModalItem({ ...modalItem, karbohidratGram: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Serat (g):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modalItem.seratGram}
                    onChange={(e) => setModalItem({ ...modalItem, seratGram: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kalsium (mg):</label>
                  <input
                    type="number"
                    value={modalItem.kalsiumMg}
                    onChange={(e) => setModalItem({ ...modalItem, kalsiumMg: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Zat Besi (mg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={modalItem.zatBesiMg}
                    onChange={(e) => setModalItem({ ...modalItem, zatBesiMg: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estimasi Biaya per Porsi (Rp):</label>
                <input
                  type="number"
                  value={modalItem.estimasiBiayaPorsi}
                  onChange={(e) => setModalItem({ ...modalItem, estimasiBiayaPorsi: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Keterangan / Standar TKPI:</label>
                <input
                  type="text"
                  value={modalItem.standarKecukupan || ''}
                  onChange={(e) => setModalItem({ ...modalItem, standarKecukupan: e.target.value })}
                  placeholder="Standar Kemenkes RI TKPI..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMasterItem}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {saving ? 'Menyimpan...' : 'Simpan Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanPlogView;
