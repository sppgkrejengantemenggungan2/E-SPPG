/**
 * Central Enterprise Store & Memory DB
 * Provides mock relational datasets for Core DB, Shared DB, and Module DBs.
 */

import { 
  User, 
  RolePermission, 
  MenuItem, 
  MasterPegawai, 
  MasterDivisi, 
  MasterJabatan, 
  MasterGudang, 
  MasterKategori, 
  MasterInstansi, 
  SuratMasuk, 
  SuratKeluar, 
  Disposisi, 
  TemplateSurat, 
  MasterBarang, 
  StockMovement, 
  StockOpnameSession, 
  NotificationItem, 
  ActivityLog, 
  PortalSettings,
  MasterKendaraan,
  LaporanBbm,
  DivisiTaskRecord,
  WhatsAppDivisiSetting,
  TaskTemplate,
  TugasChecklistItem,
  BeneficiaryGroup,
  BeneficiaryLocation,
  DailyBeneficiaryRecord,
  BeneficiaryAuditLog,
  DailyBeneficiarySummary,
  MasterBahanPangan,
  MasterMenuResep,
  NutritionPlan,
  NutritionPlanItem,
  RABPlan,
  RABTarifConfig,
  RABKomposisiConfig,
  RABItemBahan,
  RABBiayaItem,
  RABAnalisisKelayakan,
  PurchaseOrderDocument,
  POItem,
  POSupplier,
  POShipTo,
  BarangDatang,
  JenisBarangDatang,
  DriverStaff,
  DistributionReport,
  MasterDocumentTemplateConfig,
  DEFAULT_MASTER_TEMPLATE_CONFIG,
  DivisiSubItemRecord,
  MasterMenuGiziItem,
  PlogDailyMenuItem
} from '../../src/types';

export const JWT_SECRET = process.env.JWT_SECRET || 'portal-administrasi-terpadu-super-secret-jwt-key-2026';

// --- INITIAL DATA STORE ---
export const initialUsers: User[] = [
  {
    id: "USR-001",
    nama: "Admin Penuh SPPG",
    username: "sppgkrejengantemenggungan2@gmail.com",
    email: "sppgkrejengantemenggungan2@gmail.com",
    role: "Admin Penuh",
    divisi: "Direksi & Administrasi Utama",
    jabatan: "Administrator Utama SPPG",
    status: "Aktif",
    password: "Krejengan",
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    emailVerified: true
  }
];


export const initialRoles: RolePermission[] = [
  {
    role: 'Admin Penuh',
    description: 'Akses penuh tanpa batas ke seluruh fitur aplikasi, master data, user management, dan cloud settings.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: true,
      masterData: true,
      userManagement: true,
      dynamicMenu: true,
      activityLogs: true,
      settings: true,
      apiDocs: true
    },
    actions: { canCreate: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
  },
  {
    role: 'Staff Kantor',
    description: 'Mengakses Menu Dashboard Utama, e-Surat Digital, dan Stock Opname.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: false,
      masterData: false,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: false,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: true, canEdit: true, canDelete: false, canApprove: false, canExport: true }
  },
  {
    role: 'Distribusi',
    description: 'Mengakses Dashboard Utama dan Laporan BBM Kendaraan.',
    modulesAccess: {
      dashboard: true,
      esurat: false,
      stockOpname: false,
      bbm: true,
      masterData: false,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: false,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: true, canEdit: true, canDelete: false, canApprove: false, canExport: true }
  },
  {
    role: 'Super Admin',
    description: 'Akses penuh tanpa batas ke seluruh modul, master data, audit logs, dan konfigurasi portal.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: true,
      masterData: true,
      userManagement: true,
      dynamicMenu: true,
      activityLogs: true,
      settings: true,
      apiDocs: true
    },
    actions: { canCreate: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
  },
  {
    role: 'Admin',
    description: 'Akses pengelolaan operasional, master data, e-Surat, dan Stock Opname.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: true,
      masterData: true,
      userManagement: true,
      dynamicMenu: false,
      activityLogs: true,
      settings: false,
      apiDocs: true
    },
    actions: { canCreate: true, canEdit: true, canDelete: false, canApprove: true, canExport: true }
  },
  {
    role: 'Operator',
    description: 'Akses entri data surat masuk/keluar, transaksi stok masuk/keluar, dan fisik opname.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: false,
      masterData: false,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: false,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: true, canEdit: true, canDelete: false, canApprove: false, canExport: true }
  },
  {
    role: 'Supervisor',
    description: 'Pengawasan, verifikasi surat, disposisi, dan persetujuan stok penyesuaian.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: true,
      masterData: true,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: true,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: true, canEdit: true, canDelete: false, canApprove: true, canExport: true }
  },
  {
    role: 'Manager',
    description: 'Akses laporan, persetujuan level tinggi, analisis aktivitas, dan dashboard eksekutif.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: true,
      masterData: true,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: true,
      settings: false,
      apiDocs: true
    },
    actions: { canCreate: false, canEdit: true, canDelete: false, canApprove: true, canExport: true }
  },
  {
    role: 'Staff',
    description: 'Menerima disposisi surat, mengajukan permintaan barang, dan melihat status dokumen.',
    modulesAccess: {
      dashboard: true,
      esurat: true,
      stockOpname: true,
      bbm: false,
      masterData: false,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: false,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: true, canEdit: false, canDelete: false, canApprove: false, canExport: false }
  },
  {
    role: 'Viewer',
    description: 'Hanya dapat melihat ringkasan dashboard dan laporan publik tanpa hak modifikasi.',
    modulesAccess: {
      dashboard: true,
      esurat: false,
      stockOpname: false,
      bbm: false,
      masterData: false,
      userManagement: false,
      dynamicMenu: false,
      activityLogs: false,
      settings: false,
      apiDocs: false
    },
    actions: { canCreate: false, canEdit: false, canDelete: false, canApprove: false, canExport: true }
  }
];

export const initialMenus: MenuItem[] = [
  {
    id: 'MNU-001',
    title: 'Dashboard Utama',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    color: '#3B82F6',
    order: 1,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-002',
    title: 'e-Surat Digital',
    path: '/esurat',
    icon: 'Mail',
    color: '#10B981',
    order: 2,
    targetModule: 'esurat',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff'],
    isActive: true
  },
  {
    id: 'MNU-003',
    title: 'Stock Opname',
    path: '/stock',
    icon: 'Boxes',
    color: '#F59E0B',
    order: 3,
    targetModule: 'stock',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff'],
    isActive: true
  },
  {
    id: 'MNU-003-DATANG',
    title: 'Input Kedatangan Barang',
    path: '/barang-datang',
    icon: 'PackagePlus',
    color: '#0284C7',
    order: 3.1,
    targetModule: 'barangDatang',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-BENEFICIARY',
    title: 'Penerima Manfaat',
    path: '/penerima-manfaat',
    icon: 'Users',
    color: '#059669',
    order: 3.5,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-PLANNING',
    title: 'Perencanaan Bahan Pangan',
    path: '/perencanaan-bahan',
    icon: 'UtensilsCrossed',
    color: '#10B981',
    order: 3.8,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-PO',
    title: 'Purchase Order (PO) 5 Hari',
    path: '/purchase-order',
    icon: 'FileCheck',
    color: '#2563EB',
    order: 3.9,
    targetModule: 'po',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-SUPPLIER',
    title: 'Portal Supplier',
    path: '/portal-supplier',
    icon: 'Truck',
    color: '#059669',
    order: 3.95,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-TUGAS',
    title: 'Tugas Divisi',
    path: '/tugas-divisi',
    icon: 'ClipboardCheck',
    color: '#2563EB',
    order: 4,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-PLOG',
    title: 'Laporan PLOG',
    path: '/laporan-plog',
    icon: 'ClipboardList',
    color: '#8B5CF6',
    order: 4.2,
    targetModule: 'plog',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-008-PRINT',
    title: 'Print Laporan',
    path: '/print-laporan',
    icon: 'Printer',
    color: '#0284C7',
    order: 4.3,
    targetModule: 'printLaporan',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-003-BBM',
    title: 'Laporan BBM Kendaraan',
    path: '/bbm/laporan',
    icon: 'Fuel',
    color: '#0284C7',
    order: 5,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Distribusi', 'Super Admin', 'Admin', 'Supervisor', 'Manager'],
    isActive: true
  },
  {
    id: 'MNU-003-DISTRIBUSI',
    title: 'Laporan Distribusi',
    path: '/laporan-distribusi',
    icon: 'Truck',
    color: '#2563EB',
    order: 4.5,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
    isActive: true
  },
  {
    id: 'MNU-004',
    title: 'Master Data Terpadu',
    path: '/master-data',
    icon: 'Database',
    color: '#8B5CF6',
    order: 5,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Super Admin', 'Admin', 'Supervisor', 'Manager'],
    isActive: true
  },
  {
    id: 'MNU-005',
    title: 'Manajemen Pengguna',
    path: '/admin/users',
    icon: 'Users',
    color: '#EC4899',
    order: 6,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Super Admin', 'Admin'],
    isActive: true
  },
  {
    id: 'MNU-006',
    title: 'Menu Dinamis',
    path: '/admin/menus',
    icon: 'Menu',
    color: '#06B6D4',
    order: 7,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Super Admin'],
    isActive: true
  },
  {
    id: 'MNU-007',
    title: 'Log Aktivitas Central',
    path: '/admin/logs',
    icon: 'FileText',
    color: '#64748B',
    order: 8,
    targetModule: 'portal',
    requiredRole: ['Admin Penuh', 'Super Admin', 'Admin', 'Supervisor', 'Manager'],
    isActive: true
  },
  {
    id: 'MNU-008',
    title: 'Dokumentasi REST API',
    path: '/docs/api',
    icon: 'Code2',
    color: '#14B8A6',
    order: 8,
    targetModule: 'portal',
    isActive: true
  },
  {
    id: 'MNU-009',
    title: 'Arsitektur Enterprise',
    path: '/docs/architecture',
    icon: 'BookOpen',
    color: '#6366F1',
    order: 9,
    targetModule: 'portal',
    isActive: true
  },
  {
    id: 'MNU-010',
    title: 'Pengaturan Portal',
    path: '/admin/settings',
    icon: 'Settings',
    color: '#EF4444',
    order: 10,
    targetModule: 'portal',
    requiredRole: ['Super Admin'],
    isActive: true
  }
];

export const initialPegawai: MasterPegawai[] = [];

export const initialDivisi: MasterDivisi[] = [
  { id: 'DIV-001', kode: 'TIK', nama: 'Teknologi Informasi & Komunikasi', kepalaDivisi: 'Dr. H. Ahmad Pratama, M.Kom', keterangan: 'Pengelola Infrastruktur IT, Server, & Aplikasi Enterprise' },
  { id: 'DIV-002', kode: 'TU', nama: 'Sekretariat / Tata Usaha', kepalaDivisi: 'Siti Rahmawati, S.STP', keterangan: 'Pengelola Persuratan, Arsip, & Administrasi Umum' },
  { id: 'DIV-003', kode: 'LOG', nama: 'Logistik & Perlengkapan', kepalaDivisi: 'Ahmad Fauzi, S.T.', keterangan: 'Pengelola Pergudangan, Aset, & Stock Opname' },
  { id: 'DIV-004', kode: 'KEU', nama: 'Keuangan & Aset', kepalaDivisi: 'Drs. Bambang Hariyanto, M.Si', keterangan: 'Pengelolaan Anggaran, Akuntansi, & Verifikasi Aset' },
  { id: 'DIV-005', kode: 'REN', nama: 'Perencanaan & Evaluasi', kepalaDivisi: 'Rina Wijaya, S.E., M.M.', keterangan: 'Perencanaan Program Kerja & Monitoring Kinerja' }
];

export const initialJabatan: MasterJabatan[] = [
  { id: 'JAB-001', kode: 'KAPUS', nama: 'Kepala Pusat Data & Sistem Informasi', level: 1 },
  { id: 'JAB-002', kode: 'HEAD-TU', nama: 'Head of Administrative Services', level: 2 },
  { id: 'JAB-003', kode: 'STAF-LOG', nama: 'Staf Opname Gudang Central', level: 4 },
  { id: 'JAB-004', kode: 'KABID-ASET', nama: 'Kabid Pengawasan Aset', level: 2 },
  { id: 'JAB-005', kode: 'MGR-REN', nama: 'Manager Perencanaan Strategic', level: 3 }
];

