"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useBags, type ClaimablePosition } from "@/lib/hooks/useBags";
import { useToast } from "@/app/components/Toast";

export default function FeesPage() {
  const { wallet, isConnected } = useCurrentUser();
  const { getClaimable, claimFees, claiming, error } = useBags();
  const { addToast } = useToast();
  const [positions, setPositions] = useState<ClaimablePosition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    setLoading(true);
    getClaimable().then((p) => {
      setPositions(p);
      setLoading(false);
    });
  }, [isConnected, getClaimable]);

  async function handleClaim(tokenMint: string) {
    const result = await claimFees(tokenMint);
    if (result) {
      addToast("Fees claimed successfully!", "success");
      // Refresh positions
      const updated = await getClaimable();
      setPositions(updated);
    } else if (error) {
      addToast(error, "error");
    }
  }

  const totalClaimable = positions.reduce((sum, p) => sum + p.claimableAmount, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">Fees</h1>
            <p className="mt-1 text-text-secondary">
              Claim your earned fees from Bags.fm token launches
            </p>
          </div>
          {isConnected && totalClaimable > 0 && (
            <div className="glass-card px-4 py-2.5">
              <span className="text-xs text-text-dim uppercase tracking-wider">Total Claimable</span>
              <p className="font-mono text-lg font-bold text-neon-green">
                {totalClaimable.toFixed(4)} SOL
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          {!isConnected ? (
            <div className="glass-card py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10">
                <svg className="h-8 w-8 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-text-secondary">Connect your wallet to view claimable fees</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card animate-pulse p-6">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-40 rounded bg-bg-tertiary" />
                    <div className="h-8 w-24 rounded bg-bg-tertiary" />
                  </div>
                </div>
              ))}
            </div>
          ) : positions.length === 0 ? (
            <div className="glass-card py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
                <svg className="h-8 w-8 text-text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-text-secondary">No claimable fees found</p>
              <p className="mt-1 text-sm text-text-dim">
                Launch or contribute to tokens on Bags.fm to earn fees
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((pos) => (
                <div
                  key={pos.baseMint}
                  className="glass-card flex items-center justify-between p-6"
                >
                  <div>
                    <p className="font-mono text-sm text-text-secondary">
                      {pos.baseMint.slice(0, 6)}...{pos.baseMint.slice(-6)}
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-neon-green">
                      {pos.claimableAmount.toFixed(4)} SOL
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {pos.isMigrated && (
                        <span className="rounded bg-neon-cyan/10 px-1.5 py-0.5 text-[10px] font-medium text-neon-cyan">
                          Migrated
                        </span>
                      )}
                      {pos.isCustomFeeVault && (
                        <span className="rounded bg-neon-purple/10 px-1.5 py-0.5 text-[10px] font-medium text-neon-purple">
                          Fee Share
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaim(pos.baseMint)}
                    disabled={claiming || pos.claimableAmount <= 0}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                      claiming
                        ? "bg-bg-tertiary text-text-dim cursor-wait"
                        : "bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30"
                    }`}
                  >
                    {claiming ? "Claiming..." : "Claim"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="mt-8 glass-card p-5">
          <h3 className="text-sm font-semibold text-white">How Fees Work</h3>
          <p className="mt-1.5 text-xs text-text-dim leading-relaxed">
            When tokens are launched through Lumina Arcade pools on Bags.fm, creators earn 1% of all trading volume.
            These fees accumulate and can be claimed here. Fee sharing is configured when the token launches,
            distributing earnings to pool creators and contributors.
          </p>
        </div>
      </div>
    </div>
  );
}
