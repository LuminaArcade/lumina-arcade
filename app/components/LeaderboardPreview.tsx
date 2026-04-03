"use client";

import Link from "next/link";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { ArrowRight } from "./icons";

const rankColors: Record<number, string> = {
  1: "text-neon-gold",
  2: "text-gray-400",
  3: "text-amber-600",
};

const gradients = [
  "from-neon-purple to-neon-pink",
  "from-neon-cyan to-neon-purple",
  "from-neon-pink to-neon-purple",
  "from-neon-green to-neon-cyan",
  "from-neon-gold to-neon-pink",
];

export default function LeaderboardPreview() {
  const { leaderboard, initialized } = useLeaderboard(5);

  return (
    <section id="leaderboard" className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Top Players</h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-gold neon-glow-gold" />
      </div>

      <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border border-white/5">
        <div className="grid grid-cols-[50px_1fr_100px_100px] gap-2 bg-bg-secondary px-4 py-3 text-xs uppercase tracking-wide text-text-dim md:grid-cols-[60px_1fr_120px_120px] md:px-6">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">XP</span>
          <span className="text-right">Pools</span>
        </div>

        {!initialized ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[50px_1fr_100px_100px] gap-2 px-4 py-4 md:grid-cols-[60px_1fr_120px_120px] md:px-6">
              <div className="h-5 w-6 rounded bg-bg-tertiary animate-pulse" />
              <div className="h-5 w-28 rounded bg-bg-tertiary animate-pulse" />
              <div className="h-5 w-16 rounded bg-bg-tertiary animate-pulse ml-auto" />
              <div className="h-5 w-8 rounded bg-bg-tertiary animate-pulse ml-auto" />
            </div>
          ))
        ) : leaderboard.length === 0 ? (
          <div className="py-8 text-center text-text-secondary">
            No players yet. Connect your wallet to get started!
          </div>
        ) : (
          leaderboard.map((player, i) => {
            const initials = player.displayName
              .split(/[^a-zA-Z0-9]/)
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("");
            return (
              <div
                key={player.wallet}
                className={`grid grid-cols-[50px_1fr_100px_100px] items-center gap-2 px-4 py-4 transition-colors hover:bg-bg-tertiary/50 md:grid-cols-[60px_1fr_120px_120px] md:px-6 ${
                  player.rank % 2 === 0 ? "bg-bg-secondary/30" : ""
                }`}
              >
                <span
                  className={`font-mono text-lg font-bold ${
                    rankColors[player.rank] ?? "text-text-secondary"
                  }`}
                >
                  #{player.rank}
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                      gradients[i % gradients.length]
                    } text-xs font-bold text-white md:h-10 md:w-10 md:text-sm`}
                  >
                    {initials || "?"}
                  </div>
                  <span className="font-semibold text-white">
                    {player.displayName}
                  </span>
                </div>
                <span className="text-right font-mono text-sm text-neon-purple">
                  {player.xp.toLocaleString("en-US")} XP
                </span>
                <span className="text-right font-mono text-sm text-neon-green">
                  {player.poolsCreated}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 font-semibold text-neon-cyan transition-colors hover:text-neon-cyan/80"
        >
          View Full Leaderboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