export const initialGudang: MasterGudang[] = [
  { id: 'GDG-001', kode: 'GDG-CENTRAL', nama: 'Gudang Utama Central Enterprise', lokasi: 'Gedung A Lantai Dasar, Kompleks Perkantoran Pusat', penanggungJawab: 'Budi Santoso, S.E.', status: 'Aktif' },
  { id: 'GDG-002', kode: 'GDG-ATK', nama: 'Gudang ATK & Cetakan', lokasi: 'Gedung B Ruang 102', penanggungJawab: 'Dewi Lestari, A.Md', status: 'Aktif' },
  { id: 'GDG-003', kode: 'GDG-IT', nama: 'Gudang Perangkat Hardware TIK', lokasi: 'Gedung Server Lantai 2', penanggungJawab: 'Ahmad Pratama, M.Kom', status: 'Aktif' }
];

export const initialKategori: MasterKategori[] = [
  { id: 'KAT-001', kode: 'BAHAN_BAKU', nama: 'Bahan Baku', deskripsi: 'Semua jenis bahan baku makanan, bumbu, dan konsumsi dapur' },
  { id: 'KAT-002', kode: 'OPERASIONAL', nama: 'Operasional', deskripsi: 'Perlengkapan operasional, peralatan, ATK, dan kebersihan' }
];

export const initialInstansi: MasterInstansi[] = [
  { id: 'INS-001', kode: 'KEMENKEU', nama: 'Kementerian Keuangan Republik Indonesia', alamat: 'Jl. Dr. Wahidin Raya No.1, Jakarta Pusat', telepon: '021-3841000', email: 'humas@kemenkeu.go.id', kontakPerson: 'Bapak Sugeng S.' },
  { id: 'INS-002', kode: 'BKN', nama: 'Badan Kepegawaian Negara', alamat: 'Jl. Mayor Jendral Sutoyo No.12, Cililitan, Jakarta Timur', telepon: '021-80882815', email: 'info@bkn.go.id', kontakPerson: 'Ibu Ratna M.' },
  { id: 'INS-003', kode: 'PEMPROV', nama: 'Pemerintah Provinsi DKI Jakarta', alamat: 'Jl. Medan Merdeka Selatan No.8-9, Jakarta Pusat', telepon: '021-3822222', email: 'sekretariat@jakarta.go.id', kontakPerson: 'Drs. Hendra W.' }
];

// --- e-Surat Sample Data ---
export const initialSuratMasuk: SuratMasuk[] = [];

export const initialSuratKeluar: SuratKeluar[] = [];

export const initialDisposisi: Disposisi[] = [];

export const initialTemplateSurat: TemplateSurat[] = [
  {
    id: 'TMP-001',
    nama: 'Surat Undangan / Konfirmasi Resmi',
    kategori: 'Surat Keluar Dinamis',
    formatNomor: '{URUT}/PORTAL-{DIVISI}/SK/{BULAN-ROMAWI}/{TAHUN}',
    isiHeader: 'PORTAL ADMINISTRASI TERPADU ENTERPRISE\nSEKRETARIAT UTAMA PUSAT DATA',
    isiBody: 'Dengan hormat, sehubungan dengan {PERIHAL}, kami menyampaikan konfirmasi kehadiran tim...',
    isiFooter: 'Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.'
  },
  {
    id: 'TMP-002',
    nama: 'Surat Permohonan Pengadaan & Stock Refill',
    kategori: 'Logistik',
    formatNomor: '{URUT}/PORTAL-LOG/SK/{BULAN-ROMAWI}/{TAHUN}',
    isiHeader: 'DIVISI LOGISTIK & PERLENGKAPAN GUDANG CENTRAL',
    isiBody: 'Guna menunjang operasional, bersama ini kami mengajukan permohonan pengadaan barang...',
    isiFooter: 'Mengetahui, Kepala Pusat Data & Sistem Informasi.'
  }
];

// --- Stock Opname Sample Data ---
export const initialMasterBarang: MasterBarang[] = [];

export const initialStockMovements: StockMovement[] = [];

export const initialStockOpnameSessions: StockOpnameSession[] = [];

// --- Central Notifications & Logs ---
export const initialNotifications: NotificationItem[] = [];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    userId: 'USR-001',
    namaUser: 'sppgkrejengantemenggungan2@gmail.com',
    modul: 'Auth',
    aktivitas: 'Login Admin Penuh',
    detail: 'Autentikasi SSO berhasil dari IP lokal gateway',
    tanggal: '2026-11-04',
    jam: '07:30:12',
    browser: 'Chrome 128 / macOS',
    ipAddress: '192.168.1.10',
    status: 'Sukses'
  },
  {
    id: 'LOG-002',
    userId: 'USR-001',
    namaUser: 'sppgkrejengantemenggungan2@gmail.com',
    modul: 'Menu Dinamis',
    aktivitas: 'Aktivasi Menu Sistem',
    detail: 'Memulihkan menu Menu Dinamis dan Log Aktivitas Central ke sidebar portal',
    tanggal: '2026-11-04',
    jam: '07:35:45',
    browser: 'Chrome 128 / macOS',
    ipAddress: '192.168.1.10',
    status: 'Sukses'
  },
  {
    id: 'LOG-003',
    userId: 'USR-001',
    namaUser: 'sppgkrejengantemenggungan2@gmail.com',
    modul: 'Tugas Divisi',
    aktivitas: 'Validasi Sub-Menu Dapur',
    detail: 'Sinkronisasi checklist harian 4 divisi dan upload bukti',
    tanggal: '2026-11-04',
    jam: '07:40:00',
    browser: 'Chrome 128 / macOS',
    ipAddress: '192.168.1.10',
    status: 'Sukses'
  }
];

export const initialSettings: PortalSettings = {
  namaPortal: 'E-SPPG HAFSHAWATY2',
  deskripsi: 'Single Entry Point Enterprise & Module Integration Gateway (e-Surat & Stock Opname)',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
  theme: 'light',
  primaryColor: '#2563EB',
  smtpHost: 'smtp.instansi.go.id',
  smtpPort: 587,
  smtpUser: 'notifications@instansi.go.id',
  maintenanceMode: false,
  sessionTimeoutMinutes: 120,
  rateLimitPerMin: 100
};

// --- Initial Master Kendaraan & Laporan BBM ---
export const initialKendaraan: MasterKendaraan[] = [];

export const initialLaporanBbm: LaporanBbm[] = [];

export const initialDrivers: DriverStaff[] = [];

export const initialDistributionReports: DistributionReport[] = [];

export const initialWaDivisiSettings: WhatsAppDivisiSetting[] = [
  { divisiId: 'persiapan', divisiNama: 'Divisi Persiapan', nomorWa: '6281234567891', namaKontak: 'Budi Santoso (Persiapan)' },
  { divisiId: 'pengolahan', divisiNama: 'Divisi Pengolahan', nomorWa: '6281234567892', namaKontak: 'Siti Nurhaliza (Chef Dapur)' },
  { divisiId: 'pemorsian', divisiNama: 'Divisi Pemorsian', nomorWa: '6281234567893', namaKontak: 'Ahmad Yani (Pemorsian)' },
  { divisiId: 'distribusi', divisiNama: 'Divisi Distribusi', nomorWa: '6281234567894', namaKontak: 'Rudi Hermawan (Kurir/Distribusi)' },
  { divisiId: 'cuci_ompreng', divisiNama: 'Divisi Cuci Ompreng', nomorWa: '6281234567895', namaKontak: 'Dewi Sartika (Sanitasi Ompreng)' },
];

export const initialTaskTemplates: TaskTemplate[] = [
  {
    id: 'TPL-001',
    divisiId: 'persiapan',
    divisiNama: 'Divisi Persiapan',
    judulTemplate: 'Checklist Standar Persiapan Dapur SPPG',
    checklists: [
      'Pemeriksaan bahan baku',
      'Pemeriksaan kualitas sayur',
      'Pemeriksaan kualitas lauk',
      'Menimbang bahan',
      'Menyiapkan alat',
      'Membersihkan area persiapan',
      'Menyiapkan bumbu',
      'Menyiapkan bahan sesuai menu',
      'Pemeriksaan kebersihan personel',
      'Checklist selesai'
    ]
  },
  {
    id: 'TPL-002',
    divisiId: 'pengolahan',
    divisiNama: 'Divisi Pengolahan',
    judulTemplate: 'Checklist Standar Pengolahan/Memasak SPPG',
    checklists: [
      'Memasak nasi',
      'Memasak lauk',
      'Memasak sayur',
      'Memasak buah jika diperlukan',
      'Pemeriksaan suhu makanan',
      'Pemeriksaan kematangan',
      'Pemeriksaan rasa',
      'Pemeriksaan sanitasi',
      'Checklist selesai'
    ]
  },
  {
    id: 'TPL-003',
    divisiId: 'pemorsian',
    divisiNama: 'Divisi Pemorsian',
    judulTemplate: 'Checklist Standar Pemorsian Ompreng SPPG',
    checklists: [
      'Menyiapkan ompreng',
      'Pemeriksaan ompreng',
      'Pemorsian nasi',
      'Pemorsian lauk',
      'Pemorsian sayur',
      'Pemorsian buah',
      'Pemeriksaan berat porsi',
      'Pemeriksaan kualitas',
      'Menutup ompreng',
      'Checklist selesai'
    ]
  },
  {
    id: 'TPL-004',
    divisiId: 'distribusi',
    divisiNama: 'Divisi Distribusi',
    judulTemplate: 'Checklist Standar Distribusi SPPG',
    checklists: [
      'Pemeriksaan jumlah ompreng',
      'Pemeriksaan kendaraan',
      'Loading kendaraan',
      'Pemeriksaan rute',
      'Pengiriman',
      'Dokumentasi',
      'Serah terima',
      'Konfirmasi penerimaan',
      'Checklist selesai'
    ]
  },
  {
    id: 'TPL-005',
    divisiId: 'cuci_ompreng',
    divisiNama: 'Divisi Cuci Ompreng',
    judulTemplate: 'Checklist Standar Sanitasi & Cuci Ompreng SPPG',
    checklists: [
      'Penerimaan ompreng',
      'Sortir ompreng',
      'Pencucian pertama',
      'Pencucian kedua',
      'Sanitasi',
      'Pengeringan',
      'Penyimpanan',
      'Pemeriksaan akhir',
      'Checklist selesai'
    ]
  }
];

export function createDefaultTasksForDateAndDivisi(tanggal: string, divisiId: TaskTemplate['divisiId']): DivisiTaskRecord {
  const template = initialTaskTemplates.find(t => t.divisiId === divisiId);
  const checklistTexts = template ? template.checklists : [];

  const checklists: TugasChecklistItem[] = checklistTexts.map((text, idx) => ({
    id: `CHK-${divisiId}-${idx + 1}`,
    text,
    completed: idx < 3, // demo first 3 items completed
    jamMulai: idx < 3 ? '06:00' : undefined,
    jamSelesai: idx < 3 ? '07:00' : undefined,
    namaPetugas: idx < 3 ? 'Staf Dapur Operasional' : undefined,
    catatan: idx === 0 ? 'Kondisi bahan segar & lengkap.' : undefined,
    status: idx < 3 ? 'Selesai' : (idx === 3 ? 'Sedang Dikerjakan' : 'Belum Dikerjakan')
  }));

  const defaultPenanggungJawab: Record<string, string> = {
    persiapan: 'Budi Santoso, S.ST',
    pengolahan: 'Chef Hendra Wijaya',
    pemorsian: 'Siti Rahmawati',
    distribusi: 'Rudi Hermawan',
    cuci_ompreng: 'Dewi Sartika'
  };

  const defaultDivisiNama: Record<string, string> = {
    persiapan: 'Divisi Persiapan',
    pengolahan: 'Divisi Pengolahan',
    pemorsian: 'Divisi Pemorsian',
    distribusi: 'Divisi Distribusi',
    cuci_ompreng: 'Divisi Cuci Ompreng'
  };

  return {
    id: `TASK-${tanggal}-${divisiId}`,
    tanggal,
    divisiId,
    divisiNama: defaultDivisiNama[divisiId] || divisiId,
    penanggungJawab: defaultPenanggungJawab[divisiId] || 'Penanggung Jawab Divisi',
    shift: 'Shift 1 (Pagi)',
    statusProduksi: 'Proses Memasak',
    jumlahProduksi: 2500,
    keterangan: 'Pemeriksaan & pelaksanaan operasional rutin divisi.',
    menuHarian: 'Nasi, Ayam Goreng Lengkuas, Sayur Sop Bening, Pisang Ambon',
    checklists,
    updatedAt: new Date().toISOString(),
    createdBy: 'System Default'
  };
}

