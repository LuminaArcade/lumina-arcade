"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { WalletIcon } from "./icons";
import Link from "next/link";

export default function UserProfileDropdown({ className = "" }: { className?: string }) {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (connecting) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 rounded-lg bg-neon-purple/50 px-5 py-2.5 text-sm font-semibold text-white ${className}`}
      >
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Connecting...
      </button>
    );
  }

  if (publicKey && user) {
    const addr = publicKey.toBase58();
    const short = addr.slice(0, 4) + "..." + addr.slice(-4);

    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 rounded-lg border border-neon-purple/40 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-neon-purple/10 hover:border-neon-purple/60"
        >
          {/* Avatar */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan text-[10px] font-bold text-white">
            {short.slice(0, 2)}
          </div>
          <span className="font-mono text-xs text-text-secondary">{short}</span>
          {/* XP Badge */}
          <span className="rounded-full bg-neon-purple/20 px-2 py-0.5 font-mono text-[10px] font-bold text-neon-purple">
            {user.xp.toLocaleString("en-US")} XP
          </span>
          {/* Chevron */}
          <svg
            className={`h-3.5 w-3.5 text-text-dim transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-white/10 bg-bg-secondary/95 backdrop-blur-xl shadow-2xl shadow-black/50 animate-[fadeInUp_0.15s_ease-out]">
            {/* User info */}
            <div className="border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan text-sm font-bold text-white">
                  {short.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{user.displayName}</p>
                  <p className="font-mono text-xs text-text-dim">{short}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1 border-b border-white/5 px-4 py-3">
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-neon-purple">{user.xp.toLocaleString("en-US")}</p>
                <p className="text-[10px] text-text-dim">XP</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-neon-cyan">{user.poolsCreated.length}</p>
                <p className="text-[10px] text-text-dim">Pools</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-sm font-bold text-neon-green">{user.poolsPledged.length}</p>
                <p className="text-[10px] text-text-dim">Pledges</p>
              </div>
            </div>

            {/* Links */}
            <div className="py-1">
              <Link
                href="/characters"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Characters ({user.creaturesUnlocked.length})
              </Link>
              <Link
                href="/characters"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Refer & Earn
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 21h8m-4-4v4M6 4h12l-1 7H7L6 4Zm1 7 1 5h8l1-5" />
                </svg>
                Leaderboard
              </Link>
              <Link
                href="/trade"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
                </svg>
                Trade
              </Link>
            </div>

            {/* Disconnect */}
            <div className="border-t border-white/5 py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  disconnect();
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neon-pink transition-colors hover:bg-neon-pink/5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected
  return (
    <button
      onClick={() => setVisible(true)}
      className={`flex items-center gap-2 rounded-lg bg-neon-purple px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] ${className}`}
    >
      <WalletIcon className="h-4 w-4" />
      Connect Wallet
    </button>
  );
}
