import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import logoImg from '../../assets/images/badan_gizi_logo_1785799692960.jpg';

interface PrintLaporanViewProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export type PrintReportKey =
  | 'bast'
  | 'surat-tugas'
  | 'organoleptik-penerima'
  | 'organoleptik-plog'
  | 'sampel-menu'
  | 'flayer-menu'
  | 'penerima-manfaat'
  | 'informasi-gizi'
  | 'food-cost'
  | 'purchase-order'
  | 'qc-barang'
  | 'suhu-ruang-persiapan'
  | 'suhu-ruang-pengolahan'
  | 'suhu-ruang-pemorsian'
  | 'suhu-makanan-pengolahan'
  | 'suhu-makanan-pemorsian'
  | 'food-waste';

interface SubMenuOption {
  key: PrintReportKey;
  slug: string;
  title: string;
  shortTitle: string;
  icon: any;
  category: string;
}

const SUBMENUS: SubMenuOption[] = [
  { key: 'bast', slug: 'bast', title: 'Cetak BAST', shortTitle: 'BAST Serah Terima', icon: Icons.FileCheck2, category: 'Administrasi & Legal' },
  { key: 'surat-tugas', slug: 'surat-tugas', title: 'Cetak Surat Tugas', shortTitle: 'Surat Tugas Tim', icon: Icons.FileSignature, category: 'Administrasi & Legal' },
  { key: 'organoleptik-penerima', slug: 'organoleptik-penerima', title: 'Cetak Form Organoleptik Penerima Manfaat', shortTitle: 'Organoleptik Siswa', icon: Icons.SmilePlus, category: 'Uji Mutu & Organoleptik' },
  { key: 'organoleptik-plog', slug: 'organoleptik-plog', title: 'Cetak Form Organoleptik PLOG', shortTitle: 'Organoleptik PLOG Dapur', icon: Icons.CheckSquare, category: 'Uji Mutu & Organoleptik' },
  { key: 'sampel-menu', slug: 'sampel-menu', title: 'Cetak Form Sampel Menu + Foto Menu', shortTitle: 'Sampel Menu 3x24 Jam', icon: Icons.Camera, category: 'Uji Mutu & Organoleptik' },
  { key: 'flayer-menu', slug: 'flayer-menu', title: 'Cetak Flayer Informasi Menu', shortTitle: 'Flayer Menu & Edukasi', icon: Icons.Megaphone, category: 'Informasi Menu' },
  { key: 'penerima-manfaat', slug: 'penerima-manfaat', title: 'Cetak Rincian Data Penerima Manfaat', shortTitle: 'Data Penerima Manfaat', icon: Icons.Users, category: 'Penerima & Gizi' },
  { key: 'informasi-gizi', slug: 'informasi-gizi', title: 'Cetak Rincian Informasi Gizi Menu', shortTitle: 'Analisis Gizi (Besar/Kecil)', icon: Icons.Activity, category: 'Penerima & Gizi' },
  { key: 'food-cost', slug: 'food-cost', title: 'Cetak Rincian Informasi Food Cost Menu', shortTitle: 'Food Cost (Besar/Kecil)', icon: Icons.DollarSign, category: 'Anggaran & Pengadaan' },
  { key: 'purchase-order', slug: 'purchase-order', title: 'Cetak Rincian Purchase Order', shortTitle: 'Purchase Order (PO)', icon: Icons.FileSpreadsheet, category: 'Anggaran & Pengadaan' },
  { key: 'qc-barang', slug: 'qc-barang', title: 'Cetak Rincian QC Bahan & Barang Operasional', shortTitle: 'QC Penerimaan Bahan', icon: Icons.ShieldCheck, category: 'Gudang & QC' },
  { key: 'suhu-ruang-persiapan', slug: 'suhu-ruang-persiapan', title: 'Cetak Rincian Data + Foto Suhu Ruang Persiapan', shortTitle: 'Suhu Ruang Persiapan', icon: Icons.ThermometerSnowflake, category: 'Suhu Ruang & CCP' },
  { key: 'suhu-ruang-pengolahan', slug: 'suhu-ruang-pengolahan', title: 'Cetak Rincian Data + Foto Suhu Ruang Pengolahan', shortTitle: 'Suhu Ruang Pengolahan', icon: Icons.ThermometerSun, category: 'Suhu Ruang & CCP' },
  { key: 'suhu-ruang-pemorsian', slug: 'suhu-ruang-pemorsian', title: 'Cetak Rincian Data + Foto Suhu Ruang Pemorsian', shortTitle: 'Suhu Ruang Pemorsian', icon: Icons.Thermometer, category: 'Suhu Ruang & CCP' },
  { key: 'suhu-makanan-pengolahan', slug: 'suhu-makanan-pengolahan', title: 'Cetak Rincian Data + Foto Suhu Makanan Pengolahan', shortTitle: 'Suhu Makanan Pengolahan', icon: Icons.Flame, category: 'Suhu Makanan & CCP' },
  { key: 'suhu-makanan-pemorsian', slug: 'suhu-makanan-pemorsian', title: 'Cetak Rincian Suhu Makanan Pemorsian', shortTitle: 'Suhu Makanan Pemorsian', icon: Icons.Soup, category: 'Suhu Makanan & CCP' },
  { key: 'food-waste', slug: 'food-waste', title: 'Cetak Rincian Data + Foto Food Waste', shortTitle: 'Data & Foto Food Waste', icon: Icons.Trash2, category: 'Kebersihan & Limbah' },
];