// --- INITIAL BENEFICIARY DATASETS ---
export const initialBeneficiaryGroups: BeneficiaryGroup[] = [
  {
    id: 'GRP-001',
    nama: 'Siswa SD / MI (Porsi Kecil)',
    kategoriUtama: 'Siswa',
    klasifikasiPorsi: 'Porsi Kecil',
    deskripsi: 'Peserta didik jenjang SD/MI penerima paket Makan Bergizi Gratis Porsi Kecil',
    urutan: 1,
    status: 'Aktif',
    lembagaList: [
      {
        id: 'LBG-001',
        namaInstansi: 'SD Zainul Hasan Genggong',
        targetSiswa: 384,
        targetGuru: 25,
        total: 409,
        klasifikasiPorsi: 'Porsi Kecil'
      }
    ]
  },
  {
    id: 'GRP-002',
    nama: 'Siswa SMP / MTs (Porsi Besar)',
    kategoriUtama: 'Siswa',
    klasifikasiPorsi: 'Porsi Besar',
    deskripsi: 'Peserta didik jenjang SMP/MTs penerima paket Makan Bergizi Gratis Porsi Besar',
    urutan: 2,
    status: 'Aktif',
    lembagaList: [
      {
        id: 'LBG-002',
        namaInstansi: 'SMP ZAHA Genggong',
        targetSiswa: 664,
        targetGuru: 36,
        total: 700,
        klasifikasiPorsi: 'Porsi Besar'
      }
    ]
  },
  {
    id: 'GRP-003',
    nama: 'Siswa SMA / MA (Porsi Besar)',
    kategoriUtama: 'Siswa',
    klasifikasiPorsi: 'Porsi Besar',
    deskripsi: 'Peserta didik jenjang SMA/MA penerima paket Makan Bergizi Gratis Porsi Besar',
    urutan: 3,
    status: 'Aktif',
    lembagaList: [
      {
        id: 'LBG-003',
        namaInstansi: 'MA Model Hafshawaty',
        targetSiswa: 272,
        targetGuru: 25,
        total: 297,
        klasifikasiPorsi: 'Porsi Besar'
      }
    ]
  },
  {
    id: 'GRP-004',
    nama: 'Balita & Anak Prasekolah',
    kategoriUtama: 'Balita',
    klasifikasiPorsi: 'Porsi Kecil',
    deskripsi: 'Sasaran balita pemenuhan nutrisi dan pencegahan stunting',
    urutan: 4,
    status: 'Aktif',
    lembagaList: [
      {
        id: 'LBG-004',
        namaInstansi: 'Anak Balita Nutrisi',
        targetSiswa: 68,
        targetGuru: 0,
        total: 68,
        klasifikasiPorsi: 'Porsi Kecil'
      }
    ]
  },
  {
    id: 'GRP-005',
    nama: 'Ibu Hamil & Ibu Menyusui',
    kategoriUtama: 'Ibu Hamil',
    klasifikasiPorsi: 'Porsi Besar',
    deskripsi: 'Sasaran ibu hamil dan ibu menyusui Posyandu binaan SPPG',
    urutan: 5,
    status: 'Aktif',
    lembagaList: [
      {
        id: 'LBG-005',
        namaInstansi: 'Posyandu Ibu Hamil',
        targetSiswa: 30,
        targetGuru: 0,
        total: 30,
        klasifikasiPorsi: 'Porsi Besar'
      },
      {
        id: 'LBG-006',
        namaInstansi: 'Posyandu Ibu Menyusui',
        targetSiswa: 21,
        targetGuru: 0,
        total: 21,
        klasifikasiPorsi: 'Porsi Besar'
      }
    ]
  }
];

export const initialBeneficiaryLocations: BeneficiaryLocation[] = [
  {
    id: 'LOC-001',
    groupId: 'GRP-001',
    groupNama: 'Siswa SD / MI (Porsi Kecil)',
    namaInstansi: 'SD Zainul Hasan Genggong',
    alamat: 'Jl. Pesantren Genggong No. 12, Krejengan, Probolinggo',
    kontak: '081234567890',
    klasifikasiPorsi: 'Porsi Kecil',
    defaultJumlah: 409,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 384, guru: 25 }
  },
  {
    id: 'LOC-002',
    groupId: 'GRP-002',
    groupNama: 'Siswa SMP / MTs (Porsi Besar)',
    namaInstansi: 'SMP ZAHA Genggong',
    alamat: 'Kompleks Pesantren Zainul Hasan, Krejengan',
    kontak: '081234567891',
    klasifikasiPorsi: 'Porsi Besar',
    defaultJumlah: 700,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 664, guru: 36 }
  },
  {
    id: 'LOC-003',
    groupId: 'GRP-003',
    groupNama: 'Siswa SMA / MA (Porsi Besar)',
    namaInstansi: 'MA Model Hafshawaty',
    alamat: 'Kampus Hafshawaty Genggong, Krejengan',
    kontak: '081234567892',
    klasifikasiPorsi: 'Porsi Besar',
    defaultJumlah: 297,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 272, guru: 25 }
  },
  {
    id: 'LOC-004',
    groupId: 'GRP-004',
    groupNama: 'Balita & Anak Prasekolah',
    namaInstansi: 'Anak Balita Nutrisi',
    alamat: 'Posyandu Terpadu Krejengan Temenggungan 2',
    kontak: '081234567893',
    klasifikasiPorsi: 'Porsi Kecil',
    defaultJumlah: 68,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 68, guru: 0 }
  },
  {
    id: 'LOC-005',
    groupId: 'GRP-005',
    groupNama: 'Ibu Hamil & Ibu Menyusui',
    namaInstansi: 'Posyandu Ibu Hamil',
    alamat: 'Balai Desa Temenggungan, Krejengan',
    kontak: '081234567894',
    klasifikasiPorsi: 'Porsi Besar',
    defaultJumlah: 30,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 30, guru: 0 }
  },
  {
    id: 'LOC-006',
    groupId: 'GRP-005',
    groupNama: 'Ibu Hamil & Ibu Menyusui',
    namaInstansi: 'Posyandu Ibu Menyusui',
    alamat: 'Balai Desa Temenggungan, Krejengan',
    kontak: '081234567895',
    klasifikasiPorsi: 'Porsi Besar',
    defaultJumlah: 21,
    status: 'Aktif',
    kategoriBreakdown: { siswa: 21, guru: 0 }
  }
];

export const createInitialBeneficiariesForDate = (tanggal: string): DailyBeneficiaryRecord[] => {
  const records: DailyBeneficiaryRecord[] = [];
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

  initialBeneficiaryGroups.forEach((g) => {
    (g.lembagaList || []).forEach((l, idx) => {
      const jumlahAwal = (Number(l.targetSiswa) || 0) + (Number(l.targetGuru) || 0);
      records.push({
        id: `BEN-${tanggal}-${g.id}-${idx + 1}`,
        tanggal,
        groupId: g.id,
        groupNama: g.nama,
        locationId: l.id,
        namaInstansi: l.namaInstansi,
        kategori: g.kategoriUtama,
        jumlahAwal,
        penambahan: 0,
        pengurangan: 0,
        totalPenerima: jumlahAwal,
        keterangan: `${l.namaInstansi} (${l.klasifikasiPorsi || g.klasifikasiPorsi})`,
        status: 'DRAFT',
        createdBy: 'System Baseline',
        createdAt: nowStr
      });
    });
  });

  return records;
};

// =========================================================
// INITIAL DATA FOR PERENCANAAN KEBUTUHAN BAHAN PANGAN
// =========================================================

export const initialMasterBahanPangan: MasterBahanPangan[] = [];

export const initialMasterMenuResep: MasterMenuResep[] = [];

export const initialNutritionPlans: NutritionPlan[] = [];

export const initialNutritionPlanItems: NutritionPlanItem[] = [];

export const initialBarangDatang: BarangDatang[] = [];

