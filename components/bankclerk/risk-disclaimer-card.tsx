'use client';

import { BankClerkCard } from './bank-clerk-card';

export function RiskDisclaimerCard() {
  return (
    <BankClerkCard>
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-100">Risk Disclaimer</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-400 text-pretty">
        Deriv offers complex derivatives, such as options and contracts for difference (&ldquo;CFDs&rdquo;).
        These products may not be suitable for all clients, and trading them puts you at risk. Please make
        sure that you understand the following risks before trading Deriv products: a) you may lose some or
        all of the money you invest in the trade, b) if your trade involves currency conversion, exchange
        rates will affect your profit and loss. You should never trade with borrowed money or with money
        that you cannot afford to lose.
      </p>
    </BankClerkCard>
  );
}
