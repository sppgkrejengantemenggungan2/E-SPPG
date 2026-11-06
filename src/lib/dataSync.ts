import { useEffect, useRef } from 'react';

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

export interface SyncMessage {
  type: SyncEventType | string;
  timestamp: string;
  payload?: any;
}

type SyncListener = (message: SyncMessage) => void;

class RealtimeSyncManager {
  private listeners: Set<SyncListener> = new Set();
  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private reconnectTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.broadcastChannel = new BroadcastChannel('sppg_realtime_sync');
          this.broadcastChannel.onmessage = (event) => {
            if (event.data) {
              this.dispatch(event.data);
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel not supported or error:', e);
      }

      this.connectSSE();

      // Refresh on window focus or page visibility
      window.addEventListener('focus', () => {
        this.dispatch({ type: 'all', timestamp: new Date().toISOString() });
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.dispatch({ type: 'all', timestamp: new Date().toISOString() });
        }
      });
    }
  }

  private connectSSE() {
    if (typeof window === 'undefined') return;
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (_) {}
    }

    try {
      this.eventSource = new EventSource('/api/v1/events');

      this.eventSource.onmessage = (event) => {
        try {
          const data: SyncMessage = JSON.parse(event.data);
          this.dispatch(data);
        } catch (_) {
          // ignore keepalive/ping strings
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Attempt reconnect after 5s
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connectSSE();
          }, 5000);
        }
      };
    } catch (e) {
      console.warn('Could not establish SSE connection:', e);
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(message: SyncMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (e) {
        console.error('Error in sync listener:', e);
      }
    });
  }

  public async notifySync(type: SyncEventType | string, payload?: any) {
    const msg: SyncMessage = {
      type,
      timestamp: new Date().toISOString(),
      payload,
    };

    // 1. Dispatch locally to all listeners in this window
    this.dispatch(msg);

    // 2. Dispatch to other browser tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (_) {}
    }

    // 3. Dispatch to server to push to other clients
    try {
      await fetch('/api/v1/events/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      });
    } catch (_) {}
  }
}

export const syncManager = new RealtimeSyncManager();

/**
 * React hook to listen for real-time synchronization events.
 * Triggers callback whenever an event matches one of the specified eventTypes (or 'all').
 */
export function useDataSync(
  eventTypes: (SyncEventType | string)[],
  onSync: (message: SyncMessage) => void
) {
  const callbackRef = useRef(onSync);
  callbackRef.current = onSync;

  const typesKey = eventTypes.join(',');

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((msg) => {
      if (
        eventTypes.includes('all') ||
        msg.type === 'all' ||
        eventTypes.includes(msg.type)
      ) {
        callbackRef.current(msg);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [typesKey]);
}

/**
 * Trigger real-time sync across all components, tabs, and connected devices
 */
export function triggerDataSync(type: SyncEventType | string, payload?: any) {
  return syncManager.notifySync(type, payload);
}