// =========================================================
// INITIAL DATA FOR MASTER MENU & KANDUNGAN GIZI (PLOG)
// =========================================================
export const initialMasterMenuGizi: MasterMenuGiziItem[] = [
  {
    id: 'GIZI-001',
    namaMenu: 'Nasi Putih Pulen',
    kategori: 'Makanan Pokok',
    porsiGram: 100,
    energiKkal: 175,
    proteinGram: 3.0,
    lemakGram: 0.3,
    karbohidratGram: 39.8,
    seratGram: 1.2,
    kalsiumMg: 15,
    zatBesiMg: 0.8,
    estimasiBiayaPorsi: 1500,
    standarKecukupan: 'Kecukupan Karbohidrat Utama',
    keterangan: 'Beras Medium / Premium SPPG, dimasak pulen standar TKPI'
  },
  {
    id: 'GIZI-002',
    namaMenu: 'Nasi Merah Organik',
    kategori: 'Makanan Pokok',
    porsiGram: 100,
    energiKkal: 149,
    proteinGram: 2.8,
    lemakGram: 0.4,
    karbohidratGram: 32.5,
    seratGram: 2.5,
    kalsiumMg: 20,
    zatBesiMg: 1.2,
    estimasiBiayaPorsi: 2000,
    standarKecukupan: 'Tinggi Serat & Indeks Glikemik Rendah',
    keterangan: 'Beras Merah lokal Probolinggo'
  },
  {
    id: 'GIZI-003',
    namaMenu: 'Ayam Goreng Lengkuas',
    kategori: 'Lauk Hewani',
    porsiGram: 80,
    energiKkal: 218,
    proteinGram: 18.2,
    lemakGram: 14.5,
    karbohidratGram: 2.1,
    seratGram: 0.5,
    kalsiumMg: 24,
    zatBesiMg: 1.8,
    estimasiBiayaPorsi: 4500,
    standarKecukupan: 'Protein Hewani Tinggi',
    keterangan: 'Daging ayam segar ungkep bumbu lengkuas'
  },
  {
    id: 'GIZI-004',
    namaMenu: 'Ayam Kecap Gurih',
    kategori: 'Lauk Hewani',
    porsiGram: 80,
    energiKkal: 195,
    proteinGram: 17.5,
    lemakGram: 11.2,
    karbohidratGram: 5.8,
    seratGram: 0.4,
    kalsiumMg: 22,
    zatBesiMg: 1.6,
    estimasiBiayaPorsi: 4200,
    standarKecukupan: 'Protein Hewani Asam Amino Esensial',
    keterangan: 'Daging ayam bumbu kecap manis alami'
  },
  {
    id: 'GIZI-005',
    namaMenu: 'Telur Balado Daun Jeruk',
    kategori: 'Lauk Hewani',
    porsiGram: 60,
    energiKkal: 115,
    proteinGram: 7.8,
    lemakGram: 8.2,
    karbohidratGram: 2.5,
    seratGram: 0.3,
    kalsiumMg: 45,
    zatBesiMg: 1.5,
    estimasiBiayaPorsi: 2800,
    standarKecukupan: 'Protein Telur Utuh & Kolin',
    keterangan: 'Telur ayam ras rebus sambal balado halus'
  },
  {
    id: 'GIZI-006',
    namaMenu: 'Ikan Gurame Asam Manis',
    kategori: 'Lauk Hewani',
    porsiGram: 75,
    energiKkal: 142,
    proteinGram: 16.4,
    lemakGram: 4.8,
    karbohidratGram: 7.2,
    seratGram: 0.6,
    kalsiumMg: 35,
    zatBesiMg: 1.4,
    estimasiBiayaPorsi: 4800,
    standarKecukupan: 'Protein & Asam Lemak Omega',
    keterangan: 'Fillet ikan gurame saus tomat nenas'
  },
  {
    id: 'GIZI-007',
    namaMenu: 'Daging Sapi Teriyaki',
    kategori: 'Lauk Hewani',
    porsiGram: 65,
    energiKkal: 188,
    proteinGram: 19.5,
    lemakGram: 10.8,
    karbohidratGram: 3.2,
    seratGram: 0.3,
    kalsiumMg: 18,
    zatBesiMg: 2.4,
    estimasiBiayaPorsi: 6000,
    standarKecukupan: 'Zat Besi Heme & Seng (Zinc)',
    keterangan: 'Irisan daging sapi segar bumbu saus teriyaki'
  },
  {
    id: 'GIZI-008',
    namaMenu: 'Tempe Bacem Gurih',
    kategori: 'Lauk Nabati',
    porsiGram: 50,
    energiKkal: 118,
    proteinGram: 7.5,
    lemakGram: 4.2,
    karbohidratGram: 12.8,
    seratGram: 1.8,
    kalsiumMg: 55,
    zatBesiMg: 1.6,
    estimasiBiayaPorsi: 1200,
    standarKecukupan: 'Protein Nabati Fermentasi & Probiotik',
    keterangan: 'Tempe kedelai kuning bacem gula merah'
  },
  {
    id: 'GIZI-009',
    namaMenu: 'Tahu Goreng Bumbu Kuning',
    kategori: 'Lauk Nabati',
    porsiGram: 50,
    energiKkal: 78,
    proteinGram: 5.4,
    lemakGram: 4.6,
    karbohidratGram: 3.8,
    seratGram: 1.1,
    kalsiumMg: 80,
    zatBesiMg: 1.4,
    estimasiBiayaPorsi: 1000,
    standarKecukupan: 'Kalsium Nabati Tinggi',
    keterangan: 'Tahu putih segar ungkep kunyit ketumbar'
  },
  {
    id: 'GIZI-010',
    namaMenu: 'Tempe Orek Manis',
    kategori: 'Lauk Nabati',
    porsiGram: 40,
    energiKkal: 96,
    proteinGram: 6.2,
    lemakGram: 3.8,
    karbohidratGram: 8.5,
    seratGram: 1.4,
    kalsiumMg: 48,
    zatBesiMg: 1.3,
    estimasiBiayaPorsi: 1100,
    standarKecukupan: 'Protein Nabati Tambahan',
    keterangan: 'Tempe potong dadu masak kecap manis'
  },
  {
    id: 'GIZI-011',
    namaMenu: 'Sayur Sop Wortel Buncis',
    kategori: 'Sayuran',
    porsiGram: 100,
    energiKkal: 42,
    proteinGram: 1.8,
    lemakGram: 0.4,
    karbohidratGram: 8.2,
    seratGram: 2.4,
    kalsiumMg: 42,
    zatBesiMg: 1.1,
    estimasiBiayaPorsi: 1500,
    standarKecukupan: 'Vitamin A, Serat & Kalium',
    keterangan: 'Wortel, buncis, kembang kol, kuah kaldu bening'
  },
  {
    id: 'GIZI-012',
    namaMenu: 'Sayur Asem Segar',
    kategori: 'Sayuran',
    porsiGram: 100,
    energiKkal: 38,
    proteinGram: 1.5,
    lemakGram: 0.3,
    karbohidratGram: 7.8,
    seratGram: 2.1,
    kalsiumMg: 38,
    zatBesiMg: 0.9,
    estimasiBiayaPorsi: 1400,
    standarKecukupan: 'Antioksidan & Mineral Alami',
    keterangan: 'Labu siam, jagung manis, kacang panjang asam jawa'
  },
  {
    id: 'GIZI-013',
    namaMenu: 'Capcay Sayur Bakso',
    kategori: 'Sayuran',
    porsiGram: 100,
    energiKkal: 68,
    proteinGram: 4.2,
    lemakGram: 2.1,
    karbohidratGram: 8.5,
    seratGram: 2.6,
    kalsiumMg: 52,
    zatBesiMg: 1.3,
    estimasiBiayaPorsi: 2200,
    standarKecukupan: 'Multi Vitamin Sayuran Campur',
    keterangan: 'Sawi putih, sawi hijau, wortel, bakso sapi'
  },
  {
    id: 'GIZI-014',
    namaMenu: 'Sayur Bening Bayam Jagung',
    kategori: 'Sayuran',
    porsiGram: 100,
    energiKkal: 36,
    proteinGram: 2.1,
    lemakGram: 0.2,
    karbohidratGram: 7.0,
    seratGram: 2.2,
    kalsiumMg: 68,
    zatBesiMg: 1.9,
    estimasiBiayaPorsi: 1500,
    standarKecukupan: 'Zat Besi Non-Heme & Asam Folat',
    keterangan: 'Bayam hijau segar, jagung manis pipil, temu kunci'
  },
  {
    id: 'GIZI-015',
    namaMenu: 'Pisang Ambon Segar',
    kategori: 'Buah',
    porsiGram: 100,
    energiKkal: 92,
    proteinGram: 1.0,
    lemakGram: 0.2,
    karbohidratGram: 23.4,
    seratGram: 2.6,
    kalsiumMg: 12,
    zatBesiMg: 0.5,
    estimasiBiayaPorsi: 1500,
    standarKecukupan: 'Kalium, Serat & Energi Cepat Cerna',
    keterangan: '1 buah pisang ambon masak pohon'
  },
  {
    id: 'GIZI-016',
    namaMenu: 'Semangka Potong Merah',
    kategori: 'Buah',
    porsiGram: 100,
    energiKkal: 32,
    proteinGram: 0.6,
    lemakGram: 0.2,
    karbohidratGram: 7.2,
    seratGram: 0.8,
    kalsiumMg: 10,
    zatBesiMg: 0.4,
    estimasiBiayaPorsi: 1200,
    standarKecukupan: 'Likopen & Hidrasi Alami',
    keterangan: 'Semangka merah potong dadu tanpa biji'
  },
  {
    id: 'GIZI-017',
    namaMenu: 'Jeruk Manis',
    kategori: 'Buah',
    porsiGram: 100,
    energiKkal: 45,
    proteinGram: 0.9,
    lemakGram: 0.1,
    karbohidratGram: 11.2,
    seratGram: 1.4,
    kalsiumMg: 40,
    zatBesiMg: 0.4,
    estimasiBiayaPorsi: 1500,
    standarKecukupan: 'Vitamin C Daya Tahan Tubuh',
    keterangan: '1 buah jeruk manis lokal segar'
  },
  {
    id: 'GIZI-018',
    namaMenu: 'Melon Segar',
    kategori: 'Buah',
    porsiGram: 100,
    energiKkal: 36,
    proteinGram: 0.7,
    lemakGram: 0.2,
    karbohidratGram: 8.2,
    seratGram: 1.0,
    kalsiumMg: 14,
    zatBesiMg: 0.5,
    estimasiBiayaPorsi: 1400,
    standarKecukupan: 'Vitamin A & Vitamin C',
    keterangan: 'Melon hijau potong segar'
  },
  {
    id: 'GIZI-019',
    namaMenu: 'Susu UHT 125ml',
    kategori: 'Ekstra / Minuman',
    porsiGram: 125,
    energiKkal: 75,
    proteinGram: 4.0,
    lemakGram: 4.2,
    karbohidratGram: 6.0,
    seratGram: 0,
    kalsiumMg: 150,
    zatBesiMg: 0.2,
    estimasiBiayaPorsi: 3000,
    standarKecukupan: 'Kalsium & Vitamin D Tulang',
    keterangan: '1 kotak kemasan susu sapi steril UHT'
  }
];

// In-Memory Database Controller Singleton
class EnterpriseDataStore {

  public users: User[] = [...initialUsers];
  public roles: RolePermission[] = [...initialRoles];
  public menus: MenuItem[] = [...initialMenus];
  public pegawai: MasterPegawai[] = [...initialPegawai];
  public divisi: MasterDivisi[] = [...initialDivisi];
  public jabatan: MasterJabatan[] = [...initialJabatan];
  public gudang: MasterGudang[] = [...initialGudang];
  public kategori: MasterKategori[] = [...initialKategori];
  public instansi: MasterInstansi[] = [...initialInstansi];
  public suratMasuk: SuratMasuk[] = [...initialSuratMasuk];
  public suratKeluar: SuratKeluar[] = [...initialSuratKeluar];
  public disposisi: Disposisi[] = [...initialDisposisi];
  public templates: TemplateSurat[] = [...initialTemplateSurat];
  public barang: MasterBarang[] = [...initialMasterBarang];
  public stockMovements: StockMovement[] = [...initialStockMovements];
  public opnameSessions: StockOpnameSession[] = [...initialStockOpnameSessions];
  public kendaraan: MasterKendaraan[] = [...initialKendaraan];
  public laporanBbm: LaporanBbm[] = [...initialLaporanBbm];
  public drivers: DriverStaff[] = [...initialDrivers];
  public distributionReports: DistributionReport[] = [...initialDistributionReports];
  public notifications: NotificationItem[] = [...initialNotifications];
  public activityLogs: ActivityLog[] = [...initialActivityLogs];
  public settings: PortalSettings = { ...initialSettings };
  public waDivisiSettings: WhatsAppDivisiSetting[] = [...initialWaDivisiSettings];
  public taskTemplates: TaskTemplate[] = [...initialTaskTemplates];
  public tugasDivisiRecords: DivisiTaskRecord[] = [];
  public divisiSubItemRecords: DivisiSubItemRecord[] = [];

  // --- KEDATANGAN BARANG STORE ---
  public barangDatang: BarangDatang[] = [...initialBarangDatang];

  // --- PENERIMA MANFAAT STORE DATA & METHODS ---
  public beneficiaryGroups: BeneficiaryGroup[] = [...initialBeneficiaryGroups];
  public beneficiaryLocations: BeneficiaryLocation[] = [...initialBeneficiaryLocations];
  public dailyBeneficiaryRecords: DailyBeneficiaryRecord[] = [];
  public beneficiaryAuditLogs: BeneficiaryAuditLog[] = [];
  public beneficiaryLockStatus: Record<string, { status: 'DRAFT' | 'FINAL'; finalizedBy?: string; finalizedAt?: string }> = {};

  // --- NUTRITION & FOOD MATERIAL PLANNING STORE ---
  public masterBahanPangan: MasterBahanPangan[] = [...initialMasterBahanPangan];
  public masterMenuResep: MasterMenuResep[] = [...initialMasterMenuResep];
  public nutritionPlans: NutritionPlan[] = [...initialNutritionPlans];
  public nutritionPlanItems: NutritionPlanItem[] = [...initialNutritionPlanItems];
  public rabPlans: RABPlan[] = [];
  public purchaseOrders: PurchaseOrderDocument[] = [];
  public documentTemplate: MasterDocumentTemplateConfig = JSON.parse(JSON.stringify(DEFAULT_MASTER_TEMPLATE_CONFIG));

  // --- PLOG (PERENCANAAN LOGISTIK & OPERASIONAL GIZI) STORE ---
  public masterMenuGizi: MasterMenuGiziItem[] = [...initialMasterMenuGizi];
  public plogDailyMenus: PlogDailyMenuItem[] = [];

