"use client";

import { useState } from "react";
import { usePools } from "@/lib/hooks/usePools";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useReferral } from "@/lib/hooks/useReferral";
import { useToast } from "./Toast";
import { XP_REWARDS } from "@/lib/constants";

const DURATIONS = [
  { label: "1 day", ms: 86_400_000 },
  { label: "3 days", ms: 3 * 86_400_000 },
  { label: "7 days", ms: 7 * 86_400_000 },
  { label: "14 days", ms: 14 * 86_400_000 },
];

export default function CreatePoolModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createPool } = usePools();
  const { wallet, user, isConnected } = useCurrentUser();
  const { awardReferralBonus } = useReferral();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [targetSol, setTargetSol] = useState("");
  const [durationIdx, setDurationIdx] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Pool name is required";
    if (!ticker.trim()) newErrors.ticker = "Ticker is required";
    const target = parseFloat(targetSol);
    if (isNaN(target) || target <= 0) newErrors.targetSol = "Enter a valid target amount";
    if (target > 10000) newErrors.targetSol = "Max target is 10,000 SOL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !wallet || submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      createPool({
        name: `$${ticker.toUpperCase()} Pool`,
        ticker: ticker.toUpperCase(),
        description: description || `Community pool for $${ticker.toUpperCase()}`,
        creatorWallet: wallet,
        creatorName: user?.displayName ?? wallet.slice(0, 4) + "..." + wallet.slice(-4),
        targetSol: parseFloat(targetSol),
        expiresAt: Date.now() + DURATIONS[durationIdx].ms,
      });

      awardReferralBonus("create_pool");
      addToast(`Pool created! +${XP_REWARDS.CREATE_POOL} XP earned`, "success");
      setName("");
      setTicker("");
      setDescription("");
      setTargetSol("");
      setDurationIdx(2);
      setErrors({});
      onClose();
    } catch {
      addToast("Failed to create pool. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-card relative z-10 w-full max-w-md p-6 animate-[fadeInUp_0.3s_ease-out]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create Pool</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-purple"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isConnected ? (
          <p className="text-center text-text-secondary py-8">
            Connect your wallet to create a pool.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Pool Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="My Awesome Token"
                required
                className={`w-full rounded-lg border bg-bg-tertiary px-4 py-2.5 text-sm text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50 ${
                  errors.name ? "border-neon-pink/50" : "border-white/10"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-neon-pink">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Ticker
              </label>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">$</span>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => { setTicker(e.target.value.toUpperCase().slice(0, 6)); setErrors((p) => ({ ...p, ticker: "" })); }}
                  placeholder="TOKEN"
                  required
                  className={`w-full rounded-lg border bg-bg-tertiary px-4 py-2.5 text-sm font-mono text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50 ${
                    errors.ticker ? "border-neon-pink/50" : "border-white/10"
                  }`}
                />
              </div>
              {errors.ticker && <p className="mt-1 text-xs text-neon-pink">{errors.ticker}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Description <span className="text-text-dim">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's your pool about?"
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50 resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Target (SOL)
              </label>
              <input
                type="number"
                value={targetSol}
                onChange={(e) => { setTargetSol(e.target.value); setErrors((p) => ({ ...p, targetSol: "" })); }}
                placeholder="50"
                min="1"
                max="10000"
                step="0.1"
                required
                className={`w-full rounded-lg border bg-bg-tertiary px-4 py-2.5 text-sm font-mono text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50 ${
                  errors.targetSol ? "border-neon-pink/50" : "border-white/10"
                }`}
              />
              {errors.targetSol && <p className="mt-1 text-xs text-neon-pink">{errors.targetSol}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d, i) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setDurationIdx(i)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-purple ${
                      durationIdx === i
                        ? "border-neon-purple bg-neon-purple/20 text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                        : "border-white/10 text-text-secondary hover:border-white/20"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`mt-2 w-full rounded-lg py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
                submitting
                  ? "bg-neon-purple/50 cursor-wait"
                  : "bg-neon-purple hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Pool"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
