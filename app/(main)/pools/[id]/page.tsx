"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePools } from "@/lib/hooks/usePools";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useBags } from "@/lib/hooks/useBags";
import { useToast } from "@/app/components/Toast";
import PledgeModal from "@/app/components/PledgeModal";
import ShareButton from "@/app/components/ShareButton";
import { formatDate, formatTimeLeft } from "@/lib/utils";

export default function PoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getPool } = usePools();
  const { wallet, isConnected } = useCurrentUser();
  const { launchToken, launching } = useBags();
  const { addToast } = useToast();
  const [showPledge, setShowPledge] = useState(false);

  const pool = getPool(id);

  if (!pool) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Pool not found</h1>
        <Link
          href="/pools"
          className="mt-4 text-neon-cyan hover:text-neon-cyan/80"
        >
          Back to Pools
        </Link>
      </div>
    );
  }

  const percentage = Math.min(
    100,
    Math.round((pool.raisedSol / pool.targetSol) * 100)
  );
  const isLaunched = pool.status === "launched";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <Link
          href="/pools"
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-neon-cyan"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Pools
        </Link>

        {/* Header */}
        <div className="glass-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{pool.name}</h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isLaunched
                      ? "bg-neon-green/20 text-neon-green"
                      : "bg-neon-cyan/20 text-neon-cyan"
                  }`}
                >
                  {isLaunched ? "Launched" : "Active"}
                </span>
              </div>
              <p className="mt-1 font-mono text-sm text-text-secondary">
                ${pool.ticker} &middot; by {pool.creatorName}
              </p>
              <ShareButton path={`/pools/${pool.id}`} poolName={pool.name} className="mt-2" />
            </div>

            {!isLaunched && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setShowPledge(true)}
                  disabled={!isConnected}
                  className={`rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                    isConnected
                      ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:opacity-90"
                      : "bg-bg-tertiary text-text-dim cursor-not-allowed"
                  }`}
                >
                  {isConnected ? "Pledge SOL" : "Connect Wallet to Pledge"}
                </button>
                {/* Show launch button when pool target is reached */}
                {percentage >= 100 && isConnected && wallet === pool.creatorWallet && (
                  <button
                    onClick={async () => {
                      const result = await launchToken({
                        name: pool.name,
                        symbol: pool.ticker,
                        description: pool.description,
                      });
                      if (result) {
                        addToast(`Token ${pool.ticker} launched on Bags.fm!`, "success");
                      }
                    }}
                    disabled={launching}
                    className={`rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                      launching
                        ? "bg-neon-green/30 text-neon-green/60 cursor-wait"
                        : "bg-neon-green/20 text-neon-green border border-neon-green/40 hover:bg-neon-green/30"
                    }`}
                  >
                    {launching ? "Launching on Bags.fm..." : "Launch on Bags.fm 🚀"}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-text-secondary">{pool.description}</p>

          {/* Progress */}
          <div className="mt-6">
            <div className="h-4 overflow-hidden rounded-full bg-bg-tertiary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-neon-cyan">
                {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
              </span>
              <span className="font-mono text-lg font-bold text-white">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-white">
                {pool.participants.length}
              </p>
              <p className="text-xs text-text-secondary">Players</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-white">
                {pool.pledges.length}
              </p>
              <p className="text-xs text-text-secondary">Pledges</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-white">
                {isLaunched ? "Launched" : formatTimeLeft(pool.expiresAt)}
              </p>
              <p className="text-xs text-text-secondary">
                {isLaunched ? "Status" : "Time Left"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Pledges */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-white">Recent Pledges</h2>
          <div className="glass-card overflow-hidden">
            {pool.pledges.length === 0 ? (
              <div className="py-8 text-center text-text-secondary">
                No pledges yet. Be the first!
              </div>
            ) : (
              [...pool.pledges]
                .reverse()
                .slice(0, 20)
                .map((pledge, i) => (
                  <div
                    key={`${pledge.wallet}-${pledge.timestamp}`}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i % 2 === 0 ? "bg-bg-secondary/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan text-xs font-bold text-white">
                        {pledge.wallet.slice(0, 2)}
                      </div>
                      <span className="font-mono text-sm text-text-secondary">
                        {pledge.wallet}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-neon-cyan">
                        {pledge.amount.toFixed(1)} SOL
                      </p>
                      <p className="text-xs text-text-dim">
                        {formatDate(pledge.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Pool Info */}
        <div className="mt-8 glass-card p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Pool Info</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-text-dim">Created</dt>
              <dd className="font-mono text-text-secondary">
                {formatDate(pool.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-text-dim">Expires</dt>
              <dd className="font-mono text-text-secondary">
                {formatDate(pool.expiresAt)}
              </dd>
            </div>
            {pool.launchedAt && (
              <div>
                <dt className="text-text-dim">Launched</dt>
                <dd className="font-mono text-neon-green">
                  {formatDate(pool.launchedAt)}
                </dd>
              </div>
            )}
            {pool.tokenMint && (
              <div>
                <dt className="text-text-dim">Token Mint</dt>
                <dd className="font-mono text-neon-cyan truncate">
                  {pool.tokenMint}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-text-dim">Pool ID</dt>
              <dd className="font-mono text-text-secondary truncate">
                {pool.id}
              </dd>
            </div>
          </dl>
        </div>

        {/* Trade & Bags links for launched pools */}
        {isLaunched && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {pool.tokenMint && (
              <Link
                href={`/trade?token=${pool.tokenMint}`}
                className="flex-1 rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Trade ${pool.ticker}
              </Link>
            )}
            {pool.tokenMint && (
              <a
                href={`https://bags.fm/token/${pool.tokenMint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-neon-purple/40 px-6 py-3 text-center text-sm font-semibold text-neon-purple transition-all hover:bg-neon-purple/10"
              >
                View on Bags.fm ↗
              </a>
            )}
          </div>
        )}
      </div>

      <PledgeModal
        pool={pool}
        isOpen={showPledge}
        onClose={() => setShowPledge(false)}
      />
    </div>
  );
}
