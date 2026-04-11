"use client";

import { useAppContext } from "@/lib/context/AppContext";
import type { UserProfile, Pool } from "@/lib/types";

export function getReputationTier(score: number): { name: string; color: string } {
  if (score >= 81) return { name: "Legend", color: "text-neon-green" };
  if (score >= 61) return { name: "Veteran", color: "text-neon-cyan" };
  if (score >= 41) return { name: "Builder", color: "text-neon-purple" };
  if (score >= 21) return { name: "Explorer", color: "text-amber-400" };
  return { name: "Newcomer", color: "text-text-secondary" };
}

export function calculateReputationScore(
  user: UserProfile,
  pools: Pool[],
  characterCount: number
): number {
  let score = 0;

  // Account age: max 20 points (1 point per 15 days, caps at 300 days)
  const daysActive = Math.floor((Date.now() - user.joinedAt) / (1000 * 60 * 60 * 24));
  score += Math.min(20, Math.floor(daysActive / 15));

  // XP earned: max 20 points (1 point per 50 XP, caps at 1000 XP)
  score += Math.min(20, Math.floor(user.xp / 50));

  // Pools created: 10 points per pool, max 20
  score += Math.min(20, user.poolsCreated.length * 10);

  // Pools pledged to: 5 points per pledge, max 20
  score += Math.min(20, user.poolsPledged.length * 5);

  // Characters minted: 5 points per character, max 20
  score += Math.min(20, characterCount * 5);

  return Math.min(100, score);
}

function getScoreColor(score: number): string {
  if (score >= 81) return "#4ade80"; // green
  if (score >= 61) return "#22d3ee"; // cyan
  if (score >= 31) return "#fbbf24"; // amber
  return "#f87171"; // red
}

export default function WalletReputation({ wallet }: { wallet: string }) {
  const { state } = useAppContext();
  const user = state.users[wallet];

  if (!user) return null;

  const pools = state.pools;
  const characterCount = user.creaturesUnlocked.length;
  const score = calculateReputationScore(user, pools, characterCount);
  const tier = getReputationTier(score);
  const scoreColor = getScoreColor(score);

  // SVG circle progress
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Stats
  const daysActive = Math.max(1, Math.floor((Date.now() - user.joinedAt) / (1000 * 60 * 60 * 24)));
  const poolsCreatedCount = user.poolsCreated.length;
  const totalPledged = pools.reduce((sum, pool) => {
    return sum + pool.pledges
      .filter((p) => p.wallet === wallet)
      .reduce((s, p) => s + p.amount, 0);
  }, 0);

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="h-5 w-5 text-neon-cyan"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
        <h3 className="text-lg font-bold text-white">On-Chain Reputation</h3>
      </div>

      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        {/* Score ring */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-white/5"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              className="transition-all duration-700"
            />
          </svg>
          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold text-white">{score}</span>
            <span className="text-xs text-text-dim">/100</span>
          </div>
        </div>

        {/* Tier + stats */}
        <div className="flex-1 w-full">
          {/* Tier badge */}
          <div className="mb-4 text-center sm:text-left">
            <span
              className={`inline-block rounded-full border border-white/10 px-3 py-1 text-sm font-semibold ${tier.color}`}
            >
              {tier.name}
            </span>
          </div>

          {/* Stats grid 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
              <p className="font-mono text-sm font-bold text-neon-purple">
                {daysActive}
              </p>
              <p className="text-[10px] text-text-secondary">Days Active</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
              <p className="font-mono text-sm font-bold text-neon-cyan">
                {poolsCreatedCount}
              </p>
              <p className="text-[10px] text-text-secondary">Pools Created</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
              <p className="font-mono text-sm font-bold text-neon-green">
                {totalPledged.toFixed(1)} SOL
              </p>
              <p className="text-[10px] text-text-secondary">Total Pledged</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
              <p className="font-mono text-sm font-bold text-neon-pink">
                {characterCount}
              </p>
              <p className="text-[10px] text-text-secondary">Characters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
