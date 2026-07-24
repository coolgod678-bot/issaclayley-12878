'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TradeHistoryEntry } from '@/lib/trading-history';
import { getTradeHistory, clearTradeHistory, deleteTrade } from '@/lib/trading-history';

export function TradingHistory() {
  const [trades, setTrades] = useState<TradeHistoryEntry[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setTrades(getTradeHistory());
  }, []);

  const handleClearHistory = () => {
    clearTradeHistory();
    setTrades([]);
    setShowClearDialog(false);
  };

  const handleDeleteTrade = (tradeId: string) => {
    deleteTrade(tradeId);
    setTrades(trades.filter(t => t.id !== tradeId));
    setDeleteConfirm(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedTrades = [...trades].sort((a, b) => (b.closedAt || b.openedAt) - (a.closedAt || a.openedAt));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Trading History</CardTitle>
        {trades.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No trades yet</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {sortedTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-start justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{trade.symbol}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          trade.status === 'closed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : trade.status === 'lost'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {trade.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(trade.openedAt)}
                      {trade.closedAt && ` → ${formatDate(trade.closedAt)}`}
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span>Stake: {trade.stake.toFixed(2)} {trade.currency}</span>
                      <span>Growth: {trade.growthRate}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-semibold text-sm ${trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)} {trade.currency}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(trade.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Clear all dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all trading history?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All {trades.length} trade records will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear History
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete single trade dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete trade record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The trade record will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteTrade(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
