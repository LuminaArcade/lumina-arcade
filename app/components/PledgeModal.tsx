"use client";

import { useState } from "react";
import { usePools } from "@/lib/hooks/usePools";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useReferral } from "@/lib/hooks/useReferral";
import { useToast } from "./Toast";
import { XP_REWARDS } from "@/lib/constants";
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
  const { awardReferralBonus } = useReferral();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const remaining = pool.targetSol - pool.raisedSol;
  const maxPledge = Math.max(0, remaining);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !wallet || submitting) return;

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || val > maxPledge) {
      addToast(`Enter an amount between 0.1 and ${maxPledge.toFixed(1)} SOL`, "error");
      return;
    }

    setSubmitting(true);
    try {
      pledgeToPool(pool.id, wallet, val);
      awardReferralBonus("pledge");
      const xpEarned = XP_REWARDS.PLEDGE + Math.floor(val * XP_REWARDS.PLEDGE_PER_SOL);
      addToast(`Pledged ${val} SOL! +${xpEarned} XP earned`, "success");

      if (pool.raisedSol + val >= pool.targetSol) {
        setTimeout(() => addToast("Pool launched! Token is live!", "info"), 1000);
      }

      setAmount("");
      onClose();
    } catch {
      addToast("Pledge failed. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const percentage = Math.min(
    100,
    Math.round((pool.raisedSol / pool.targetSol) * 100)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      <div className="glass-card relative z-10 w-full max-w-sm p-6 animate-[fadeInUp_0.3s_ease-out]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pledge to {pool.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-purple"
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
              className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500"
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
          <div className="py-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neon-green/20">
              <svg className="h-6 w-6 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="font-semibold text-neon-green">This pool has launched!</p>
          </div>
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
              <div className="mt-1.5 flex items-center justify-between text-xs text-text-dim">
                <span>Remaining: {maxPledge.toFixed(1)} SOL</span>
                <button
                  type="button"
                  onClick={() => setAmount(maxPledge.toFixed(1))}
                  className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-lg py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan ${
                submitting
                  ? "bg-gradient-to-r from-neon-purple/50 to-neon-cyan/50 cursor-wait"
                  : "bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Pledging...
                </span>
              ) : (
                "Pledge SOL"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
