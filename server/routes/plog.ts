import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store';
import { MasterMenuGiziItem, PlogDailyMenuItem, PlogGiziCalculation, PlogFoodCostCalculation, PlogFoodCostItem } from '../../src/types';
import { syncSaveDoc, syncDeleteDoc } from '../db/firestore';
import { broadcastDataSync } from '../events';

const router = Router();

// =========================================================
// 1. MASTER MENU & KANDUNGAN GIZI (DATABASE CATALOG)
// =========================================================

// GET /api/v1/plog/master-menu
router.get('/master-menu', (req: Request, res: Response): void => {
  try {
    const { kategori, search } = req.query;
    let list = [...dbStore.masterMenuGizi];

    if (kategori && typeof kategori === 'string' && kategori !== 'Semua') {
      list = list.filter(m => m.kategori === kategori);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.namaMenu.toLowerCase().includes(q) ||
        (m.standarKecukupan && m.standarKecukupan.toLowerCase().includes(q)) ||
        (m.keterangan && m.keterangan.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal memuat master menu gizi' });
  }
});

// POST /api/v1/plog/master-menu
router.post('/master-menu', (req: Request, res: Response): void => {
  try {
    const {
      namaMenu,
      kategori,
      porsiGram,
      energiKkal,
      proteinGram,
      lemakGram,
      karbohidratGram,
      seratGram,
      kalsiumMg,
      zatBesiMg,
      estimasiBiayaPorsi,
      standarKecukupan,
      keterangan
    } = req.body;

    if (!namaMenu || !kategori) {
      res.status(400).json({ success: false, message: 'Nama menu dan kategori wajib diisi!' });
      return;
    }

    const now = new Date().toISOString();
    const newId = `GIZI-${String(dbStore.masterMenuGizi.length + 1).padStart(3, '0')}`;

    const newItem: MasterMenuGiziItem = {
      id: newId,
      namaMenu: String(namaMenu).trim(),
      kategori,
      porsiGram: Number(porsiGram) || 100,
      energiKkal: Number(energiKkal) || 0,
      proteinGram: Number(proteinGram) || 0,
      lemakGram: Number(lemakGram) || 0,
      karbohidratGram: Number(karbohidratGram) || 0,
      seratGram: Number(seratGram) || 0,
      kalsiumMg: Number(kalsiumMg) || 0,
      zatBesiMg: Number(zatBesiMg) || 0,
      estimasiBiayaPorsi: Number(estimasiBiayaPorsi) || 0,
      standarKecukupan: standarKecukupan || 'Standar TKPI Kemenkes RI',
      keterangan: keterangan || '',
      createdAt: now,
      updatedAt: now
    };

    dbStore.masterMenuGizi.push(newItem);
    syncSaveDoc('masterMenuGizi', newItem.id, newItem);
    broadcastDataSync({ type: 'plog', action: 'create', id: newItem.id });
    dbStore.addLog('ADMIN', 'Petugas Gizi SPPG', 'Laporan PLOG', 'Tambah Master Menu Gizi', `Menambahkan menu: ${newItem.namaMenu} (${newItem.kategori})`, req.ip);

    res.status(201).json({
      success: true,
      message: `Menu ${newItem.namaMenu} berhasil disimpan ke database master gizi!`,
      data: newItem
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menambahkan master menu gizi' });
  }
});

// PUT /api/v1/plog/master-menu/:id
router.put('/master-menu/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const idx = dbStore.masterMenuGizi.findIndex(m => m.id === id);

    if (idx === -1) {
      res.status(404).json({ success: false, message: `Menu dengan ID ${id} tidak ditemukan.` });
      return;
    }

    const current = dbStore.masterMenuGizi[idx];
    const updated: MasterMenuGiziItem = {
      ...current,
      ...req.body,
      id: current.id,
      updatedAt: new Date().toISOString()
    };

    dbStore.masterMenuGizi[idx] = updated;
    syncSaveDoc('masterMenuGizi', updated.id, updated);
    broadcastDataSync({ type: 'plog', action: 'update', id: updated.id });
    dbStore.addLog('ADMIN', 'Petugas Gizi SPPG', 'Laporan PLOG', 'Update Master Menu Gizi', `Memperbarui menu: ${updated.namaMenu}`, req.ip);

    res.json({
      success: true,
      message: `Menu ${updated.namaMenu} berhasil diperbarui!`,
      data: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal memperbarui menu gizi' });
  }
});

// DELETE /api/v1/plog/master-menu/:id
router.delete('/master-menu/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const prev = dbStore.masterMenuGizi.length;
    const item = dbStore.masterMenuGizi.find(m => m.id === id);
    dbStore.masterMenuGizi = dbStore.masterMenuGizi.filter(m => m.id !== id);

    if (dbStore.masterMenuGizi.length === prev) {
      res.status(404).json({ success: false, message: `Menu ${id} tidak ditemukan.` });
      return;
    }

    syncDeleteDoc('masterMenuGizi', id);
    broadcastDataSync({ type: 'plog', action: 'delete', id });
    dbStore.addLog('ADMIN', 'Petugas Gizi SPPG', 'Laporan PLOG', 'Hapus Master Menu Gizi', `Menghapus menu: ${item?.namaMenu || id}`, req.ip);
    res.json({ success: true, message: `Menu ${item?.namaMenu || id} berhasil dihapus dari katalog.` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menghapus menu gizi' });
  }
});

// =========================================================
// 2. CONTEXT & BENEFICIARY INTEGRATION (SUB-MENU 1 & ALL)
// =========================================================

// Helper to get beneficiary stats for a date directly from daily beneficiary data in Penerima Manfaat
function getBeneficiaryStats(tanggal: string) {
  const summary = dbStore.getBeneficiarySummaryForDate(tanggal);
  const pb = summary.portionBreakdown || { porsiBesar: 0, porsiKecil: 0, balita: 0, bumilBusui: 0 };

  const totalPenerima = summary.totalPenerima || 0;
  let porsiBesar = pb.porsiBesar || 0;
  let porsiKecil = pb.porsiKecil || 0;

  // Ensure 100% of recipients are accounted for in porsiBesar and porsiKecil
  if (porsiBesar === 0 && porsiKecil === 0 && totalPenerima > 0) {
    porsiBesar = Math.round(totalPenerima * 0.65);
    porsiKecil = totalPenerima - porsiBesar;
  } else if (porsiBesar + porsiKecil < totalPenerima) {
    porsiBesar += (totalPenerima - (porsiBesar + porsiKecil));
  }

  const totalJumlahPorsi = porsiBesar + porsiKecil;

  return {
    totalPenerima,
    porsiBesar,
    porsiKecil,
    totalJumlahPorsi,
    totalPorsiHarian: totalJumlahPorsi,
    breakdown: {
      porsiBesar,
      porsiKecil,
      totalJumlahPorsi,
      totalSiswa: summary.totalSiswa || 0,
      totalGuru: summary.totalGuru || 0,
      balita: pb.balita || 0,
      bumilBusui: pb.bumilBusui || 0,
      paudTk: pb.porsiKecil ? Math.round(pb.porsiKecil * 0.2) : 0,
      sdKelas1_3: pb.porsiKecil ? Math.round(pb.porsiKecil * 0.8) : 0,
      sdKelas4_6: pb.porsiBesar ? Math.round(pb.porsiBesar * 0.45) : 0,
      smpMts: pb.porsiBesar ? Math.round(pb.porsiBesar * 0.45) : 0,
      guruStaf: summary.totalGuru || (pb.porsiBesar ? Math.round(pb.porsiBesar * 0.1) : 0)
    }
  };
}

// GET /api/v1/plog/context/:tanggal
router.get('/context/:tanggal', (req: Request, res: Response): void => {
  try {
    const { tanggal } = req.params;
    const benStats = getBeneficiaryStats(tanggal);

    // Existing daily menu
    let dailyMenu = dbStore.plogDailyMenus.find(m => m.tanggal === tanggal);

    if (dailyMenu) {
      // Automatically keep in sync with live Penerima Manfaat daily numbers
      dailyMenu.jumlahPenerimaManfaat = benStats.totalPenerima;
      dailyMenu.porsiBesar = benStats.porsiBesar;
      dailyMenu.porsiKecil = benStats.porsiKecil;
      dailyMenu.totalJumlahPorsi = benStats.totalJumlahPorsi;
      dailyMenu.jumlahPorsiHarian = benStats.totalJumlahPorsi;
    } else {
      const tugasRecs = dbStore.getTugasDivisiForDate(tanggal);
      const mHarian = tugasRecs.find(t => t.menuHarian)?.menuHarian;
      dailyMenu = {
        id: `PLOG-${tanggal}`,
        tanggal,
        namaMenuHarian: mHarian || 'Nasi Putih Pulen, Ayam Goreng Lengkuas, Tempe Bacem, Sayur Sop, Pisang Ambon & Susu UHT',
        makananPokok: 'Nasi Putih Pulen',
        laukHewani: 'Ayam Goreng Lengkuas',
        laukNabati: 'Tempe Bacem Tradisional',
        sayur: 'Sayur Sop Wortel Bakso',
        buah: 'Pisang Ambon Segar',
        ekstra: 'Susu UHT Plain 200ml',
        jumlahPenerimaManfaat: benStats.totalPenerima,
        porsiBesar: benStats.porsiBesar,
        porsiKecil: benStats.porsiKecil,
        totalJumlahPorsi: benStats.totalJumlahPorsi,
        jumlahPorsiHarian: benStats.totalJumlahPorsi,
        rincianSasaran: benStats.breakdown,
        waktuDistribusi: '10:30 WIB',
        penanggungJawabGizi: 'Rina Wijaya, S.Gz (Ahli Gizi SPPG)',
        statusApproval: 'Diverifikasi Ahli Gizi'
      };
    }

    // Matching PO Harian
    let po = dbStore.purchaseOrders.find(p =>
      p.date === tanggal ||
      p.orderDate === tanggal ||
      (p.periodeDates && p.periodeDates.includes(tanggal))
    );

    if (!po && dbStore.purchaseOrders.length > 0) {
      po = dbStore.purchaseOrders[0];
    }

    res.json({
      success: true,
      data: {
        tanggal,
        beneficiary: benStats,
        dailyMenu: dailyMenu || null,
        purchaseOrder: po ? {
          id: po.id,
          poNumber: po.poNumber,
          date: po.date,
          totalAmount: po.totalAmount,
          supplier: po.supplier,
          itemsCount: po.items ? po.items.length : 0,
          items: po.items || []
        } : null,
        masterMenuGiziCount: dbStore.masterMenuGizi.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal memuat konteks PLOG' });
  }
});

// =========================================================
// 3. SUB MENU 1: INPUT MENU (DAILY MENU)
// =========================================================

// GET /api/v1/plog/daily-menu
router.get('/daily-menu', (req: Request, res: Response): void => {
  try {
    const { tanggal } = req.query;
    if (tanggal && typeof tanggal === 'string') {
      const benStats = getBeneficiaryStats(tanggal);
      const found = dbStore.plogDailyMenus.find(m => m.tanggal === tanggal);
      if (found) {
        // Automatically sync latest daily beneficiary data from Penerima Manfaat
        found.jumlahPenerimaManfaat = benStats.totalPenerima;
        found.porsiBesar = benStats.porsiBesar;
        found.porsiKecil = benStats.porsiKecil;
        found.totalJumlahPorsi = benStats.totalJumlahPorsi;
        found.jumlahPorsiHarian = benStats.totalJumlahPorsi;
        res.json({ success: true, data: found });
        return;
      }

      // Check context fallback
      const defaultMenu: PlogDailyMenuItem = {
        id: `PLOG-${tanggal}`,
        tanggal,
        namaMenuHarian: 'Nasi Pulen, Ayam Goreng Lengkuas, Tempe Bacem, Sayur Sop & Buah Pisang',
        makananPokok: 'Nasi Putih Pulen',
        laukHewani: 'Ayam Goreng Lengkuas',
        laukNabati: 'Tempe Bacem Tradisional',
        sayur: 'Sayur Sop Wortel Bakso',
        buah: 'Pisang Ambon Segar',
        ekstra: 'Susu UHT Plain 200ml',
        jumlahPenerimaManfaat: benStats.totalPenerima,
        porsiBesar: benStats.porsiBesar,
        porsiKecil: benStats.porsiKecil,
        totalJumlahPorsi: benStats.totalJumlahPorsi,
        jumlahPorsiHarian: benStats.totalJumlahPorsi,
        rincianSasaran: benStats.breakdown,
        waktuDistribusi: '10:30 WIB',
        penanggungJawabGizi: 'Rina Wijaya, S.Gz (Ahli Gizi SPPG)',
        statusApproval: 'Diverifikasi Ahli Gizi'
      };
      res.json({ success: true, data: defaultMenu, isDraft: true });
      return;
    }

    res.json({
      success: true,
      total: dbStore.plogDailyMenus.length,
      data: dbStore.plogDailyMenus
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal memuat daily menu PLOG' });
  }
});

// POST /api/v1/plog/daily-menu
router.post('/daily-menu', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      tanggal,
      namaMenuHarian,
      makananPokok,
      laukHewani,
      laukNabati,
      sayur,
      buah,
      ekstra,
      porsiBesar,
      porsiKecil,
      waktuDistribusi,
      penanggungJawabGizi,
      statusApproval,
      catatan
    } = req.body;

    if (!tanggal) {
      res.status(400).json({ success: false, message: 'Tanggal pelaksanaan menu wajib diisi!' });
      return;
    }

    // Always fetch latest real-time beneficiary and portion stats from Penerima Manfaat
    const benStats = getBeneficiaryStats(tanggal);
    const finalPenerima = benStats.totalPenerima;
    const finalPorsiBesar = porsiBesar !== undefined ? Number(porsiBesar) : benStats.porsiBesar;
    const finalPorsiKecil = porsiKecil !== undefined ? Number(porsiKecil) : benStats.porsiKecil;
    const finalTotalPorsi = finalPorsiBesar + finalPorsiKecil;

    // Construct full menu name if not provided
    const combinedName = namaMenuHarian || [
      makananPokok,
      laukHewani,
      laukNabati,
      sayur,
      buah
    ].filter(Boolean).join(' + ');

    // Synchronize across all modules, persist to Firestore, and broadcast SSE
    const syncResult = await dbStore.updateDailyMenuAcrossAll(tanggal, combinedName, {
      makananPokok: makananPokok || 'Nasi Putih Pulen',
      laukHewani: laukHewani || 'Ayam Goreng Lengkuas',
      laukNabati: laukNabati || 'Tempe Bacem Tradisional',
      sayur: sayur || 'Sayur Sop Wortel Bakso',
      buah: buah || 'Pisang Ambon Segar',
      ekstra: ekstra || 'Susu UHT Plain 200ml',
      porsiBesar: finalPorsiBesar,
      porsiKecil: finalPorsiKecil,
      waktuDistribusi: waktuDistribusi || '10:30 WIB',
      penanggungJawabGizi: penanggungJawabGizi || 'Rina Wijaya, S.Gz (Ahli Gizi SPPG)',
      statusApproval: statusApproval || 'Diverifikasi Ahli Gizi',
      catatan: catatan || ''
    });

    dbStore.addLog(
      'ADMIN',
      'Petugas Gizi SPPG',
      'Laporan PLOG',
      'Simpan Input Menu Harian',
      `Menyimpan menu harian tanggal ${tanggal}: ${syncResult.plogRecord.namaMenuHarian} (Besar: ${finalPorsiBesar}, Kecil: ${finalPorsiKecil}, Total: ${finalTotalPorsi} porsi)`,
      req.ip
    );

    res.json({
      success: true,
      message: `Menu harian tanggal ${tanggal} (${finalTotalPorsi} porsi: ${finalPorsiBesar} besar / ${finalPorsiKecil} kecil) berhasil disimpan & disinkronisasikan ke seluruh sistem!`,
      data: syncResult.plogRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menyimpan input menu harian' });
  }
});

// =========================================================
// 4. SUB MENU 2: INFORMASI KANDUNGAN GIZI (AUTO-CALCULATED)
// =========================================================

// Helper function to find master menu item by matching dish name
function findMasterNutrition(dishName: string, categoryFallback?: string): MasterMenuGiziItem | null {
  if (!dishName) return null;
  const nameClean = dishName.toLowerCase().trim();

  // 1. Exact or include match
  let found = dbStore.masterMenuGizi.find(m =>
    m.namaMenu.toLowerCase() === nameClean ||
    nameClean.includes(m.namaMenu.toLowerCase()) ||
    m.namaMenu.toLowerCase().includes(nameClean)
  );

  if (found) return found;

  // 2. Fallback by Category
  if (categoryFallback) {
    found = dbStore.masterMenuGizi.find(m => m.kategori.toLowerCase() === categoryFallback.toLowerCase());
  }

  return found || null;
}

// GET /api/v1/plog/gizi-calculation/:tanggal
router.get('/gizi-calculation/:tanggal', (req: Request, res: Response): void => {
  try {
    const { tanggal } = req.params;

    const benStats = getBeneficiaryStats(tanggal);

    // 1. Get or create daily menu
    let dailyMenu = dbStore.plogDailyMenus.find(m => m.tanggal === tanggal);
    if (!dailyMenu) {
      dailyMenu = {
        id: `PLOG-${tanggal}`,
        tanggal,
        namaMenuHarian: 'Nasi Putih Pulen, Ayam Goreng Lengkuas, Tempe Bacem, Sayur Sop, Pisang Ambon & Susu UHT',
        makananPokok: 'Nasi Putih Pulen',
        laukHewani: 'Ayam Goreng Lengkuas',
        laukNabati: 'Tempe Bacem Tradisional',
        sayur: 'Sayur Sop Wortel Bakso',
        buah: 'Pisang Ambon Segar',
        ekstra: 'Susu UHT Plain 200ml',
        jumlahPenerimaManfaat: benStats.totalPenerima,
        porsiBesar: benStats.porsiBesar,
        porsiKecil: benStats.porsiKecil,
        totalJumlahPorsi: benStats.totalJumlahPorsi,
        jumlahPorsiHarian: benStats.totalPorsiHarian
      };
    }

    // 2. Match each component against Master Database
    const components = [
      { kategori: 'Makanan Pokok', name: dailyMenu.makananPokok || 'Nasi Putih Pulen' },
      { kategori: 'Lauk Hewani', name: dailyMenu.laukHewani || 'Ayam Goreng Lengkuas' },
      { kategori: 'Lauk Nabati', name: dailyMenu.laukNabati || 'Tempe Bacem Tradisional' },
      { kategori: 'Sayuran', name: dailyMenu.sayur || 'Sayur Sop Wortel Bakso' },
      { kategori: 'Buah', name: dailyMenu.buah || 'Pisang Ambon Segar' },
      { kategori: 'Ekstra / Minuman', name: dailyMenu.ekstra || 'Susu UHT Plain 200ml' }
    ];

    // Helper to calculate items with specific scaling factors for Porsi Besar and Porsi Kecil
    const calculateNutritionForScale = (scaleMap: Record<string, number>, targetGramasi: Record<string, number>) => {
      return components.map(c => {
        const match = findMasterNutrition(c.name, c.kategori);
        const scale = scaleMap[c.kategori] || 1.0;
        const defaultGram = targetGramasi[c.kategori] || 100;

        if (match) {
          const ratio = (defaultGram / (match.porsiGram || 100));
          return {
            kategori: c.kategori,
            namaMenu: match.namaMenu,
            porsiGram: defaultGram,
            energiKkal: Number((match.energiKkal * ratio).toFixed(1)),
            proteinGram: Number((match.proteinGram * ratio).toFixed(1)),
            lemakGram: Number((match.lemakGram * ratio).toFixed(1)),
            karbohidratGram: Number((match.karbohidratGram * ratio).toFixed(1)),
            seratGram: Number((match.seratGram * ratio).toFixed(1))
          };
        }

        const baseKkal = c.kategori.includes('Pokok') ? 175 : c.kategori.includes('Hewani') ? 200 : c.kategori.includes('Nabati') ? 120 : c.kategori.includes('Sayur') ? 45 : c.kategori.includes('Buah') ? 90 : 130;
        const baseProt = c.kategori.includes('Hewani') ? 18 : c.kategori.includes('Nabati') ? 8 : 2.5;
        const baseLemak = c.kategori.includes('Hewani') ? 12 : 3;
        const baseKarbo = c.kategori.includes('Pokok') ? 40 : 15;
        const baseSerat = c.kategori.includes('Sayur') ? 2.5 : 1;

        return {
          kategori: c.kategori,
          namaMenu: c.name,
          porsiGram: defaultGram,
          energiKkal: Number((baseKkal * scale).toFixed(1)),
          proteinGram: Number((baseProt * scale).toFixed(1)),
          lemakGram: Number((baseLemak * scale).toFixed(1)),
          karbohidratGram: Number((baseKarbo * scale).toFixed(1)),
          seratGram: Number((baseSerat * scale).toFixed(1))
        };
      });
    };

    // --- PORSI BESAR PROFILE (SMP, SMA, Bumil, Busui, Guru & Staf) ---
    const scaleBesar: Record<string, number> = {
      'Makanan Pokok': 1.5,
      'Lauk Hewani': 1.25,
      'Lauk Nabati': 1.2,
      'Sayuran': 1.2,
      'Buah': 1.0,
      'Ekstra / Minuman': 1.0
    };
    const gramasiBesar: Record<string, number> = {
      'Makanan Pokok': 150,
      'Lauk Hewani': 100,
      'Lauk Nabati': 60,
      'Sayuran': 120,
      'Buah': 100,
      'Ekstra / Minuman': 200
    };
    const itemsBesar = calculateNutritionForScale(scaleBesar, gramasiBesar);
    const totalEnergiBesar = Number(itemsBesar.reduce((s, i) => s + i.energiKkal, 0).toFixed(1));
    const totalProteinBesar = Number(itemsBesar.reduce((s, i) => s + i.proteinGram, 0).toFixed(1));
    const totalLemakBesar = Number(itemsBesar.reduce((s, i) => s + i.lemakGram, 0).toFixed(1));
    const totalKarboBesar = Number(itemsBesar.reduce((s, i) => s + i.karbohidratGram, 0).toFixed(1));
    const totalSeratBesar = Number(itemsBesar.reduce((s, i) => s + i.seratGram, 0).toFixed(1));

    const standarAKGBesar = {
      energiMin: 700,
      energiMax: 850,
      proteinMin: 22,
      proteinMax: 30,
      lemakMin: 20,
      lemakMax: 28,
      karboMin: 95,
      karboMax: 120
    };
    let statusBesar: PlogGiziCalculation['statusEvaluasi'] = 'Sesuai Standar AKG';
    let rekomendasiBesar = 'Kandungan gizi Porsi Besar telah memenuhi standar AKG Makan Siang Remaja & Dewasa BGN (SMP, SMA, Guru & Bumil).';
    if (totalEnergiBesar < standarAKGBesar.energiMin) statusBesar = 'Kurang Energi';
    else if (totalProteinBesar < standarAKGBesar.proteinMin) statusBesar = 'Kurang Protein';

    // --- PORSI KECIL PROFILE (SD/MI, PAUD, Balita) ---
    const scaleKecil: Record<string, number> = {
      'Makanan Pokok': 1.0,
      'Lauk Hewani': 0.75,
      'Lauk Nabati': 0.7,
      'Sayuran': 0.75,
      'Buah': 0.8,
      'Ekstra / Minuman': 0.8
    };
    const gramasiKecil: Record<string, number> = {
      'Makanan Pokok': 100,
      'Lauk Hewani': 60,
      'Lauk Nabati': 35,
      'Sayuran': 75,
      'Buah': 80,
      'Ekstra / Minuman': 125
    };
    const itemsKecil = calculateNutritionForScale(scaleKecil, gramasiKecil);
    const totalEnergiKecil = Number(itemsKecil.reduce((s, i) => s + i.energiKkal, 0).toFixed(1));
    const totalProteinKecil = Number(itemsKecil.reduce((s, i) => s + i.proteinGram, 0).toFixed(1));
    const totalLemakKecil = Number(itemsKecil.reduce((s, i) => s + i.lemakGram, 0).toFixed(1));
    const totalKarboKecil = Number(itemsKecil.reduce((s, i) => s + i.karbohidratGram, 0).toFixed(1));
    const totalSeratKecil = Number(itemsKecil.reduce((s, i) => s + i.seratGram, 0).toFixed(1));

    const standarAKGKecil = {
      energiMin: 500,
      energiMax: 650,
      proteinMin: 15,
      proteinMax: 22,
      lemakMin: 14,
      lemakMax: 20,
      karboMin: 70,
      karboMax: 90
    };
    let statusKecil: PlogGiziCalculation['statusEvaluasi'] = 'Sesuai Standar AKG';
    let rekomendasiKecil = 'Kandungan gizi Porsi Kecil telah memenuhi standar AKG Makan Siang Anak SD/MI & Balita Nutrisi BGN.';
    if (totalEnergiKecil < standarAKGKecil.energiMin) statusKecil = 'Kurang Energi';
    else if (totalProteinKecil < standarAKGKecil.proteinMin) statusKecil = 'Kurang Protein';

    const result: PlogGiziCalculation = {
      tanggal,
      namaMenuHarian: dailyMenu.namaMenuHarian,
      jumlahPenerimaManfaat: benStats.totalPenerima,
      porsiBesar: benStats.porsiBesar,
      porsiKecil: benStats.porsiKecil,
      totalJumlahPorsi: benStats.totalJumlahPorsi,
      porsiBesarDetail: {
        label: 'Porsi Besar',
        sasaran: 'SMP, SMA, Bumil, Busui, Guru & Staf',
        jumlahPorsi: benStats.porsiBesar,
        items: itemsBesar,
        totalEnergiKkal: totalEnergiBesar,
        totalProteinGram: totalProteinBesar,
        totalLemakGram: totalLemakBesar,
        totalKarbohidratGram: totalKarboBesar,
        totalSeratGram: totalSeratBesar,
        standarAKG: standarAKGBesar,
        statusEvaluasi: statusBesar,
        rekomendasi: rekomendasiBesar
      },
      porsiKecilDetail: {
        label: 'Porsi Kecil',
        sasaran: 'SD, MI, PAUD & Balita Nutrisi',
        jumlahPorsi: benStats.porsiKecil,
        items: itemsKecil,
        totalEnergiKkal: totalEnergiKecil,
        totalProteinGram: totalProteinKecil,
        totalLemakGram: totalLemakKecil,
        totalKarbohidratGram: totalKarboKecil,
        totalSeratGram: totalSeratKecil,
        standarAKG: standarAKGKecil,
        statusEvaluasi: statusKecil,
        rekomendasi: rekomendasiKecil
      },
      // Summary / Default (Porsi Besar as standard presentation)
      items: itemsBesar,
      totalEnergiKkal: totalEnergiBesar,
      totalProteinGram: totalProteinBesar,
      totalLemakGram: totalLemakBesar,
      totalKarbohidratGram: totalKarboBesar,
      totalSeratGram: totalSeratBesar,
      standarAKG: standarAKGBesar,
      statusEvaluasi: statusBesar,
      rekomendasi: rekomendasiBesar
    };

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menghitung kandungan gizi menu harian' });
  }
});

// =========================================================
// 5. SUB MENU 3: INFORMASI FOOD COST MENU (AUTO FROM PO)
// =========================================================

// GET /api/v1/plog/food-cost-calculation/:tanggal
router.get('/food-cost-calculation/:tanggal', (req: Request, res: Response): void => {
  try {
    const { tanggal } = req.params;

    // 1. Get live daily beneficiary portions directly from Penerima Manfaat
    const benStats = getBeneficiaryStats(tanggal);
    let dailyMenu = dbStore.plogDailyMenus.find(m => m.tanggal === tanggal);
    const namaMenuHarian = dailyMenu?.namaMenuHarian || 'Menu Makan Bergizi Gratis Harian';

    const jumlahPenerimaManfaat = benStats.totalPenerima;
    const porsiBesar = dailyMenu?.porsiBesar || benStats.porsiBesar;
    const porsiKecil = dailyMenu?.porsiKecil || benStats.porsiKecil;
    const totalJumlahPorsi = porsiBesar + porsiKecil || benStats.totalJumlahPorsi;

    // 2. Match Purchase Order for this date
    let matchedPO = dbStore.purchaseOrders.find(p =>
      p.date === tanggal ||
      p.orderDate === tanggal ||
      (p.periodeDates && p.periodeDates.includes(tanggal))
    );

    if (!matchedPO && dbStore.purchaseOrders.length > 0) {
      matchedPO = dbStore.purchaseOrders[0];
    }

    // Weight factor BGN: Porsi Besar (~1.15) vs Porsi Kecil (~0.80)
    const bobotBesar = 1.15;
    const bobotKecil = 0.80;
    const totalWeight = ((porsiBesar || 1) * bobotBesar) + ((porsiKecil || 1) * bobotKecil);
    const ratioBesar = ((porsiBesar || 1) * bobotBesar) / totalWeight;
    const ratioKecil = ((porsiKecil || 1) * bobotKecil) / totalWeight;

    // Raw items calculation
    let rawItems: Array<{ namaBahan: string; kategori: string; kebutuhanKg: number; hargaSatuan: number; totalBiaya: number }> = [];

    if (matchedPO && matchedPO.items && matchedPO.items.length > 0) {
      const is5DayBatch = matchedPO.periodeDates && matchedPO.periodeDates.length > 1;
      const divisor = is5DayBatch ? matchedPO.periodeDates.length : 1;

      rawItems = matchedPO.items.map(item => {
        const qty = item.qty || (item as any).quantity || 0;
        const price = item.unitPrice || (item as any).pricePerUnit || 0;
        const itemTotal = (item.totalPrice || (qty * price)) / divisor;
        return {
          namaBahan: item.details || (item as any).itemName || 'Bahan Pangan',
          kategori: item.category || 'Bahan Baku',
          kebutuhanKg: Number((qty / divisor).toFixed(1)),
          hargaSatuan: price,
          totalBiaya: Math.round(itemTotal)
        };
      });
    } else {
      const sampleItems = [
        { namaBahan: 'Beras Medium Premium SPPG', kategori: 'Bahan Pokok', kebutuhanKg: Math.round(totalJumlahPorsi * 0.10), hargaSatuan: 14500 },
        { namaBahan: 'Daging Ayam Broiler Segar', kategori: 'Lauk Hewani', kebutuhanKg: Math.round(totalJumlahPorsi * 0.08), hargaSatuan: 38000 },
        { namaBahan: 'Tempe & Tahu Kedelai Lokal', kategori: 'Lauk Nabati', kebutuhanKg: Math.round(totalJumlahPorsi * 0.05), hargaSatuan: 16000 },
        { namaBahan: 'Sayur Sop Campur (Wortel, Buncis, Kol)', kategori: 'Sayuran', kebutuhanKg: Math.round(totalJumlahPorsi * 0.07), hargaSatuan: 14000 },
        { namaBahan: 'Pisang Ambon Super Probolinggo', kategori: 'Buah', kebutuhanKg: Math.round(totalJumlahPorsi * 0.10), hargaSatuan: 18000 },
        { namaBahan: 'Bumbu Dapur Lengkap & Minyak Goreng', kategori: 'Bumbu & Pelengkap', kebutuhanKg: Math.round(totalJumlahPorsi * 0.02), hargaSatuan: 25000 },
      ];

      rawItems = sampleItems.map(item => ({
        namaBahan: item.namaBahan,
        kategori: item.kategori,
        kebutuhanKg: item.kebutuhanKg,
        hargaSatuan: item.hargaSatuan,
        totalBiaya: item.kebutuhanKg * item.hargaSatuan
      }));
    }

    const totalBelanjaPO = rawItems.reduce((s, i) => s + i.totalBiaya, 0);

    // Build rincian bahan divided into Porsi Besar and Porsi Kecil
    const rincianBahanPO: PlogFoodCostItem[] = rawItems.map(item => {
      const kebutuhanKgBesar = Number((item.kebutuhanKg * ratioBesar).toFixed(1));
      const kebutuhanKgKecil = Number((item.kebutuhanKg - kebutuhanKgBesar).toFixed(1));

      const biayaBesar = Math.round(item.totalBiaya * ratioBesar);
      const biayaKecil = item.totalBiaya - biayaBesar;

      const biayaPerPorsiBesar = Math.round(biayaBesar / (porsiBesar || 1));
      const biayaPerPorsiKecil = Math.round(biayaKecil / (porsiKecil || 1));
      const biayaPerPorsi = Math.round(item.totalBiaya / (totalJumlahPorsi || 1));

      return {
        namaBahan: item.namaBahan,
        kategori: item.kategori,
        hargaSatuan: item.hargaSatuan,
        kebutuhanKg: item.kebutuhanKg,
        totalBiaya: item.totalBiaya,
        biayaPerPorsi,
        kebutuhanKgBesar,
        biayaBesar,
        biayaPerPorsiBesar,
        kebutuhanKgKecil,
        biayaKecil,
        biayaPerPorsiKecil
      };
    });

    // Porsi Besar Profile
    const totalAlokasiBiayaBesar = rincianBahanPO.reduce((s, i) => s + i.biayaBesar, 0);
    const foodCostPerPorsiBesar = Math.round(totalAlokasiBiayaBesar / (porsiBesar || 1));
    const plafonAnggaranBesar = 11000; // Plafon pagu BGN porsi besar
    const persentaseFoodCostBesar = Number(((foodCostPerPorsiBesar / plafonAnggaranBesar) * 100).toFixed(1));
    const selisihEfisiensiBesar = (plafonAnggaranBesar * porsiBesar) - totalAlokasiBiayaBesar;
    const statusBiayaBesar = foodCostPerPorsiBesar > plafonAnggaranBesar ? 'Melebihi Pagu' : 'Efisien / Surplus';

    // Porsi Kecil Profile
    const totalAlokasiBiayaKecil = rincianBahanPO.reduce((s, i) => s + i.biayaKecil, 0);
    const foodCostPerPorsiKecil = Math.round(totalAlokasiBiayaKecil / (porsiKecil || 1));
    const plafonAnggaranKecil = 8000; // Plafon pagu BGN porsi kecil
    const persentaseFoodCostKecil = Number(((foodCostPerPorsiKecil / plafonAnggaranKecil) * 100).toFixed(1));
    const selisihEfisiensiKecil = (plafonAnggaranKecil * porsiKecil) - totalAlokasiBiayaKecil;
    const statusBiayaKecil = foodCostPerPorsiKecil > plafonAnggaranKecil ? 'Melebihi Pagu' : 'Efisien / Surplus';

    // Overall Average / Combined Metrics
    const plafonAnggaranPerPorsi = 10000;
    const foodCostPerPorsi = Math.round(totalBelanjaPO / (totalJumlahPorsi || 1));
    const persentaseFoodCost = Number(((foodCostPerPorsi / plafonAnggaranPerPorsi) * 100).toFixed(1));
    const selisihEfisiensi = (plafonAnggaranPerPorsi * totalJumlahPorsi) - totalBelanjaPO;
    let statusBiaya: PlogFoodCostCalculation['statusBiaya'] = 'Efisien / Surplus';
    if (foodCostPerPorsi > plafonAnggaranPerPorsi) statusBiaya = 'Melebihi Pagu';

    const result: PlogFoodCostCalculation = {
      tanggal,
      namaMenuHarian,
      jumlahPenerimaManfaat,
      porsiBesar,
      porsiKecil,
      totalJumlahPorsi,
      jumlahPorsiHarian: totalJumlahPorsi,
      poNumber: matchedPO?.poNumber || `PO-HARIAN-${tanggal.replace(/-/g, '')}`,
      totalBelanjaPO,
      foodCostPerPorsi,
      plafonAnggaranPerPorsi,
      persentaseFoodCost,
      selisihEfisiensi,
      statusBiaya,
      porsiBesarDetail: {
        label: 'Porsi Besar',
        sasaran: 'SMP, SMA, Bumil, Busui, Guru & Staf',
        jumlahPorsi: porsiBesar,
        totalAlokasiBiaya: totalAlokasiBiayaBesar,
        foodCostPerPorsi: foodCostPerPorsiBesar,
        plafonAnggaranPerPorsi: plafonAnggaranBesar,
        persentaseFoodCost: persentaseFoodCostBesar,
        selisihEfisiensi: selisihEfisiensiBesar,
        statusBiaya: statusBiayaBesar
      },
      porsiKecilDetail: {
        label: 'Porsi Kecil',
        sasaran: 'SD, MI, PAUD & Balita Nutrisi',
        jumlahPorsi: porsiKecil,
        totalAlokasiBiaya: totalAlokasiBiayaKecil,
        foodCostPerPorsi: foodCostPerPorsiKecil,
        plafonAnggaranPerPorsi: plafonAnggaranKecil,
        persentaseFoodCost: persentaseFoodCostKecil,
        selisihEfisiensi: selisihEfisiensiKecil,
        statusBiaya: statusBiayaKecil
      },
      rincianBahanPO
    };

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menghitung food cost menu' });
  }
});

export default router;
