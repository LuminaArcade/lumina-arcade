"use client";

import { useState } from "react";
import { usePools } from "@/lib/hooks/usePools";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useToast } from "./Toast";

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
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [targetSol, setTargetSol] = useState("");
  const [durationIdx, setDurationIdx] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !wallet) return;

    const target = parseFloat(targetSol);
    if (!name.trim() || !ticker.trim() || isNaN(target) || target <= 0) return;

    createPool({
      name: `$${ticker.toUpperCase()} Pool`,
      ticker: ticker.toUpperCase(),
      description: description || `Community pool for $${ticker.toUpperCase()}`,
      creatorWallet: wallet,
      creatorName: user?.displayName ?? wallet.slice(0, 4) + "..." + wallet.slice(-4),
      targetSol: target,
      expiresAt: Date.now() + DURATIONS[durationIdx].ms,
    });

    addToast(`Pool created! +200 XP earned`, "success");
    setName("");
    setTicker("");
    setDescription("");
    setTargetSol("");
    setDurationIdx(2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-card relative z-10 w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create Pool</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
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
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Token"
                required
                className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50"
              />
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
                  onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="TOKEN"
                  required
                  className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm font-mono text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Description
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
                onChange={(e) => setTargetSol(e.target.value)}
                placeholder="50"
                min="1"
                step="0.1"
                required
                className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm font-mono text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50"
              />
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
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      durationIdx === i
                        ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
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
              className="mt-2 w-full rounded-lg bg-neon-purple py-3 text-sm font-semibold text-white transition-all hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              Create Pool
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