  // Helper method to compute and construct a synchronized RAB Plan
  public calculateRABPlan(
    tanggal: string,
    customData?: Partial<RABPlan>
  ): RABPlan {
    const defaultTarif: RABTarifConfig = {
      porsiKecil: 10000,
      porsiBesar: 15000,
      balita: 8500,
      bumilBusui: 12500
    };

    const defaultKomposisi: RABKomposisiConfig = {
      bahanPanganPersen: 100, // Penyerapan Pagu Anggaran harus 100% untuk Belanja Bahan Baku
      operasionalPersen: 0,
      kemasanDistribusiPersen: 0
    };

    // 1. Get real-time beneficiary target counts
    const benSummary = this.getBeneficiarySummaryForDate(tanggal);
    const pb = benSummary.portionBreakdown || {
      porsiBesar: 2220,
      porsiKecil: 471,
      balita: 75,
      bumilBusui: 43
    };

    const targetCounts = customData?.targetCounts || {
      porsiKecil: pb.porsiKecil || 471,
      porsiBesar: pb.porsiBesar || 2220,
      balita: pb.balita || 75,
      bumilBusui: pb.bumilBusui || 43,
      total: (pb.porsiKecil || 471) + (pb.porsiBesar || 2220) + (pb.balita || 75) + (pb.bumilBusui || 43)
    };

    const tarifConfig = customData?.tarifConfig || defaultTarif;
    const komposisiConfig = customData?.komposisiConfig || defaultKomposisi;

    // Calculate Total Pagu (Target Penyerapan 100% untuk Belanja Bahan Baku)
    const totalPaguAnggaran = (
      (targetCounts.porsiKecil * tarifConfig.porsiKecil) +
      (targetCounts.porsiBesar * tarifConfig.porsiBesar) +
      (targetCounts.balita * tarifConfig.balita) +
      (targetCounts.bumilBusui * tarifConfig.bumilBusui)
    );

    // Target penyerapan pagu belanja bahan baku adalah 100%
    const targetPenyerapanPagu = totalPaguAnggaran;
    const targetPlafondBahan = totalPaguAnggaran;

    // 2. Get menu name and ingredients from Nutrition Plan or fallback
    const existingPlan = this.nutritionPlans.find(p => p.tanggalPelaksanaan === tanggal);
    const tugasRecs = this.getTugasDivisiForDate(tanggal);
    const tugasMenu = tugasRecs.find(t => t.menuHarian)?.menuHarian;

    const namaMenu = customData?.namaMenu || existingPlan?.menuName || tugasMenu || 'CHICKEN KATSU SAUS KARI JEPANG + TAHU GORENG + TUMIS SAYUR + BUAH KELENGKENG';

    // 3. Build Items Bahan Baku
    let itemsBahanBaku: RABItemBahan[] = [];
    if (customData?.itemsBahanBaku && customData.itemsBahanBaku.length > 0) {
      itemsBahanBaku = customData.itemsBahanBaku.map((it, idx) => {
        const kebutuhanKg = Number(it.kebutuhanKg) || 0;
        const hargaSatuan = Number(it.hargaSatuan) || 0;
        const matchingMaster = this.masterBahanPangan.find(m => m.namaBahan.toLowerCase() === (it.namaBahan || '').toLowerCase());
        const satuan = matchingMaster?.satuanPembelian || it.satuan || 'Kg';
        return {
          ...it,
          no: idx + 1,
          kebutuhanKg,
          satuan,
          hargaSatuan,
          subtotal: Math.round(kebutuhanKg * hargaSatuan)
        };
      });
    } else if (existingPlan?.ingredientsData && existingPlan.ingredientsData.length > 0) {
      itemsBahanBaku = existingPlan.ingredientsData.map((ing: any, idx: number) => {
        const matchingMaster = this.masterBahanPangan.find(m => m.namaBahan.toLowerCase() === (ing.bahanPangan || '').toLowerCase());
        const isTahu = (ing.bahanPangan || '').toLowerCase().includes('tahu');
        
        let kebutuhan: number | null = null;
        if (ing.pembulatan !== undefined && ing.pembulatan !== null && ing.pembulatan !== '-') {
          const rawStr = String(ing.pembulatan).trim();
          if (rawStr) {
            if (rawStr.includes(',') && !rawStr.includes('.')) {
              kebutuhan = Number(rawStr.replace(',', '.'));
            } else if (rawStr.includes('.') && !rawStr.includes(',')) {
              const parts = rawStr.split('.');
              if (parts.length === 2 && parts[1].length === 3 && Number(parts[0]) > 0 && !rawStr.startsWith('0.')) {
                kebutuhan = Number(parts.join(''));
              } else {
                kebutuhan = Number(rawStr);
              }
            } else {
              kebutuhan = Number(rawStr);
            }
          }
        }

        if (kebutuhan === null || isNaN(kebutuhan) || kebutuhan <= 0) {
          if (ing.totalPlusBuffer && !isNaN(Number(ing.totalPlusBuffer)) && Number(ing.totalPlusBuffer) > 0) {
            kebutuhan = Number(ing.totalPlusBuffer);
          } else if (ing.totalKebutuhan && !isNaN(Number(ing.totalKebutuhan)) && Number(ing.totalKebutuhan) > 0) {
            kebutuhan = Number(ing.totalKebutuhan);
          } else {
            kebutuhan = isTahu ? 142 : 10;
          }
        }

        const harga = Number(ing.hargaPerKg || matchingMaster?.hargaDasarPerKg || (isTahu ? 10000 : 15000));
        const satuan = matchingMaster?.satuanPembelian || ing.satuan || 'Kg';

        return {
          no: idx + 1,
          namaBahan: ing.bahanPangan || `Bahan ${idx + 1}`,
          kategori: matchingMaster?.kategori || (isTahu ? 'Lauk Nabati' : 'Bahan Pangan'),
          kebutuhanKg: kebutuhan,
          satuan,
          hargaSatuan: harga,
          subtotal: Math.round(kebutuhan * harga),
          sumberHarga: 'Harga Acuan Pasar SPPG'
        };
      });
    } else {
      // Default standard menu items
      const defaultItems = [
        { namaBahan: 'Beras kepompong 25kg', kategori: 'Sembako', kebutuhanKg: 190, satuan: 'Kg', hargaSatuan: 15000 },
        { namaBahan: 'Daging ayam fillet', kategori: 'Lauk Hewani', kebutuhanKg: 113, satuan: 'Kg', hargaSatuan: 38000 },
        { namaBahan: 'Tepung terigu Segitiga Biru 1 Kg', kategori: 'Bahan Olahan', kebutuhanKg: 50, satuan: 'Kg', hargaSatuan: 13000 },
        { namaBahan: 'Tepung panir 10Kg', kategori: 'Bahan Olahan', kebutuhanKg: 30, satuan: 'Kg', hargaSatuan: 22000 },
        { namaBahan: 'Tahu', kategori: 'Lauk Nabati', kebutuhanKg: 142, satuan: 'Kg', hargaSatuan: 10000 },
        { namaBahan: 'Wortel', kategori: 'Sayuran', kebutuhanKg: 60, satuan: 'Kg', hargaSatuan: 14000 },
        { namaBahan: 'Kentang', kategori: 'Sayuran', kebutuhanKg: 60, satuan: 'Kg', hargaSatuan: 18000 },
        { namaBahan: 'Kelengkeng', kategori: 'Buah Segar', kebutuhanKg: 130, satuan: 'Kg', hargaSatuan: 35000 },
        { namaBahan: 'Minyak goreng filma 2ltr', kategori: 'Minyak & Lemak', kebutuhanKg: 50, satuan: 'Liter', hargaSatuan: 36000 },
        { namaBahan: 'Bumbu kari jepang 40g', kategori: 'Bumbu & Rempah', kebutuhanKg: 10, satuan: 'Pack', hargaSatuan: 12000 },
        { namaBahan: 'Bawang putih & merah kupas', kategori: 'Bumbu & Rempah', kebutuhanKg: 6, satuan: 'Kg', hargaSatuan: 36000 },
        { namaBahan: 'Bumbu pelengkap & garam', kategori: 'Bumbu & Rempah', kebutuhanKg: 5, satuan: 'Kg', hargaSatuan: 15000 }
      ];

      itemsBahanBaku = defaultItems.map((it, idx) => ({
        no: idx + 1,
        namaBahan: it.namaBahan,
        kategori: it.kategori,
        kebutuhanKg: it.kebutuhanKg,
        satuan: it.satuan,
        hargaSatuan: it.hargaSatuan,
        subtotal: Math.round(it.kebutuhanKg * it.hargaSatuan),
        sumberHarga: 'Harga Acuan Pasar'
      }));
    }

    const totalBiayaBahanBaku = itemsBahanBaku.reduce((acc, it) => acc + it.subtotal, 0);

    // Compute bobot persen for each ingredient
    itemsBahanBaku = itemsBahanBaku.map(it => ({
      ...it,
      bobotPersen: totalBiayaBahanBaku > 0 ? Number(((it.subtotal / totalBiayaBahanBaku) * 100).toFixed(1)) : 0
    }));

    // 4. Build Biaya Operasional (Menu Kemasan & BBM Distribusi Dihapus)
    const defaultOperasionalItems: RABBiayaItem[] = [
      { id: 'OPS-01', namaItem: 'Gas LPG 50 Kg / 12 Kg Dapur Industri SPPG', kategori: 'OPERASIONAL', volume: 2, satuan: 'Tabung', hargaSatuan: 850000, subtotal: 1700000, keterangan: 'Bahan bakar memasak kapasitas besar' },
      { id: 'OPS-02', namaItem: 'Listrik, Air Bersih & Sanitasi Dapur', kategori: 'OPERASIONAL', volume: 1, satuan: 'Hari', hargaSatuan: 650000, subtotal: 650000, keterangan: 'Utilitas dapur dan kebersihan standar HACCP' },
      { id: 'OPS-03', namaItem: 'Insentif & Upah Juru Masak / Tim Dapur (15 Orang)', kategori: 'OPERASIONAL', volume: 15, satuan: 'Orang/Hari', hargaSatuan: 175000, subtotal: 2625000, keterangan: 'Tenaga persiapan, pengolahan, dan pemorsian' }
    ];

    const biayaOperasionalItems = customData?.biayaOperasionalItems || defaultOperasionalItems;
    const biayaKemasanDistribusiItems: RABBiayaItem[] = []; // Kemasan & BBM Distribusi Dihapus

    const totalBiayaOperasional = biayaOperasionalItems.reduce((acc, it) => acc + it.subtotal, 0);
    const totalBiayaKemasanDistribusi = 0; // Dihapus

    const cadanganTakTerduga = customData?.cadanganTakTerduga ?? Math.round(totalPaguAnggaran * 0.02); // 2% buffer
    const grandTotalRAB = totalBiayaBahanBaku + totalBiayaOperasional + cadanganTakTerduga;

    const sisaAnggaranPagu = totalPaguAnggaran - totalBiayaBahanBaku;
    const selisihPlafondBahan = sisaAnggaranPagu;
    const persentaseSerapanPagu = totalPaguAnggaran > 0 ? Number(((totalBiayaBahanBaku / totalPaguAnggaran) * 100).toFixed(1)) : 0;
    const persentaseFoodCost = persentaseSerapanPagu;
    const biayaPerPorsiRataRata = targetCounts.total > 0 ? Math.round(grandTotalRAB / targetCounts.total) : 0;

    // Status Evaluation: Penyerapan PAGU Anggaran harus 100%
    let statusKelayakan: 'HEMAT_EFISIEN' | 'OPTIMAL_SESUAI_PAGU' | 'PERINGATAN_OVER_BUDGET' = 'OPTIMAL_SESUAI_PAGU';
    let keteranganStatus = `Penyerapan Pagu Anggaran optimal mencapai ${persentaseSerapanPagu}% dari target 100%.`;

    if (persentaseSerapanPagu > 100) {
      statusKelayakan = 'PERINGATAN_OVER_BUDGET';
      keteranganStatus = `Belanja bahan baku (${persentaseSerapanPagu}%) melebihi Pagu Anggaran 100% (Defisit Rp ${Math.abs(sisaAnggaranPagu).toLocaleString('id-ID')}). Perlu penyesuaian gramatur atau harga satuan.`;
    } else if (persentaseSerapanPagu < 98) {
      statusKelayakan = 'HEMAT_EFISIEN';
      keteranganStatus = `Penyerapan Pagu Anggaran baru mencapai ${persentaseSerapanPagu}% (Target: 100%). Terdapat sisa alokasi Rp ${sisaAnggaranPagu.toLocaleString('id-ID')} yang belum terserap maksimal untuk bahan baku.`;
    } else {
      statusKelayakan = 'OPTIMAL_SESUAI_PAGU';
      keteranganStatus = `Penyerapan Pagu Anggaran sangat presisi & optimal 100% (${persentaseSerapanPagu}%). Seluruh pagu teralokasikan tuntas untuk belanja bahan baku.`;
    }

    // Pareto Top Cost Drivers
    const sortedItems = [...itemsBahanBaku].sort((a, b) => b.subtotal - a.subtotal);
    const topCostDrivers = sortedItems.slice(0, 5).map(it => ({
      namaBahan: it.namaBahan,
      subtotal: it.subtotal,
      persen: totalBiayaBahanBaku > 0 ? Number(((it.subtotal / totalBiayaBahanBaku) * 100).toFixed(1)) : 0
    }));

    const analisis: RABAnalisisKelayakan = {
      totalPaguAnggaran,
      targetPlafondBahan: totalPaguAnggaran,
      targetPenyerapanPagu,
      totalRealisasiBahan: totalBiayaBahanBaku,
      selisihPlafondBahan: sisaAnggaranPagu,
      sisaAnggaranPagu,
      persentaseFoodCost: persentaseSerapanPagu,
      persentaseSerapanPagu,
      biayaPerPorsiRataRata,
      statusKelayakan,
      keteranganStatus,
      topCostDrivers
    };

    const nowStr = new Date().toISOString();
    return {
      id: customData?.id || `RAB-${tanggal.replace(/-/g, '')}-001`,
      tanggalPelaksanaan: tanggal,
      namaMenu,
      status: customData?.status || 'Draft',
      targetCounts,
      tarifConfig,
      komposisiConfig,
      totalPaguAnggaran,
      itemsBahanBaku,
      totalBiayaBahanBaku,
      biayaOperasionalItems,
      totalBiayaOperasional,
      biayaKemasanDistribusiItems,
      totalBiayaKemasanDistribusi,
      cadanganTakTerduga,
      grandTotalRAB,
      analisis,
      catatan: customData?.catatan || 'Rencana Anggaran Belanja (RAB) terintegrasi otomatis dengan Data Sasaran Penerima Manfaat & Lembar Kerja Gizi SPPG.',
      penanggungJawab: customData?.penanggungJawab || {
        nutritionistName: 'Rina Wijaya, S.Gz., M.Gizi',
        kepalaSppgName: 'Sri Rohayu, S. Pd',
        bendaharaName: 'Hj. Siti Aminah, S.E.'
      },
      createdAt: customData?.createdAt || nowStr,
      updatedAt: nowStr,
      approvedAt: customData?.approvedAt,
      approvedBy: customData?.approvedBy
    };
  }

