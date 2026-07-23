'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { BankClerkCard, BankClerkHeading } from './bank-clerk-card';
import { cn } from '@/lib/utils';

// Placeholder trade history — real Bank Clerk trade logging will be wired later.
const TRADES = [
  {
    symbol: 'Volatility 10 (1s) Index',
    status: 'COMPLETED',
    pnl: '+0.30 USD',
    won: true,
    time: '13:13:32 - 13:13:43',
    takeTicks: 'Take Ticks: Off',
    stake: '1.00 USD',
    payout: '1.30 USD',
    entrySpot: '9411.78',
  },
];

export function TradeHistoryCard() {
  const [tab, setTab] = useState<'all' | 'wins' | 'losses'>('all');

  const tabs = [
    { key: 'all' as const, label: 'All Trades (1)' },
    { key: 'wins' as const, label: 'Wins (1)' },
    { key: 'losses' as const, label: 'Losses (0)' },
  ];

  const visible = tab === 'losses' ? [] : TRADES;

  return (
    <BankClerkCard>
      <BankClerkHeading
        right={
          <button
            type="button"
            aria-label="Clear trade history"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-slate-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        }
      >
        Bank Clerk Trade History
      </BankClerkHeading>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bc-inset p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Net P/L</p>
          <p className="text-2xl font-bold text-emerald-400">+0.30 USD</p>
        </div>
        <div className="bc-inset p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Win Rate</p>
          <p className="text-2xl font-bold text-slate-100">100.0%</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {tabs.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded-lg py-3 text-sm font-semibold transition-colors',
                active ? 'bc-inset-orange text-orange-400' : 'bc-inset text-slate-300'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-3">
        {visible.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No trades to show.</p>
        ) : (
          visible.map((trade, i) => (
            <div
              key={i}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-white/5 px-2 py-1 text-sm font-semibold text-slate-100">
                  {trade.symbol}
                </span>
                <span className="rounded-md border border-emerald-500/40 px-2 py-1 text-xs font-bold text-emerald-400">
                  {trade.status}
                </span>
                <span className="text-lg font-bold text-emerald-400">{trade.pnl}</span>
              </div>

              <span className="mt-2 inline-block rounded-md border border-emerald-500/40 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                Bank Clerk
              </span>

              <dl className="mt-3 space-y-1.5 text-sm">
                {[
                  ['Trade Time', trade.time],
                  ['Take Ticks', trade.takeTicks],
                  ['Stake', trade.stake],
                  ['Payout', trade.payout],
                  ['Entry Spot', trade.entrySpot],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-400">{k}</dt>
                    <dd className="font-medium text-slate-200">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-sm font-semibold text-emerald-400">Completed - Won</p>
            </div>
          ))
        )}
      </div>
    </BankClerkCard>
  );
}
