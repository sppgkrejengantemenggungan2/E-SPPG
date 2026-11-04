import React, { useState, useEffect, useRef } from 'react';
import { 
  Carrot, 
  ChefHat, 
  Boxes, 
  Sparkles, 
  Upload, 
  Camera, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Search, 
  Thermometer, 
  Refrigerator, 
  Scale, 
  Image as ImageIcon,
  Check,
  X,
  Share2,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { DivisiSubItemRecord, SubMenuId } from '../../types';
import logoImg from '../../assets/images/badan_gizi_logo_1785799692960.jpg';

interface DivisiSubMenuViewProps {
  initialDivisiId?: 'persiapan' | 'pengolahan' | 'pemorsian' | 'cuci_ompreng';
  onNavigate?: (path: string) => void;
}

interface SubMenuConfig {
  id: SubMenuId;
  title: string;
  category: 'bahan_rusak' | 'suhu_makanan' | 'suhu_ruang' | 'suhu_chiller' | 'ompreng' | 'sampah';
  targetGroup: string;
  icon: any;
  defaultStandar?: string;
}

export const DivisiSubMenuView: React.FC<DivisiSubMenuViewProps> = ({
  initialDivisiId = 'persiapan',
  onNavigate
}) => {
  const [activeDivisi, setActiveDivisi] = useState<'persiapan' | 'pengolahan' | 'pemorsian' | 'cuci_ompreng'>(initialDivisiId);
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Sub menus per division configuration matching user specifications
  const divisiMenus: Record<'persiapan' | 'pengolahan' | 'pemorsian' | 'cuci_ompreng', SubMenuConfig[]> = {
    persiapan: [
      { id: 'bahan_rusak_sayur', title: 'Input data bahan rusak (sayur)', category: 'bahan_rusak', targetGroup: 'Sayur', icon: Carrot },
      { id: 'bahan_rusak_lauk_hewani', title: 'Input data bahan rusak (lauk hewani)', category: 'bahan_rusak', targetGroup: 'Lauk Hewani', icon: Utensils },
      { id: 'bahan_rusak_buah', title: 'Input data bahan rusak (buah)', category: 'bahan_rusak', targetGroup: 'Buah', icon: Carrot },
      { id: 'suhu_ruang_tiga', title: 'Input data suhu ruang & upload foto ruang persiapan, ruang pengolahan dan ruang pemorsian', category: 'suhu_ruang', targetGroup: '3 Ruangan Dapur', icon: Thermometer, defaultStandar: '18°C - 24°C' },
      { id: 'suhu_chiller_freezer', title: 'Input data suhu ruang & upload foto Suhu Chiller 1, Suhu Chiller 2, Suhu Chiller 3, Suhu Chiller 4, Suhu Freezer 1 dan Suhu Freezer 2', category: 'suhu_chiller', targetGroup: 'Cold Storage (4 Chiller & 2 Freezer)', icon: Refrigerator, defaultStandar: 'Chiller 0-4°C, Freezer -18 s/d -20°C' }
    ],
    pengolahan: [
      { id: 'suhu_makanan_nasi', title: 'Input data & upload suhu makanan (nasi)', category: 'suhu_makanan', targetGroup: 'Nasi Matang', icon: Thermometer, defaultStandar: 'Minimal >60°C' },
      { id: 'suhu_makanan_lauk_hewani', title: 'Input data & upload suhu makanan (Lauk hewani)', category: 'suhu_makanan', targetGroup: 'Lauk Hewani', icon: Thermometer, defaultStandar: 'Minimal >65°C' },
      { id: 'suhu_makanan_lauk_nabati', title: 'Input data & upload suhu makanan (lauk nabati)', category: 'suhu_makanan', targetGroup: 'Lauk Nabati', icon: Thermometer, defaultStandar: 'Minimal >60°C' },
      { id: 'suhu_makanan_sayur', title: 'Input data & upload suhu makanan (sayur)', category: 'suhu_makanan', targetGroup: 'Sayur Matang', icon: Thermometer, defaultStandar: 'Minimal >60°C' },
      { id: 'suhu_makanan_buah', title: 'Input data & upload suhu makanan (buah)', category: 'suhu_makanan', targetGroup: 'Buah Potong / Utuh', icon: Thermometer, defaultStandar: 'Dingin Segar <10°C / Ruang' },
      { id: 'suhu_ruang_tiga', title: 'Input data suhu ruang & upload foto ruang persiapan, ruang pengolahan dan ruang pemorsian', category: 'suhu_ruang', targetGroup: '3 Ruangan Dapur', icon: Thermometer, defaultStandar: '18°C - 24°C' },
      { id: 'suhu_chiller_freezer', title: 'Input data suhu ruang & upload foto Suhu Chiller 1, Suhu Chiller 2, Suhu Chiller 3, Suhu Chiller 4, Suhu Freezer 1 dan Suhu Freezer 2', category: 'suhu_chiller', targetGroup: 'Cold Storage (4 Chiller & 2 Freezer)', icon: Refrigerator, defaultStandar: 'Chiller 0-4°C, Freezer -18 s/d -20°C' }
    ],
    pemorsian: [
      { id: 'suhu_makanan_nasi', title: 'Input data & upload suhu makanan (nasi)', category: 'suhu_makanan', targetGroup: 'Nasi Saat Pemorsian', icon: Thermometer, defaultStandar: 'Minimal >55°C' },
      { id: 'suhu_makanan_lauk_hewani', title: 'Input data & upload suhu makanan (lauk hewani)', category: 'suhu_makanan', targetGroup: 'Lauk Hewani', icon: Thermometer, defaultStandar: 'Minimal >60°C' },
      { id: 'suhu_makanan_lauk_nabati', title: 'Input data & upload suhu makanan (lauk nabati)', category: 'suhu_makanan', targetGroup: 'Lauk Nabati', icon: Thermometer, defaultStandar: 'Minimal >55°C' },
      { id: 'suhu_makanan_sayur', title: 'Input data & upload suhu makanan (sayur)', category: 'suhu_makanan', targetGroup: 'Sayur Saat Pemorsian', icon: Thermometer, defaultStandar: 'Minimal >55°C' },
      { id: 'suhu_makanan_buah', title: 'Input data & upload suhu makanan (buah)', category: 'suhu_makanan', targetGroup: 'Buah', icon: Thermometer, defaultStandar: 'Dingin Segar <10°C / Ruang' },
      { id: 'suhu_ruang_tiga', title: 'Input data suhu ruang & upload foto ruang persiapan, ruang pengolahan dan ruang pemorsian', category: 'suhu_ruang', targetGroup: '3 Ruangan Dapur', icon: Thermometer, defaultStandar: '18°C - 24°C' },
      { id: 'suhu_chiller_freezer', title: 'Input data suhu ruang & upload foto Suhu Chiller 1, Suhu Chiller 2, Suhu Chiller 3, Suhu Chiller 4, Suhu Freezer 1 dan Suhu Freezer 2', category: 'suhu_chiller', targetGroup: 'Cold Storage (4 Chiller & 2 Freezer)', icon: Refrigerator, defaultStandar: 'Chiller 0-4°C, Freezer -18 s/d -20°C' },
      { id: 'foto_ompreng_porsi_kecil', title: 'Upload Foto ompreng porsi kecil', category: 'ompreng', targetGroup: 'Porsi Kecil (PAUD / TK / SD 1-3)', icon: Boxes, defaultStandar: 'Gramatur & Komposisi Lengkap' },
      { id: 'foto_ompreng_porsi_besar', title: 'Upload foto ompreng porsi besar', category: 'ompreng', targetGroup: 'Porsi Besar (SD 4-6 / SMP / Guru)', icon: Boxes, defaultStandar: 'Gramatur & Komposisi Lengkap' }
    ],
    cuci_ompreng: [
      { id: 'foto_sampah_nasi', title: 'Input data & upload Foto sampah (nasi)', category: 'sampah', targetGroup: 'Sampah Nasi', icon: Sparkles },
      { id: 'foto_sampah_lauk_hewani', title: 'Input data & upload Foto sampah (lauk hewani)', category: 'sampah', targetGroup: 'Sampah Lauk Hewani', icon: Sparkles },
      { id: 'foto_sampah_lauk_nabati', title: 'Input data & upload Foto sampah (lauk nabati)', category: 'sampah', targetGroup: 'Sampah Lauk Nabati', icon: Sparkles },
      { id: 'foto_sampah_sayur', title: 'Input data & upload Foto sampah (sayur)', category: 'sampah', targetGroup: 'Sampah Sayur', icon: Sparkles },
      { id: 'foto_sampah_buah', title: 'Input data & upload Foto sampah (buah)', category: 'sampah', targetGroup: 'Sampah Buah', icon: Sparkles }
    ]
  };

  const activeSubMenuList = divisiMenus[activeDivisi] || [];
  const [activeSubMenuId, setActiveSubMenuId] = useState<SubMenuId>(activeSubMenuList[0]?.id || 'bahan_rusak_sayur');

  // Sync active sub-menu when division changes
  useEffect(() => {
    if (activeSubMenuList.length > 0 && !activeSubMenuList.find(m => m.id === activeSubMenuId)) {
      setActiveSubMenuId(activeSubMenuList[0].id);
    }
  }, [activeDivisi]);

  const currentSubMenu = activeSubMenuList.find(m => m.id === activeSubMenuId) || activeSubMenuList[0];

  // Records state
  const [subItemRecords, setSubItemRecords] = useState<DivisiSubItemRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Data inputs
  const [formData, setFormData] = useState({
    jamInput: new Date().toTimeString().slice(0, 5),
    petugas: 'Petugas SPPG',
    catatan: '',
    // Bahan rusak
    namaBahan: '',
    beratRusakKg: '',
    penyebabRusak: 'Busuk / Layu saat sortir',
    tindakanPenanganan: 'Dimusnahkan',
    // Suhu makanan
    namaMenu: '',
    suhuCelcius: '',
    statusSuhu: 'Sesuai Standar',
    // Suhu 3 Ruang
    suhuRuangPersiapan: '',
    fotoRuangPersiapan: '',
    suhuRuangPengolahan: '',
    fotoRuangPengolahan: '',
    suhuRuangPemorsian: '',
    fotoRuangPemorsian: '',
    // Suhu 4 Chiller & 2 Freezer
    suhuChiller1: '',
    fotoChiller1: '',
    suhuChiller2: '',
    fotoChiller2: '',
    suhuChiller3: '',
    fotoChiller3: '',
    suhuChiller4: '',
    fotoChiller4: '',
    suhuFreezer1: '',
    fotoFreezer1: '',
    suhuFreezer2: '',
    fotoFreezer2: '',
    // Ompreng
    beratOmprengGram: '',
    statusKelayakanOmpreng: 'Lolos QC',
    fotoOmpreng: '',
    // Sampah
    beratSampahKg: '',
    estimasiPersenSisa: '5',
    penyebabSisa: 'Porsi berlebih / siswa kenyang',
    fotoSampah: '',
    // Common photo
    fotoBukti: ''
  });

  // Lightbox preview modal state
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Show Toast
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch items from backend
  const fetchSubItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/tugas-divisi/sub-items?tanggal=${selectedDate}&divisiId=${activeDivisi}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSubItemRecords(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sub-items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubItems();
  }, [selectedDate, activeDivisi]);

  // Image Compressor Helper
  const handleCompressAndSetImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Add timestamp watermark
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(0, height - 36, width, 36);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Inter, sans-serif';
          const stamp = `SPPG HAFSHAWATY2 • ${selectedDate} ${new Date().toLocaleTimeString()} • ${currentSubMenu.title}`;
          ctx.fillText(stamp, 12, height - 14);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
          callback(compressedBase64);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Submit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<DivisiSubItemRecord> = {
        id: editingId || undefined,
        tanggal: selectedDate,
        divisiId: activeDivisi,
        subMenuId: activeSubMenuId,
        subMenuJudul: currentSubMenu.title,
        jamInput: formData.jamInput,
        petugas: formData.petugas || 'Petugas SPPG',
        catatan: formData.catatan,
        fotoBukti: formData.fotoBukti || undefined,
        standarSuhu: currentSubMenu.defaultStandar
      };

      if (currentSubMenu.category === 'bahan_rusak') {
        payload.namaBahan = formData.namaBahan;
        payload.beratRusakKg = parseFloat(formData.beratRusakKg) || 0;
        payload.penyebabRusak = formData.penyebabRusak;
        payload.tindakanPenanganan = formData.tindakanPenanganan;
      } else if (currentSubMenu.category === 'suhu_makanan') {
        payload.namaMenu = formData.namaMenu || currentSubMenu.targetGroup;
        payload.suhuCelcius = parseFloat(formData.suhuCelcius) || 0;
        payload.statusSuhu = formData.statusSuhu as any;
      } else if (currentSubMenu.category === 'suhu_ruang') {
        payload.suhuRuangPersiapan = parseFloat(formData.suhuRuangPersiapan) || undefined;
        payload.fotoRuangPersiapan = formData.fotoRuangPersiapan || undefined;
        payload.suhuRuangPengolahan = parseFloat(formData.suhuRuangPengolahan) || undefined;
        payload.fotoRuangPengolahan = formData.fotoRuangPengolahan || undefined;
        payload.suhuRuangPemorsian = parseFloat(formData.suhuRuangPemorsian) || undefined;
        payload.fotoRuangPemorsian = formData.fotoRuangPemorsian || undefined;
      } else if (currentSubMenu.category === 'suhu_chiller') {
        payload.suhuChiller1 = parseFloat(formData.suhuChiller1) || undefined;
        payload.fotoChiller1 = formData.fotoChiller1 || undefined;
        payload.suhuChiller2 = parseFloat(formData.suhuChiller2) || undefined;
        payload.fotoChiller2 = formData.fotoChiller2 || undefined;
        payload.suhuChiller3 = parseFloat(formData.suhuChiller3) || undefined;
        payload.fotoChiller3 = formData.fotoChiller3 || undefined;
        payload.suhuChiller4 = parseFloat(formData.suhuChiller4) || undefined;
        payload.fotoChiller4 = formData.fotoChiller4 || undefined;
        payload.suhuFreezer1 = parseFloat(formData.suhuFreezer1) || undefined;
        payload.fotoFreezer1 = formData.fotoFreezer1 || undefined;
        payload.suhuFreezer2 = parseFloat(formData.suhuFreezer2) || undefined;
        payload.fotoFreezer2 = formData.fotoFreezer2 || undefined;
      } else if (currentSubMenu.category === 'ompreng') {
        payload.beratOmprengGram = parseFloat(formData.beratOmprengGram) || undefined;
        payload.statusKelayakanOmpreng = formData.statusKelayakanOmpreng as any;
        payload.fotoOmpreng = formData.fotoOmpreng || formData.fotoBukti || undefined;
      } else if (currentSubMenu.category === 'sampah') {
        payload.beratSampahKg = parseFloat(formData.beratSampahKg) || 0;
        payload.estimasiPersenSisa = parseFloat(formData.estimasiPersenSisa) || 0;
        payload.penyebabSisa = formData.penyebabSisa;
        payload.fotoSampah = formData.fotoSampah || formData.fotoBukti || undefined;
      }

      const res = await fetch('/api/v1/tugas-divisi/sub-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Data dan foto bukti berhasil disimpan & disinkronkan ke Cloud!', 'success');
        setIsFormOpen(false);
        setEditingId(null);
        fetchSubItems();
      } else {
        showToast(data.message || 'Gagal menyimpan data', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Terjadi kesalahan sistem', 'error');
    }
  };

  // Trigger Instant Sync
  const handleInstantSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/tugas-divisi/sub-items/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tanggal: selectedDate, divisiId: activeDivisi })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Sinkronisasi Cloud Berhasil! (${data.syncedCount || subItemRecords.length} data)`, 'success');
        fetchSubItems();
      } else {
        showToast('Gagal melakukan sinkronisasi cloud.', 'error');
      }
    } catch (err) {
      showToast('Gagal menghubungi server sinkronisasi.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete Sub Item
  const handleDeleteSubItem = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus catatan data ini?')) return;
    try {
      const res = await fetch(`/api/v1/tugas-divisi/sub-items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Data berhasil dihapus dari cloud database.', 'info');
        fetchSubItems();
      }
    } catch (err) {
      showToast('Gagal menghapus data.', 'error');
    }
  };

  // Filter items matching the active sub-menu
  const filteredSubItems = subItemRecords.filter(r => r.subMenuId === activeSubMenuId);

  // Trigger Formal Print
  const handlePrintDocument = () => {
    window.print();
  };

  // Open Form for New Entry
  const openNewEntryForm = () => {
    setEditingId(null);
    setFormData({
      jamInput: new Date().toTimeString().slice(0, 5),
      petugas: 'Petugas SPPG',
      catatan: '',
      namaBahan: '',
      beratRusakKg: '',
      penyebabRusak: 'Busuk / Layu saat sortir',
      tindakanPenanganan: 'Dimusnahkan',
      namaMenu: currentSubMenu.targetGroup,
      suhuCelcius: '',
      statusSuhu: 'Sesuai Standar',
      suhuRuangPersiapan: '20',
      fotoRuangPersiapan: '',
      suhuRuangPengolahan: '22',
      fotoRuangPengolahan: '',
      suhuRuangPemorsian: '19',
      fotoRuangPemorsian: '',
      suhuChiller1: '3.2',
      fotoChiller1: '',
      suhuChiller2: '2.8',
      fotoChiller2: '',
      suhuChiller3: '3.5',
      fotoChiller3: '',
      suhuChiller4: '3.0',
      fotoChiller4: '',
      suhuFreezer1: '-19.5',
      fotoFreezer1: '',
      suhuFreezer2: '-18.8',
      fotoFreezer2: '',
      beratOmprengGram: currentSubMenu.id === 'foto_ompreng_porsi_kecil' ? '320' : '450',
      statusKelayakanOmpreng: 'Lolos QC',
      fotoOmpreng: '',
      beratSampahKg: '1.2',
      estimasiPersenSisa: '4',
      penyebabSisa: 'Porsi kenyang / sisa siswa',
      fotoSampah: '',
      fotoBukti: ''
    });
    setIsFormOpen(true);
  };

  const divisiTitles = {
    persiapan: 'Tugas Div. Persiapan',
    pengolahan: 'Tugas Div. Pengolahan',
    pemorsian: 'Tugas Div. Pemorsian',
    cuci_ompreng: 'Tugas Div. Cuci Ompreng'
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border transition-all animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-900 border-emerald-700 text-emerald-100' 
            : toastMessage.type === 'info'
            ? 'bg-blue-900 border-blue-700 text-blue-100'
            : 'bg-rose-900 border-rose-700 text-rose-100'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-3 bg-slate-800 flex items-center justify-between text-xs text-slate-200">
              <span className="font-semibold">{lightboxImage.title}</span>
              <button onClick={() => setLightboxImage(null)} className="p-1 hover:bg-slate-700 rounded-lg">
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[75vh] overflow-auto">
              <img src={lightboxImage.url} alt={lightboxImage.title} className="max-h-[70vh] object-contain rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Printable Area - Only Visible during window.print() */}
      <div className="hidden print:block font-sans text-slate-900 p-4">
        <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo BGN" className="w-14 h-14 object-cover rounded-full" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">BADAN GIZI NASIONAL REPUBLIK INDONESIA</div>
              <h1 className="text-base font-extrabold uppercase text-slate-900">SPPG HAFSHAWATY2 PROBOLINGGO</h1>
              <p className="text-[10px] text-slate-600">Dokumen Kendali Mutu & Pelaksanaan Operasional Divisi Dapur MBG</p>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <div className="font-bold text-slate-900">FORM KENDALI RESMI</div>
            <div>Tanggal: {selectedDate}</div>
            <div>Divisi: {divisiTitles[activeDivisi]}</div>
          </div>
        </div>

        <div className="mb-4 bg-slate-100 p-2.5 rounded border border-slate-300 text-xs">
          <div className="font-bold uppercase text-slate-800">{currentSubMenu.title}</div>
          <div className="text-[11px] text-slate-600">Target/Spesifikasi: {currentSubMenu.targetGroup} {currentSubMenu.defaultStandar ? `(${currentSubMenu.defaultStandar})` : ''}</div>
        </div>

        <table className="w-full text-[11px] border-collapse border border-slate-400 mb-6">
          <thead>
            <tr className="bg-slate-200 text-left font-bold">
              <th className="border border-slate-400 p-2 w-8 text-center">No</th>
              <th className="border border-slate-400 p-2">Jam</th>
              <th className="border border-slate-400 p-2">Rincian / Parameter</th>
              <th className="border border-slate-400 p-2">Nilai / Ukuran / Status</th>
              <th className="border border-slate-400 p-2">Catatan / Tindakan</th>
              <th className="border border-slate-400 p-2">Petugas</th>
              <th className="border border-slate-400 p-2 w-28 text-center">Bukti Foto</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-slate-400 p-4 text-center text-slate-500 italic">
                  Belum ada data input tercatat untuk tanggal {selectedDate}
                </td>
              </tr>
            ) : (
              filteredSubItems.map((item, idx) => (
                <tr key={item.id} className="align-top">
                  <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-400 p-2">{item.jamInput}</td>
                  <td className="border border-slate-400 p-2">
                    <div className="font-semibold">{item.namaBahan || item.namaMenu || item.subMenuJudul}</div>
                    {item.penyebabRusak && <div className="text-[10px] text-slate-500">Penyebab: {item.penyebabRusak}</div>}
                    {item.penyebabSisa && <div className="text-[10px] text-slate-500">Penyebab Sisa: {item.penyebabSisa}</div>}
                  </td>
                  <td className="border border-slate-400 p-2">
                    {item.beratRusakKg !== undefined && <div>Berat: <strong>{item.beratRusakKg} kg</strong></div>}
                    {item.suhuCelcius !== undefined && <div>Suhu: <strong>{item.suhuCelcius}°C</strong> ({item.statusSuhu})</div>}
                    {item.beratOmprengGram !== undefined && <div>Berat: <strong>{item.beratOmprengGram} gr</strong> ({item.statusKelayakanOmpreng})</div>}
                    {item.beratSampahKg !== undefined && <div>Sampah: <strong>{item.beratSampahKg} kg</strong> (Estimasi sisa {item.estimasiPersenSisa}%)</div>}
                    {item.suhuRuangPersiapan !== undefined && (
                      <div className="text-[10px] space-y-0.5">
                        <div>Persiapan: {item.suhuRuangPersiapan}°C</div>
                        <div>Pengolahan: {item.suhuRuangPengolahan}°C</div>
                        <div>Pemorsian: {item.suhuRuangPemorsian}°C</div>
                      </div>
                    )}
                    {item.suhuChiller1 !== undefined && (
                      <div className="text-[9px] grid grid-cols-2 gap-x-2">
                        <div>Ch1: {item.suhuChiller1}°C</div>
                        <div>Ch2: {item.suhuChiller2}°C</div>
                        <div>Ch3: {item.suhuChiller3}°C</div>
                        <div>Ch4: {item.suhuChiller4}°C</div>
                        <div>Fr1: {item.suhuFreezer1}°C</div>
                        <div>Fr2: {item.suhuFreezer2}°C</div>
                      </div>
                    )}
                  </td>
                  <td className="border border-slate-400 p-2">
                    {item.tindakanPenanganan && <div>Tindakan: {item.tindakanPenanganan}</div>}
                    <div>{item.catatan || '-'}</div>
                  </td>
                  <td className="border border-slate-400 p-2">{item.petugas}</td>
                  <td className="border border-slate-400 p-1 text-center">
                    {(item.fotoBukti || item.fotoOmpreng || item.fotoSampah || item.fotoRuangPersiapan || item.fotoChiller1) ? (
                      <img 
                        src={item.fotoBukti || item.fotoOmpreng || item.fotoSampah || item.fotoRuangPersiapan || item.fotoChiller1} 
                        alt="Bukti Foto" 
                        className="w-20 h-14 object-cover mx-auto rounded border border-slate-300" 
                      />
                    ) : (
                      <span className="text-[9px] text-slate-400">Tidak ada</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Official Signature Blocks */}
        <div className="grid grid-cols-3 gap-6 text-center text-xs mt-8 pt-4">
          <div>
            <div className="text-slate-600 mb-12">Petugas Pelaksana Divisi,</div>
            <div className="font-bold border-b border-slate-600 pb-1 inline-block min-w-[140px]">( ................................ )</div>
            <div className="text-[10px] text-slate-500 mt-1">{divisiTitles[activeDivisi]}</div>
          </div>
          <div>
            <div className="text-slate-600 mb-12">Supervisor QC & Higiene,</div>
            <div className="font-bold border-b border-slate-600 pb-1 inline-block min-w-[140px]">( ................................ )</div>
            <div className="text-[10px] text-slate-500 mt-1">Pengawas Dapur SPPG</div>
          </div>
          <div>
            <div className="text-slate-600 mb-12">Kepala SPPG / Admin Penuh,</div>
            <div className="font-bold border-b border-slate-600 pb-1 inline-block min-w-[140px]">sppgkrejengantemenggungan2</div>
            <div className="text-[10px] text-slate-500 mt-1">NIP. SPPG-BGN-2026-001</div>
          </div>
        </div>
      </div>

      {/* Screen Interface */}
      <div className="print:hidden space-y-6">
        {/* Tier 1: 4 Divisional Main Menus */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { id: 'persiapan', title: 'Tugas Div. Persiapan', icon: Carrot, color: 'from-amber-500 to-orange-600', subCount: divisiMenus.persiapan.length },
            { id: 'pengolahan', title: 'Tugas Div. Pengolahan', icon: ChefHat, color: 'from-blue-600 to-indigo-700', subCount: divisiMenus.pengolahan.length },
            { id: 'pemorsian', title: 'Tugas Div. Pemorsian', icon: Boxes, color: 'from-emerald-500 to-teal-700', subCount: divisiMenus.pemorsian.length },
            { id: 'cuci_ompreng', title: 'Tugas Div. Cuci Ompreng', icon: Sparkles, color: 'from-cyan-500 to-blue-600', subCount: divisiMenus.cuci_ompreng.length }
          ].map((div) => {
            const IconComp = div.icon;
            const isActive = activeDivisi === div.id;
            return (
              <button
                key={div.id}
                onClick={() => {
                  setActiveDivisi(div.id as any);
                  onNavigate?.(`/tugas-divisi/${div.id}`);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group shadow-sm ${
                  isActive 
                    ? 'bg-white dark:bg-slate-900 border-blue-500/80 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${div.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {div.subCount} Sub Menu
                  </span>
                </div>
                <div className={`text-xs sm:text-sm font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {div.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span>Klik untuk pilih sub menu</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Tier 2: Sub-Menus Filter Carousel / Horizontal Nav */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sub Menu Pilihan: {divisiTitles[activeDivisi]}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {currentSubMenu.title}
              </h2>
            </div>

            {/* Date Picker & Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-semibold cursor-pointer"
                />
              </div>

              {/* Tombol Sinkronisasi */}
              <button
                onClick={handleInstantSync}
                disabled={isSyncing}
                className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                title="Sinkronisasi Seluruh Data Sub Menu ke Cloud Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}</span>
              </button>

              {/* Tombol Cetak Dokumen */}
              <button
                onClick={handlePrintDocument}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Cetak Berita Acara & Lembar Kendali Resmi"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Dokumen</span>
              </button>

              {/* Tombol Input Data Baru */}
              <button
                onClick={openNewEntryForm}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Data Baru</span>
              </button>
            </div>
          </div>

          {/* Sub Menu Badges List */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activeSubMenuList.map((sub, index) => {
              const IconComp = sub.icon;
              const isSelected = activeSubMenuId === sub.id;
              const countForSub = subItemRecords.filter(r => r.subMenuId === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubMenuId(sub.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="truncate max-w-[220px] sm:max-w-xs">{sub.title}</span>
                  {countForSub > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                      isSelected ? 'bg-white text-blue-700' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}>
                      {countForSub}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Form: Input Data & Upload Foto Bukti */}
        {isFormOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Form Input: {currentSubMenu.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Lengkapi data dan upload foto bukti fisik untuk validasi kendali mutu SPPG.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                {/* Meta Jam & Petugas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jam Pencatatan</label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        required
                        value={formData.jamInput}
                        onChange={(e) => setFormData({ ...formData, jamInput: e.target.value })}
                        className="bg-transparent focus:outline-none w-full font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Petugas Pelaksana</label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Nama petugas..."
                        value={formData.petugas}
                        onChange={(e) => setFormData({ ...formData, petugas: e.target.value })}
                        className="bg-transparent focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-menu Category Specific Inputs */}
                {currentSubMenu.category === 'bahan_rusak' && (
                  <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                    <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                      <Carrot className="w-4 h-4" />
                      <span>Data Bahan Rusak ({currentSubMenu.targetGroup})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Komoditas / Bahan</label>
                        <input
                          type="text"
                          required
                          placeholder={currentSubMenu.targetGroup === 'Sayur' ? 'Misal: Sawi Hijau, Wortel...' : currentSubMenu.targetGroup === 'Lauk Hewani' ? 'Misal: Daging Ayam, Ikan...' : 'Misal: Pisang Ambon, Semangka...'}
                          value={formData.namaBahan}
                          onChange={(e) => setFormData({ ...formData, namaBahan: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Berat Rusak (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="Misal: 1.5"
                          value={formData.beratRusakKg}
                          onChange={(e) => setFormData({ ...formData, beratRusakKg: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Penyebab / Kondisi Kerusakan</label>
                        <input
                          type="text"
                          value={formData.penyebabRusak}
                          onChange={(e) => setFormData({ ...formData, penyebabRusak: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tindakan Penanganan</label>
                        <select
                          value={formData.tindakanPenanganan}
                          onChange={(e) => setFormData({ ...formData, tindakanPenanganan: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        >
                          <option value="Dimusnahkan">Dimusnahkan (Dibuang ke Tempat Sampah)</option>
                          <option value="Retur Supplier">Retur ke Supplier Pengirim</option>
                          <option value="Disisihkan">Disisihkan / Ditolak saat QC</option>
                        </select>
                      </div>
                    </div>

                    {/* Perintah Upload Foto Bukti Bahan Rusak */}
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                      <label className="block font-semibold text-amber-900 dark:text-amber-200 mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Perintah Upload Foto Bukti Bahan Rusak ({currentSubMenu.targetGroup})</span>
                          <span className="text-rose-500">*</span>
                        </span>
                        {formData.fotoBukti && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Foto Terlampir
                          </span>
                        )}
                      </label>

                      {formData.fotoBukti ? (
                        <div className="relative rounded-xl overflow-hidden border border-amber-300 dark:border-amber-800 bg-black/5 group">
                          <img src={formData.fotoBukti} alt="Bukti Bahan Rusak" className="w-full h-36 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: formData.fotoBukti, title: `Bukti Bahan Rusak: ${formData.namaBahan || currentSubMenu.targetGroup}` })}
                              className="p-1.5 bg-white/95 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-white shadow cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Perbesar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoBukti: '' })}
                              className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-rose-500 shadow cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Ganti Foto</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-amber-300 dark:border-amber-800/80 rounded-xl cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors text-center bg-white/60 dark:bg-slate-900/40">
                          <Camera className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-1" />
                          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                            Ambil Foto Kamera / Pilih File Bukti Bahan Rusak
                          </span>
                          <span className="text-[10px] text-amber-700/70 dark:text-amber-400/70 mt-0.5">
                            Format JPG/PNG • Otomatis kompresi & watermark resmi SPPG
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCompressAndSetImage(file, (b64) => setFormData({ ...formData, fotoBukti: b64 }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Suhu Makanan Single */}
                {currentSubMenu.category === 'suhu_makanan' && (
                  <div className="space-y-3 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40">
                    <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 text-xs">
                      <Thermometer className="w-4 h-4" />
                      <span>Ukur Suhu Makanan ({currentSubMenu.targetGroup})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Menu Masakan</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Ayam Kecap, Sop Sayur..."
                          value={formData.namaMenu}
                          onChange={(e) => setFormData({ ...formData, namaMenu: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Suhu Terukur (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="Misal: 68.5"
                          value={formData.suhuCelcius}
                          onChange={(e) => setFormData({ ...formData, suhuCelcius: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Status Kepatuhan Suhu</label>
                        <select
                          value={formData.statusSuhu}
                          onChange={(e) => setFormData({ ...formData, statusSuhu: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        >
                          <option value="Sesuai Standar">Sesuai Standar (&gt;60°C)</option>
                          <option value="Di Bawah Standar">Di Bawah Standar (Perlu Dipanaskan)</option>
                          <option value="Perlu Penanganan">Perlu Penanganan Khusus</option>
                        </select>
                      </div>
                    </div>

                    {/* Perintah Upload Foto Pengukuran Suhu Makanan */}
                    <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                      <label className="block font-semibold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Perintah Upload Foto Pengukuran Suhu Makanan ({currentSubMenu.targetGroup})</span>
                          <span className="text-rose-500">*</span>
                        </span>
                        {formData.fotoBukti && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Foto Terlampir
                          </span>
                        )}
                      </label>

                      {formData.fotoBukti ? (
                        <div className="relative rounded-xl overflow-hidden border border-blue-300 dark:border-blue-800 bg-black/5 group">
                          <img src={formData.fotoBukti} alt="Bukti Suhu Makanan" className="w-full h-36 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: formData.fotoBukti, title: `Bukti Suhu: ${formData.namaMenu || currentSubMenu.targetGroup} (${formData.suhuCelcius}°C)` })}
                              className="p-1.5 bg-white/95 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-white shadow cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Perbesar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoBukti: '' })}
                              className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-rose-500 shadow cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Ganti Foto</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-blue-300 dark:border-blue-800/80 rounded-xl cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors text-center bg-white/60 dark:bg-slate-900/40">
                          <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
                          <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                            Ambil Foto Kamera / Unggah Bukti Termometer ({currentSubMenu.targetGroup})
                          </span>
                          <span className="text-[10px] text-blue-700/70 dark:text-blue-400/70 mt-0.5">
                            Foto jarum/display digital termometer tusuk • Kompresi otomatis SPPG
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCompressAndSetImage(file, (b64) => setFormData({ ...formData, fotoBukti: b64 }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Suhu 3 Ruang (Persiapan, Pengolahan, Pemorsian) */}
                {currentSubMenu.category === 'suhu_ruang' && (
                  <div className="space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4" />
                        <span>Suhu & Dokumentasi 3 Ruangan Dapur (Standar 18°C - 24°C)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Ruang Persiapan */}
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200">1. Ruang Persiapan</div>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Suhu (°C)..."
                          value={formData.suhuRuangPersiapan}
                          onChange={(e) => setFormData({ ...formData, suhuRuangPersiapan: e.target.value })}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                        />
                        <div className="text-[10px] text-slate-400">Upload Foto Bukti:</div>
                        {formData.fotoRuangPersiapan ? (
                          <div className="relative">
                            <img src={formData.fotoRuangPersiapan} alt="Foto Persiapan" className="w-full h-20 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoRuangPersiapan: '' })}
                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center p-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <Camera className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Pilih/Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCompressAndSetImage(f, (b64) => setFormData({ ...formData, fotoRuangPersiapan: b64 }));
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Ruang Pengolahan */}
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200">2. Ruang Pengolahan</div>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Suhu (°C)..."
                          value={formData.suhuRuangPengolahan}
                          onChange={(e) => setFormData({ ...formData, suhuRuangPengolahan: e.target.value })}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                        />
                        <div className="text-[10px] text-slate-400">Upload Foto Bukti:</div>
                        {formData.fotoRuangPengolahan ? (
                          <div className="relative">
                            <img src={formData.fotoRuangPengolahan} alt="Foto Pengolahan" className="w-full h-20 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoRuangPengolahan: '' })}
                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center p-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <Camera className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Pilih/Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCompressAndSetImage(f, (b64) => setFormData({ ...formData, fotoRuangPengolahan: b64 }));
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Ruang Pemorsian */}
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200">3. Ruang Pemorsian</div>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Suhu (°C)..."
                          value={formData.suhuRuangPemorsian}
                          onChange={(e) => setFormData({ ...formData, suhuRuangPemorsian: e.target.value })}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                        />
                        <div className="text-[10px] text-slate-400">Upload Foto Bukti:</div>
                        {formData.fotoRuangPemorsian ? (
                          <div className="relative">
                            <img src={formData.fotoRuangPemorsian} alt="Foto Pemorsian" className="w-full h-20 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoRuangPemorsian: '' })}
                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center p-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <Camera className="w-4 h-4 text-blue-500 mr-1" />
                            <span>Pilih/Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCompressAndSetImage(f, (b64) => setFormData({ ...formData, fotoRuangPemorsian: b64 }));
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Suhu Chiller 1-4 & Freezer 1-2 */}
                {currentSubMenu.category === 'suhu_chiller' && (
                  <div className="space-y-4 bg-cyan-50/50 dark:bg-cyan-950/20 p-4 rounded-2xl border border-cyan-200/60 dark:border-cyan-900/40">
                    <div className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Refrigerator className="w-4 h-4" />
                        <span>Suhu & Bukti Foto: 4 Chiller (0-4°C) & 2 Freezer (-18 s/d -20°C)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'Chiller 1', sKey: 'suhuChiller1', fKey: 'fotoChiller1', std: '0 - 4°C' },
                        { key: 'Chiller 2', sKey: 'suhuChiller2', fKey: 'fotoChiller2', std: '0 - 4°C' },
                        { key: 'Chiller 3', sKey: 'suhuChiller3', fKey: 'fotoChiller3', std: '0 - 4°C' },
                        { key: 'Chiller 4', sKey: 'suhuChiller4', fKey: 'fotoChiller4', std: '0 - 4°C' },
                        { key: 'Freezer 1', sKey: 'suhuFreezer1', fKey: 'fotoFreezer1', std: '-18 s/d -20°C' },
                        { key: 'Freezer 2', sKey: 'suhuFreezer2', fKey: 'fotoFreezer2', std: '-18 s/d -20°C' },
                      ].map((u) => (
                        <div key={u.key} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                            <span>{u.key}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{u.std}</span>
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Suhu °C..."
                            value={(formData as any)[u.sKey]}
                            onChange={(e) => setFormData({ ...formData, [u.sKey]: e.target.value })}
                            className="w-full p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                          />
                          {(formData as any)[u.fKey] ? (
                            <div className="relative">
                              <img src={(formData as any)[u.fKey]} alt={u.key} className="w-full h-14 object-cover rounded-md" />
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, [u.fKey]: '' })}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-rose-600 text-white rounded-full"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center p-1.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 text-[10px]">
                              <Camera className="w-3 h-3 text-cyan-600 mr-1" />
                              <span>Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleCompressAndSetImage(f, (b64) => setFormData({ ...formData, [u.fKey]: b64 }));
                                }}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Ompreng */}
                {currentSubMenu.category === 'ompreng' && (
                  <div className="space-y-3 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40">
                    <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 text-xs">
                      <Boxes className="w-4 h-4" />
                      <span>{currentSubMenu.title} ({currentSubMenu.targetGroup})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Berat Total Gramatur (gram)</label>
                        <input
                          type="number"
                          required
                          placeholder="Misal: 350"
                          value={formData.beratOmprengGram}
                          onChange={(e) => setFormData({ ...formData, beratOmprengGram: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Evaluasi Mutu QC</label>
                        <select
                          value={formData.statusKelayakanOmpreng}
                          onChange={(e) => setFormData({ ...formData, statusKelayakanOmpreng: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        >
                          <option value="Lolos QC">Lolos QC (Sesuai Standar Porsi)</option>
                          <option value="Perlu Penyesuaian">Perlu Penyesuaian Gramatur</option>
                          <option value="Tidak Layak">Tidak Layak Saji</option>
                        </select>
                      </div>
                    </div>

                    {/* Perintah Upload Foto Ompreng */}
                    <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40">
                      <label className="block font-semibold text-indigo-900 dark:text-indigo-200 mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Perintah Upload Foto Ompreng ({currentSubMenu.targetGroup})</span>
                          <span className="text-rose-500">*</span>
                        </span>
                        {(formData.fotoOmpreng || formData.fotoBukti) && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Foto Terlampir
                          </span>
                        )}
                      </label>

                      {(formData.fotoOmpreng || formData.fotoBukti) ? (
                        <div className="relative rounded-xl overflow-hidden border border-indigo-300 dark:border-indigo-800 bg-black/5 group">
                          <img src={formData.fotoOmpreng || formData.fotoBukti} alt="Bukti Foto Ompreng" className="w-full h-36 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: formData.fotoOmpreng || formData.fotoBukti, title: `Foto Ompreng: ${currentSubMenu.title}` })}
                              className="p-1.5 bg-white/95 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-white shadow cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Perbesar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoOmpreng: '', fotoBukti: '' })}
                              className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-rose-500 shadow cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Ganti Foto</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 rounded-xl cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors text-center bg-white/60 dark:bg-slate-900/40">
                          <Camera className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
                          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                            Ambil Foto Kamera / Pilih File Bukti Ompreng ({currentSubMenu.targetGroup})
                          </span>
                          <span className="text-[10px] text-indigo-700/70 dark:text-indigo-400/70 mt-0.5">
                            Foto nampan/ompreng lengkap dengan porsi gizi seimbang • Watermark SPPG
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCompressAndSetImage(file, (b64) => setFormData({ ...formData, fotoOmpreng: b64, fotoBukti: b64 }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Sampah (Waste) */}
                {currentSubMenu.category === 'sampah' && (
                  <div className="space-y-3 bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40">
                    <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>Input Data Sisa / Sampah ({currentSubMenu.targetGroup})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Berat Sampah (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="Misal: 1.2"
                          value={formData.beratSampahKg}
                          onChange={(e) => setFormData({ ...formData, beratSampahKg: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Estimasi % Sisa Konsumsi</label>
                        <input
                          type="number"
                          placeholder="Misal: 5"
                          value={formData.estimasiPersenSisa}
                          onChange={(e) => setFormData({ ...formData, estimasiPersenSisa: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Faktor Penyebab Sisa</label>
                        <input
                          type="text"
                          value={formData.penyebabSisa}
                          onChange={(e) => setFormData({ ...formData, penyebabSisa: e.target.value })}
                          className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Perintah Upload Foto Bukti Sampah */}
                    <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                      <label className="block font-semibold text-rose-900 dark:text-rose-200 mb-1.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>Perintah Upload Foto Bukti Sampah ({currentSubMenu.targetGroup})</span>
                          <span className="text-rose-500">*</span>
                        </span>
                        {(formData.fotoSampah || formData.fotoBukti) && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Foto Terlampir
                          </span>
                        )}
                      </label>

                      {(formData.fotoSampah || formData.fotoBukti) ? (
                        <div className="relative rounded-xl overflow-hidden border border-rose-300 dark:border-rose-800 bg-black/5 group">
                          <img src={formData.fotoSampah || formData.fotoBukti} alt="Bukti Foto Sampah" className="w-full h-36 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ url: formData.fotoSampah || formData.fotoBukti, title: `Bukti Sampah: ${currentSubMenu.title}` })}
                              className="p-1.5 bg-white/95 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-white shadow cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Perbesar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, fotoSampah: '', fotoBukti: '' })}
                              className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-rose-500 shadow cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Ganti Foto</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-rose-300 dark:border-rose-800/80 rounded-xl cursor-pointer hover:bg-rose-100/50 dark:hover:bg-rose-900/30 transition-colors text-center bg-white/60 dark:bg-slate-900/40">
                          <Camera className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-1" />
                          <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                            Ambil Foto Kamera / Pilih File Bukti Sampah ({currentSubMenu.targetGroup})
                          </span>
                          <span className="text-[10px] text-rose-700/70 dark:text-rose-400/70 mt-0.5">
                            Foto sisa makanan saat proses cuci ompreng • Watermark SPPG
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCompressAndSetImage(file, (b64) => setFormData({ ...formData, fotoSampah: b64, fotoBukti: b64 }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}


                {/* Catatan Tambahan */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Verifikasi Tambahan</label>
                  <textarea
                    rows={2}
                    placeholder="Catatan kondisi lapangan atau instruksi tindak lanjut..."
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Sinkronkan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tier 3: Record Listing & Evidence Gallery */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daftar Input: {currentSubMenu.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  Tanggal {selectedDate} ({filteredSubItems.length} Catatan)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Semua data tersinkronisasi dengan Google Cloud Firestore & siap dicetak sebagai laporan resmi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openNewEntryForm}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-blue-200 dark:border-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Catatan</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
              <span>Memuat data sub menu dari server...</span>
            </div>
          ) : filteredSubItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Belum Ada Data Tercatat</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                  Klik tombol <strong>"Input Data Baru"</strong> di atas untuk menginput data dan mengunggah foto bukti fisik pada sub menu ini.
                </p>
              </div>
              <button
                onClick={openNewEntryForm}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Data Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubItems.map((item, index) => {
                const primaryPhoto = item.fotoBukti || item.fotoOmpreng || item.fotoSampah || item.fotoRuangPersiapan || item.fotoChiller1;
                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Photo Thumbnail */}
                      <div className="relative shrink-0">
                        {primaryPhoto ? (
                          <div 
                            onClick={() => setLightboxImage({ url: primaryPhoto, title: `${item.subMenuJudul} (${item.jamInput})` })}
                            className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group shadow-2xs relative"
                          >
                            <img src={primaryPhoto} alt="Foto Bukti" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-[10px]">
                            <ImageIcon className="w-4 h-4 mb-0.5 text-slate-400" />
                            <span>No Foto</span>
                          </div>
                        )}
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          {index + 1}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.namaBahan || item.namaMenu || item.subMenuJudul}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                            {item.jamInput} WIB
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tersinkron Cloud</span>
                          </span>
                        </div>

                        {/* Specific Metrics Display */}
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-3 pt-0.5">
                          {item.beratRusakKg !== undefined && (
                            <div>Berat Rusak: <strong className="text-amber-600">{item.beratRusakKg} kg</strong></div>
                          )}
                          {item.tindakanPenanganan && (
                            <div>Tindakan: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.tindakanPenanganan}</span></div>
                          )}
                          {item.suhuCelcius !== undefined && (
                            <div>Suhu: <strong className="text-blue-600">{item.suhuCelcius}°C</strong> ({item.statusSuhu})</div>
                          )}
                          {item.beratOmprengGram !== undefined && (
                            <div>Gramatur: <strong className="text-indigo-600">{item.beratOmprengGram} gram</strong> ({item.statusKelayakanOmpreng})</div>
                          )}
                          {item.beratSampahKg !== undefined && (
                            <div>Sampah: <strong className="text-rose-600">{item.beratSampahKg} kg</strong> (Estimasi sisa {item.estimasiPersenSisa}%)</div>
                          )}
                          {item.suhuRuangPersiapan !== undefined && (
                            <div className="text-[11px] text-slate-500">
                              Persiapan: {item.suhuRuangPersiapan}°C | Pengolahan: {item.suhuRuangPengolahan}°C | Pemorsian: {item.suhuRuangPemorsian}°C
                            </div>
                          )}
                          {item.suhuChiller1 !== undefined && (
                            <div className="text-[11px] text-slate-500">
                              Chiller 1-4: {item.suhuChiller1}°C, {item.suhuChiller2}°C, {item.suhuChiller3}°C, {item.suhuChiller4}°C | Freezer: {item.suhuFreezer1}°C, {item.suhuFreezer2}°C
                            </div>
                          )}
                        </div>

                        {/* Note & Petugas */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Petugas: {item.petugas}</span>
                          {item.catatan && (
                            <>
                              <span>•</span>
                              <span className="italic">"{item.catatan}"</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {primaryPhoto && (
                        <button
                          onClick={() => setLightboxImage({ url: primaryPhoto, title: `${item.subMenuJudul}` })}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                          title="Lihat Foto Bukti"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={handlePrintDocument}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                        title="Cetak Berita Acara"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
