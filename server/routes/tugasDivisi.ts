import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store';
import { DivisiTaskRecord, WhatsAppDivisiSetting, TaskTemplate } from '../../src/types';
import { syncSaveDoc, syncSaveBatch, syncDeleteDoc } from '../db/firestore';
import { broadcastDataSync } from '../events';

const router = Router();

// GET tasks for a specific date
router.get('/by-date', (req: Request, res: Response): void => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dateQuery = (req.query.tanggal as string) || todayStr;

  const records = dbStore.getTugasDivisiForDate(dateQuery);
  res.json({
    success: true,
    tanggal: dateQuery,
    data: records
  });
});

// GET menu harian for a specific date
router.get('/menu-harian', (req: Request, res: Response): void => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dateQuery = (req.query.tanggal as string) || todayStr;

  const records = dbStore.getTugasDivisiForDate(dateQuery);
  const foundMenu = records.find(r => r.menuHarian && r.menuHarian.trim() !== '')?.menuHarian || '';

  res.json({
    success: true,
    tanggal: dateQuery,
    data: {
      tanggal: dateQuery,
      menuHarian: foundMenu
    }
  });
});

// UPDATE division task record for a specific date and division
router.put('/record', (req: Request, res: Response): void => {
  const updatedData = req.body as Partial<DivisiTaskRecord>;

  if (!updatedData.tanggal || !updatedData.divisiId) {
    res.status(400).json({ success: false, message: 'Tanggal dan ID Divisi wajib diisi.' });
    return;
  }

  let idx = -1;
  if (updatedData.id) {
    idx = dbStore.tugasDivisiRecords.findIndex(r => r.id === updatedData.id);
  }

  if (idx === -1) {
    idx = dbStore.tugasDivisiRecords.findIndex(
      r => r.tanggal === updatedData.tanggal && r.divisiId === updatedData.divisiId
    );
  }

  if (idx !== -1) {
    dbStore.tugasDivisiRecords[idx] = {
      ...dbStore.tugasDivisiRecords[idx],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
  } else {
    const newRecord: DivisiTaskRecord = {
      id: updatedData.id || `TASK-${updatedData.tanggal}-${updatedData.divisiId}-${Date.now()}`,
      tanggal: updatedData.tanggal,
      divisiId: updatedData.divisiId,
      divisiNama: updatedData.divisiNama || updatedData.divisiId,
      penanggungJawab: updatedData.penanggungJawab || 'Petugas SPPG',
      shift: updatedData.shift || 'Shift 1 (Pagi)',
      statusProduksi: updatedData.statusProduksi || 'Dalam Persiapan',
      jumlahProduksi: updatedData.jumlahProduksi || 2500,
      keterangan: updatedData.keterangan || '',
      menuHarian: updatedData.menuHarian || '',
      checklists: updatedData.checklists || [],
      updatedAt: new Date().toISOString(),
      createdBy: updatedData.createdBy || 'Petugas SPPG'
    };
    dbStore.tugasDivisiRecords.push(newRecord);
    idx = dbStore.tugasDivisiRecords.length - 1;
  }

  const savedRecord = dbStore.tugasDivisiRecords[idx];
  syncSaveDoc('tugasDivisi', savedRecord.id, savedRecord);

  dbStore.addLog(
    'USER',
    updatedData.createdBy || 'Petugas SPPG',
    'Tugas Divisi',
    'Update Tugas Divisi',
    `Memperbarui tugas untuk ${savedRecord.divisiNama} tanggal ${savedRecord.tanggal}`,
    req.ip
  );

  res.json({
    success: true,
    message: `Data tugas ${savedRecord.divisiNama} berhasil disimpan.`,
    data: savedRecord
  });
});

// UPDATE menu harian for a specific date
router.put('/menu-harian', async (req: Request, res: Response): Promise<void> => {
  const { tanggal, menuHarian } = req.body;

  if (!tanggal) {
    res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
    return;
  }

  const result = await dbStore.updateDailyMenuAcrossAll(tanggal, menuHarian);

  dbStore.addLog(
    'USER',
    'Petugas SPPG',
    'Tugas Divisi',
    'Update Menu Harian',
    `Memperbarui menu harian tanggal ${tanggal}: ${menuHarian}`,
    req.ip
  );

  res.json({
    success: true,
    message: `Menu harian untuk tanggal ${tanggal} berhasil diperbarui & disinkronisasi ke seluruh modul.`,
    menuHarian: result.menuHarian,
    data: dbStore.getTugasDivisiForDate(tanggal)
  });
});

// DELETE / CLEAR menu harian for a specific date
router.delete('/menu-harian', async (req: Request, res: Response): Promise<void> => {
  const { tanggal } = req.query as { tanggal?: string };

  if (!tanggal) {
    res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
    return;
  }

  await dbStore.updateDailyMenuAcrossAll(tanggal, '');

  dbStore.addLog(
    'USER',
    'Petugas SPPG',
    'Tugas Divisi',
    'Hapus Menu Harian',
    `Menghapus/mengosongkan menu harian untuk tanggal ${tanggal}`,
    req.ip
  );

  res.json({
    success: true,
    message: `Menu harian tanggal ${tanggal} berhasil dihapus dari seluruh modul.`
  });
});

// GET menu harian range for planning (e.g. 7 days or custom range)
router.get('/menu-harian-range', (req: Request, res: Response): void => {
  const { startDate, endDate, days } = req.query as Record<string, string>;
  
  let start = startDate || new Date().toISOString().split('T')[0];
  let numDays = parseInt(days || '7', 10);
  if (isNaN(numDays) || numDays < 1) numDays = 7;

  const resultList: Array<{ tanggal: string; menuHarian: string; isPlanned: boolean }> = [];

  const startDt = new Date(start);

  for (let i = 0; i < numDays; i++) {
    const curDt = new Date(startDt);
    curDt.setDate(startDt.getDate() + i);
    const dateStr = curDt.toISOString().split('T')[0];

    // Find existing menu harian
    const existingRecords = dbStore.tugasDivisiRecords.filter(r => r.tanggal === dateStr);
    const existingMenu = existingRecords.find(r => r.menuHarian && r.menuHarian.trim() !== '')?.menuHarian || '';

    resultList.push({
      tanggal: dateStr,
      menuHarian: existingMenu,
      isPlanned: Boolean(existingMenu && existingMenu.trim() !== '')
    });
  }

  res.json({
    success: true,
    data: resultList
  });
});

// PUT menu harian bulk for weekly menu planning
router.put('/menu-harian-bulk', async (req: Request, res: Response): Promise<void> => {
  const { items } = req.body as { items: Array<{ tanggal: string; menuHarian: string }> };

  if (!Array.isArray(items)) {
    res.status(400).json({ success: false, message: 'Format data items tidak valid.' });
    return;
  }

  for (const item of items) {
    if (!item.tanggal) continue;
    await dbStore.updateDailyMenuAcrossAll(item.tanggal, item.menuHarian || '');
  }

  dbStore.addLog(
    'USER',
    'Petugas SPPG',
    'Tugas Divisi',
    'Bulk Update Menu Harian',
    `Memperbarui perencanaan menu harian untuk ${items.length} tanggal.`,
    req.ip
  );

  res.json({
    success: true,
    message: `Perencanaan menu harian untuk ${items.length} hari berhasil disimpan & disinkronkan ke seluruh sistem!`
  });
});

// DELETE division task record by ID
router.delete('/record/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const idx = dbStore.tugasDivisiRecords.findIndex(r => r.id === id);

  if (idx !== -1) {
    const deleted = dbStore.tugasDivisiRecords.splice(idx, 1)[0];
    syncDeleteDoc('tugasDivisi', id);
    dbStore.addLog(
      'USER',
      'Petugas SPPG',
      'Tugas Divisi',
      'Hapus Tugas Divisi',
      `Menghapus tugas ${deleted.divisiNama} tanggal ${deleted.tanggal}`,
      req.ip
    );

    res.json({
      success: true,
      message: `Tugas ${deleted.divisiNama} tanggal ${deleted.tanggal} berhasil dihapus.`
    });
  } else {
    res.status(404).json({ success: false, message: 'Record tugas divisi tidak ditemukan.' });
  }
});

