'use client';

import { BankClerkCard, BankClerkHeading } from './bank-clerk-card';
import type { AccumulatorProposalInfo } from '../../hooks/use-accumulator-proposal';
import type { GrowthRate } from '../../lib/types';

interface ProfileCardProps {
  growthRate: GrowthRate;
  growthRateOptions: { value: number; label: string }[];
  proposal: AccumulatorProposalInfo | null;
}

export function ProfileCard({ growthRate, growthRateOptions, proposal }: ProfileCardProps) {
  const growthLabel =
    growthRateOptions.find((o) => o.value === growthRate)?.label ??
    `${(growthRate * 100).toFixed(0)}%`;
  const maxTicks = proposal?.maxTicks && proposal.maxTicks > 0 ? proposal.maxTicks : 90;
  const projectedMax = proposal?.maxPayout
    ? `${proposal.maxPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    : '—';

  const rows = [
    { label: 'Growth Rate', value: growthLabel, accent: true },
    { label: 'Max Duration', value: `${maxTicks} ticks` },
    { label: 'Projected Max', value: projectedMax },
    { label: 'All Windows', value: '1%: 250 · 2%: 135 · 3%: 90 · 4%: 90 · 5%: 55', small: true },
  ];

  return (
    <BankClerkCard>
      <BankClerkHeading>Bank Clerk Profile</BankClerkHeading>

      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="bc-inset px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">{r.label}</p>
            <p
              className={
                r.accent
                  ? 'text-xl font-bold text-orange-400'
                  : r.small
                    ? 'mt-1 text-sm text-slate-300'
                    : 'text-lg font-semibold text-slate-100'
              }
            >
              {r.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400 text-pretty">
        Your stake grows by <span className="font-semibold text-orange-400">{growthLabel}</span> per tick
        while price remains inside range. The selected Take Ticks value controls when Bank Clerk attempts
        to exit and lock value before a barrier hit. Max analysis window at {growthLabel} growth:{' '}
        <span className="font-semibold text-orange-400">{maxTicks} ticks</span>. Scanner blocks show how
        many ticks each run lasted before knockout or max completion. Use the Take Ticks summary to judge
        safer manual entries and Auto Trade waits.
      </p>
    </BankClerkCard>
  );
}
