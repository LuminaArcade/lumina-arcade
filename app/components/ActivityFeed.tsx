"use client";

import { useMemo } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "pledge" | "pool_created" | "pool_launched";
  message: string;
  poolId?: string;
  poolName?: string;
  timestamp: number;
  icon: string;
  color: string;
}

export default function ActivityFeed() {
  const { state } = useAppContext();

  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    // Gather pledges from all pools
    for (const pool of state.pools) {
      for (const pledge of pool.pledges) {
        items.push({
          id: `pledge-${pool.id}-${pledge.wallet}-${pledge.timestamp}`,
          type: "pledge",
          message: `${pledge.wallet.slice(0, 4)}...${pledge.wallet.slice(-4)} pledged ${pledge.amount.toFixed(1)} SOL to ${pool.name}`,
          poolId: pool.id,
          poolName: pool.name,
          timestamp: pledge.timestamp,
          icon: "⚡",
          color: "text-neon-cyan",
        });
      }

      // Pool creation events
      items.push({
        id: `created-${pool.id}`,
        type: "pool_created",
        message: `${pool.creatorName} created ${pool.name}`,
        poolId: pool.id,
        poolName: pool.name,
        timestamp: pool.createdAt,
        icon: "🎯",
        color: "text-neon-purple",
      });

      // Pool launched events
      if (pool.status === "launched" && pool.launchedAt) {
        items.push({
          id: `launched-${pool.id}`,
          type: "pool_launched",
          message: `${pool.name} launched! 🚀`,
          poolId: pool.id,
          poolName: pool.name,
          timestamp: pool.launchedAt,
          icon: "🚀",
          color: "text-neon-green",
        });
      }
    }

    // Sort by timestamp descending, take latest 50
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
  }, [state.pools]);

  if (!state.initialized || activities.length === 0) return null;

  // Show the latest 20 for the scrolling ticker
  const tickerItems = activities.slice(0, 20);

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-bg-secondary/80 backdrop-blur-sm">
      <div className="flex items-center">
        {/* Live indicator */}
        <div className="flex-shrink-0 flex items-center gap-2 border-r border-white/5 px-4 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-green">Live</span>
        </div>

        {/* Scrolling content */}
        <div className="overflow-hidden relative flex-1">
          <div className="flex animate-[scroll_60s_linear_infinite] hover:pause whitespace-nowrap py-2.5">
            {/* Duplicate items for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={item.poolId ? `/pools/${item.poolId}` : "/pools"}
                className="inline-flex items-center gap-2 px-4 text-sm transition-colors hover:text-white"
              >
                <span>{item.icon}</span>
                <span className={item.color}>{item.message}</span>
                <span className="text-text-dim text-xs">{timeAgo(item.timestamp)}</span>
                <span className="text-text-dim/30 mx-2">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
