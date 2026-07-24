/**
 * Trading history state management
 * Stores completed trades in localStorage for persistence
 */

export interface TradeHistoryEntry {
  id: string;
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stake: number;
  payout?: number;
  profit: number;
  growthRate: number;
  openedAt: number; // Unix timestamp
  closedAt?: number; // Unix timestamp
  status: 'open' | 'closed' | 'lost';
  currency: string;
}

const STORAGE_KEY = 'trading-history';

export function getTradeHistory(): TradeHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.warn('Failed to load trading history from localStorage');
    return [];
  }
}

export function addTradeToHistory(trade: TradeHistoryEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTradeHistory();
    history.push(trade);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.warn('Failed to save trade to history');
  }
}

export function updateTradeInHistory(tradeId: string, updates: Partial<TradeHistoryEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTradeHistory();
    const index = history.findIndex(t => t.id === tradeId);
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch {
    console.warn('Failed to update trade in history');
  }
}

export function clearTradeHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('Failed to clear trading history');
  }
}

export function deleteTrade(tradeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTradeHistory();
    const filtered = history.filter(t => t.id !== tradeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    console.warn('Failed to delete trade from history');
  }
}
