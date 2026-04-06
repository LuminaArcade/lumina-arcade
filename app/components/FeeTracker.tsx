"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FeeTrackerProps {
  tokenMint?: string;
  poolName: string;
  isLaunched: boolean;
}

interface FeeData {
  totalLifetimeFees: number;
  uniqueClaimers: number;
  totalClaimed: number;
  totalUnclaimed: number;
}

function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  if (sol >= 1_000) return `${(sol / 1_000).toFixed(1)}K`;
  if (sol >= 1) return sol.toFixed(2);
  if (sol >= 0.001) return sol.toFixed(3);
  return sol.toFixed(4);
}

export default function FeeTracker({
  tokenMint,
  poolName,
  isLaunched,
}: FeeTrackerProps) {
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLaunched || !tokenMint) {
      setLoading(false);
      return;
    }

    async function fetchFeeData() {
      try {
        const [feesRes, claimRes] = await Promise.all([
          fetch(
            `/api/bags/analytics?action=lifetime-fees&tokenMint=${tokenMint}`
          ),
          fetch(
            `/api/bags/analytics?action=claim-stats&tokenMint=${tokenMint}`
          ),
        ]);

        if (!feesRes.ok || !claimRes.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const feesJson = await feesRes.json();
        const claimJson = await claimRes.json();

        const fees = feesJson.fees ?? 0;
        const stats = claimJson.stats ?? {};

        setFeeData({
          totalLifetimeFees: typeof fees === "number" ? fees : Number(fees) || 0,
          uniqueClaimers: stats.uniqueClaimers ?? 0,
          totalClaimed: stats.totalClaimed ?? 0,
          totalUnclaimed: stats.totalUnclaimed ?? 0,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFeeData();
  }, [isLaunched, tokenMint]);

  if (!isLaunched || !tokenMint) return null;

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-bg-tertiary animate-pulse" />
          <div className="h-5 w-32 rounded bg-bg-tertiary animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-10 rounded bg-bg-tertiary animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded bg-bg-tertiary animate-pulse" />
            <div className="h-16 rounded bg-bg-tertiary animate-pulse" />
            <div className="h-16 rounded bg-bg-tertiary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="h-5 w-5 text-text-dim"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="m7 16 4-8 4 4 4-6" />
          </svg>
          <h2 className="text-lg font-bold text-white">Fee Revenue</h2>
        </div>
        <p className="text-sm text-text-dim">
          Fee data unavailable. The Bags API may not be configured.
        </p>
      </div>
    );
  }

  const data = feeData ?? {
    totalLifetimeFees: 0,
    uniqueClaimers: 0,
    totalClaimed: 0,
    totalUnclaimed: 0,
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-neon-green"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="m7 16 4-8 4 4 4-6" />
          </svg>
          <h2 className="text-lg font-bold text-white">Fee Revenue</h2>
        </div>
        <Link
          href="/fees"
          className="text-xs font-semibold text-neon-cyan hover:text-neon-cyan/80 transition-colors"
        >
          Claim Fees &rarr;
        </Link>
      </div>

      {/* Total lifetime fees */}
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-4 mb-4">
        <p className="text-xs text-text-dim uppercase tracking-wider mb-1">
          Total Lifetime Fees Earned
        </p>
        <p className="text-3xl font-bold font-mono text-neon-green">
          {formatSol(data.totalLifetimeFees)} SOL
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 bg-bg-tertiary/50 p-3 text-center">
          <p className="font-mono text-lg font-bold text-neon-cyan">
            {data.uniqueClaimers}
          </p>
          <p className="text-[10px] text-text-dim mt-0.5">Unique Claimers</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-bg-tertiary/50 p-3 text-center">
          <p className="font-mono text-lg font-bold text-neon-green">
            {formatSol(data.totalClaimed)}
          </p>
          <p className="text-[10px] text-text-dim mt-0.5">Claimed (SOL)</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-bg-tertiary/50 p-3 text-center">
          <p className="font-mono text-lg font-bold text-neon-cyan">
            {formatSol(data.totalUnclaimed)}
          </p>
          <p className="text-[10px] text-text-dim mt-0.5">Unclaimed (SOL)</p>
        </div>
      </div>
    </div>
  );
}
