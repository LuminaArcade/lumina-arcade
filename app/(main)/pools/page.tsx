"use client";

import { useState } from "react";
import Link from "next/link";
import { usePools } from "@/lib/hooks/usePools";
import CreatePoolModal from "@/app/components/CreatePoolModal";

function formatTimeLeft(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return `${hours}h ${mins}m`;
}

type Filter = "all" | "active" | "launched";

export default function PoolsPage() {
  const { pools, initialized } = usePools();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = pools.filter((p) => {
    if (filter === "active") return p.status === "active";
    if (filter === "launched") return p.status === "launched";
    return true;
  });

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Launched", value: "launched" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">Pools</h1>
            <p className="mt-1 text-text-secondary">
              Browse, create, and pledge to community token pools
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-neon-purple px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            + Create Pool
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40"
                  : "border border-white/10 text-text-secondary hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pool Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!initialized ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse p-6">
                <div className="h-6 w-32 rounded bg-bg-tertiary" />
                <div className="mt-2 h-4 w-48 rounded bg-bg-tertiary" />
                <div className="mt-4 h-3 rounded-full bg-bg-tertiary" />
                <div className="mt-4 h-4 w-full rounded bg-bg-tertiary" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-text-secondary">
              {filter === "all"
                ? "No pools yet. Create the first one!"
                : `No ${filter} pools found.`}
            </div>
          ) : (
            filtered.map((pool) => {
              const pct = Math.min(100, Math.round((pool.raisedSol / pool.targetSol) * 100));
              const isLaunched = pool.status === "launched";
              return (
                <Link
                  key={pool.id}
                  href={`/pools/${pool.id}`}
                  className="glass-card p-6 transition-all hover:border-neon-purple/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{pool.name}</h3>
                      <p className="mt-0.5 font-mono text-xs text-text-secondary">
                        by {pool.creatorName}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isLaunched
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-neon-cyan/20 text-neon-cyan"
                      }`}
                    >
                      {isLaunched ? "Launched" : "Active"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {pool.description}
                  </p>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-bg-tertiary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-neon-cyan">
                      {pool.raisedSol.toFixed(1)} / {pool.targetSol} SOL
                    </span>
                    <span className="text-text-secondary">{pct}%</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
                    <span>{pool.participants.length} players</span>
                    <span>
                      {isLaunched ? "Launched" : formatTimeLeft(pool.expiresAt)}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      <CreatePoolModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
