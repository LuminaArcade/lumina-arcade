"use client";

import { useReferral } from "@/lib/hooks/useReferral";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import ShareButton from "./ShareButton";

export default function ReferralStats() {
  const { isConnected, user } = useCurrentUser();
  const { referralStats } = useReferral();

  if (!isConnected || !user) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Referral Program</h3>
          <p className="mt-0.5 text-sm text-text-secondary">
            Invite friends and earn bonus XP together
          </p>
        </div>
        <ShareButton />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-bg-tertiary/50 p-4 text-center">
          <p className="font-mono text-2xl font-bold text-neon-cyan">
            {referralStats.referralCount}
          </p>
          <p className="mt-1 text-xs text-text-dim">Friends Referred</p>
        </div>
        <div className="rounded-lg bg-bg-tertiary/50 p-4 text-center">
          <p className="font-mono text-2xl font-bold text-neon-purple">
            {referralStats.referralXpEarned.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-text-dim">Referral XP</p>
        </div>
        <div className="rounded-lg bg-bg-tertiary/50 p-4 text-center">
          <p className="font-mono text-2xl font-bold text-neon-green">
            {user.xp.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-text-dim">Total XP</p>
        </div>
      </div>

      {referralStats.referredBy && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-neon-green/5 border border-neon-green/20 px-3 py-2">
          <svg className="h-4 w-4 text-neon-green flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <p className="text-xs text-text-secondary">
            Referred by <span className="font-mono text-neon-green">{referralStats.referredBy.slice(0, 4)}...{referralStats.referredBy.slice(-4)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
