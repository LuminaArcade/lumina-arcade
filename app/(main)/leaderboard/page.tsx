"use client";

import { useLeaderboard } from "@/lib/hooks/useLeaderboard";

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

export default function LeaderboardPage() {
  const { leaderboard, initialized } = useLeaderboard();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Leaderboard
        </h1>
        <p className="mt-1 text-text-secondary">
          Top players ranked by XP earned across all pool activity
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/5">
          <div className="grid grid-cols-[50px_1fr_100px_80px_100px] gap-2 bg-bg-secondary px-4 py-3 text-xs uppercase tracking-wide text-text-dim md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="text-right">Pools</span>
            <span className="text-right">Pledged</span>
          </div>

          {!initialized ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[50px_1fr_100px_80px_100px] gap-2 px-4 py-4 md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6"
              >
                <div className="h-5 w-6 rounded bg-bg-tertiary animate-pulse" />
                <div className="h-5 w-28 rounded bg-bg-tertiary animate-pulse" />
                <div className="h-5 w-16 rounded bg-bg-tertiary animate-pulse ml-auto" />
                <div className="h-5 w-8 rounded bg-bg-tertiary animate-pulse ml-auto" />
                <div className="h-5 w-16 rounded bg-bg-tertiary animate-pulse ml-auto" />
              </div>
            ))
          ) : leaderboard.length === 0 ? (
            <div className="py-12 text-center text-text-secondary">
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
                  className={`grid grid-cols-[50px_1fr_100px_80px_100px] items-center gap-2 px-4 py-4 transition-colors hover:bg-bg-tertiary/50 md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6 ${
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
                    {player.xp.toLocaleString("en-US")}
                  </span>
                  <span className="text-right font-mono text-sm text-neon-green">
                    {player.poolsCreated}
                  </span>
                  <span className="text-right font-mono text-sm text-neon-cyan">
                    {player.totalPledged.toFixed(1)} SOL
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