  public getOrCreateRABForDate(tanggal: string): RABPlan {
    const existingIdx = this.rabPlans.findIndex(r => r.tanggalPelaksanaan === tanggal);
    const existingPlan = this.nutritionPlans.find(p => p.tanggalPelaksanaan === tanggal);

    if (existingIdx >= 0) {
      const existingRAB = this.rabPlans[existingIdx];

      // If a nutrition plan exists for this date, automatically sync RAB items with latest ingredientsData (Tabel Pembulatan)
      if (existingPlan && existingPlan.ingredientsData && existingPlan.ingredientsData.length > 0) {
        // Keep custom hargaSatuan if user customized prices in RAB
        const oldPriceMap = new Map<string, number>();
        (existingRAB.itemsBahanBaku || []).forEach(item => {
          if (item.namaBahan) {
            oldPriceMap.set(item.namaBahan.toLowerCase(), item.hargaSatuan);
          }
        });

        const updated = this.calculateRABPlan(tanggal, {
          id: existingRAB.id,
          status: existingRAB.status,
          approvedAt: existingRAB.approvedAt,
          approvedBy: existingRAB.approvedBy,
          createdAt: existingRAB.createdAt,
          biayaOperasionalItems: existingRAB.biayaOperasionalItems,
          catatan: existingRAB.catatan,
          penanggungJawab: existingRAB.penanggungJawab
        });

        if (updated.itemsBahanBaku) {
          updated.itemsBahanBaku = updated.itemsBahanBaku.map(item => {
            const oldPrice = oldPriceMap.get(item.namaBahan.toLowerCase());
            if (oldPrice && oldPrice > 0) {
              const hargaSatuan = oldPrice;
              return {
                ...item,
                hargaSatuan,
                subtotal: Math.round(item.kebutuhanKg * hargaSatuan)
              };
            }
            return item;
          });

          updated.totalBiayaBahanBaku = updated.itemsBahanBaku.reduce((sum, i) => sum + i.subtotal, 0);
          updated.grandTotalRAB = updated.totalBiayaBahanBaku + updated.totalBiayaOperasional + updated.cadanganTakTerduga;
          updated.analisis.totalRealisasiBahan = updated.totalBiayaBahanBaku;
          updated.analisis.selisihPlafondBahan = updated.totalPaguAnggaran - updated.totalBiayaBahanBaku;
          updated.analisis.sisaAnggaranPagu = updated.analisis.selisihPlafondBahan;
          updated.analisis.persentaseSerapanPagu = updated.totalPaguAnggaran > 0 ? Number(((updated.totalBiayaBahanBaku / updated.totalPaguAnggaran) * 100).toFixed(1)) : 0;
          updated.analisis.persentaseFoodCost = updated.analisis.persentaseSerapanPagu;
        }

        this.rabPlans[existingIdx] = updated;
        return updated;
      }

      if (existingRAB && existingRAB.itemsBahanBaku) {
        existingRAB.itemsBahanBaku = existingRAB.itemsBahanBaku.map(item => {
          const matchingMaster = this.masterBahanPangan.find(m => m.namaBahan.toLowerCase() === (item.namaBahan || '').toLowerCase());
          if (matchingMaster && matchingMaster.satuanPembelian) {
            return { ...item, satuan: matchingMaster.satuanPembelian };
          }
          return item;
        });
      }

      return existingRAB;
    }

    const computed = this.calculateRABPlan(tanggal);
    this.rabPlans.push(computed);
    return computed;
  }

