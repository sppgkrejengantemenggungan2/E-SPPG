import { Request, Response } from 'express';

export type SyncEventType =
  | 'menu'
  | 'beneficiary'
  | 'plog'
  | 'stock'
  | 'barangDatang'
  | 'tugas'
  | 'po'
  | 'distribusi'
  | 'bbm'
  | 'settings'
  | 'all';

export interface DataSyncEvent {
  type: SyncEventType;
  action?: 'create' | 'update' | 'delete' | 'sync';
  date?: string;
  id?: string;
  payload?: any;
  timestamp: string;
}

const clients = new Set<Response>();

/**
 * Server-Sent Events (SSE) handler for real-time synchronization across all tabs and devices
 */
export function sseHandler(req: Request, res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Flush initial connection packet
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  clients.add(res);

  // Keep-alive heartbeat every 20 seconds
  const keepAlive = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (_) {
      clearInterval(keepAlive);
      clients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
}

/**
 * Broadcasts a real-time synchronization event to all connected clients
 */
export function broadcastDataSync(event: Omit<DataSyncEvent, 'timestamp'>): void {
  const fullEvent: DataSyncEvent = {
    ...event,
    timestamp: new Date().toISOString()
  };

  const payload = `data: ${JSON.stringify(fullEvent)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch (_) {
      clients.delete(client);
    }
  }
}
