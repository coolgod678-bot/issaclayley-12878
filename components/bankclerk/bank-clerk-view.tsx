'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/custom/header';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceChartCard } from './price-chart-card';
import { ConfigurationCard, type BankClerkToggles } from './configuration-card';
import { StatsCard } from './stats-card';
import { ProfileCard } from './profile-card';
import { TradeHistoryCard } from './trade-history-card';
import { RiskDisclaimerCard } from './risk-disclaimer-card';
import { CommunityButton } from './community-button';
import type { AuthState, DerivAccount, ActiveSymbol, BuyResult } from '@deriv/core';
import type { AccumulatorProposalInfo } from '../../hooks/use-accumulator-proposal';
import type { GrowthRate, OpenPosition } from '../../lib/types';

export interface BankClerkViewProps {
  // Auth
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;
  logoSrc?: string;
  appName?: string;

  // Connection / loading
  isConnected: boolean;
  isLoading: boolean;

  // Market data
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  prices: number[];
  pipSize: number;

  // Trade controls
  growthRate: GrowthRate;
  setGrowthRate: (rate: GrowthRate) => void;
  growthRateOptions: { value: number; label: string }[];
  stake: string;
  setStake: (value: string) => void;
  proposal: AccumulatorProposalInfo | null;
  buyContract: () => void;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  clearBuyResult: () => void;

  // Positions
  activePosition: OpenPosition | null;
  sellContract: (contractId: number, bidPrice: string) => void;
  isClosing: boolean;
}

export function BankClerkView({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onSignUp,
  onLogout,
  onSwitchAccount,
  logoSrc,
  appName,
  isConnected,
  isLoading,
  symbols,
  activeSymbol,
  selectSymbol,
  prices,
  pipSize,
  growthRate,
  setGrowthRate,
  growthRateOptions,
  stake,
  setStake,
  proposal,
  buyContract,
  isBuying,
  buyResult,
  buyError,
  clearBuyResult,
  activePosition,
  sellContract,
  isClosing,
}: BankClerkViewProps) {
  const [toggles, setToggles] = useState<BankClerkToggles>({
    takeTicks: false,
    reinvest: false,
    secureProfit: false,
    autoTrade: false,
  });
  const setToggle = (key: keyof BankClerkToggles, value: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: value }));

  // Buy result / error toasts (previously handled by TradeControls).
  useEffect(() => {
    if (buyError) {
      toast.error('Purchase Failed', { description: buyError });
      clearBuyResult();
    }
  }, [buyError, clearBuyResult]);

  useEffect(() => {
    if (buyResult) {
      toast.success('Contract Purchased', {
        description: `Buy price: ${buyResult.buyPrice.toFixed(2)} USD | Payout: ${buyResult.payout.toFixed(2)} USD | Balance: ${buyResult.balanceAfter.toFixed(2)} USD`,
      });
      clearBuyResult();
    }
  }, [buyResult, clearBuyResult]);

  const symbolName = activeSymbol?.underlying_symbol_name ?? 'Volatility 10 (1s) Index';

  return (
    <main className="bc-page flex h-dvh flex-col text-slate-100 lg:h-auto lg:min-h-screen">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onLogout={onLogout}
        onSwitchAccount={onSwitchAccount}
        logoSrc={logoSrc}
        appName={appName}
        actions={<ThemeToggle />}
      />
      {/* Spacer for the fixed header (taller when the account bar is visible). */}
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain lg:flex-none lg:overflow-visible">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 py-4 pb-28">
          {isLoading ? (
            <>
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <PriceChartCard symbolName={symbolName} prices={prices} pipSize={pipSize} />
              <ConfigurationCard
                symbols={symbols}
                activeSymbol={activeSymbol}
                selectSymbol={selectSymbol}
                growthRate={growthRate}
                setGrowthRate={setGrowthRate}
                growthRateOptions={growthRateOptions}
                stake={stake}
                setStake={setStake}
                proposal={proposal}
                toggles={toggles}
                setToggle={setToggle}
                isConnected={isConnected}
                onBuy={buyContract}
                isBuying={isBuying}
                activePosition={activePosition}
                onClose={sellContract}
                isClosing={isClosing}
              />
              <StatsCard tickCount={prices.length} />
              <ProfileCard
                growthRate={growthRate}
                growthRateOptions={growthRateOptions}
                proposal={proposal}
              />
              <TradeHistoryCard />
              <RiskDisclaimerCard />
            </>
          )}
        </div>
      </div>

      <CommunityButton />
    </main>
  );
}
