'use client';

import { useMemo } from 'react';
import { BankClerkCard } from './bank-clerk-card';

interface PriceChartCardProps {
  symbolName: string;
  prices: number[];
  pipSize: number;
}

/**
 * Lightweight live price chart (area line) rendered from the real Deriv tick
 * stream. Matches the minimal chart look in the design while staying connected
 * to live market data.
 */
export function PriceChartCard({ symbolName, prices, pipSize }: PriceChartCardProps) {
  const view = useMemo(() => {
    const points = prices.slice(-60).filter((p) => Number.isFinite(p));
    const last = points[points.length - 1];
    const first = points[0];
    const decimals = pipSize || 2;

    const changePct =
      points.length >= 2 && first ? ((last - first) / first) * 100 : 0;
    const isUp = changePct >= 0;

    // Build the SVG path within a 0..100 x 0..100 viewbox.
    let linePath = '';
    let areaPath = '';
    if (points.length >= 2) {
      const min = Math.min(...points);
      const max = Math.max(...points);
      const range = max - min || 1;
      const stepX = 100 / (points.length - 1);
      const coords = points.map((p, i) => {
        const x = i * stepX;
        const y = 100 - ((p - min) / range) * 90 - 5; // padding top/bottom
        return [x, y] as const;
      });
      linePath = coords
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
        .join(' ');
      areaPath = `${linePath} L100,100 L0,100 Z`;
    }

    return {
      last: Number.isFinite(last) ? last.toFixed(decimals) : '—',
      changePct: `${isUp ? '' : '-'}${Math.abs(changePct).toFixed(2)}%`,
      isUp,
      linePath,
      areaPath,
      hasData: points.length >= 2,
    };
  }, [prices, pipSize]);

  const stroke = view.isUp ? '#22c55e' : '#f5493d';
  const gradientId = view.isUp ? 'bcAreaUp' : 'bcAreaDown';

  return (
    <BankClerkCard>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-100 text-balance">{symbolName}</h2>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: stroke }}>
            {view.last}
          </p>
          <p className="text-sm font-medium tabular-nums" style={{ color: stroke }}>
            {view.changePct}
          </p>
        </div>
      </div>

      <div className="mt-4 h-44 w-full bc-inset overflow-hidden">
        {view.hasData ? (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-label={`${symbolName} price chart`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={view.areaPath} fill={`url(#${gradientId})`} />
            <path
              d={view.linePath}
              fill="none"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Waiting for live prices…
          </div>
        )}
      </div>
    </BankClerkCard>
  );
}
