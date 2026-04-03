"use client";

import { useState } from "react";
import { usePools } from "@/lib/hooks/usePools";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useToast } from "./Toast";
import type { Pool } from "@/lib/types";

export default function PledgeModal({
  pool,
  isOpen,
  onClose,
}: {
  pool: Pool;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { pledgeToPool } = usePools();
  const { wallet, isConnected } = useCurrentUser();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const remaining = pool.targetSol - pool.raisedSol;
  const maxPledge = Math.max(0, remaining);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !wallet) return;

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || val > maxPledge) return;

    pledgeToPool(pool.id, wallet, val);
    const xpEarned = 50 + Math.floor(val * 10);
    addToast(`Pledged ${val} SOL! +${xpEarned} XP earned`, "success");

    if (pool.raisedSol + val >= pool.targetSol) {
      setTimeout(() => addToast("Pool launched! Token is live!", "info"), 1000);
    }

    setAmount("");
    onClose();
  };

  const percentage = Math.min(
    100,
    Math.round((pool.raisedSol / pool.targetSol) * 100)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="glass-card relative z-10 w-full max-w-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pledge to {pool.name}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-3 overflow-hidden rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-text-secondary">
            <span className="font-mono text-neon-cyan">
              {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
            </span>
            <span>{percentage}%</span>
          </div>
        </div>

        {!isConnected ? (
          <p className="text-center text-text-secondary py-4">
            Connect your wallet to pledge.
          </p>
        ) : pool.status !== "active" ? (
          <p className="text-center text-neon-green py-4 font-semibold">
            This pool has launched!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Amount (SOL)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Max ${maxPledge.toFixed(1)}`}
                min="0.1"
                max={maxPledge}
                step="0.1"
                required
                className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm font-mono text-white placeholder-text-dim outline-none transition-colors focus:border-neon-cyan/50"
              />
              <p className="mt-1 text-xs text-text-dim">
                Remaining: {maxPledge.toFixed(1)} SOL
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              Pledge SOL
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
