"use client";

import Link from "next/link";
import { usePools } from "@/lib/hooks/usePools";
import { ArrowRight } from "./icons";
import { formatTimeLeft } from "@/lib/utils";

export default function HotPools() {
  const { hotPools, initialized } = usePools();
  const displayPools = hotPools.slice(0, 3);

  return (
    <section id="pools" className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          <span className="mr-2">Hot Pools</span>
          <span className="inline-block text-2xl">&#128293;</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-pink neon-glow-pink" />
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
        ) : displayPools.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-text-secondary">
            No active pools yet. Be the first to create one!
          </div>
        ) : (
          displayPools.map((pool) => {
            const percentage = Math.min(
              100,
              Math.round((pool.raisedSol / pool.targetSol) * 100)
            );
            return (
              <Link
                key={pool.id}
                href={`/pools/${pool.id}`}
                className="glass-card p-6 transition-all hover:border-neon-purple/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              >
                <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                <p className="mt-1 font-mono text-sm text-text-secondary">
                  {pool.creatorName}
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-sm text-neon-cyan">
                    {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
                  </span>
                  <span className="rounded-full bg-neon-cyan/10 px-2 py-0.5 font-mono text-xs font-semibold text-neon-cyan">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
                  <span>{pool.participants.length} players</span>
                  <span>{formatTimeLeft(pool.expiresAt)} left</span>
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
