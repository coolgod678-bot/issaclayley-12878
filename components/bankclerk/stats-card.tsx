'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { BankClerkCard, BankClerkHeading } from './bank-clerk-card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  /** Live tick count for the active symbol (drives the "N ticks" label). */
  tickCount: number;
}

const WINDOWS: Record<string, number> = { '1%': 250, '2%': 135, '3%': 90, '4%': 90, '5%': 55 };
const RATE_FILTERS = ['All Rates', '1%', '2%', '3%', '4%', '5%'];

// Placeholder analytics — the live knockout scanner will be wired up later.
const KNOCKOUT_CHIPS = [
  { rate: '1%', value: '16/250' },
  { rate: '2%', value: '1/135' },
  { rate: '3%', value: '1/90' },
  { rate: '4%', value: '1/90' },
  { rate: '5%', value: '1/55' },
];

const STAT_BOXES = [
  { label: 'Knockouts', value: '1' },
  { label: 'Completed', value: '0' },
  { label: 'Longest', value: '15' },
  { label: 'Average', value: '15.0' },
  { label: 'Shortest', value: '15' },
];

const LEGEND = [
  { label: '1–3', color: '#7f1d1d' },
  { label: '4–10', color: '#dc2626' },
  { label: '11–25', color: '#d97706' },
  { label: '26–50', color: '#0d9488' },
  { label: '51+', color: '#16a34a' },
  { label: 'Completed', color: '#06b6d4' },
  { label: 'Live', color: '#6366f1' },
];

export function StatsCard({ tickCount }: StatsCardProps) {
  const [rate, setRate] = useState('3%');
  const maxTicks = WINDOWS[rate === 'All Rates' ? '3%' : rate];

  return (
    <BankClerkCard>
      <BankClerkHeading
        right={
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LIVE
            </span>
            <span className="text-slate-400">{tickCount} ticks</span>
          </div>
        }
      >
        Stats
      </BankClerkHeading>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-orange-500">
            Knockout History <span className="font-normal text-slate-400">· 1 knockout · 1 run tracked</span>
          </p>
          <button
            type="button"
            aria-label="Refresh knockout history"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/40 text-orange-400 transition-colors hover:bg-orange-500/10"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Knockout chips */}
        <div className="flex flex-wrap gap-2">
          {KNOCKOUT_CHIPS.map((c) => (
            <span
              key={c.rate}
              className="rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-1.5 text-sm"
            >
              <span className="font-bold text-orange-400">{c.rate}</span>{' '}
              <span className="text-slate-300">{c.value}</span>
            </span>
          ))}
        </div>

        {/* Rate filters */}
        <div className="flex flex-wrap gap-2">
          {RATE_FILTERS.map((r) => {
            const active = r === rate;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  active ? 'bc-inset-orange text-orange-400' : 'bc-inset text-slate-300'
                )}
              >
                {r}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-slate-300">
          Max ticks: <span className="font-bold text-orange-400">{maxTicks}</span>
        </p>

        <div className="bc-inset p-4 text-sm leading-relaxed text-slate-300">
          Current run: 1/{maxTicks} ticks | All scanned blocks: Take Ticks 5 would survive 1/1 runs | 0
          knocked at/before target
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-3 gap-3">
          {STAT_BOXES.map((s) => (
            <div key={s.label} className="bc-inset flex flex-col items-center gap-1 p-4">
              <span className="text-xs uppercase tracking-wide text-slate-400">{s.label}</span>
              <span className="text-2xl font-bold text-orange-400">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Scanner blocks */}
        <div className="flex gap-3">
          <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-amber-600 text-lg font-bold text-white">
            15
          </span>
          <span className="flex h-12 w-16 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500/30 text-lg font-bold text-indigo-200">
            1
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-sm text-slate-300">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </BankClerkCard>
  );
}
