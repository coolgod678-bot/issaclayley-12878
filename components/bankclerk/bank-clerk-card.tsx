'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Dark navy card with the signature orange glow used across the Bank Clerk UI. */
export function BankClerkCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn('bc-card p-5', className)}>{children}</section>;
}

/** Orange section heading used at the top of each card. */
export function BankClerkHeading({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <h2 className="text-lg font-bold text-orange-500">{children}</h2>
      {right}
    </div>
  );
}
