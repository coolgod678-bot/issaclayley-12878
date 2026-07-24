'use client';

import { Megaphone } from 'lucide-react';

/** Floating community pill. Its destination will be configured later. */
export function CommunityButton() {
  return (
    <button
      type="button"
      className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full border border-sky-400/50 bg-[#0f1420]/90 px-4 py-2.5 text-sm font-bold text-sky-400 shadow-lg backdrop-blur-sm transition-colors hover:bg-[#141b28]"
    >
      <Megaphone className="h-4 w-4" />
      Community
    </button>
  );
}
