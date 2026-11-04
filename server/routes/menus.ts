import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store';
import { MenuItem } from '../../src/types';

const router = Router();

// Get dynamic menus (sorted by order)
router.get('/', (req: Request, res: Response): void => {
  // Ensure required system menus are present
  if (!dbStore.menus.some(m => m.path === '/admin/menus' || m.id === 'MNU-006')) {
    dbStore.menus.push({
      id: 'MNU-006',
      title: 'Menu Dinamis',
      path: '/admin/menus',
      icon: 'Menu',
      color: '#06B6D4',
      order: 7,
      targetModule: 'portal',
      requiredRole: ['Admin Penuh', 'Super Admin'],
      isActive: true
    });
  }

  if (!dbStore.menus.some(m => m.path === '/admin/logs' || m.id === 'MNU-007')) {
    dbStore.menus.push({
      id: 'MNU-007',
      title: 'Log Aktivitas Central',
      path: '/admin/logs',
      icon: 'FileText',
      color: '#64748B',
      order: 8,
      targetModule: 'portal',
      requiredRole: ['Admin Penuh', 'Super Admin', 'Admin', 'Supervisor', 'Manager'],
      isActive: true
    });
  }

  if (!dbStore.menus.some(m => m.path === '/laporan-plog' || m.id === 'MNU-003-PLOG')) {
    dbStore.menus.push({
      id: 'MNU-003-PLOG',
      title: 'Laporan PLOG',
      path: '/laporan-plog',
      icon: 'ClipboardList',
      color: '#8B5CF6',
      order: 4.2,
      targetModule: 'plog',
      requiredRole: ['Admin Penuh', 'Staff Kantor', 'Distribusi', 'Super Admin', 'Admin', 'Operator', 'Supervisor', 'Manager', 'Staff', 'Viewer'],
      isActive: true
    });
  }

  const sortedMenus = [...dbStore.menus].sort((a, b) => a.order - b.order);
  res.json({ success: true, data: sortedMenus });
});

// Create new menu item
router.post('/', (req: Request, res: Response): void => {
  const { title, path, icon, color, order, targetModule, requiredRole } = req.body;

  if (!title || !path || !icon) {
    res.status(400).json({ success: false, message: 'Judul, Path URL, dan Icon wajib diisi.' });
    return;
  }

  const newMenu: MenuItem = {
    id: `MNU-${String(dbStore.menus.length + 1).padStart(3, '0')}`,
    title,
    path,
    icon: icon || 'Circle',
    color: color || '#3B82F6',
    order: order || dbStore.menus.length + 1,
    targetModule: targetModule || 'portal',
    requiredRole,
    isActive: true
  };

  dbStore.menus.push(newMenu);
  dbStore.addLog('ADMIN', 'System Administrator', 'Menu Dinamis', 'Tambah Menu Baru', `Menambahkan menu '${title}' dengan modul target '${targetModule}'`, req.ip);

  res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan', data: newMenu });
});

// Update menu item
router.put('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = dbStore.menus.findIndex(m => m.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    return;
  }

  dbStore.menus[index] = {
    ...dbStore.menus[index],
    ...req.body
  };

  dbStore.addLog('ADMIN', 'System Administrator', 'Menu Dinamis', 'Update Menu', `Memperbarui menu ID ${id} ('${dbStore.menus[index].title}')`, req.ip);

  res.json({ success: true, message: 'Menu berhasil diperbarui', data: dbStore.menus[index] });
});

// Reorder menus batch
router.put('/reorder/batch', (req: Request, res: Response): void => {
  const { items } = req.body as { items: { id: string; order: number }[] };

  if (!Array.isArray(items)) {
    res.status(400).json({ success: false, message: 'Payload items harus berupa array.' });
    return;
  }

  items.forEach(item => {
    const found = dbStore.menus.find(m => m.id === item.id);
    if (found) {
      found.order = item.order;
    }
  });

  dbStore.addLog('ADMIN', 'System Administrator', 'Menu Dinamis', 'Reorder Menus', 'Mengubah urutan tampilan menu dinamis', req.ip);

  res.json({ success: true, message: 'Urutan menu berhasil disimpan', data: dbStore.menus });
});

// Delete menu
router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = dbStore.menus.findIndex(m => m.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    return;
  }

  const deletedMenu = dbStore.menus.splice(index, 1)[0];
  dbStore.addLog('ADMIN', 'System Administrator', 'Menu Dinamis', 'Hapus Menu', `Menghapus menu '${deletedMenu.title}'`, req.ip);

  res.json({ success: true, message: 'Menu berhasil dihapus', data: deletedMenu });
});

export default router;
