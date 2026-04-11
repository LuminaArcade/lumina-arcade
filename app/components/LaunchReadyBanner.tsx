"use client";

import type { Pool } from "@/lib/types";

export default function LaunchReadyBanner({
  pool,
  isCreator,
  onLaunch,
  launching,
}: {
  pool: Pool;
  isCreator: boolean;
  onLaunch: () => void;
  launching: boolean;
}) {
  const isFunded = pool.raisedSol >= pool.targetSol;
  const isActive = pool.status === "active";
  const isLaunched = pool.status === "launched";

  if (!isFunded || !isActive || isLaunched) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neon-green/30 bg-gradient-to-r from-neon-green/20 via-neon-green/10 to-neon-green/20 p-6 animate-[pulse_3s_ease-in-out_infinite]">
      {/* Confetti dots — CSS only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-2 left-[10%] h-2 w-2 rounded-full bg-neon-cyan/60 animate-confetti-fall" />
        <div className="absolute top-0 left-[25%] h-1.5 w-1.5 rounded-full bg-neon-purple/60 animate-confetti-fall" style={{ animationDelay: "0.4s", animationDuration: "3s" }} />
        <div className="absolute top-1 left-[40%] h-2 w-2 rounded-full bg-neon-green/60 animate-confetti-fall" style={{ animationDelay: "0.8s", animationDuration: "2.8s" }} />
        <div className="absolute top-0 left-[55%] h-1.5 w-1.5 rounded-full bg-yellow-400/60 animate-confetti-fall" style={{ animationDelay: "0.2s", animationDuration: "3.2s" }} />
        <div className="absolute top-2 left-[70%] h-2 w-2 rounded-full bg-neon-cyan/60 animate-confetti-fall" style={{ animationDelay: "0.6s", animationDuration: "2.6s" }} />
        <div className="absolute top-0 left-[85%] h-1.5 w-1.5 rounded-full bg-neon-purple/60 animate-confetti-fall" style={{ animationDelay: "1s", animationDuration: "3.1s" }} />
        <div className="absolute top-1 left-[95%] h-2 w-2 rounded-full bg-yellow-400/60 animate-confetti-fall" style={{ animationDelay: "0.3s", animationDuration: "2.9s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-neon-green">
            🎉 Pool Funded! Ready to Launch!
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Your pool reached its target of{" "}
            <span className="font-mono font-semibold text-white">
              {pool.targetSol} SOL
            </span>
            . Launch your token on Bags.fm now!
          </p>
        </div>

        {isCreator ? (
          <button
            onClick={onLaunch}
            disabled={launching}
            className={`shrink-0 rounded-xl px-8 py-3.5 text-sm font-bold transition-all ${
              launching
                ? "bg-neon-green/30 text-neon-green/60 cursor-wait"
                : "bg-neon-green text-black hover:shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95"
            }`}
          >
            {launching ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Launching...
              </span>
            ) : (
              "Launch on Bags.fm 🚀"
            )}
          </button>
        ) : (
          <p className="shrink-0 rounded-xl border border-neon-green/20 bg-neon-green/5 px-6 py-3 text-sm text-text-secondary">
            Waiting for creator to launch...
          </p>
        )}
      </div>
    </div>
  );
}
