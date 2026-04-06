"use client";

import Link from "next/link";
import { usePools } from "@/lib/hooks/usePools";
import { ArrowRight } from "./icons";
import PoolCountdown, { EndingSoonBadge } from "./PoolCountdown";

export default function TrendingPools() {
  const { trendingPools, initialized } = usePools();
  const display = trendingPools.slice(0, 3);

  if (initialized && display.length === 0) return null;

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          <span className="mr-2">Trending Now</span>
          <span className="inline-block text-2xl">&#128200;</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary">
          Pools with the most pledge activity in the last 24 hours
        </p>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-cyan neon-glow-cyan" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {!initialized ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card animate-pulse p-6">
              <div className="h-6 w-32 rounded bg-bg-tertiary" />
              <div className="mt-2 h-4 w-24 rounded bg-bg-tertiary" />
              <div className="mt-4 h-3 rounded-full bg-bg-tertiary" />
              <div className="mt-4 h-4 w-full rounded bg-bg-tertiary" />
            </div>
          ))
        ) : (
          display.map(({ pool, momentum, recentVolume, recentCount }, rank) => {
            const pct = Math.min(100, Math.round((pool.raisedSol / pool.targetSol) * 100));
            return (
              <Link
                key={pool.id}
                href={`/pools/${pool.id}`}
                className="glass-card relative p-6 transition-all hover:border-neon-cyan/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              >
                {/* Rank badge */}
                <div className="absolute -top-2.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple text-xs font-bold text-white shadow-lg">
                  #{rank + 1}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                    <p className="mt-1 font-mono text-sm text-text-secondary">
                      {pool.creatorName}
                    </p>
                  </div>
                  <EndingSoonBadge expiresAt={pool.expiresAt} />
                </div>

                {/* Momentum stats */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neon-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-neon-cyan">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {recentVolume.toFixed(1)} SOL 24h
                  </span>
                  <span className="text-[10px] text-text-dim">
                    {recentCount} pledge{recentCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-sm text-neon-cyan">
                    {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
                  </span>
                  <span className="rounded-full bg-neon-cyan/10 px-2 py-0.5 font-mono text-xs font-semibold text-neon-cyan">
                    {pct}%
                  </span>
                </div>

                {/* Countdown */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    {pool.participants.length} players
                  </span>
                  <PoolCountdown expiresAt={pool.expiresAt} compact />
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/pools"
          className="inline-flex items-center gap-1 font-semibold text-neon-cyan transition-colors hover:text-neon-cyan/80"
        >
          View All Pools <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
