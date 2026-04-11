"use client";

import { useState } from "react";
import { useTokenGate } from "@/lib/hooks/useTokenGate";

export default function TokenGateBanner() {
  const { isPremium, isChecking, simulatePurchase, gateConfigured } = useTokenGate();
  const [dismissed, setDismissed] = useState(false);

  // Don't render if premium, still checking, dismissed, or gate not configured
  if (isPremium || isChecking || dismissed || !gateConfigured) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-amber-500/10 p-4 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-text-dim transition-colors hover:text-white"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {/* Diamond icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Hold $LUMINA to unlock premium features
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              2x XP, custom characters, priority pools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://bags.fm/token/7jC3iMX9RzgnkND9TriAmQcdJpz7SxNGyJiPpo3EBAGS"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            Get $LUMINA on Bags.fm
          </a>
          <button
            onClick={simulatePurchase}
            className="rounded-lg border border-amber-500/40 px-4 py-2 text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/10"
          >
            Try Premium (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