// GET task history with filters
router.get('/history', (req: Request, res: Response): void => {
  const { tanggal, bulan, tahun, divisi, status, search } = req.query as Record<string, string>;

  let results = [...dbStore.tugasDivisiRecords];

  if (tanggal) {
    results = results.filter(r => r.tanggal === tanggal);
  }

  if (bulan) {
    const padBulan = String(bulan).padStart(2, '0');
    results = results.filter(r => r.tanggal.split('-')[1] === padBulan);
  }

  if (tahun) {
    results = results.filter(r => r.tanggal.split('-')[0] === tahun);
  }

  if (divisi && divisi !== 'semua') {
    results = results.filter(r => r.divisiId === divisi);
  }

  if (status && status !== 'semua') {
    results = results.filter(r => r.statusProduksi === status);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(r =>
      r.divisiNama.toLowerCase().includes(q) ||
      r.penanggungJawab.toLowerCase().includes(q) ||
      r.keterangan.toLowerCase().includes(q)
    );
  }

  // Sort by date descending
  results.sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// GET & PUT WhatsApp division numbers
router.get('/wa-settings', (req: Request, res: Response): void => {
  res.json({ success: true, data: dbStore.waDivisiSettings });
});

router.put('/wa-settings', (req: Request, res: Response): void => {
  const newSettings = req.body as WhatsAppDivisiSetting[];

  if (Array.isArray(newSettings)) {
    dbStore.waDivisiSettings = newSettings;
    dbStore.addLog('ADMIN', 'Administrator', 'Pengaturan WhatsApp', 'Update WA Divisi', 'Memperbarui kontak WhatsApp divisi', req.ip);
    res.json({ success: true, message: 'Nomor WhatsApp Divisi berhasil diperbarui.', data: dbStore.waDivisiSettings });
  } else {
    res.status(400).json({ success: false, message: 'Data setting harus berupa array.' });
  }
});

// GET & PUT Task Templates
router.get('/templates', (req: Request, res: Response): void => {
  res.json({ success: true, data: dbStore.taskTemplates });
});

router.put('/templates', (req: Request, res: Response): void => {
  const newTemplate = req.body as TaskTemplate;

  const idx = dbStore.taskTemplates.findIndex(t => t.id === newTemplate.id);
  if (idx !== -1) {
    dbStore.taskTemplates[idx] = newTemplate;
  } else {
    newTemplate.id = newTemplate.id || `TPL-${Date.now()}`;
    dbStore.taskTemplates.push(newTemplate);
  }

  dbStore.addLog('ADMIN', 'Administrator', 'Template Tugas', 'Simpan Template', `Menyimpan template tugas untuk ${newTemplate.divisiNama}`, req.ip);
  res.json({ success: true, message: 'Template tugas berhasil disimpan.', data: dbStore.taskTemplates });
});

router.delete('/templates/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const idx = dbStore.taskTemplates.findIndex(t => t.id === id);

  if (idx !== -1) {
    const deleted = dbStore.taskTemplates.splice(idx, 1)[0];
    dbStore.addLog('ADMIN', 'Administrator', 'Template Tugas', 'Hapus Template', `Menghapus template ${deleted.judulTemplate}`, req.ip);
    res.json({ success: true, message: 'Template tugas berhasil dihapus.' });
  } else {
    res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
  }
});

// ========================================================
// SUB-MENU INPUT, DOKUMENTASI, SUHU & WASTE API ENDPOINTS
// ========================================================

// GET sub-items with optional filters
router.get('/sub-items', (req: Request, res: Response): void => {
  const { tanggal, divisiId, subMenuId } = req.query as {
    tanggal?: string;
    divisiId?: string;
    subMenuId?: string;
  };

  const items = dbStore.getDivisiSubItems({ tanggal, divisiId, subMenuId });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// POST save / update sub-item
router.post('/sub-items', (req: Request, res: Response): void => {
  try {
    const payload = req.body;
    if (!payload.tanggal || !payload.divisiId || !payload.subMenuId) {
      res.status(400).json({
        success: false,
        message: 'Field tanggal, divisiId, dan subMenuId wajib disertakan.'
      });
      return;
    }

    const saved = dbStore.saveDivisiSubItem(payload);
    // Background sync to Firestore
    syncSaveDoc('divisiSubItems', saved.id, saved);

    broadcastDataSync({
      type: 'tugas',
      action: 'update',
      date: saved.tanggal,
      id: saved.id,
      payload: saved
    });

    dbStore.addLog(
      'USER',
      saved.petugas || 'Petugas SPPG',
      `Tugas Divisi (${saved.divisiId})`,
      `Input Data: ${saved.subMenuJudul || saved.subMenuId}`,
      `Pencatatan data sub-menu ${saved.subMenuJudul} tanggal ${saved.tanggal}`,
      req.ip
    );

    res.json({
      success: true,
      message: `Data ${saved.subMenuJudul || 'sub-menu'} berhasil disimpan dan disinkronisasi ke cloud!`,
      data: saved
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || 'Gagal menyimpan data sub-menu.'
    });
  }
});

// DELETE sub-item by id
router.delete('/sub-items/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const deleted = dbStore.deleteDivisiSubItem(id);
  if (deleted) {
    syncDeleteDoc('divisiSubItems', id);
    broadcastDataSync({
      type: 'tugas',
      action: 'delete',
      id
    });
    res.json({
      success: true,
      message: 'Data sub-menu berhasil dihapus.'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Data sub-menu tidak ditemukan.'
    });
  }
});

// POST trigger instant cloud sync for sub-items
router.post('/sub-items/sync', (req: Request, res: Response): void => {
  const { tanggal, divisiId } = req.body as { tanggal?: string; divisiId?: string };
  const items = dbStore.getDivisiSubItems({ tanggal, divisiId });
  
  items.forEach(item => {
    item.isSynced = true;
    item.syncedAt = new Date().toISOString();
    syncSaveDoc('divisiSubItems', item.id, item);
  });

  res.json({
    success: true,
    message: `Berhasil menyinkronkan ${items.length} data ke Cloud Database!`,
    syncedCount: items.length,
    data: items
  });
});

export default router;
