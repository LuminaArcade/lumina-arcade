"use client";

import { useState } from "react";

export default function PremiumBadge() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Diamond/sparkle icon */}
      <svg
        className="h-3 w-3 text-amber-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
      <span className="text-[10px] font-bold text-amber-400">PRO</span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-amber-500/30 bg-bg-secondary/95 px-3 py-1.5 text-xs text-amber-300 shadow-lg backdrop-blur-sm">
          Premium Member — Hold $LUMINA to unlock
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-bg-secondary/95" />
        </div>
      )}
    </div>
  );
}