  // --- PURCHASE ORDER (PO) CONSOLIDATION & DAILY GENERATION ALGORITHM ---
  public aggregatePeriodPO(startDate: string, datesOverride?: string[]): {
    poBahanBaku: Partial<PurchaseOrderDocument>;
    poOperasional: Partial<PurchaseOrderDocument>;
    dailyPOBahanBaku: PurchaseOrderDocument[];
    dailyPOOperasional: PurchaseOrderDocument[];
    batchId: string;
    periodeDates: string[];
    periodSummary: {
      totalBahanBaku: number;
      totalOperasional: number;
      grandTotal: number;
      totalPorsi5Hari: number;
    };
  } {
    let dates: string[] = [];
    if (datesOverride && datesOverride.length > 0) {
      dates = datesOverride.slice(0, 5);
    } else {
      const start = new Date(startDate || new Date().toISOString().split('T')[0]);
      for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    const pStart = dates[0];
    const pEnd = dates[dates.length - 1];
    const batchId = `BATCH-${pStart.replace(/-/g, '')}-5D`;

    const defaultSupplier: POSupplier = {
      name: 'KOPERASI KONSUMEN ZANTARA',
      address: 'Dusun Krajan RT/RW 003/004, Temenggungan, Krejengan, Probolinggo',
      contact: '082319871985'
    };

    const defaultShipTo: POShipTo = {
      name: 'SPPG KREJENGAN TEMENGGUNGAN',
      address: 'Kantor Kesekretariatan SPPG, Temenggungan, Krejengan, Probolinggo',
      contact: '082333141643'
    };

    const rabs = dates.map(d => this.getOrCreateRABForDate(d));

    // Array 5 PO Harian Bahan Baku & 5 PO Harian Operasional
    const dailyPOBahanBaku: PurchaseOrderDocument[] = [];
    const dailyPOOperasional: PurchaseOrderDocument[] = [];

    let overallBahanTotal = 0;
    let overallOpsTotal = 0;
    let overallPorsiTotal = 0;

    dates.forEach((d, idx) => {
      const r = rabs[idx];
      const pB = (r.targetCounts?.porsiBesar || 0) + (r.targetCounts?.bumilBusui || 0);
      const pK = (r.targetCounts?.porsiKecil || 0) + (r.targetCounts?.balita || 0);
      const dayPorsi = pB + pK;
      overallPorsiTotal += dayPorsi;

      // Item Bahan Baku Harian
      const itemsBahan: POItem[] = (r.itemsBahanBaku || []).map((item, iIdx) => {
        const key = (item.namaBahan || '').trim().toLowerCase();
        const masterMatch = this.masterBahanPangan.find(m => m.namaBahan.toLowerCase() === key);
        const unit = masterMatch?.satuanPembelian || item.satuan || 'Kg';
        const price = item.hargaSatuan || masterMatch?.hargaDasarPerKg || 0;
        const qty = item.kebutuhanKg || 0;
        return {
          no: iIdx + 1,
          details: item.namaBahan,
          qty: Math.round(qty * 100) / 100,
          unit,
          unitPrice: price,
          totalPrice: Math.round(qty * price),
          category: 'Bahan Baku'
        };
      });

      const dayBahanAmount = itemsBahan.reduce((sum, i) => sum + i.totalPrice, 0);
      overallBahanTotal += dayBahanAmount;

      const dateClean = d.replace(/-/g, '');
      const yearStr = new Date().getFullYear();

      // Hitung tanggal target tiba: 1 hari sebelum tanggal pemesanan/menu (H-1)
      const dParts = d.split('-');
      const menuDateObj = new Date(Number(dParts[0]), Number(dParts[1]) - 1, Number(dParts[2]));
      const arrivalDateObj = new Date(menuDateObj);
      arrivalDateObj.setDate(arrivalDateObj.getDate() - 1);
      const arrY = arrivalDateObj.getFullYear();
      const arrM = String(arrivalDateObj.getMonth() + 1).padStart(2, '0');
      const arrD = String(arrivalDateObj.getDate()).padStart(2, '0');
      const targetArrivalDate = `${arrY}-${arrM}-${arrD}`;

      const dailyPOBahanDoc: PurchaseOrderDocument = {
        id: `PO-${d}-BB-${batchId}`,
        poNumber: `040-H${idx + 1}/PO-SPPG/HAF/${dateClean}`,
        poType: 'Bahan Baku',
        periodeBatchId: batchId,
        dayIndex: idx + 1,
        dayLabel: `Hari ${idx + 1} dari 5 (Menu: ${d} | Tiba: ${targetArrivalDate})`,
        periodeStartDate: pStart,
        periodeEndDate: pEnd,
        periodeDates: dates,
        date: d,
        orderDate: d,
        targetArrivalDate: targetArrivalDate,
        estimatedArrival: `${targetArrivalDate} Pkl 16:00 WIB (H-1)`,
        porsiBesar: pB,
        porsiKecil: pK,
        totalPorsi: dayPorsi,
        menuSummary: r.namaMenu || 'MENU PANGAN SPPG HARIAN',
        supplier: defaultSupplier,
        shipTo: defaultShipTo,
        pemesan: 'Muhammad Fadil, S. Akun',
        approvedBy: 'SRI ROHAYU, S. Pd',
        approvedTitle: 'Kepala Satuan Pelayanan Pemenuhan Gizi',
        items: itemsBahan,
        totalAmount: dayBahanAmount,
        additionalNotes: `Tanggal Pemesanan (Menu): ${d}. Target Tiba / Kedatangan Barang (H-1): ${targetArrivalDate} pkl 16:00 WIB (Satu hari sebelum tanggal masak).`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dailyPOBahanBaku.push(dailyPOBahanDoc);

      // Item Operasional Harian
      const itemsOps: POItem[] = (r.biayaOperasionalItems || []).map((item, oIdx) => ({
        no: oIdx + 1,
        details: item.namaItem,
        qty: Math.round((item.volume || 1) * 100) / 100,
        unit: item.satuan || 'Pack',
        unitPrice: item.hargaSatuan || 0,
        totalPrice: Math.round((item.volume || 1) * (item.hargaSatuan || 0)),
        category: 'Operasional'
      }));

      const dayOpsAmount = itemsOps.reduce((sum, i) => sum + i.totalPrice, 0);
      overallOpsTotal += dayOpsAmount;

      const dailyPOOpsDoc: PurchaseOrderDocument = {
        id: `PO-${d}-OPS-${batchId}`,
        poNumber: `041-H${idx + 1}/PO-SPPG/HAF/${dateClean}`,
        poType: 'Operasional',
        periodeBatchId: batchId,
        dayIndex: idx + 1,
        dayLabel: `Hari ${idx + 1} dari 5 (Menu: ${d} | Tiba: ${targetArrivalDate})`,
        periodeStartDate: pStart,
        periodeEndDate: pEnd,
        periodeDates: dates,
        date: d,
        orderDate: d,
        targetArrivalDate: targetArrivalDate,
        estimatedArrival: `${targetArrivalDate} Pkl 16:00 WIB (H-1)`,
        porsiBesar: pB,
        porsiKecil: pK,
        totalPorsi: dayPorsi,
        menuSummary: `PERLENGKAPAN & OPERASIONAL DAPUR HARIAN (${d})`,
        supplier: defaultSupplier,
        shipTo: defaultShipTo,
        pemesan: 'Muhammad Fadil, S. Akun',
        approvedBy: 'SRI ROHAYU, S. Pd',
        approvedTitle: 'Kepala Satuan Pelayanan Pemenuhan Gizi',
        items: itemsOps,
        totalAmount: dayOpsAmount,
        additionalNotes: `Tanggal Pemesanan (Menu): ${d}. Target Tiba / Kedatangan Barang (H-1): ${targetArrivalDate} pkl 16:00 WIB.`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dailyPOOperasional.push(dailyPOOpsDoc);
    });

    // Integrated / Summary fallback objects for 5-Day Period
    const poBahanBaku: Partial<PurchaseOrderDocument> = {
      poType: 'Bahan Baku',
      periodeBatchId: batchId,
      periodeStartDate: pStart,
      periodeEndDate: pEnd,
      periodeDates: dates,
      poNumber: `040-BATCH/PO-SPPG/HAF/${pStart.replace(/-/g, '')}`,
      date: pStart,
      estimatedArrival: `${pStart} s/d ${pEnd}`,
      porsiBesar: dailyPOBahanBaku.reduce((s, d) => s + d.porsiBesar, 0),
      porsiKecil: dailyPOBahanBaku.reduce((s, d) => s + d.porsiKecil, 0),
      totalPorsi: overallPorsiTotal,
      menuSummary: dailyPOBahanBaku.map(d => `${d.dayLabel.split(' ')[0]}: ${d.menuSummary}`).join(' | '),
      supplier: defaultSupplier,
      shipTo: defaultShipTo,
      pemesan: 'Muhammad Fadil, S. Akun',
      approvedBy: 'SRI ROHAYU, S. Pd',
      approvedTitle: 'Kepala Satuan Pelayanan Pemenuhan Gizi',
      items: dailyPOBahanBaku[0]?.items || [],
      totalAmount: overallBahanTotal,
      status: 'Draft'
    };

    const poOperasional: Partial<PurchaseOrderDocument> = {
      poType: 'Operasional',
      periodeBatchId: batchId,
      periodeStartDate: pStart,
      periodeEndDate: pEnd,
      periodeDates: dates,
      poNumber: `041-BATCH/PO-SPPG/HAF/${pStart.replace(/-/g, '')}`,
      date: pStart,
      estimatedArrival: `${pStart} s/d ${pEnd}`,
      porsiBesar: dailyPOOperasional.reduce((s, d) => s + d.porsiBesar, 0),
      porsiKecil: dailyPOOperasional.reduce((s, d) => s + d.porsiKecil, 0),
      totalPorsi: overallPorsiTotal,
      menuSummary: 'OPERASIONAL DAPUR PERIODE 5 HARI (SISTEM HARIAN)',
      supplier: defaultSupplier,
      shipTo: defaultShipTo,
      pemesan: 'Muhammad Fadil, S. Akun',
      approvedBy: 'SRI ROHAYU, S. Pd',
      approvedTitle: 'Kepala Satuan Pelayanan Pemenuhan Gizi',
      items: dailyPOOperasional[0]?.items || [],
      totalAmount: overallOpsTotal,
      status: 'Draft'
    };

    return {
      batchId,
      poBahanBaku,
      poOperasional,
      dailyPOBahanBaku,
      dailyPOOperasional,
      periodeDates: dates,
      periodSummary: {
        totalBahanBaku: overallBahanTotal,
        totalOperasional: overallOpsTotal,
        grandTotal: overallBahanTotal + overallOpsTotal,
        totalPorsi5Hari: overallPorsiTotal
      }
    };
  }

  public ensureInitialPOs() {
    if (this.purchaseOrders.length === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const aggregated = this.aggregatePeriodPO(todayStr);
      const allDaily = [...aggregated.dailyPOBahanBaku, ...aggregated.dailyPOOperasional];
      allDaily.forEach((po, idx) => {
        if (idx === 0 || idx === 5) {
          po.status = 'Dikonfirmasi Admin';
          po.adminConfirmation = {
            isConfirmed: true,
            confirmedAt: new Date(Date.now() - 3600000).toISOString(),
            confirmedBy: 'SRI ROHAYU, S. Pd',
            notes: 'PO telah diverifikasi dan dikonfirmasi Admin SPPG untuk segera dibelanjakan oleh Supplier.'
          };
        } else if (idx === 1 || idx === 6) {
          po.status = 'Diproses Belanja';
          po.adminConfirmation = {
            isConfirmed: true,
            confirmedAt: new Date(Date.now() - 7200000).toISOString(),
            confirmedBy: 'SRI ROHAYU, S. Pd',
            notes: 'Disetujui belanja pasar subuh.'
          };
          po.supplierShoppingStatus = {
            isAccepted: true,
            acceptedAt: new Date(Date.now() - 5400000).toISOString(),
            acceptedBy: 'Budi Santoso (Koperasi Zantara)',
            isShopping: true,
            shoppingStartedAt: new Date(Date.now() - 1800000).toISOString(),
            checkedItemIndexes: [0, 1, 2]
          };
        } else {
          po.status = 'Draft';
        }
        this.purchaseOrders.push(po);
      });
    }
  }

  public getAllPO(): PurchaseOrderDocument[] {
    this.ensureInitialPOs();
    return this.purchaseOrders;
  }

  public getSupplierPortalPOs(): PurchaseOrderDocument[] {
    this.ensureInitialPOs();
    return this.purchaseOrders.filter(p => p.status !== 'Draft');
  }

  public confirmPOByAdmin(poId: string, confirmedBy?: string, notes?: string): PurchaseOrderDocument | null {
    this.ensureInitialPOs();
    const targetPOs = this.purchaseOrders.filter(p => p.id === poId || p.poNumber === poId || p.periodeBatchId === poId);
    if (targetPOs.length === 0) return null;

    const now = new Date().toISOString();
    targetPOs.forEach(po => {
      po.status = 'Dikonfirmasi Admin';
      po.adminConfirmation = {
        isConfirmed: true,
        confirmedAt: now,
        confirmedBy: confirmedBy || 'SRI ROHAYU, S. Pd (Kepala SPPG)',
        notes: notes || 'PO telah diverifikasi dan dikonfirmasi resmi oleh Admin SPPG untuk dibelanjakan oleh Supplier.'
      };
      po.updatedAt = now;
    });

    this.addNotification(
      'Perencanaan Bahan',
      'PO Dikonfirmasi Admin SPPG',
      `PO ${targetPOs[0].poNumber} telah dikonfirmasi oleh Admin dan sekarang tampil di Status Pemesanan Portal Supplier.`,
      'success',
      '/portal-supplier'
    );

    return targetPOs[0];
  }

  public confirmPOBatchByAdmin(poIds: string[], confirmedBy?: string, notes?: string): PurchaseOrderDocument[] {
    this.ensureInitialPOs();
    const confirmed: PurchaseOrderDocument[] = [];
    poIds.forEach(id => {
      const res = this.confirmPOByAdmin(id, confirmedBy, notes);
      if (res && !confirmed.some(c => c.id === res.id)) {
        confirmed.push(res);
      }
    });
    return confirmed;
  }

  public updatePOSupplierShoppingProgress(
    poId: string,
    status: PurchaseOrderDocument['status'],
    supplierData?: {
      acceptedBy?: string;
      driverName?: string;
      driverPhone?: string;
      driverPlate?: string;
      checkedItemIndexes?: number[];
      notes?: string;
    }
  ): PurchaseOrderDocument | null {
    this.ensureInitialPOs();
    const targetPOs = this.purchaseOrders.filter(p => p.id === poId || p.poNumber === poId);
    if (targetPOs.length === 0) return null;

    const now = new Date().toISOString();
    targetPOs.forEach(po => {
      po.status = status;
      po.supplierShoppingStatus = {
        ...(po.supplierShoppingStatus || {}),
        isAccepted: true,
        acceptedAt: po.supplierShoppingStatus?.acceptedAt || now,
        acceptedBy: supplierData?.acceptedBy || po.supplierShoppingStatus?.acceptedBy || 'Petugas Pengadaan Supplier',
        isShopping: status === 'Diproses Belanja' || po.supplierShoppingStatus?.isShopping,
        shoppingStartedAt: status === 'Diproses Belanja' ? now : po.supplierShoppingStatus?.shoppingStartedAt,
        isDispatched: status === 'Dikirim Supplier' || po.supplierShoppingStatus?.isDispatched,
        dispatchedAt: status === 'Dikirim Supplier' ? now : po.supplierShoppingStatus?.dispatchedAt,
        driverName: supplierData?.driverName || po.supplierShoppingStatus?.driverName,
        driverPhone: supplierData?.driverPhone || po.supplierShoppingStatus?.driverPhone,
        driverPlate: supplierData?.driverPlate || po.supplierShoppingStatus?.driverPlate,
        checkedItemIndexes: supplierData?.checkedItemIndexes !== undefined ? supplierData.checkedItemIndexes : po.supplierShoppingStatus?.checkedItemIndexes,
        notes: supplierData?.notes || po.supplierShoppingStatus?.notes
      };

      if (status === 'Dikonfirmasi Supplier') {
        po.supplierConfirmation = {
          isConfirmed: true,
          confirmedAt: now,
          confirmedBy: supplierData?.acceptedBy || 'Koperasi Zantara',
          notes: supplierData?.notes || 'Pesanan telah diterima & disanggupi untuk dibelanjakan'
        };
      }
      po.updatedAt = now;
    });

    return targetPOs[0];
  }

  public savePOBatch(batch: Partial<PurchaseOrderDocument>[]): PurchaseOrderDocument[] {
    const saved: PurchaseOrderDocument[] = [];
    batch.forEach(item => {
      saved.push(this.savePO(item));
    });
    return saved;
  }

  public confirmPOBySupplier(poId: string, confirmedBy?: string, notes?: string): PurchaseOrderDocument | null {
    const targetPOs = this.purchaseOrders.filter(p => p.id === poId || p.poNumber === poId || p.periodeBatchId === poId);
    if (targetPOs.length === 0) return null;

    const now = new Date().toISOString();
    targetPOs.forEach(po => {
      po.status = 'Dikonfirmasi Supplier';
      po.supplierConfirmation = {
        isConfirmed: true,
        confirmedAt: now,
        confirmedBy: confirmedBy || 'Koperasi Zantara',
        notes: notes || 'PO Harian telah diterima dan disetujui untuk dikirimkan sesuai jadwal.'
      };
      po.updatedAt = now;
    });

    return targetPOs[0];
  }

  public savePO(data: Partial<PurchaseOrderDocument>): PurchaseOrderDocument {
    const existingIdx = this.purchaseOrders.findIndex(p => p.id === data.id);
    const now = new Date().toISOString();

    const orderDate = data.orderDate || data.date || now.split('T')[0];
    let targetArrivalDate = data.targetArrivalDate;
    if (!targetArrivalDate && orderDate) {
      const parts = orderDate.split('-');
      if (parts.length === 3) {
        const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        dObj.setDate(dObj.getDate() - 1);
        const y = dObj.getFullYear();
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const d = String(dObj.getDate()).padStart(2, '0');
        targetArrivalDate = `${y}-${m}-${d}`;
      }
    }

    const poDoc: PurchaseOrderDocument = {
      id: data.id || `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      poNumber: data.poNumber || `PO-${Date.now()}`,
      poType: data.poType || 'Bahan Baku',
      periodeStartDate: data.periodeStartDate || now.split('T')[0],
      periodeEndDate: data.periodeEndDate || now.split('T')[0],
      periodeDates: data.periodeDates || [],
      date: orderDate,
      orderDate: orderDate,
      targetArrivalDate: targetArrivalDate || orderDate,
      estimatedArrival: data.estimatedArrival || (targetArrivalDate ? `${targetArrivalDate} Pkl 16:00 WIB (H-1)` : now.split('T')[0]),
      porsiBesar: data.porsiBesar || 0,
      porsiKecil: data.porsiKecil || 0,
      totalPorsi: (data.porsiBesar || 0) + (data.porsiKecil || 0),
      menuSummary: data.menuSummary || '',
      supplier: data.supplier || { name: 'KOPERASI KONSUMEN ZANTARA', address: '', contact: '' },
      shipTo: data.shipTo || { name: 'SPPG KREJENGAN TEMENGGUNGAN', address: '', contact: '' },
      pemesan: data.pemesan || 'Muhammad Fadil, S. Akun',
      approvedBy: data.approvedBy || 'SRI ROHAYU, S. Pd',
      approvedTitle: data.approvedTitle || 'Kepala Satuan Pelayanan Pemenuhan Gizi',
      items: data.items || [],
      totalAmount: data.totalAmount || (data.items || []).reduce((sum, i) => sum + i.totalPrice, 0),
      additionalNotes: data.additionalNotes || '',
      status: data.status || 'Draft',
      createdAt: data.createdAt || now,
      updatedAt: now
    };

    if (existingIdx >= 0) {
      this.purchaseOrders[existingIdx] = poDoc;
    } else {
      this.purchaseOrders.unshift(poDoc);
    }

    return poDoc;
  }

  public deletePO(id: string): boolean {
    const initialLen = this.purchaseOrders.length;
    this.purchaseOrders = this.purchaseOrders.filter(p => p.id !== id);
    return this.purchaseOrders.length < initialLen;
  }


  public getTargetCountForDateAndGroup(tanggal: string, groupNama: string): number {
    const summary = this.getBeneficiarySummaryForDate(tanggal);
    const pb = summary.portionBreakdown;
    const target = (groupNama || '').toUpperCase();

    let count = 0;
    if (target.includes('PORSI BESAR') || target.includes('SD KELAS 4-6') || target.includes('SMA') || target.includes('SMP')) {
      count = pb?.porsiBesar || 0;
    } else if (target.includes('PORSI KECIL') || target.includes('SD KELAS 1-3') || target.includes('PAUD') || target.includes('TK')) {
      count = pb?.porsiKecil || 0;
    } else if (target.includes('BALITA')) {
      count = pb?.balita || 0;
    } else if (target.includes('HAMIL') || target.includes('MENYUSUI') || target.includes('BUMIL') || target.includes('BUSUI')) {
      count = pb?.bumilBusui || 0;
    } else if (target.includes('GURU') || target.includes('STAF')) {
      count = summary.totalGuru || 0;
    } else {
      const recs = this.getBeneficiaryRecordsForDate(tanggal);
      const filtered = recs.filter(r => {
        const gName = (r.groupNama || '').toUpperCase();
        return gName.includes(target) || target.includes(gName) || (r.kategori && r.kategori.toUpperCase().includes(target));
      });
      if (filtered.length > 0) {
        count = filtered.reduce((acc, curr) => acc + curr.totalPenerima, 0);
      } else {
        count = summary.totalPenerima || 0;
      }
    }

    // Fallback: calculate directly from beneficiaryGroups & lembagaList if count is 0
    if (count === 0 && Array.isArray(this.beneficiaryGroups) && this.beneficiaryGroups.length > 0) {
      let fallbackSum = 0;
      this.beneficiaryGroups.forEach(g => {
        const gKlas = g.klasifikasiPorsi || 'Porsi Besar';
        const isMatch = (
          (target.includes('PORSI BESAR') && gKlas === 'Porsi Besar') ||
          (target.includes('PORSI KECIL') && gKlas === 'Porsi Kecil') ||
          (target.includes('BALITA') && (gKlas === 'Balita' || g.nama.toUpperCase().includes('BALITA'))) ||
          ((target.includes('BUMIL') || target.includes('BUSUI') || target.includes('HAMIL') || target.includes('MENYUSUI')) && (gKlas === 'Bumil & Busui' || g.nama.toUpperCase().includes('HAMIL') || g.nama.toUpperCase().includes('MENYUSUI')))
        );
        if (isMatch) {
          if (Array.isArray(g.lembagaList) && g.lembagaList.length > 0) {
            g.lembagaList.forEach(l => {
              const tSiswa = Number(l.targetSiswa) || 0;
              const tGuru = Number(l.targetGuru) || 0;
              const tBalita = Number(l.targetBalita) || 0;
              const tBumil = Number(l.targetBumilBusui) || 0;
              if (target.includes('BALITA')) fallbackSum += (tBalita || tSiswa);
              else if (target.includes('BUMIL') || target.includes('BUSUI') || target.includes('HAMIL')) fallbackSum += (tBumil || tSiswa);
              else fallbackSum += (tSiswa + tGuru);
            });
          }
        }
      });
      if (fallbackSum > 0) return fallbackSum;
    }

    if (count > 0) return count;

    if (target.includes('PORSI BESAR')) return 618;
    if (target.includes('PORSI KECIL')) return 481;
    if (target.includes('BALITA')) return 100;
    if (target.includes('BUMIL') || target.includes('BUSUI')) return 51;

    return summary.totalPenerima || 1250;
  }

  public getBeneficiaryRecordsForDate(tanggal: string): DailyBeneficiaryRecord[] {
    return this.dailyBeneficiaryRecords.filter(r => r.tanggal === tanggal);
  }

  public getBeneficiarySummaryForDate(tanggal: string): DailyBeneficiarySummary {
    let recs = this.getBeneficiaryRecordsForDate(tanggal);
    if (recs.length === 0) {
      recs = this.copyBeneficiaryFromPreviousDay(tanggal);
    }
    const lockInfo = this.beneficiaryLockStatus[tanggal] || { status: 'DRAFT' };

    let totalPenerima = 0;
    let totalBalita = 0;
    let totalIbuHamil = 0;
    let totalIbuMenyusui = 0;
    let totalSiswa = 0;
    let totalGuru = 0;

    const groupSet = new Set<string>();
    const instansiSet = new Set<string>();

    let porsiBesar = 0;
    let porsiKecil = 0;

    recs.forEach(r => {
      totalPenerima += r.totalPenerima;
      groupSet.add(r.groupId);
      instansiSet.add(r.namaInstansi);

      const upperGroup = (r.groupNama || '').toUpperCase();

      const loc = this.beneficiaryLocations.find(l => l.id === r.locationId || l.namaInstansi === r.namaInstansi);
      const grp = this.beneficiaryGroups.find(g => g.id === r.groupId || g.nama.toUpperCase() === upperGroup);
      const klas = loc?.klasifikasiPorsi || grp?.klasifikasiPorsi;

      if (klas === 'Balita' || r.kategori === 'Balita' || upperGroup.includes('BALITA')) {
        totalBalita += r.totalPenerima;
        porsiKecil += r.totalPenerima;
      } else if (klas === 'Bumil & Busui' || r.kategori === 'Ibu Hamil' || r.kategori === 'Ibu Menyusui' || upperGroup.includes('HAMIL') || upperGroup.includes('MENYUSUI') || upperGroup.includes('BUSUI')) {
        if (r.kategori === 'Ibu Menyusui' || upperGroup.includes('MENYUSUI')) {
          totalIbuMenyusui += r.totalPenerima;
        } else {
          totalIbuHamil += r.totalPenerima;
        }
        porsiBesar += r.totalPenerima;
      } else if (r.kategori === 'Guru / Staf' || upperGroup.includes('GURU')) {
        totalGuru += r.totalPenerima;
        if (klas === 'Porsi Kecil') {
          porsiKecil += r.totalPenerima;
        } else {
          porsiBesar += r.totalPenerima;
        }
      } else {
        totalSiswa += r.totalPenerima;
        if (klas === 'Porsi Kecil' || upperGroup.includes('PAUD') || upperGroup.includes('TK') || upperGroup.includes('KELAS 1-3')) {
          porsiKecil += r.totalPenerima;
        } else {
          porsiBesar += r.totalPenerima;
        }
      }
    });

    // Safeguard: if any unclassified recipients exist, ensure porsiBesar + porsiKecil === totalPenerima
    if (porsiBesar + porsiKecil < totalPenerima) {
      const diff = totalPenerima - (porsiBesar + porsiKecil);
      porsiBesar += diff;
    }

    return {
      tanggal,
      totalPenerima,
      totalPorsi: totalPenerima,
      totalKelompok: groupSet.size,
      totalInstansi: instansiSet.size,
      totalBalita,
      totalIbuHamil,
      totalIbuMenyusui,
      totalSiswa,
      totalGuru,
      portionBreakdown: {
        porsiBesar,
        porsiKecil,
        balita: totalBalita,
        bumilBusui: totalIbuHamil + totalIbuMenyusui
      },
      statusLock: lockInfo.status,
      finalizedBy: lockInfo.finalizedBy,
      finalizedAt: lockInfo.finalizedAt
    };
  }

  public copyBeneficiaryFromPreviousDay(targetDate: string, sourceDate?: string): DailyBeneficiaryRecord[] {
    let sourceRecs: DailyBeneficiaryRecord[] = [];
    if (sourceDate) {
      sourceRecs = this.getBeneficiaryRecordsForDate(sourceDate);
    } else {
      const availableDates = Array.from(new Set(this.dailyBeneficiaryRecords.map(r => r.tanggal)))
        .filter(d => d < targetDate)
        .sort((a, b) => b.localeCompare(a));

      if (availableDates.length > 0) {
        sourceRecs = this.getBeneficiaryRecordsForDate(availableDates[0]);
      } else if (this.dailyBeneficiaryRecords.length > 0) {
        sourceRecs = this.dailyBeneficiaryRecords;
      }
    }

    if (sourceRecs.length === 0) {
      const created = createInitialBeneficiariesForDate(targetDate);
      this.dailyBeneficiaryRecords.push(...created);
      return created;
    }

    this.dailyBeneficiaryRecords = this.dailyBeneficiaryRecords.filter(r => r.tanggal !== targetDate);

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newRecords: DailyBeneficiaryRecord[] = sourceRecs.map((src, idx) => ({
      ...src,
      id: `BEN-${targetDate}-${String(idx + 1).padStart(3, '0')}`,
      tanggal: targetDate,
      penambahan: 0,
      pengurangan: 0,
      totalPenerima: src.jumlahAwal,
      status: 'DRAFT',
      createdBy: 'System Copy',
      createdAt: nowStr,
      updatedBy: undefined,
      updatedAt: undefined
    }));

    this.dailyBeneficiaryRecords.push(...newRecords);
    return newRecords;
  }

  public getTugasDivisiForDate(tanggal: string): DivisiTaskRecord[] {
    return this.tugasDivisiRecords.filter(r => r.tanggal === tanggal);
  }

  public getOrCreateTugasDivisiForDate(tanggal: string): DivisiTaskRecord[] {
    let records = this.getTugasDivisiForDate(tanggal);
    if (records.length === 0) {
      const divisionIds: TaskTemplate['divisiId'][] = ['persiapan', 'pengolahan', 'pemorsian', 'distribusi', 'cuci_ompreng'];
      const newRecords = divisionIds.map(divId => createDefaultTasksForDateAndDivisi(tanggal, divId));
      this.tugasDivisiRecords.push(...newRecords);
      return newRecords;
    }
    return records;
  }

  public getDivisiSubItems(filter: { tanggal?: string; divisiId?: string; subMenuId?: string }): DivisiSubItemRecord[] {
    return this.divisiSubItemRecords.filter(item => {
      if (filter.tanggal && item.tanggal !== filter.tanggal) return false;
      if (filter.divisiId && item.divisiId !== filter.divisiId) return false;
      if (filter.subMenuId && item.subMenuId !== filter.subMenuId) return false;
      return true;
    });
  }

  public saveDivisiSubItem(record: Omit<DivisiSubItemRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DivisiSubItemRecord {
    const nowIso = new Date().toISOString();
    const id = record.id || `SUB-${record.tanggal}-${record.divisiId}-${record.subMenuId}-${Date.now()}`;
    const idx = this.divisiSubItemRecords.findIndex(r => r.id === id);
    const fullRecord: DivisiSubItemRecord = {
      ...record,
      id,
      isSynced: true,
      syncedAt: nowIso,
      createdAt: idx !== -1 ? this.divisiSubItemRecords[idx].createdAt : nowIso,
      updatedAt: nowIso
    };
    if (idx !== -1) {
      this.divisiSubItemRecords[idx] = fullRecord;
    } else {
      this.divisiSubItemRecords.unshift(fullRecord);
    }
    return fullRecord;
  }

  public deleteDivisiSubItem(id: string): boolean {
    const prev = this.divisiSubItemRecords.length;
    this.divisiSubItemRecords = this.divisiSubItemRecords.filter(r => r.id !== id);
    return this.divisiSubItemRecords.length < prev;
  }

  public sanitizeCategories() {
    this.kategori = [...initialKategori];
    if (Array.isArray(this.barang)) {
      this.barang.forEach(b => {
        const kName = (b.kategoriNama || '').toLowerCase();
        const bName = (b.namaBarang || '').toLowerCase();
        const isOps = kName.includes('operasional') || kName.includes('hardware') || kName.includes('atk') ||
                      kName.includes('cetakan') || kName.includes('konsumabel') ||
                      bName.includes('laptop') || bName.includes('scanner') || bName.includes('kertas') || bName.includes('map');
        if (isOps) {
          b.kategoriId = 'KAT-002';
          b.kategoriNama = 'Operasional';
        } else {
          b.kategoriId = 'KAT-001';
          b.kategoriNama = 'Bahan Baku';
        }
      });
    }
  }

  constructor() {
    this.sanitizeCategories();
  }

  public addLog(userId: string, namaUser: string, modul: string, aktivitas: string, detail?: string, ipAddress = '127.0.0.1', status: 'Sukses' | 'Gagal' = 'Sukses') {
    const now = new Date();
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      userId,
      namaUser,
      modul,
      aktivitas,
      detail: detail || aktivitas,
      tanggal: now.toISOString().split('T')[0],
      jam: now.toTimeString().split(' ')[0],
      browser: 'Web Browser / REST Client',
      ipAddress,
      status
    };
    this.activityLogs.unshift(newLog);
  }

  public addNotification(modul: NotificationItem['modul'], judul: string, pesan: string, tipe: NotificationItem['tipe'] = 'info', linkUrl?: string) {
    const now = new Date();
    const newNtf: NotificationItem = {
      id: `NTF-${Date.now()}`,
      modul,
      judul,
      pesan,
      tipe,
      isRead: false,
      createdAt: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
      linkUrl
    };
    this.notifications.unshift(newNtf);
  }

  public addBarangDatang(item: Omit<BarangDatang, 'id' | 'createdAt'>): BarangDatang {
    const now = new Date();
    const cleanDate = (item.tanggal || now.toISOString().split('T')[0]).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const id = `BD-${cleanDate}-${rand}`;
    const newItem: BarangDatang = {
      ...item,
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    this.barangDatang.unshift(newItem);
    return newItem;
  }

  public updateBarangDatang(id: string, updates: Partial<BarangDatang>): BarangDatang | null {
    const idx = this.barangDatang.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.barangDatang[idx] = {
      ...this.barangDatang[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.barangDatang[idx];
  }

  public deleteBarangDatang(id: string): boolean {
    const prevLen = this.barangDatang.length;
    this.barangDatang = this.barangDatang.filter(b => b.id !== id);
    return this.barangDatang.length < prevLen;
  }
}

export const dbStore = new EnterpriseDataStore();
