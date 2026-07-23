'use client';

import { cn } from '@/lib/utils';

/**
 * Presentational on/off switch styled to match the design. Behaviour for the
 * individual feature toggles will be wired up later per upcoming instructions.
 */
export function BcSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-orange-500' : 'bg-slate-700/70'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}
