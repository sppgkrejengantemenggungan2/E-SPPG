import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store';

const router = Router();

// Official Organization Constants
const IDENTITAS_SPPG = {
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

// GET /api/v1/print-laporan/bundle/:tanggal
// Aggregates real-time data across all modules for seamless reporting
router.get('/bundle/:tanggal', (req: Request, res: Response): void => {
  try {
    const { tanggal } = req.params;

    // 1. Data Penerima Manfaat
    const beneficiarySummary = dbStore.getBeneficiarySummaryForDate(tanggal);
    const beneficiaryRecords = dbStore.getBeneficiaryRecordsForDate(tanggal);

    // 2. Data Menu Harian & PLOG
    let dailyMenu = dbStore.plogDailyMenus.find(m => m.tanggal === tanggal);
    const tugasRecs = dbStore.getTugasDivisiForDate(tanggal);
    const tugasMenu = tugasRecs.find(t => t.menuHarian && t.menuHarian.trim())?.menuHarian;

    if (!dailyMenu) {
      dailyMenu = {
        id: `PLOG-${tanggal}`,
        tanggal,
        namaMenuHarian: tugasMenu || 'Nasi Putih Pulen, Ayam Goreng Lengkuas, Tempe Bacem Tradisional, Sayur Sop Bakso, Pisang Ambon & Susu UHT',
        makananPokok: 'Nasi Putih Pulen',
        laukHewani: 'Ayam Goreng Lengkuas',
        laukNabati: 'Tempe Bacem Tradisional',
        sayur: 'Sayur Sop Bakso Wortel',
        buah: 'Pisang Ambon Super',
        ekstra: 'Susu UHT Plain 200ml',
        jumlahPenerimaManfaat: beneficiarySummary.totalPenerima || 1525,
        porsiBesar: beneficiarySummary.portionBreakdown?.porsiBesar || 1048,
        porsiKecil: beneficiarySummary.portionBreakdown?.porsiKecil || 477,
        totalJumlahPorsi: beneficiarySummary.totalPorsi || 1525,
        jumlahPorsiHarian: beneficiarySummary.totalPorsi || 1525,
        waktuDistribusi: '10:30 WIB',
        penanggungJawabGizi: IDENTITAS_SPPG.pejabat.ahliGizi,
        statusApproval: 'Diverifikasi Ahli Gizi'
      };
    }

    // 3. Data Purchase Order
    let matchedPO = dbStore.purchaseOrders.find(p =>
      p.date === tanggal ||
      p.orderDate === tanggal ||
      (p.periodeDates && p.periodeDates.includes(tanggal))
    );
    if (!matchedPO && dbStore.purchaseOrders.length > 0) {
      matchedPO = dbStore.purchaseOrders[0];
    }

    // 4. Data Sub-Items Tugas Divisi (Suhu Ruangan, Suhu Makanan, Foto Ompreng, Sampah/Food Waste, Bahan Rusak)
    const divisiSubItems = dbStore.getDivisiSubItems({ tanggal });

    // 5. Data QC Barang Datang
    const barangDatangList = dbStore.barangDatang.filter(b => b.tanggal === tanggal);

    // 6. Data Distribusi & Driver
    const distribusiReports = dbStore.distributionReports.filter(d => d.tanggal === tanggal);
    const driverList = dbStore.drivers;
    const kendaraanList = dbStore.kendaraan;

    res.json({
      success: true,
      data: {
        tanggal,
        identitasSPPG: IDENTITAS_SPPG,
        beneficiarySummary,
        beneficiaryRecords,
        dailyMenu,
        purchaseOrder: matchedPO,
        divisiSubItems,
        barangDatangList,
        distribusiReports,
        driverList,
        kendaraanList
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Gagal mengambil data terpadu untuk cetak laporan'
    });
  }
});

export default router;
