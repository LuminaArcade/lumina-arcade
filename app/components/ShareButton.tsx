"use client";

import { useState } from "react";
import { useReferral } from "@/lib/hooks/useReferral";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useToast } from "./Toast";

interface ShareButtonProps {
  path?: string;
  label?: string;
  poolName?: string;
  className?: string;
}

export default function ShareButton({
  path = "/",
  label = "Share & Earn XP",
  poolName,
  className = "",
}: ShareButtonProps) {
  const { getReferralLink } = useReferral();
  const { isConnected } = useCurrentUser();
  const { addToast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isConnected) return null;

  const link = getReferralLink(path);
  if (!link) return null;

  const shareText = poolName
    ? `Check out ${poolName} on Lumina Arcade! Pool, launch, and earn XP on Solana.`
    : "Join me on Lumina Arcade! The ultimate SocialFi arcade on Solana. Pool, launch, and earn XP.";

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link!);
      addToast("Referral link copied! Share it to earn bonus XP", "success");
      setShowDropdown(false);
    } catch {
      addToast("Failed to copy link", "error");
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-sm font-semibold text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:border-neon-cyan/50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {label}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-white/10 bg-bg-secondary/95 backdrop-blur-xl shadow-2xl shadow-black/50 animate-[fadeInUp_0.15s_ease-out]">
            {/* Referral info */}
            <div className="border-b border-white/5 px-4 py-3">
              <p className="text-xs font-semibold text-neon-cyan uppercase tracking-wider">Referral Rewards</p>
              <p className="mt-1 text-xs text-text-dim leading-relaxed">
                Share your link. When someone joins and pledges, you BOTH earn bonus XP!
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                <div className="rounded bg-bg-tertiary/50 px-2 py-1.5">
                  <p className="font-mono text-xs font-bold text-neon-purple">+100</p>
                  <p className="text-[9px] text-text-dim">Signup</p>
                </div>
                <div className="rounded bg-bg-tertiary/50 px-2 py-1.5">
                  <p className="font-mono text-xs font-bold text-neon-cyan">+25</p>
                  <p className="text-[9px] text-text-dim">Pledge</p>
                </div>
                <div className="rounded bg-bg-tertiary/50 px-2 py-1.5">
                  <p className="font-mono text-xs font-bold text-neon-green">+50</p>
                  <p className="text-[9px] text-text-dim">Create</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="py-1">
              <button
                onClick={copyLink}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy Referral Link
              </button>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowDropdown(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X / Twitter
              </a>
            </div>

            {/* Link preview */}
            <div className="border-t border-white/5 px-4 py-2.5">
              <p className="font-mono text-[10px] text-text-dim truncate">{link}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
