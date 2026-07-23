'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BankClerkCard, BankClerkHeading } from './bank-clerk-card';
import { BcSwitch } from './bc-switch';
import { cn } from '@/lib/utils';
import { getSubmarketDisplayName } from '@/lib/active-symbols-display-names';
import type { ActiveSymbol } from '@deriv/core';
import type { AccumulatorProposalInfo } from '../../hooks/use-accumulator-proposal';
import type { GrowthRate, OpenPosition } from '../../lib/types';

export interface BankClerkToggles {
  takeTicks: boolean;
  reinvest: boolean;
  secureProfit: boolean;
  autoTrade: boolean;
}

interface ConfigurationCardProps {
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  growthRate: GrowthRate;
  setGrowthRate: (rate: GrowthRate) => void;
  growthRateOptions: { value: number; label: string }[];
  stake: string;
  setStake: (value: string) => void;
  proposal: AccumulatorProposalInfo | null;
  toggles: BankClerkToggles;
  setToggle: (key: keyof BankClerkToggles, value: boolean) => void;
  isConnected: boolean;
  onBuy: () => void;
  isBuying: boolean;
  activePosition?: OpenPosition | null;
  onClose?: (contractId: number, bidPrice: string) => void;
  isClosing?: boolean;
}

const SELECT_TRIGGER = 'bc-inset h-12 border-0 text-base text-slate-100 focus:ring-orange-500/40';
const SELECT_CONTENT = 'border-white/10 bg-[#0f1420] text-slate-100';

export function ConfigurationCard({
  symbols,
  activeSymbol,
  selectSymbol,
  growthRate,
  setGrowthRate,
  growthRateOptions,
  stake,
  setStake,
  proposal,
  toggles,
  setToggle,
  isConnected,
  onBuy,
  isBuying,
  activePosition,
  onClose,
  isClosing,
}: ConfigurationCardProps) {
  // Group symbols by submarket so we can drive a Market + Symbol pair of menus.
  const grouped = useMemo(() => {
    const map = new Map<string, { displayName: string; symbols: ActiveSymbol[] }>();
    for (const s of symbols) {
      const existing = map.get(s.submarket);
      if (existing) existing.symbols.push(s);
      else
        map.set(s.submarket, {
          displayName: s.submarket_display_name ?? getSubmarketDisplayName(s.submarket),
          symbols: [s],
        });
    }
    return map;
  }, [symbols]);

  const activeMarket = activeSymbol?.submarket ?? '';
  const marketSymbols = grouped.get(activeMarket)?.symbols ?? [];
  const symbolName = activeSymbol?.underlying_symbol_name ?? 'Select a symbol';

  const growthLabel =
    growthRateOptions.find((o) => o.value === growthRate)?.label ??
    `${(growthRate * 100).toFixed(0)}%`;
  const maxTicks = proposal?.maxTicks && proposal.maxTicks > 0 ? proposal.maxTicks : 90;
  const stakeDisplay = (() => {
    const n = parseFloat(stake);
    return Number.isFinite(n) && n > 0 ? n.toFixed(2) : '0.00';
  })();

  const summary = `${growthLabel} · Take Ticks ${toggles.takeTicks ? 'on' : 'off'} · ${symbolName} · ${toggles.autoTrade ? 'Auto' : 'Manual'}`;

  const toggleRows: { key: keyof BankClerkToggles; label: string }[] = [
    { key: 'takeTicks', label: 'Take Ticks' },
    { key: 'reinvest', label: 'Reinvest' },
    { key: 'secureProfit', label: 'Secure Profit' },
    { key: 'autoTrade', label: 'Auto Trade' },
  ];

  return (
    <BankClerkCard>
      <BankClerkHeading>Bank Clerk Configuration</BankClerkHeading>

      <div className="mt-4 space-y-4">
        {/* Market */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Market</label>
          <Select
            value={activeMarket}
            onValueChange={(submarket) => {
              const first = grouped.get(submarket)?.symbols[0];
              if (first) selectSymbol(first.underlying_symbol);
            }}
          >
            <SelectTrigger className={SELECT_TRIGGER}>
              <SelectValue placeholder="Select a market" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              <SelectGroup>
                {Array.from(grouped.entries()).map(([submarket, { displayName }]) => (
                  <SelectItem key={submarket} value={submarket}>
                    {displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Symbol */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Symbol</label>
          <Select
            value={activeSymbol?.underlying_symbol ?? ''}
            onValueChange={selectSymbol}
          >
            <SelectTrigger className={SELECT_TRIGGER}>
              <SelectValue placeholder="Select a symbol" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT}>
              <SelectGroup>
                <SelectLabel>{grouped.get(activeMarket)?.displayName ?? 'Symbols'}</SelectLabel>
                {marketSymbols.map((s) => (
                  <SelectItem key={s.underlying_symbol} value={s.underlying_symbol}>
                    {s.underlying_symbol_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Growth rate */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Growth rate</label>
          <div className="grid grid-cols-5 gap-2">
            {growthRateOptions.map((opt) => {
              const active = opt.value === growthRate;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGrowthRate(opt.value)}
                  className={cn(
                    'rounded-lg py-3 text-sm font-semibold transition-colors',
                    active
                      ? 'bc-inset-orange text-orange-400'
                      : 'bc-inset text-slate-300 hover:text-slate-100'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-slate-400">Max {maxTicks} ticks</p>
        </div>

        {/* Stake */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Stake</label>
          <div className="flex items-center gap-3 bc-inset px-4 h-12">
            <span className="text-sm text-slate-400">USD</span>
            <input
              type="number"
              inputMode="decimal"
              value={stake}
              min={0}
              step="0.01"
              onChange={(e) => setStake(e.target.value)}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
              }}
              className="w-full bg-transparent text-right text-lg font-bold text-slate-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Feature toggles */}
        <div className="space-y-3">
          {toggleRows.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between bc-inset px-4 h-14">
              <span className="text-base font-semibold text-slate-100">{label}</span>
              <BcSwitch
                label={label}
                checked={toggles[key]}
                onChange={(v) => setToggle(key, v)}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-400 text-pretty">{summary}</p>

        {/* Buy / Close */}
        {activePosition && onClose ? (
          <button
            type="button"
            disabled={!isConnected || isClosing || !activePosition.is_valid_to_sell}
            onClick={() => onClose(activePosition.contract_id, activePosition.bid_price)}
            className="w-full rounded-xl border border-orange-500 bg-transparent py-4 text-base font-bold text-orange-400 transition-colors hover:bg-orange-500/10 disabled:opacity-50"
          >
            {isClosing
              ? 'Closing…'
              : `Close ${(parseFloat(activePosition.buy_price) + parseFloat(activePosition.profit)).toFixed(2)} ${activePosition.currency}`}
          </button>
        ) : (
          <button
            type="button"
            disabled={!isConnected || !proposal || isBuying}
            onClick={onBuy}
            className="w-full rounded-xl bg-orange-500 py-4 text-base font-bold text-white shadow-[0_8px_30px_-8px_rgba(249,115,22,0.6)] transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isBuying ? 'Purchasing…' : `Buy for ${stakeDisplay} USD`}
          </button>
        )}
      </div>
    </BankClerkCard>
  );
}