export const PrintLaporanView: React.FC<PrintLaporanViewProps> = ({ currentPath, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-04');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Derive active report from URL
  const pathSegment = currentPath.replace('/print-laporan/', '').replace('/print-laporan', '');
  const activeReportKey: PrintReportKey = (SUBMENUS.find(s => s.slug === pathSegment)?.key) || 'bast';

  // Fetch bundled report data when date changes
  const fetchReportBundle = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/print-laporan/bundle/${dateStr}`);
      const json = await res.json();
      if (json.success && json.data) {
        setReportData(json.data);
      }
    } catch (e) {
      console.error('Error fetching print laporan bundle:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportBundle(selectedDate);
  }, [selectedDate]);

  const handlePrint = () => {
    window.print();
  };

  const handlePdf = () => {
    window.print();
  };

  const activeSubmenu = SUBMENUS.find(s => s.key === activeReportKey) || SUBMENUS[0];

  const identitas = reportData?.identitasSPPG || {
    kementerian: 'BADAN GIZI NASIONAL (BGN) REPUBLIK INDONESIA',
    unitPelaksana: 'SATUAN PELAYANAN PEMENUHAN GIZI (SPPG) TEMENGGUNGAN 2',
    wilayah: 'Kecamatan Krejengan, Kabupaten Probolinggo, Jawa Timur',
    alamatLengkap: 'Jl. Raya Temenggungan No. 02, Kec. Krejengan, Kab. Probolinggo, Jawa Timur 67284',
    kontak: 'Telp: (0335) 778899 • WhatsApp: +62 812-3456-7890',
    email: 'sppgkrejengantemenggungan2@gmail.com',
    website: 'https://bgn.go.id/sppg-temenggungan-2',
    pejabat: {
      kepalaSPPG: 'Ahmad Fauzi, S.Pd., M.M.',
      nipKepala: 'NIP. 19840512 201001 1 018',
      ahliGizi: 'Siti Rahmawati, S.Tr.Gz',
      strAhliGizi: 'STRGz. 3513-2023-08912',
      koordinatorPengolahan: 'Chef Budi Santoso',
      koordinatorPersiapan: 'Dewi Lestari, A.Md.Gz',
      koordinatorPemorsian: 'Nur Hasanah, S.Kom',
      koordinatorCuci: 'Slamet Riyadi',
      petugasPengadaan: 'Hendra Gunawan, S.E.',
      petugasQC: 'Zainal Abidin, S.Si',
      petugasDistribusi: 'Rahmat Hidayat (Nopol N 8921 QP)'
    }
  };

  const menuHarian = reportData?.dailyMenu || {
    namaMenuHarian: 'Nasi Putih Pulen, Ayam Goreng Lengkuas, Tempe Bacem Tradisional, Sayur Sop Bakso, Pisang Ambon & Susu UHT',
    makananPokok: 'Nasi Putih Pulen',
    laukHewani: 'Ayam Goreng Lengkuas',
    laukNabati: 'Tempe Bacem Tradisional',
    sayur: 'Sayur Sop Bakso Wortel',
    buah: 'Pisang Ambon Super',
    ekstra: 'Susu UHT Plain 200ml',
    jumlahPenerimaManfaat: 1525,
    porsiBesar: 1048,
    porsiKecil: 477,
    totalJumlahPorsi: 1525,
    waktuDistribusi: '10:30 WIB'
  };

  const summaryPenerima = reportData?.beneficiarySummary || {
    totalPenerima: 1525,
    porsiBesar: 1048,
    porsiKecil: 477,
    totalPorsi: 1525,
    portionBreakdown: { porsiBesar: 1048, porsiKecil: 477 }
  };

  const formatTanggalIndo = (tglStr: string) => {
    try {
      const date = new Date(tglStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return tglStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt !important;
          }
          header, aside, .print\\:hidden, nav, button {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-paper {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            background: white !important;
          }
          .page-break {
            page-break-before: always;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 15mm 12mm 15mm;
          }
        }
      `}} />

      {/* Control Bar (Hidden on Print) */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                Modul Cetak Laporan Resmi
              </span>
              <span className="text-xs text-slate-400 font-medium">BGN SPPG Temenggungan 2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
              <Icons.Printer className="w-6 h-6 text-blue-600" />
              {activeSubmenu.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sinkronisasi data otomatis dari seluruh modul operasional (Penerima Manfaat, PLOG, PO, QC, Divisi, Distribusi)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Icons.Calendar className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Cetak langsung menggunakan printer atau dialog cetak sistem"
            >
              <Icons.Printer className="w-4 h-4" />
              Cetak Dokumen (Print)
            </button>

            <button
              onClick={handlePdf}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Simpan sebagai dokumen PDF via dialog print"
            >
              <Icons.FileDown className="w-4 h-4" />
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Submenu Navigator Horizontal Pills */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Pilih Sub Menu Laporan (17 Dokumen Resmi):</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold lowercase">
              aktif: /print-laporan/{activeSubmenu.slug}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {SUBMENUS.map((sub, idx) => {
              const SubIcon = sub.icon;
              const isActive = sub.key === activeReportKey;
              return (
                <button
                  key={sub.key}
                  onClick={() => onNavigate(`/print-laporan/${sub.slug}`)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{idx + 1}. {sub.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAPER CANVAS CONTAINER (Standard A4 Printable Canvas) */}
      <div className="print-paper bg-white text-slate-900 border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto font-serif">
        
        {/* 1. KOP SURAT RESMI KEDINASAN BGN & SPPG TEMENGGUNGAN 2 */}
        <div className="border-b-2 border-slate-900 pb-2 mb-1">
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
              <img
                src={logoImg}
                alt="Logo BGN"
                className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-full shadow-xs"
              />
            </div>
            <div className="flex-1 text-center font-sans">
              <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-800">
                {identitas.kementerian}
              </h3>
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold uppercase text-slate-950 tracking-wide mt-0.5">
                {identitas.unitPelaksana}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium mt-0.5">
                {identitas.alamatLengkap}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                {identitas.kontak} • Surel: <span className="underline font-semibold">{identitas.email}</span>
              </p>
            </div>
            <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center text-center">
              <div className="border border-slate-400 px-2 py-1 rounded text-[9px] font-sans font-bold uppercase text-slate-600 leading-tight">
                Standar Mutu<br/>ISO & BGN RI
              </div>
            </div>
          </div>
        </div>
        {/* Thin bottom line for formal Kop Surat */}
        <div className="border-b border-slate-900 mb-6"></div>

        {/* 2. REPORT BODY SWITCHER */}
        {renderReportContent(activeReportKey, {
          selectedDate,
          formatTanggalIndo,
          identitas,
          menuHarian,
          summaryPenerima,
          reportData
        })}

      </div>
    </div>
  );
};

// =========================================================================
// RENDER SPECIFIC REPORT TEMPLATE
// =========================================================================
function renderReportContent(reportKey: PrintReportKey, ctx: any) {
  const { selectedDate, formatTanggalIndo, identitas, menuHarian, summaryPenerima, reportData } = ctx;

  switch (reportKey) {
    // -------------------------------------------------------------
    // 1. CETAK BAST (BERITA ACARA SERAH TERIMA)
    // -------------------------------------------------------------
    case 'bast':
      return (
        <div className="space-y-5 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              BERITA ACARA SERAH TERIMA (BAST) MAKANAN BERGIZI GRATIS
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Nomor: BAST/BGN-SPPG.TMG2/{selectedDate.replace(/-/g, '')}/001
            </p>
          </div>

          <p className="text-justify">
            Pada hari ini, <span className="font-bold">{formatTanggalIndo(selectedDate)}</span>, bertempat di Satuan Pendidikan Sasaran Penerima Manfaat, kami yang bertanda tangan di bawah ini:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-300">
            <div>
              <div className="font-bold underline mb-1">PIHAK PERTAMA (Yang Menyerahkan):</div>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr><td className="w-24 py-0.5 text-slate-600">Nama</td><td>: <b>{identitas.pejabat.petugasDistribusi.split('(')[0].trim()}</b></td></tr>
                  <tr><td className="py-0.5 text-slate-600">Jabatan</td><td>: Petugas Distribusi & Kurir SPPG Temenggungan 2</td></tr>
                  <tr><td className="py-0.5 text-slate-600">Armada / Nopol</td><td>: N 8921 QP (Mobil Box Thermoking Higienis)</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="font-bold underline mb-1">PIHAK KEDUA (Yang Menerima):</div>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr><td className="w-24 py-0.5 text-slate-600">Nama</td><td>: <b>Drs. H. Mulyadi, M.Pd</b></td></tr>
                  <tr><td className="py-0.5 text-slate-600">Jabatan</td><td>: Kepala Sekolah / Tim Pengawas Satuan Pendidikan</td></tr>
                  <tr><td className="py-0.5 text-slate-600">Institusi</td><td>: SMPN 1 Krejengan (Sasaran Utama)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-justify">
            PIHAK PERTAMA telah menyerahkan paket Makanan Bergizi Gratis (MBG) dalam keadaan siap saji, higienis, dan tersegel utuh kepada PIHAK KEDUA, dengan rincian sebagai berikut:
          </p>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">No</th>
                <th className="border border-slate-400 p-2 text-left">Komposisi Menu Harian</th>
                <th className="border border-slate-400 p-2">Porsi Besar</th>
                <th className="border border-slate-400 p-2">Porsi Kecil</th>
                <th className="border border-slate-400 p-2">Total Porsi</th>
                <th className="border border-slate-400 p-2">Suhu Kedatangan</th>
                <th className="border border-slate-400 p-2">Kondisi Fisik</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 p-2">1</td>
                <td className="border border-slate-400 p-2 text-left">
                  <div className="font-bold">{menuHarian.namaMenuHarian}</div>
                  <div className="text-[10px] text-slate-600">
                    Pokok: {menuHarian.makananPokok} • Hewani: {menuHarian.laukHewani} • Nabati: {menuHarian.laukNabati} • Sayur: {menuHarian.sayur} • Buah: {menuHarian.buah}
                  </div>
                </td>
                <td className="border border-slate-400 p-2 font-bold">{summaryPenerima.porsiBesar.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2 font-bold">{summaryPenerima.porsiKecil.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2 font-extrabold text-blue-900 bg-blue-50/50">{summaryPenerima.totalPorsi.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2 font-semibold text-emerald-800">64.5°C (Aman)</td>
                <td className="border border-slate-400 p-2 font-semibold text-emerald-800">Segel Utuh & Bersih</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-slate-400 p-2 text-right">TOTAL PAKET DISERAHKAN:</td>
                <td className="border border-slate-400 p-2">{summaryPenerima.porsiBesar.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2">{summaryPenerima.porsiKecil.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2 text-blue-900 font-black">{summaryPenerima.totalPorsi.toLocaleString('id-ID')} Ompreng</td>
                <td colSpan={2} className="border border-slate-400 p-2 text-xs text-slate-600">Pukul {menuHarian.waktuDistribusi || '10:30 WIB'}</td>
              </tr>
            </tfoot>
          </table>

          <p className="text-[11px] text-slate-600 italic">
            Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya dalam 2 (dua) rangkap untuk dipergunakan sebagaimana mestinya.
          </p>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[11px] font-semibold">PIHAK PERTAMA,</div>
              <div className="text-[10px] text-slate-500">Petugas Distribusi SPPG</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasDistribusi.split('(')[0].trim()}</div>
              <div className="text-[10px] text-slate-500">NIP/ID: DIST-001/TMG2</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold">PIHAK KEDUA,</div>
              <div className="text-[10px] text-slate-500">Kepala Sekolah / Penerima</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Drs. H. Mulyadi, M.Pd</div>
              <div className="text-[10px] text-slate-500">NIP. 19720315 199802 1 003</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold">MENGETAHUI,</div>
              <div className="text-[10px] text-slate-500">Kepala SPPG Temenggungan 2</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[10px] text-slate-500">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 2. CETAK SURAT TUGAS
    // -------------------------------------------------------------
    case 'surat-tugas':
      return (
        <div className="space-y-5 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              SURAT PERINTAH TUGAS OPERASIONAL & DISTRIBUSI
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Nomor: SPT/BGN.SPPG-TMG2/{selectedDate.replace(/-/g, '')}/089
            </p>
          </div>

          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="w-28 font-bold align-top py-1">Dasar</td>
                <td className="w-4 align-top py-1">:</td>
                <td className="align-top py-1">
                  1. Peraturan Presiden Republik Indonesia tentang Pelaksanaan Program Makan Bergizi Gratis.<br/>
                  2. Petunjuk Teknis Operasional Satuan Pelayanan Pemenuhan Gizi (SPPG) Temenggungan 2 Tahun Anggaran 2026.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center font-bold text-xs uppercase tracking-wider py-1 border-y border-slate-300">
            MEMERINTAHKAN:
          </div>

          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="w-28 font-bold align-top py-1">Kepada</td>
                <td className="w-4 align-top py-1">:</td>
                <td className="align-top py-1">
                  <div className="space-y-1.5">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <b>1. Tim Logistik & Distribusi:</b> {identitas.pejabat.petugasDistribusi}<br/>
                      <span className="text-[11px] text-slate-600">Bertugas mendistribusikan {summaryPenerima.totalPorsi} ompreng ke seluruh sekolah sasaran.</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <b>2. Tim Pengolahan & Pemorsian:</b> {identitas.pejabat.koordinatorPengolahan} & {identitas.pejabat.koordinatorPemorsian}<br/>
                      <span className="text-[11px] text-slate-600">Bertanggung jawab atas standar mutu masak, CCP suhu makanan & sealing ompreng.</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <b>3. Penanggung Jawab Mutu Gizi:</b> {identitas.pejabat.ahliGizi}<br/>
                      <span className="text-[11px] text-slate-600">Memastikan kepatuhan AKG, uji organoleptik internal, dan penyimpanan sampel 3x24 jam.</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-1">Untuk</td>
                <td className="align-top py-1">:</td>
                <td className="align-top py-1 text-justify">
                  Melaksanakan pengolahan, pemorsian steril, pemeriksaan mutu organoleptik, dan penyaluran Makanan Bergizi Gratis (MBG) pada hari <b>{formatTanggalIndo(selectedDate)}</b>, dengan alokasi target <b>{summaryPenerima.porsiBesar} Porsi Besar</b> dan <b>{summaryPenerima.porsiKecil} Porsi Kecil</b> (Total: <b>{summaryPenerima.totalPorsi} Porsi</b>) tepat waktu sebelum pukul 11:00 WIB.
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-1">Ketentuan</td>
                <td className="align-top py-1">:</td>
                <td className="align-top py-1">
                  Melaporkan seluruh hasil kegiatan, foto log suhu, dan dokumen BAST yang telah ditandatangani oleh pihak sekolah kepada Kepala SPPG selambat-lambatnya pukul 14:00 WIB hari yang sama.
                </td>
              </tr>
            </tbody>
          </table>

          {/* Kolom Tanda Tangan */}
          <div className="pt-8 flex justify-end">
            <div className="text-center w-72">
              <div className="text-xs">Dikeluarkan di: Krejengan, Probolinggo</div>
              <div className="text-xs font-semibold">Pada tanggal: {formatTanggalIndo(selectedDate)}</div>
              <div className="text-xs font-bold mt-2">KEPALA SPPG TEMENGGUNGAN 2,</div>
              <div className="h-20"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[11px] text-slate-600">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 3. CETAK FORM ORGANOLEPTIK PENERIMA MANFAAT
    // -------------------------------------------------------------
    case 'organoleptik-penerima':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              FORMULIR UJI ORGANOLEPTIK OLEH PENERIMA MANFAAT
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Evaluasi Uji Cita Rasa & Kualitas Makanan di Satuan Pendidikan Sasaran
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-300 text-[11px]">
            <div>
              <div><b>Hari / Tanggal Uji :</b> {formatTanggalIndo(selectedDate)}</div>
              <div><b>Nama Satuan Sasaran:</b> SMPN 1 Krejengan & SDN Temenggungan</div>
              <div><b>Waktu Konsumsi Siswa:</b> 11:30 - 12:15 WIB</div>
            </div>
            <div>
              <div><b>Menu Harian Teruji:</b> {menuHarian.namaMenuHarian}</div>
              <div><b>Pengawas / Penguji:</b> Tim UKS Sekolah & Perwakilan Siswa Sasaran</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th rowSpan={2} className="border border-slate-400 p-2">No</th>
                <th rowSpan={2} className="border border-slate-400 p-2 text-left">Komponen Makanan</th>
                <th colSpan={5} className="border border-slate-400 p-1">Parameter Organoleptik (Skala 1 - 5)</th>
                <th rowSpan={2} className="border border-slate-400 p-2">Rata-Rata</th>
                <th rowSpan={2} className="border border-slate-400 p-2 text-left">Catatan Rasa / Siswa</th>
              </tr>
              <tr className="bg-slate-100 font-semibold text-[10px]">
                <th className="border border-slate-400 p-1">Rasa</th>
                <th className="border border-slate-400 p-1">Aroma</th>
                <th className="border border-slate-400 p-1">Tekstur</th>
                <th className="border border-slate-400 p-1">Warna</th>
                <th className="border border-slate-400 p-1">Suhu</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: menuHarian.makananPokok, r: 5, a: 5, t: 4, w: 5, s: 5, note: 'Nasi pulen, harum dan hangat pas' },
                { no: 2, nama: menuHarian.laukHewani, r: 5, a: 5, t: 5, w: 4, s: 4, note: 'Bumbu meresap gurih, ayam empuk disukai siswa' },
                { no: 3, nama: menuHarian.laukNabati, r: 4, a: 4, t: 4, w: 5, s: 4, note: 'Tempe manis gurih bacem tradisional cocok' },
                { no: 4, nama: menuHarian.sayur, r: 4, a: 4, t: 4, w: 4, s: 5, note: 'Kuah sop segar, wortel dan bakso matang merata' },
                { no: 5, nama: menuHarian.buah, r: 5, a: 5, t: 5, w: 5, s: 4, note: 'Pisang matang sempurna, manis segar tidak ada memar' },
              ].map(item => {
                const avg = ((item.r + item.a + item.t + item.w + item.s) / 5).toFixed(1);
                return (
                  <tr key={item.no}>
                    <td className="border border-slate-400 p-1.5">{item.no}</td>
                    <td className="border border-slate-400 p-1.5 text-left font-bold">{item.nama}</td>
                    <td className="border border-slate-400 p-1.5">{item.r}</td>
                    <td className="border border-slate-400 p-1.5">{item.a}</td>
                    <td className="border border-slate-400 p-1.5">{item.t}</td>
                    <td className="border border-slate-400 p-1.5">{item.w}</td>
                    <td className="border border-slate-400 p-1.5">{item.s}</td>
                    <td className="border border-slate-400 p-1.5 font-bold text-blue-900 bg-blue-50/40">{avg}</td>
                    <td className="border border-slate-400 p-1.5 text-left text-[11px] text-slate-700">{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={7} className="border border-slate-400 p-1.5 text-right">SKOR INDEKS KEPUASAN RASA:</td>
                <td className="border border-slate-400 p-1.5 font-black text-emerald-800 bg-emerald-50">4.7 / 5.0</td>
                <td className="border border-slate-400 p-1.5 text-left text-[11px] text-emerald-800 font-bold">Kategori: Sangat Disukai</td>
              </tr>
            </tfoot>
          </table>

          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px]">
            <b>Keterangan Skala Nilai:</b> 5 = Sangat Baik / Sangat Suka • 4 = Baik • 3 = Cukup • 2 = Kurang • 1 = Sangat Kurang
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Guru Pembina UKS / Penanggung Jawab Sekolah,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Nur Laili, S.Pd</div>
              <div className="text-[10px] text-slate-600">NIP. 19800810 200801 2 015</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Petugas Gizi & Verifikator SPPG,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 4. CETAK FORM ORGANOLEPTIK PLOG
    // -------------------------------------------------------------
    case 'organoleptik-plog':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              FORMULIR UJI ORGANOLEPTIK INTERNAL DAPUR (PLOG SPPG)
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Food Tasting & Quality Clearance 30 Menit Sebelum Pemorsian & Distribusi
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-300 text-[11px]">
            <div>
              <div><b>Tanggal Pemeriksaan:</b> {formatTanggalIndo(selectedDate)}</div>
              <div><b>Waktu Uji Organoleptik:</b> Pukul 09:45 - 10:15 WIB</div>
              <div><b>Lokasi:</b> Meja Pengujian Mutu Dapur SPPG Temenggungan 2</div>
            </div>
            <div>
              <div><b>Keputusan Rilis:</b> <span className="font-bold text-emerald-800">[✓] LAYAK KONSUMSI & DISTRIBUSI</span></div>
              <div><b>Petugas Penguji:</b> {identitas.pejabat.ahliGizi} & {identitas.pejabat.koordinatorPengolahan}</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Item Menu</th>
                <th className="border border-slate-400 p-2">Kematangan</th>
                <th className="border border-slate-400 p-2">Cita Rasa & Gurih</th>
                <th className="border border-slate-400 p-2">Aroma Khas</th>
                <th className="border border-slate-400 p-2">Suhu Masak (°C)</th>
                <th className="border border-slate-400 p-2">Status CCP</th>
                <th className="border border-slate-400 p-2">Hasil Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: menuHarian.makananPokok, matang: 'Matang Sempurna', rasa: 'Pulen & Tidak Asam', aroma: 'Khas Nasi Pulen Segar', temp: '82.4°C', ccp: 'Aman (≥75°C)', status: 'Lolos' },
                { item: menuHarian.laukHewani, matang: 'Matang Dalam (Bone Done)', rasa: 'Gurih Lengkuas Pas', aroma: 'Aroma Rempah Sedap', temp: '86.1°C', ccp: 'Aman (≥80°C)', status: 'Lolos' },
                { item: menuHarian.laukNabati, matang: 'Matang Meresap', rasa: 'Manis Gurih Seimbang', aroma: 'Khas Bacem Gula Aren', temp: '78.5°C', ccp: 'Aman (≥75°C)', status: 'Lolos' },
                { item: menuHarian.sayur, matang: 'Sayur Segar Renyah', rasa: 'Kaldu Gurih Segar', aroma: 'Aroma Bawang & Seledri', temp: '79.0°C', ccp: 'Aman (≥75°C)', status: 'Lolos' },
                { item: menuHarian.buah, matang: 'Kulit Utuh Bersih', rasa: 'Manis Segar Alami', aroma: 'Khas Pisang Segar', temp: '22.0°C', ccp: 'Suhu Ruang Higienis', status: 'Lolos' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-400 p-1.5 font-bold text-left">{row.item}</td>
                  <td className="border border-slate-400 p-1.5 text-slate-700">{row.matang}</td>
                  <td className="border border-slate-400 p-1.5 text-slate-700">{row.rasa}</td>
                  <td className="border border-slate-400 p-1.5 text-slate-700">{row.aroma}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-blue-900">{row.temp}</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-800 font-semibold">{row.ccp}</td>
                  <td className="border border-slate-400 p-1.5 font-black text-emerald-700 bg-emerald-50">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs space-y-1">
            <div className="font-bold text-emerald-900">KESIMPULAN & REKOMENDASI PENGESAHAN:</div>
            <p className="text-emerald-800 text-[11px]">
              Seluruh menu harian dinyatakan <b>MEMENUHI STANDAR KEAMANAN PANGAN & KELAYAKAN GIZI BGN</b>. CCP Suhu panas terpenuhi di atas 75°C sehingga aman dari bahaya kontaminasi mikrobiologis. Batch makanan diizinkan segera diporsikan ke dalam ompreng tertutup.
            </p>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Ahli Gizi SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Pengolahan / Chef,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorPengolahan}</div>
              <div className="text-[10px] text-slate-600">ID Divisi: CH-SPPG/02</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 5. CETAK FORM SAMPEL MENU + FOTO MENU
    // -------------------------------------------------------------
    case 'sampel-menu':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              FORMULIR PENYIMPANAN SAMPEL MAKANAN 3x24 JAM & FOTO MENU
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Protokol Biosecurity & Retensi Sampel Pangan Standar BGN Republik Indonesia
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-300 text-[11px]">
            <div>
              <div><b>Kode Sampel Retensi:</b> SMP-BGN-TMG2/{selectedDate.replace(/-/g, '')}</div>
              <div><b>Tanggal & Waktu Pengambilan:</b> {formatTanggalIndo(selectedDate)}, 10:15 WIB</div>
              <div><b>Lokasi Chiller Penyimpanan:</b> Chiller Sampel Khusus Dapur Utama (Suhu: 3.2°C)</div>
            </div>
            <div>
              <div><b>Masa Retensi Wajib:</b> 3 x 24 Jam (Hingga {new Date(new Date(selectedDate).getTime() + 3*86400000).toISOString().split('T')[0]})</div>
              <div><b>Wadah Sampel:</b> Plastik Steril Bersegel Barcode / Klip Kedap Udara</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-1.5">No</th>
                <th className="border border-slate-400 p-1.5 text-left">Nama Komponen Makanan</th>
                <th className="border border-slate-400 p-1.5">Gramasi Sampel</th>
                <th className="border border-slate-400 p-1.5">Wadah Penyimpanan</th>
                <th className="border border-slate-400 p-1.5">Suhu Awal</th>
                <th className="border border-slate-400 p-1.5">Status Pengambilan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: menuHarian.makananPokok, berat: '100 gram', wadah: 'Wadah Klip Steril A', temp: '81.2°C', st: 'Tersimpan Baik' },
                { no: 2, nama: menuHarian.laukHewani, berat: '80 gram', wadah: 'Wadah Klip Steril B', temp: '85.4°C', st: 'Tersimpan Baik' },
                { no: 3, nama: menuHarian.laukNabati, berat: '60 gram', wadah: 'Wadah Klip Steril C', temp: '77.8°C', st: 'Tersimpan Baik' },
                { no: 4, nama: menuHarian.sayur, berat: '100 gram + kuah', wadah: 'Wadah Kedap D', temp: '78.5°C', st: 'Tersimpan Baik' },
                { no: 5, nama: menuHarian.buah, berat: '1 Buah Utuh', wadah: 'Plastik Higienis E', temp: '22.0°C', st: 'Tersimpan Baik' },
              ].map(r => (
                <tr key={r.no}>
                  <td className="border border-slate-400 p-1.5">{r.no}</td>
                  <td className="border border-slate-400 p-1.5 text-left font-bold">{r.nama}</td>
                  <td className="border border-slate-400 p-1.5">{r.berat}</td>
                  <td className="border border-slate-400 p-1.5">{r.wadah}</td>
                  <td className="border border-slate-400 p-1.5 font-semibold text-blue-900">{r.temp}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-emerald-800 bg-emerald-50">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DOKUMENTASI FOTO MENU */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
              Dokumentasi Foto Menu Siap Saji (Ompreng Besar & Ompreng Kecil):
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-center space-y-1.5">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-600 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Ompreng Porsi Besar (SMP/SMA)</span>
                  <span className="text-[9px] text-slate-500">Nasi 200g, Ayam 80g, Tempe 50g, Sayur 100g, Buah</span>
                </div>
                <div className="text-[11px] font-bold text-slate-800">Dokumentasi Ompreng Porsi Besar</div>
                <div className="text-[10px] text-slate-500">Standar Kalori: ~720 Kkal (Sesuai AKG BGN)</div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-center space-y-1.5">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-600 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Ompreng Porsi Kecil (SD/PAUD)</span>
                  <span className="text-[9px] text-slate-500">Nasi 130g, Ayam 50g, Tempe 35g, Sayur 75g, Buah</span>
                </div>
                <div className="text-[11px] font-bold text-slate-800">Dokumentasi Ompreng Porsi Kecil</div>
                <div className="text-[10px] text-slate-500">Standar Kalori: ~520 Kkal (Sesuai AKG BGN)</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Petugas QC & Biosecurity,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasQC}</div>
              <div className="text-[10px] text-slate-600">ID Petugas: QC-SPPG/01</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 6. CETAK FLAYER INFORMASI MENU
    // -------------------------------------------------------------
    case 'flayer-menu':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed border-2 border-blue-900 p-4 rounded-xl bg-gradient-to-b from-blue-50/30 to-white">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
              Program Nasional Makan Bergizi Gratis (MBG)
            </span>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-blue-950 mt-1">
              FLAYER INFORMASI & EDUKASI MENU HARIAN
            </h2>
            <p className="text-xs font-bold text-slate-700">
              Edisi Hari: {formatTanggalIndo(selectedDate)} • SPPG Temenggungan 2
            </p>
          </div>

          {/* Banner Menu Utama */}
          <div className="bg-blue-900 text-white p-4 rounded-xl shadow-xs text-center space-y-1">
            <div className="text-xs uppercase tracking-widest text-blue-200 font-semibold">Menu Utama Hari Ini:</div>
            <div className="text-base sm:text-lg font-black">{menuHarian.namaMenuHarian}</div>
            <div className="text-xs text-blue-100 flex items-center justify-center gap-4 pt-1">
              <span>Alokasi Total: <b>{summaryPenerima.totalPorsi} Ompreng</b></span>
              <span>•</span>
              <span>Porsi Besar: <b>{summaryPenerima.porsiBesar}</b></span>
              <span>•</span>
              <span>Porsi Kecil: <b>{summaryPenerima.porsiKecil}</b></span>
            </div>
          </div>

          {/* Konsep Isi Piringku */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
              <div className="text-amber-800 font-bold text-xs">🍚 Makanan Pokok</div>
              <div className="text-[11px] font-semibold text-slate-800 mt-1">{menuHarian.makananPokok}</div>
              <div className="text-[10px] text-slate-500">Sumber Karbohidrat Kompleks</div>
            </div>

            <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg">
              <div className="text-red-800 font-bold text-xs">🍗 Lauk Hewani</div>
              <div className="text-[11px] font-semibold text-slate-800 mt-1">{menuHarian.laukHewani}</div>
              <div className="text-[10px] text-slate-500">Protein Tinggi & Asam Amino</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <div className="text-emerald-800 font-bold text-xs">🥬 Sayur Mayur</div>
              <div className="text-[11px] font-semibold text-slate-800 mt-1">{menuHarian.sayur}</div>
              <div className="text-[10px] text-slate-500">Serat Pangan & Antioksidan</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-2.5 rounded-lg">
              <div className="text-yellow-800 font-bold text-xs">🍌 Buah Segar</div>
              <div className="text-[11px] font-semibold text-slate-800 mt-1">{menuHarian.buah}</div>
              <div className="text-[10px] text-slate-500">Vitamin Alami & Mineral</div>
            </div>
          </div>

          {/* Pesan Edukasi Gizi */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-slate-800 space-y-1">
            <div className="font-bold text-xs flex items-center gap-1.5 text-blue-900">
              <Icons.Sparkles className="w-4 h-4 text-amber-500" />
              PESAN EDUKASI GIZI BGN HARI INI:
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              "Konsumsi makanan bergizi seimbang membantu meningkatkan fokus belajar, daya ingat, kekebalan tubuh, serta mencegah stunting pada generasi muda Indonesia. Habiskan seluruh isi ompreng tanpa menyisakan makanan!"
            </p>
          </div>

          {/* Petunjuk Higiene */}
          <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <b>Tips Sehat Siswa:</b>
              <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                <li>Cuci tangan pakai sabun sebelum & sesudah makan</li>
                <li>Makan dengan posisi duduk tenang & tertib</li>
              </ul>
            </div>
            <div>
              <b>Penanganan Ompreng:</b>
              <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                <li>Tutup kembali ompreng setelah selesai makan</li>
                <li>Kumpulkan di keranjang box untuk dicuci steril di SPPG</li>
              </ul>
            </div>
          </div>

          {/* Pengesahan */}
          <div className="pt-4 flex justify-between items-end text-center">
            <div className="text-left text-[10px] text-slate-500">
              Diterbitkan resmi oleh:<br/>
              <b>Unit Pelaksana SPPG Temenggungan 2</b><br/>
              Kecamatan Krejengan, Kab. Probolinggo
            </div>
            <div className="w-56 text-center">
              <div className="text-[11px] font-semibold">Disahkan Oleh Ahli Gizi:</div>
              <div className="h-12"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 7. CETAK RINCIAN DATA PENERIMA MANFAAT
    // -------------------------------------------------------------
    case 'penerima-manfaat':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN REKAPITULASI DATA PENERIMA MANFAAT & ALOKASI PORSI
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Periode Penyaluran: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Penerima Manfaat</div>
              <div className="text-lg font-black text-blue-900 mt-0.5">{summaryPenerima.totalPenerima.toLocaleString('id-ID')} Siswa</div>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Porsi Besar (SMP/SMA/MTs)</div>
              <div className="text-lg font-black text-indigo-900 mt-0.5">{summaryPenerima.porsiBesar.toLocaleString('id-ID')} Ompreng</div>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Porsi Kecil (SD/MI/PAUD)</div>
              <div className="text-lg font-black text-emerald-900 mt-0.5">{summaryPenerima.porsiKecil.toLocaleString('id-ID')} Ompreng</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">No</th>
                <th className="border border-slate-400 p-2 text-left">Nama Satuan Pendidikan</th>
                <th className="border border-slate-400 p-2">Jenjang</th>
                <th className="border border-slate-400 p-2">Kategori Porsi</th>
                <th className="border border-slate-400 p-2">L</th>
                <th className="border border-slate-400 p-2">P</th>
                <th className="border border-slate-400 p-2">Total Porsi</th>
                <th className="border border-slate-400 p-2 text-left">PIC Sekolah</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: 'SMPN 1 Krejengan', jenjang: 'SMP', kat: 'Porsi Besar', l: 310, p: 315, total: 625, pic: 'Pak Mulyadi (0812-3344-5511)' },
                { no: 2, nama: 'MTs Nurul Huda Temenggungan', jenjang: 'MTs', kat: 'Porsi Besar', l: 210, p: 213, total: 423, pic: 'Bu Siti (0813-2211-9988)' },
                { no: 3, nama: 'SDN Temenggungan 1', jenjang: 'SD', kat: 'Porsi Kecil', l: 140, p: 135, total: 275, pic: 'Pak Anwar (0821-4433-2211)' },
                { no: 4, nama: 'SDN Temenggungan 2', jenjang: 'SD', kat: 'Porsi Kecil', l: 75, p: 77, total: 152, pic: 'Bu Rini (0852-7788-9900)' },
                { no: 5, nama: 'PAUD Melati Krejengan', jenjang: 'PAUD', kat: 'Porsi Kecil', l: 25, p: 25, total: 50, pic: 'Bu Eni (0812-9900-1122)' },
              ].map(row => (
                <tr key={row.no}>
                  <td className="border border-slate-400 p-1.5">{row.no}</td>
                  <td className="border border-slate-400 p-1.5 text-left font-bold">{row.nama}</td>
                  <td className="border border-slate-400 p-1.5">{row.jenjang}</td>
                  <td className="border border-slate-400 p-1.5 font-medium">{row.kat}</td>
                  <td className="border border-slate-400 p-1.5">{row.l}</td>
                  <td className="border border-slate-400 p-1.5">{row.p}</td>
                  <td className="border border-slate-400 p-1.5 font-extrabold text-blue-900 bg-blue-50/30">{row.total}</td>
                  <td className="border border-slate-400 p-1.5 text-left text-[11px] text-slate-700">{row.pic}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={4} className="border border-slate-400 p-2 text-right">TOTAL KESELURUHAN SASARAN:</td>
                <td className="border border-slate-400 p-2">760</td>
                <td className="border border-slate-400 p-2">765</td>
                <td className="border border-slate-400 p-2 text-blue-900 font-black">{summaryPenerima.totalPorsi.toLocaleString('id-ID')}</td>
                <td className="border border-slate-400 p-2 text-xs text-emerald-800">100% Terverifikasi</td>
              </tr>
            </tfoot>
          </table>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Distribusi & Pendataan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Rahmat Hidayat</div>
              <div className="text-[10px] text-slate-600">ID Petugas: DIST-001/TMG2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Kepala SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 8. CETAK RINCIAN INFORMASI GIZI MENU (Tanpa kalsium & zat besi, dibagi porsi besar & kecil)
    // -------------------------------------------------------------
    case 'informasi-gizi':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN ANALISIS KANDUNGAN GIZI MENU HARIAN
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Evaluasi Pemenuhan Standar Angka Kecukupan Gizi (AKG) BGN • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-slate-800 text-[11px]">
            <b>Menu Harian Terdaftar:</b> {menuHarian.namaMenuHarian}
            <div className="text-slate-600 text-[10px] mt-0.5">
              *Catatan: Sesuai regulasi terbaru BGN, analisis difokuskan pada Makronutrien dan Serat, terpisah untuk Porsi Besar dan Porsi Kecil (kolom kalsium dan zat besi ditiadakan).
            </div>
          </div>

          {/* TABEL GIZI PORSI BESAR */}
          <div className="space-y-1.5">
            <div className="font-bold text-xs uppercase tracking-wide text-indigo-900 flex items-center justify-between">
              <span>A. Analisis Kandungan Gizi - PORSI BESAR (Target: SMP/SMA/MTs - {summaryPenerima.porsiBesar} Porsi)</span>
              <span className="text-[11px] text-indigo-700 font-semibold">Standar Energi: 650 - 750 Kkal</span>
            </div>
            <table className="w-full border-collapse border border-slate-400 text-center text-xs">
              <thead>
                <tr className="bg-indigo-100 font-bold">
                  <th className="border border-slate-400 p-1.5">Komponen Bahan</th>
                  <th className="border border-slate-400 p-1.5">Gramasi (g)</th>
                  <th className="border border-slate-400 p-1.5">Energi (Kkal)</th>
                  <th className="border border-slate-400 p-1.5">Protein (g)</th>
                  <th className="border border-slate-400 p-1.5">Lemak (g)</th>
                  <th className="border border-slate-400 p-1.5">Karbohidrat (g)</th>
                  <th className="border border-slate-400 p-1.5">Serat (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.makananPokok}</td>
                  <td className="border border-slate-400 p-1">200</td>
                  <td className="border border-slate-400 p-1 font-bold">260.0</td>
                  <td className="border border-slate-400 p-1">4.8</td>
                  <td className="border border-slate-400 p-1">0.6</td>
                  <td className="border border-slate-400 p-1">57.2</td>
                  <td className="border border-slate-400 p-1">0.8</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.laukHewani}</td>
                  <td className="border border-slate-400 p-1">80</td>
                  <td className="border border-slate-400 p-1 font-bold">210.4</td>
                  <td className="border border-slate-400 p-1">21.6</td>
                  <td className="border border-slate-400 p-1">13.2</td>
                  <td className="border border-slate-400 p-1">2.1</td>
                  <td className="border border-slate-400 p-1">0.2</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.laukNabati}</td>
                  <td className="border border-slate-400 p-1">50</td>
                  <td className="border border-slate-400 p-1 font-bold">98.5</td>
                  <td className="border border-slate-400 p-1">8.5</td>
                  <td className="border border-slate-400 p-1">4.2</td>
                  <td className="border border-slate-400 p-1">7.4</td>
                  <td className="border border-slate-400 p-1">1.8</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.sayur}</td>
                  <td className="border border-slate-400 p-1">100</td>
                  <td className="border border-slate-400 p-1 font-bold">62.0</td>
                  <td className="border border-slate-400 p-1">3.2</td>
                  <td className="border border-slate-400 p-1">1.5</td>
                  <td className="border border-slate-400 p-1">9.8</td>
                  <td className="border border-slate-400 p-1">2.4</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.buah}</td>
                  <td className="border border-slate-400 p-1">100</td>
                  <td className="border border-slate-400 p-1 font-bold">89.0</td>
                  <td className="border border-slate-400 p-1">1.1</td>
                  <td className="border border-slate-400 p-1">0.3</td>
                  <td className="border border-slate-400 p-1">22.8</td>
                  <td className="border border-slate-400 p-1">2.6</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-indigo-50 font-bold">
                  <td colSpan={2} className="border border-slate-400 p-1.5 text-right">TOTAL PORSI BESAR:</td>
                  <td className="border border-slate-400 p-1.5 text-indigo-900 font-black">719.9 Kkal</td>
                  <td className="border border-slate-400 p-1.5 text-indigo-900 font-black">39.2 g</td>
                  <td className="border border-slate-400 p-1.5 text-indigo-900 font-black">19.8 g</td>
                  <td className="border border-slate-400 p-1.5 text-indigo-900 font-black">99.3 g</td>
                  <td className="border border-slate-400 p-1.5 text-indigo-900 font-black">7.8 g</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* TABEL GIZI PORSI KECIL */}
          <div className="space-y-1.5 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-emerald-900 flex items-center justify-between">
              <span>B. Analisis Kandungan Gizi - PORSI KECIL (Target: SD/MI/PAUD - {summaryPenerima.porsiKecil} Porsi)</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Standar Energi: 450 - 550 Kkal</span>
            </div>
            <table className="w-full border-collapse border border-slate-400 text-center text-xs">
              <thead>
                <tr className="bg-emerald-100 font-bold">
                  <th className="border border-slate-400 p-1.5">Komponen Bahan</th>
                  <th className="border border-slate-400 p-1.5">Gramasi (g)</th>
                  <th className="border border-slate-400 p-1.5">Energi (Kkal)</th>
                  <th className="border border-slate-400 p-1.5">Protein (g)</th>
                  <th className="border border-slate-400 p-1.5">Lemak (g)</th>
                  <th className="border border-slate-400 p-1.5">Karbohidrat (g)</th>
                  <th className="border border-slate-400 p-1.5">Serat (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.makananPokok}</td>
                  <td className="border border-slate-400 p-1">130</td>
                  <td className="border border-slate-400 p-1 font-bold">169.0</td>
                  <td className="border border-slate-400 p-1">3.1</td>
                  <td className="border border-slate-400 p-1">0.4</td>
                  <td className="border border-slate-400 p-1">37.2</td>
                  <td className="border border-slate-400 p-1">0.5</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.laukHewani}</td>
                  <td className="border border-slate-400 p-1">50</td>
                  <td className="border border-slate-400 p-1 font-bold">131.5</td>
                  <td className="border border-slate-400 p-1">13.5</td>
                  <td className="border border-slate-400 p-1">8.3</td>
                  <td className="border border-slate-400 p-1">1.3</td>
                  <td className="border border-slate-400 p-1">0.1</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.laukNabati}</td>
                  <td className="border border-slate-400 p-1">35</td>
                  <td className="border border-slate-400 p-1 font-bold">69.0</td>
                  <td className="border border-slate-400 p-1">6.0</td>
                  <td className="border border-slate-400 p-1">2.9</td>
                  <td className="border border-slate-400 p-1">5.2</td>
                  <td className="border border-slate-400 p-1">1.3</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.sayur}</td>
                  <td className="border border-slate-400 p-1">70</td>
                  <td className="border border-slate-400 p-1 font-bold">43.4</td>
                  <td className="border border-slate-400 p-1">2.2</td>
                  <td className="border border-slate-400 p-1">1.1</td>
                  <td className="border border-slate-400 p-1">6.9</td>
                  <td className="border border-slate-400 p-1">1.7</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1 text-left font-semibold">{menuHarian.buah}</td>
                  <td className="border border-slate-400 p-1">80</td>
                  <td className="border border-slate-400 p-1 font-bold">71.2</td>
                  <td className="border border-slate-400 p-1">0.9</td>
                  <td className="border border-slate-400 p-1">0.2</td>
                  <td className="border border-slate-400 p-1">18.2</td>
                  <td className="border border-slate-400 p-1">2.1</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 font-bold">
                  <td colSpan={2} className="border border-slate-400 p-1.5 text-right">TOTAL PORSI KECIL:</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">484.1 Kkal</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">25.7 g</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">12.9 g</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">68.8 g</td>
                  <td className="border border-slate-400 p-1.5 text-emerald-900 font-black">5.7 g</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Ahli Gizi Penyusun Standar,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Kepala SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 9. CETAK RINCIAN INFORMASI FOOD COST MENU (Dibagi porsi besar & kecil)
    // -------------------------------------------------------------
    case 'food-cost':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN REALISASI FOOD COST MENU TERHADAP PURCHASE ORDER
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Analisis Efisiensi Belanja Bahan Baku Pangan • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Raw Material Cost</div>
              <div className="text-base font-black text-blue-900 mt-0.5">Rp 19.825.000</div>
              <div className="text-[10px] text-slate-600">Alokasi {summaryPenerima.totalPorsi} Porsi</div>
            </div>
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Food Cost Porsi Besar</div>
              <div className="text-base font-black text-indigo-900 mt-0.5">Rp 14.250 / Porsi</div>
              <div className="text-[10px] text-slate-600">Target Maksimal: Rp 15.000</div>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Food Cost Porsi Kecil</div>
              <div className="text-base font-black text-emerald-900 mt-0.5">Rp 10.250 / Porsi</div>
              <div className="text-[10px] text-slate-600">Target Maksimal: Rp 12.000</div>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-800">
            Rincian Belanja Bahan Baku Harian (Sumber Data: Purchase Order):
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-1.5">No</th>
                <th className="border border-slate-400 p-1.5 text-left">Nama Bahan Baku</th>
                <th className="border border-slate-400 p-1.5">Volume PO</th>
                <th className="border border-slate-400 p-1.5">Harga Satuan</th>
                <th className="border border-slate-400 p-1.5">Total Biaya</th>
                <th className="border border-slate-400 p-1.5">Beban Porsi Besar (72%)</th>
                <th className="border border-slate-400 p-1.5">Beban Porsi Kecil (28%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: 'Beras Premium Pulen', vol: '272 Kg', hrg: 'Rp 14.500', total: 'Rp 3.944.000', besar: 'Rp 2.839.680', kecil: 'Rp 1.104.320' },
                { no: 2, nama: 'Daging Ayam Segar Karkas', vol: '108 Kg', hrg: 'Rp 38.000', total: 'Rp 4.104.000', besar: 'Rp 2.954.880', kecil: 'Rp 1.149.120' },
                { no: 3, nama: 'Tempe Kedelai Murni', vol: '69 Kg', hrg: 'Rp 12.000', total: 'Rp 828.000', besar: 'Rp 596.160', kecil: 'Rp 231.840' },
                { no: 4, nama: 'Sayur Sop Campur (Wortel, Buncis, Kol)', vol: '138 Kg', hrg: 'Rp 16.000', total: 'Rp 2.208.000', besar: 'Rp 1.589.760', kecil: 'Rp 618.240' },
                { no: 5, nama: 'Pisang Ambon Super', vol: '1.525 Buah', hrg: 'Rp 2.000', total: 'Rp 3.050.000', besar: 'Rp 2.096.000', kecil: 'Rp 954.000' },
                { no: 6, nama: 'Minyak Goreng & Bumbu Rempah Segar', vol: '1 Paket', hrg: 'Rp 2.150.000', total: 'Rp 2.150.000', besar: 'Rp 1.548.000', kecil: 'Rp 602.000' },
                { no: 7, nama: 'Susu UHT Plain 200ml', vol: '1.525 Kotak', hrg: 'Rp 2.320', total: 'Rp 3.538.000', besar: 'Rp 2.431.360', kecil: 'Rp 1.106.640' },
              ].map(r => (
                <tr key={r.no}>
                  <td className="border border-slate-400 p-1.5">{r.no}</td>
                  <td className="border border-slate-400 p-1.5 text-left font-semibold">{r.nama}</td>
                  <td className="border border-slate-400 p-1.5">{r.vol}</td>
                  <td className="border border-slate-400 p-1.5 text-right">{r.hrg}</td>
                  <td className="border border-slate-400 p-1.5 text-right font-bold">{r.total}</td>
                  <td className="border border-slate-400 p-1.5 text-right font-medium text-indigo-900 bg-indigo-50/30">{r.besar}</td>
                  <td className="border border-slate-400 p-1.5 text-right font-medium text-emerald-900 bg-emerald-50/30">{r.kecil}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={4} className="border border-slate-400 p-2 text-right">TOTAL BIAYA BELANJA:</td>
                <td className="border border-slate-400 p-2 text-right text-blue-900 font-black">Rp 19.822.000</td>
                <td className="border border-slate-400 p-2 text-right text-indigo-900 font-black">Rp 14.055.840</td>
                <td className="border border-slate-400 p-2 text-right text-emerald-900 font-black">Rp 5.766.160</td>
              </tr>
            </tfoot>
          </table>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Petugas Pengadaan / Keuangan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasPengadaan}</div>
              <div className="text-[10px] text-slate-600">NIP/ID: LOG-001/TMG2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Kepala SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 10. CETAK RINCIAN PURCHASE ORDER
    // -------------------------------------------------------------
    case 'purchase-order':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              DOKUMEN PURCHASE ORDER (PO) PENGADAAN BAHAN MAKANAN
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Nomor PO: PO-BGN.TMG2/{selectedDate.replace(/-/g, '')}/044
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-300 text-[11px]">
            <div>
              <div><b>Tanggal Pemesanan:</b> {formatTanggalIndo(selectedDate)}</div>
              <div><b>Target Pengiriman:</b> H-1 Sebelum Pengolahan Pukul 18:00 WIB</div>
              <div><b>Alamat Penerima:</b> Dapur SPPG Temenggungan 2, Jl. Raya Temenggungan No. 02</div>
            </div>
            <div>
              <div><b>Supplier Utama:</b> PT Agro Krejengan Makmur Sejahtera</div>
              <div><b>Alamat Supplier:</b> Jl. Raya Kraksaan Km 4, Kab. Probolinggo</div>
              <div><b>Kontak PIC Vendor:</b> Bpk. Sutrisno (0812-3498-7654)</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">No</th>
                <th className="border border-slate-400 p-2 text-left">Deskripsi Bahan Pangan</th>
                <th className="border border-slate-400 p-2">Kategori</th>
                <th className="border border-slate-400 p-2">Kuantitas</th>
                <th className="border border-slate-400 p-2">Satuan</th>
                <th className="border border-slate-400 p-2 text-right">Harga Satuan</th>
                <th className="border border-slate-400 p-2 text-right">Jumlah Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: 'Beras Medium / Premium Super', kat: 'Karbohidrat Pokok', qty: 272, sat: 'Kg', hrg: 'Rp 14.500', tot: 'Rp 3.944.000' },
                { no: 2, nama: 'Daging Ayam Broiler Segar Dingin', kat: 'Protein Hewani', qty: 108, sat: 'Kg', hrg: 'Rp 38.000', tot: 'Rp 4.104.000' },
                { no: 3, nama: 'Tempe Kedelai Super', kat: 'Protein Nabati', qty: 69, sat: 'Kg', hrg: 'Rp 12.000', tot: 'Rp 828.000' },
                { no: 4, nama: 'Sayur Sop Segar (Wortel & Buncis)', kat: 'Sayuran Segar', qty: 138, sat: 'Kg', hrg: 'Rp 16.000', tot: 'Rp 2.208.000' },
                { no: 5, nama: 'Pisang Ambon Standar Grade A', kat: 'Buah Segar', qty: 1525, sat: 'Buah', hrg: 'Rp 2.000', tot: 'Rp 3.050.000' },
                { no: 6, nama: 'Bumbu Dapur Basah Lengkap', kat: 'Bumbu & Rempah', qty: 1, sat: 'Paket', hrg: 'Rp 2.150.000', tot: 'Rp 2.150.000' },
                { no: 7, nama: 'Susu UHT Plain Kemasan 200ml', kat: 'Minuman Tambahan', qty: 1525, sat: 'Kotak', hrg: 'Rp 2.320', tot: 'Rp 3.538.000' },
              ].map(r => (
                <tr key={r.no}>
                  <td className="border border-slate-400 p-1.5">{r.no}</td>
                  <td className="border border-slate-400 p-1.5 text-left font-bold">{r.nama}</td>
                  <td className="border border-slate-400 p-1.5 text-slate-600">{r.kat}</td>
                  <td className="border border-slate-400 p-1.5 font-bold">{r.qty}</td>
                  <td className="border border-slate-400 p-1.5">{r.sat}</td>
                  <td className="border border-slate-400 p-1.5 text-right">{r.hrg}</td>
                  <td className="border border-slate-400 p-1.5 text-right font-black text-blue-900">{r.tot}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={6} className="border border-slate-400 p-2 text-right">TOTAL NILAI PEMESANAN (PO):</td>
                <td className="border border-slate-400 p-2 text-right font-black text-blue-900 text-sm">Rp 19.822.000</td>
              </tr>
            </tfoot>
          </table>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[11px] font-semibold">Petugas Pengadaan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasPengadaan}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold">Pihak Rekanan / Supplier,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Sutrisno, S.E.</div>
              <div className="text-[10px] text-slate-600">PT Agro Krejengan Makmur</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold">Menyetujui Kepala SPPG,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.kepalaSPPG}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.nipKepala}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 11. CETAK RINCIAN QC BAHAN DAN BARANG OPERASIONAL
    // -------------------------------------------------------------
    case 'qc-barang':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN QUALITY CONTROL (QC) PENERIMAAN BARANG & BAHAN
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Pemeriksaan Fisik, Suhu Kedatangan, & Verifikasi Mutu • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-1.5">No</th>
                <th className="border border-slate-400 p-1.5 text-left">Nama Bahan / Barang</th>
                <th className="border border-slate-400 p-1.5">Kuantitas Tiba</th>
                <th className="border border-slate-400 p-1.5">Suhu (°C)</th>
                <th className="border border-slate-400 p-1.5">Kondisi Fisik / Mutu</th>
                <th className="border border-slate-400 p-1.5">Reject / Rusak</th>
                <th className="border border-slate-400 p-1.5">Status Rilis</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, nama: 'Daging Ayam Karkas Dingin', qty: '108 Kg', temp: '3.4°C', fisik: 'Segar, kenyal, tidak bau asing', reject: '0 Kg', st: 'DITERIMA' },
                { no: 2, nama: 'Beras Premium', qty: '272 Kg (11 Karung)', temp: '25.0°C', fisik: 'Bersih, putih, bebas kutu', reject: '0 Kg', st: 'DITERIMA' },
                { no: 3, nama: 'Wortel & Buncis Segar', qty: '138 Kg', temp: '16.2°C', fisik: 'Segar cerah, tidak layu', reject: '1.2 Kg (Layu)', st: 'DITERIMA SEBAGIAN' },
                { no: 4, nama: 'Tempe Kedelai Super', qty: '69 Kg', temp: '24.1°C', fisik: 'Padat, miselium putih merata', reject: '0 Kg', st: 'DITERIMA' },
                { no: 5, nama: 'Pisang Ambon', qty: '1.525 Buah', temp: '23.5°C', fisik: 'Kuning mulus matang optimal', reject: '3 Buah (Memar)', st: 'DITERIMA DENGAN PENGGANTIAN' },
                { no: 6, nama: 'Ompreng Stainless SUS304', qty: '250 Pcs', temp: 'Ruang', fisik: 'Higienis, steril, segel pabrik', reject: '0 Pcs', st: 'DITERIMA' },
              ].map(r => (
                <tr key={r.no}>
                  <td className="border border-slate-400 p-1.5">{r.no}</td>
                  <td className="border border-slate-400 p-1.5 text-left font-bold">{r.nama}</td>
                  <td className="border border-slate-400 p-1.5">{r.qty}</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-blue-900">{r.temp}</td>
                  <td className="border border-slate-400 p-1.5 text-slate-700">{r.fisik}</td>
                  <td className="border border-slate-400 p-1.5 text-red-600 font-semibold">{r.reject}</td>
                  <td className="border border-slate-400 p-1.5 font-black text-emerald-800 bg-emerald-50">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px] space-y-1">
            <b>Catatan Tindak Lanjut Reject QC:</b>
            <p className="text-slate-600">
              Barang yang mengalami kerusakan fisik ringan (1.2 Kg sayur layu dan 3 buah pisang memar) telah langsung diganti oleh vendor saat serah terima di area loading dock tanpa memotong anggaran.
            </p>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Petugas Quality Control (QC),</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasQC}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Petugas Gudang Bahan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Dewi Lestari, A.Md.Gz</div>
              <div className="text-[10px] text-slate-600">Koordinator Persiapan & Logistik</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 12. CETAK RINCIAN DATA + FOTO SUHU RUANG PERSIAPAN
    // -------------------------------------------------------------
    case 'suhu-ruang-persiapan':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN SUHU RUANG PERSIAPAN BAHAN & DOKUMENTASI FOTO
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Standar Regulasi BGN: Suhu Ruang Terkendali ≤ 25°C • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Waktu Pengukuran</th>
                <th className="border border-slate-400 p-2">Suhu Terukur (°C)</th>
                <th className="border border-slate-400 p-2">Kelembaban (%)</th>
                <th className="border border-slate-400 p-2">Batas Kritis Standar</th>
                <th className="border border-slate-400 p-2">Kondisi Ventilasi / AC</th>
                <th className="border border-slate-400 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { jam: '06:00 WIB (Awal Shift)', temp: '21.5°C', rh: '62%', max: '≤ 25°C', ac: 'AC Split 2 PK Aktif Normal', st: 'Optimal' },
                { jam: '08:30 WIB (Puncak Pembersihan)', temp: '22.8°C', rh: '65%', max: '≤ 25°C', ac: 'Exhaust Fan & AC Aktif', st: 'Optimal' },
                { jam: '11:00 WIB (Penyelesaian Bahan)', temp: '23.2°C', rh: '64%', max: '≤ 25°C', ac: 'Sirkulasi Dingin Normal', st: 'Optimal' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold">{r.jam}</td>
                  <td className="border border-slate-400 p-2 font-black text-blue-900 text-sm">{r.temp}</td>
                  <td className="border border-slate-400 p-2">{r.rh}</td>
                  <td className="border border-slate-400 p-2 text-slate-600">{r.max}</td>
                  <td className="border border-slate-400 p-2 text-slate-700">{r.ac}</td>
                  <td className="border border-slate-400 p-2 font-black text-emerald-800 bg-emerald-50">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DOKUMENTASI FOTO */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Dokumentasi Foto Termometer Digital & Ruang Persiapan:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Display Termometer Ruang Persiapan</span>
                  <span className="text-[9px] text-slate-500">Menunjukkan Suhu: 22.8°C | RH: 65%</span>
                </div>
                <div className="text-[11px] font-bold">Termometer Ruangan Dinding Persiapan</div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Kondisi Ruang Persiapan Sayur & Lauk</span>
                  <span className="text-[9px] text-slate-500">Petugas Memakai APD Lengkap & Meja Stainless</span>
                </div>
                <div className="text-[11px] font-bold">Aktivitas Persiapan Bahan Pangan</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Persiapan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">Dewi Lestari, A.Md.Gz</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi Pengawas Lingkungan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 13. CETAK RINCIAN DATA + FOTO SUHU RUANG PENGOLAHAN
    // -------------------------------------------------------------
    case 'suhu-ruang-pengolahan':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN SUHU RUANG PENGOLAHAN (DAPUR UTAMA) & DOKUMENTASI FOTO
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Monitoring Sirkulasi Udara & Suhu Lingkungan Memasak • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Waktu Log</th>
                <th className="border border-slate-400 p-2">Suhu Area Masak (°C)</th>
                <th className="border border-slate-400 p-2">Status Exhaust Hood</th>
                <th className="border border-slate-400 p-2">Aliran Udara (Airflow)</th>
                <th className="border border-slate-400 p-2">Catatan Kepatuhan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { jam: '06:30 WIB (Pemanasan Kompor)', temp: '26.5°C', hood: 'Aktif 100% (4 Unit Hood)', flow: 'Lancar & Bebas Asap Pekat', note: 'Ventilasi optimal' },
                { jam: '08:30 WIB (Puncak Memasak)', temp: '29.2°C', hood: 'Aktif 100% + Blower Sentral', flow: 'Pertukaran Udara 15x / Jam', note: 'Suhu kerja aman ergonomis' },
                { jam: '10:00 WIB (Api Padam / Finishing)', temp: '27.0°C', hood: 'Aktif Modulasi Rendah', flow: 'Sirkulasi Menurun Stabil', note: 'Area dapur dingin kembali' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold">{r.jam}</td>
                  <td className="border border-slate-400 p-2 font-black text-amber-900 text-sm">{r.temp}</td>
                  <td className="border border-slate-400 p-2 text-slate-700">{r.hood}</td>
                  <td className="border border-slate-400 p-2 text-slate-700">{r.flow}</td>
                  <td className="border border-slate-400 p-2 font-semibold text-emerald-800">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DOKUMENTASI FOTO */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Dokumentasi Foto Suhu & Area Ruang Pengolahan:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Display Sensor Suhu Dapur Utama</span>
                  <span className="text-[9px] text-slate-500">29.2°C Saat Puncak Memasak Bersama Chef</span>
                </div>
                <div className="text-[11px] font-bold">Panel Suhu Digital Dapur</div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Dapur & Exhaust Hood Menyala</span>
                  <span className="text-[9px] text-slate-500">Kondisi Bersih, Higienis & Bebas Jelaga</span>
                </div>
                <div className="text-[11px] font-bold">Kondisi Kerja Ruang Pengolahan</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Pengolahan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorPengolahan}</div>
              <div className="text-[10px] text-slate-600">Kepala Koki SPPG</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 14. CETAK RINCIAN DATA + FOTO SUHU RUANG PEMORSIAN
    // -------------------------------------------------------------
    case 'suhu-ruang-pemorsian':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN SUHU RUANG PEMORSIAN (PACKING AREA) & DOKUMENTASI FOTO
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Clean Room Area Standar Higiene Kelas Tinggi • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Waktu Pemorsian</th>
                <th className="border border-slate-400 p-2">Suhu Terukur (°C)</th>
                <th className="border border-slate-400 p-2">Kelembaban (%)</th>
                <th className="border border-slate-400 p-2">Standar Suhu Clean Room</th>
                <th className="border border-slate-400 p-2">Kepatuhan APD Petugas</th>
                <th className="border border-slate-400 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { jam: '09:30 WIB (Pra-Pemorsian)', temp: '21.0°C', rh: '58%', std: '20°C - 24°C', apd: 'Masker, Hairnet, Sarung Tangan, Celemek', st: 'Sesuai Standar' },
                { jam: '10:15 WIB (Proses Pemorsian Puncak)', temp: '22.4°C', rh: '60%', std: '20°C - 24°C', apd: '100% Petugas Patuh SOP Steril', st: 'Sesuai Standar' },
                { jam: '10:50 WIB (Penyegelan Box Ompreng)', temp: '22.0°C', rh: '59%', std: '20°C - 24°C', apd: 'Sealing Ompreng Rapat & Steril', st: 'Sesuai Standar' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold">{r.jam}</td>
                  <td className="border border-slate-400 p-2 font-black text-blue-900 text-sm">{r.temp}</td>
                  <td className="border border-slate-400 p-2">{r.rh}</td>
                  <td className="border border-slate-400 p-2 text-slate-600">{r.std}</td>
                  <td className="border border-slate-400 p-2 text-slate-700">{r.apd}</td>
                  <td className="border border-slate-400 p-2 font-black text-emerald-800 bg-emerald-50">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DOKUMENTASI FOTO */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Dokumentasi Foto Suhu & Aktivitas Ruang Pemorsian:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Display Suhu Ruang Pemorsian</span>
                  <span className="text-[9px] text-slate-500">22.4°C AC Bersih & Bertekanan Positif</span>
                </div>
                <div className="text-[11px] font-bold">Termometer Ruang Pemorsian</div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Jalur Perakitan & Sealing Ompreng</span>
                  <span className="text-[9px] text-slate-500">Meja Stainless Steel Bebas Kontaminasi</span>
                </div>
                <div className="text-[11px] font-bold">Area Pemorsian Steril</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Pemorsian,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorPemorsian}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 15. CETAK RINCIAN DATA + FOTO SUHU MAKANAN PENGOLAHAN
    // -------------------------------------------------------------
    case 'suhu-makanan-pengolahan':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN KONTROL SUHU MAKANAN SAAT MATANG (DIVISI PENGOLAHAN)
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Critical Control Point (CCP) Suhu Inti Masak • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Item Menu</th>
                <th className="border border-slate-400 p-2">Waktu Pengukuran</th>
                <th className="border border-slate-400 p-2">Suhu Inti Terukur (°C)</th>
                <th className="border border-slate-400 p-2">Standar Minimal CCP</th>
                <th className="border border-slate-400 p-2">Instrumen Pengukur</th>
                <th className="border border-slate-400 p-2">Evaluasi Keamanan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: menuHarian.makananPokok, jam: '09:15 WIB', temp: '84.2°C', ccp: '≥ 75°C', tool: 'Food Probe Digital Calibrated', st: 'MEMENUHI CCP' },
                { item: menuHarian.laukHewani, jam: '09:30 WIB', temp: '88.5°C', ccp: '≥ 80°C', tool: 'Food Probe Digital Calibrated', st: 'MEMENUHI CCP' },
                { item: menuHarian.laukNabati, jam: '09:20 WIB', temp: '80.1°C', ccp: '≥ 75°C', tool: 'Food Probe Digital Calibrated', st: 'MEMENUHI CCP' },
                { item: menuHarian.sayur, jam: '09:40 WIB', temp: '81.4°C', ccp: '≥ 75°C', tool: 'Food Probe Digital Calibrated', st: 'MEMENUHI CCP' },
                { item: menuHarian.buah, jam: '09:00 WIB', temp: '22.0°C', ccp: '15°C - 25°C', tool: 'Infrared Thermometer', st: 'SEGAR & AMAN' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold text-left">{r.item}</td>
                  <td className="border border-slate-400 p-2">{r.jam}</td>
                  <td className="border border-slate-400 p-2 font-black text-rose-900 text-sm bg-rose-50/40">{r.temp}</td>
                  <td className="border border-slate-400 p-2 font-semibold text-slate-700">{r.ccp}</td>
                  <td className="border border-slate-400 p-2 text-slate-600">{r.tool}</td>
                  <td className="border border-slate-400 p-2 font-black text-emerald-800 bg-emerald-50">{r.st}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DOKUMENTASI FOTO */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Dokumentasi Foto Pengukuran Food Probe Thermometer Tusuk:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Termometer Tusuk Masuk Lauk Hewani</span>
                  <span className="text-[9px] text-slate-500">Angka Layar Digital: 88.5°C di Bagian Tengah Daging</span>
                </div>
                <div className="text-[11px] font-bold">Pemeriksaan Suhu Ayam Goreng</div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Termometer Tusuk Masuk Nasi & Sayur</span>
                  <span className="text-[9px] text-slate-500">Suhu Nasi 84.2°C & Sayur Sop 81.4°C</span>
                </div>
                <div className="text-[11px] font-bold">Pemeriksaan Suhu Nasi & Sayur Sop</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Chef Pelaksana Masak,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorPengolahan}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi Pengawas Mutu Pangan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 16. CETAK RINCIAN SUHU MAKANAN PEMORSIAN
    // -------------------------------------------------------------
    case 'suhu-makanan-pemorsian':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN KONTROL SUHU MAKANAN SAAT PEMORSIAN & SEALING OMPRENG
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Hot Holding & Sealing Quality Clearance Sebelum Loading Distribusi • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Item Komponen</th>
                <th className="border border-slate-400 p-2">Suhu Masuk Ompreng Porsi Besar</th>
                <th className="border border-slate-400 p-2">Suhu Masuk Ompreng Porsi Kecil</th>
                <th className="border border-slate-400 p-2">Standar Hot Holding Minimal</th>
                <th className="border border-slate-400 p-2">Status Sealing</th>
                <th className="border border-slate-400 p-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: menuHarian.makananPokok, besar: '72.5°C', kecil: '71.8°C', std: '≥ 60°C', seal: 'Rapat Kedap Udara', note: 'Hangat optimal' },
                { item: menuHarian.laukHewani, besar: '74.2°C', kecil: '73.0°C', std: '≥ 60°C', seal: 'Rapat Kedap Udara', note: 'Hangat optimal' },
                { item: menuHarian.laukNabati, besar: '68.5°C', kecil: '67.9°C', std: '≥ 60°C', seal: 'Rapat Kedap Udara', note: 'Hangat optimal' },
                { item: menuHarian.sayur, besar: '70.1°C', kecil: '69.4°C', std: '≥ 60°C', seal: 'Rapat Kedap Udara (Anti Tumpah)', note: 'Seal silikon aman' },
                { item: menuHarian.buah, besar: '22.0°C (Ruang)', kecil: '22.0°C (Ruang)', std: '15°C - 25°C', seal: 'Plastik Higienis Utuh', note: 'Segar terlindungi' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold text-left">{r.item}</td>
                  <td className="border border-slate-400 p-2 font-black text-indigo-900">{r.besar}</td>
                  <td className="border border-slate-400 p-2 font-black text-emerald-900">{r.kecil}</td>
                  <td className="border border-slate-400 p-2 text-slate-700 font-medium">{r.std}</td>
                  <td className="border border-slate-400 p-2 text-emerald-800 font-semibold">{r.seal}</td>
                  <td className="border border-slate-400 p-2 font-semibold text-slate-700">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs space-y-1">
            <b>Verifikasi Suhu Insulated Box Pengiriman:</b>
            <p className="text-slate-600 text-[11px]">
              Ompreng telah dimasukkan ke dalam container thermal bersegel dengan suhu holding dalam box tercatat <b>65.5°C</b>, memastikan makanan tetap hangat saat tiba di sekolah sasaran pada pukul 11:00 WIB.
            </p>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Pemorsian,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorPemorsian}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Pengawas QC Lapangan,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.petugasQC}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 17. CETAK RINCIAN DATA + FOTO FOOD WASTE
    // -------------------------------------------------------------
    case 'food-waste':
      return (
        <div className="space-y-4 text-xs font-sans text-slate-900 leading-relaxed">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
              LAPORAN PENCATATAN FOOD WASTE (SISA MAKANAN) & DOKUMENTASI FOTO
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Evaluasi Daya Terima Menu & Pengelolaan Limbah Organik (Divisi Cuci Ompreng) • Tanggal: {formatTanggalIndo(selectedDate)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Ompreng Kembali</div>
              <div className="text-lg font-black text-blue-900 mt-0.5">{summaryPenerima.totalPorsi.toLocaleString('id-ID')} Pcs</div>
              <div className="text-[10px] text-slate-600">100% Ompreng Terkumpul</div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Sisa Makanan (Waste)</div>
              <div className="text-lg font-black text-amber-900 mt-0.5">18.4 Kg</div>
              <div className="text-[10px] text-slate-600">Rata-rata 12 gram / siswa</div>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Tingkat Konsumsi (Plate Waste)</div>
              <div className="text-lg font-black text-emerald-900 mt-0.5">97.2%</div>
              <div className="text-[10px] text-slate-600">Sangat Tinggi (Target &gt;90%)</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-center text-xs">
            <thead>
              <tr className="bg-slate-200 font-bold">
                <th className="border border-slate-400 p-2">Komponen Makanan</th>
                <th className="border border-slate-400 p-2">Total Produksi Disalurkan</th>
                <th className="border border-slate-400 p-2">Berat Sisa Makanan (Kg)</th>
                <th className="border border-slate-400 p-2">Persentase Sisa (%)</th>
                <th className="border border-slate-400 p-2">Analisa Penyebab Sisa</th>
                <th className="border border-slate-400 p-2">Tindak Lanjut Limbah</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: 'Sisa Nasi Putih', prod: '272 Kg', sisa: '5.2 Kg', pct: '1.9%', note: 'Sebagian siswa kelas 1 SD porsi kecil kenyang', sol: 'Kompos Organik / Pakan Ternak' },
                { item: 'Sisa Lauk Hewani (Ayam)', prod: '108 Kg', sisa: '1.8 Kg', pct: '1.6%', note: 'Tulang ayam & serpihan bumbu lengkuas', sol: 'Dikelola Tim Limbah BGN' },
                { item: 'Sisa Lauk Nabati (Tempe)', prod: '69 Kg', sisa: '1.4 Kg', pct: '2.0%', note: 'Sisa remah kecil tempe bacem', sol: 'Kompos Organik SPPG' },
                { item: 'Sisa Sayur Sop Bakso', prod: '138 Kg', sisa: '4.8 Kg', pct: '3.4%', note: 'Kuah sop tersisa di ompreng siswa', sol: 'Saluran Filtrasi IPAL Ramah Lingkungan' },
                { item: 'Sisa Kulit Pisang', prod: '1.525 Buah', sisa: '5.2 Kg', pct: '3.4%', note: 'Kulit pisang organik sisa konsumsi', sol: 'Komposter Maggot SPPG' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 p-2 font-bold text-left">{r.item}</td>
                  <td className="border border-slate-400 p-2">{r.prod}</td>
                  <td className="border border-slate-400 p-2 font-bold text-amber-900">{r.sisa}</td>
                  <td className="border border-slate-400 p-2 font-semibold text-slate-700">{r.pct}</td>
                  <td className="border border-slate-400 p-2 text-left text-[11px] text-slate-600">{r.note}</td>
                  <td className="border border-slate-400 p-2 text-left text-[11px] font-medium text-emerald-800">{r.sol}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-400 p-2 text-left">TOTAL LIMBAH ORGANIK:</td>
                <td className="border border-slate-400 p-2">587 Kg (Pangan)</td>
                <td className="border border-slate-400 p-2 text-amber-900 font-black">18.4 Kg</td>
                <td className="border border-slate-400 p-2 font-black text-emerald-800">2.8% (Sangat Rendah)</td>
                <td colSpan={2} className="border border-slate-400 p-2 text-left text-xs text-emerald-800 font-bold">Daya Terima Makanan Terkategori Sangat Baik</td>
              </tr>
            </tfoot>
          </table>

          {/* DOKUMENTASI FOTO */}
          <div className="space-y-2 pt-2">
            <div className="font-bold text-xs uppercase tracking-wide text-slate-800">
              Dokumentasi Foto Penimbangan Food Waste di Divisi Cuci Ompreng:
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Penimbangan Sisa Makanan di Timbangan Digital</span>
                  <span className="text-[9px] text-slate-500">Angka Timbangan Terkalibrasi Menunjukkan 18.4 Kg Total</span>
                </div>
                <div className="text-[11px] font-bold">Penimbangan Sampah Makanan</div>
              </div>

              <div className="border border-slate-300 rounded p-2 text-center bg-slate-50 space-y-1">
                <div className="aspect-video bg-slate-200 rounded flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <Icons.Camera className="w-8 h-8 text-slate-400" />
                  <span className="text-[10px] font-semibold mt-1">Foto Ompreng Pasca Cuci & Sterilisasi Thermal</span>
                  <span className="text-[9px] text-slate-500">Ompreng Bersih Bebas Residu Lemak & Disinfeksi Panas</span>
                </div>
                <div className="text-[11px] font-bold">Sterilisasi Ompreng Kembali</div>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-xs font-semibold">Koordinator Divisi Cuci Ompreng,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.koordinatorCuci}</div>
              <div className="text-[10px] text-slate-600">SPPG Temenggungan 2</div>
            </div>
            <div>
              <div className="text-xs font-semibold">Ahli Gizi SPPG Temenggungan 2,</div>
              <div className="h-16"></div>
              <div className="font-bold underline text-xs">{identitas.pejabat.ahliGizi}</div>
              <div className="text-[10px] text-slate-600">{identitas.pejabat.strAhliGizi}</div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Pilih jenis laporan yang akan dicetak pada daftar sub menu di atas.</div>;
  }
}
