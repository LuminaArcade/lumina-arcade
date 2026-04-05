"use client";

import { useLeaderboard } from "@/lib/hooks/useLeaderboard";

const rankColors: Record<number, string> = {
  1: "text-neon-gold",
  2: "text-text-secondary",
  3: "text-neon-pink",
};

const rankBg: Record<number, string> = {
  1: "bg-neon-gold/10 border-neon-gold/30",
  2: "bg-white/5 border-white/10",
  3: "bg-neon-pink/10 border-neon-pink/30",
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

        {/* Top 3 Cards - Desktop */}
        {initialized && leaderboard.length >= 3 && (
          <div className="mt-8 hidden md:grid md:grid-cols-3 md:gap-4">
            {leaderboard.slice(0, 3).map((player, i) => {
              const initials = player.displayName
                .split(/[^a-zA-Z0-9]/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");
              return (
                <div
                  key={player.wallet}
                  className={`glass-card flex flex-col items-center p-6 border ${
                    rankBg[player.rank] ?? ""
                  }`}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} text-lg font-bold text-white`}>
                    {initials || "?"}
                  </div>
                  <span className={`mt-2 text-2xl font-bold font-mono ${rankColors[player.rank] ?? "text-text-secondary"}`}>
                    #{player.rank}
                  </span>
                  <span className="mt-1 font-semibold text-white">{player.displayName}</span>
                  <span className="mt-1 font-mono text-sm text-neon-purple">
                    {player.xp.toLocaleString("en-US")} XP
                  </span>
                  <div className="mt-3 flex gap-4 text-xs text-text-dim">
                    <span>{player.poolsCreated} pools</span>
                    <span>{player.totalPledged.toFixed(1)} SOL</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className={`overflow-hidden rounded-xl border border-white/5 ${
          initialized && leaderboard.length >= 3 ? "mt-6" : "mt-8"
        }`}>
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_80px] gap-2 bg-bg-secondary px-4 py-3 text-xs uppercase tracking-wide text-text-dim sm:grid-cols-[50px_1fr_100px_80px] md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="hidden text-right sm:block">Pools</span>
            <span className="hidden text-right md:block">Pledged</span>
          </div>

          {!initialized ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr_80px] gap-2 px-4 py-4 sm:grid-cols-[50px_1fr_100px_80px] md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-5 w-6 rounded bg-bg-tertiary animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-5 w-28 rounded bg-bg-tertiary animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                <div className="h-5 w-16 rounded bg-bg-tertiary animate-pulse ml-auto" style={{ animationDelay: `${i * 100 + 100}ms` }} />
              </div>
            ))
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-neon-purple/10">
                <svg className="h-8 w-8 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-text-secondary">No players yet.</p>
              <p className="mt-1 text-sm text-text-dim">Connect your wallet and create a pool to get started!</p>
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
                  className={`grid grid-cols-[40px_1fr_80px] items-center gap-2 px-4 py-4 transition-colors hover:bg-bg-tertiary/50 sm:grid-cols-[50px_1fr_100px_80px] md:grid-cols-[60px_1fr_120px_100px_120px] md:px-6 ${
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                        gradients[i % gradients.length]
                      } text-xs font-bold text-white md:h-10 md:w-10 md:text-sm`}
                    >
                      {initials || "?"}
                    </div>
                    <span className="truncate font-semibold text-white">
                      {player.displayName}
                    </span>
                  </div>
                  <span className="text-right font-mono text-sm text-neon-purple">
                    {player.xp.toLocaleString("en-US")}
                  </span>
                  <span className="hidden text-right font-mono text-sm text-neon-green sm:block">
                    {player.poolsCreated}
                  </span>
                  <span className="hidden text-right font-mono text-sm text-neon-cyan md:block">
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
