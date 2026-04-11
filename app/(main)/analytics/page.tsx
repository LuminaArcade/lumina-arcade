"use client";

import { useState, useEffect } from "react";

interface TopToken {
  tokenMint: string;
  name?: string;
  symbol?: string;
  totalFees: number;
  volume?: number;
}

interface Creator {
  wallet: string;
  totalEarnings: number;
  tokenCount: number;
}

interface AnalyticsState {
  topTokens: TopToken[];
  topTokensLoading: boolean;
  topTokensError: string | null;
  creators: Creator[];
  creatorsLoading: boolean;
  creatorsError: string | null;
  notConfigured: boolean;
}

const SAMPLE_TOKENS: TopToken[] = [
  { tokenMint: "SaMpLe1111111111111111111111111111111111111", name: "Lumina Gold", symbol: "LGLD", totalFees: 12.45, volume: 342.8 },
  { tokenMint: "SaMpLe2222222222222222222222222222222222222", name: "Arcade Coin", symbol: "ARC", totalFees: 8.92, volume: 215.3 },
  { tokenMint: "SaMpLe3333333333333333333333333333333333333", name: "Pixel Token", symbol: "PXL", totalFees: 5.67, volume: 148.1 },
  { tokenMint: "SaMpLe4444444444444444444444444444444444444", name: "Boss Drop", symbol: "BOSS", totalFees: 3.21, volume: 89.4 },
  { tokenMint: "SaMpLe5555555555555555555555555555555555555", name: "Neon Shard", symbol: "NEON", totalFees: 1.88, volume: 52.7 },
];

const SAMPLE_CREATORS: Creator[] = [
  { wallet: "Abc1defghijklmnopqrstuvwxyz1234567890ABCDEF", totalEarnings: 18.34, tokenCount: 4 },
  { wallet: "Xyz9876543210ABCDEFghijklmnopqrstuvwxyz1234", totalEarnings: 11.02, tokenCount: 3 },
  { wallet: "Qrs4567890abcdefGHIJKLMNOPQRSTUVWXYZ123456", totalEarnings: 6.45, tokenCount: 2 },
  { wallet: "Mno1234567890ABCDEFghijklmnopqrstuvwxyz5678", totalEarnings: 3.78, tokenCount: 1 },
];

function truncateWallet(wallet: string): string {
  if (wallet.length <= 10) return wallet;
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function SkeletonCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="glass-card animate-pulse p-6">
      <div className="h-6 w-40 rounded bg-bg-tertiary" />
      <div className="mt-2 h-4 w-56 rounded bg-bg-tertiary" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-bg-tertiary" />
            <div className="h-4 w-20 rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [state, setState] = useState<AnalyticsState>({
    topTokens: [],
    topTokensLoading: true,
    topTokensError: null,
    creators: [],
    creatorsLoading: true,
    creatorsError: null,
    notConfigured: false,
  });

  useEffect(() => {
    async function fetchTopTokens() {
      try {
        const res = await fetch("/api/bags/analytics?action=top-tokens");
        if (res.status === 503) {
          setState((s) => ({ ...s, topTokensLoading: false, notConfigured: true }));
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch top tokens");
        const data = await res.json();
        const tokens: TopToken[] = Array.isArray(data.tokens) ? data.tokens : [];
        setState((s) => ({ ...s, topTokens: tokens, topTokensLoading: false }));
      } catch (err: any) {
        setState((s) => ({
          ...s,
          topTokensLoading: false,
          topTokensError: err.message || "Failed to load",
        }));
      }
    }

    async function fetchCreators() {
      try {
        // The creators endpoint requires a tokenMint, so we fetch top tokens first
        // and aggregate creator data. For now, we handle the case where the endpoint
        // may return aggregate data or show sample data.
        const res = await fetch("/api/bags/analytics?action=top-tokens");
        if (res.status === 503) {
          setState((s) => ({ ...s, creatorsLoading: false, notConfigured: true }));
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch creator data");
        const data = await res.json();
        // If we get token data, we can derive creator info from it
        // For now, mark as loaded (will show sample data if empty)
        setState((s) => ({ ...s, creators: [], creatorsLoading: false }));
      } catch (err: any) {
        setState((s) => ({
          ...s,
          creatorsLoading: false,
          creatorsError: err.message || "Failed to load",
        }));
      }
    }

    fetchTopTokens();
    fetchCreators();
  }, []);

  const isLoading = state.topTokensLoading || state.creatorsLoading;

  const displayTokens = state.topTokens.length > 0 ? state.topTokens : SAMPLE_TOKENS;
  const displayCreators = state.creators.length > 0 ? state.creators : SAMPLE_CREATORS;
  const isSampleData = state.topTokens.length === 0 && !state.topTokensLoading;

  const totalFees = displayTokens.reduce((sum, t) => sum + (t.totalFees || 0), 0);
  const totalCreators = displayCreators.length;
  const avgFeePerToken = displayTokens.length > 0 ? totalFees / displayTokens.length : 0;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white md:text-4xl">
            <svg
              className="h-8 w-8 text-neon-cyan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
            Token Analytics
          </h1>
          <p className="mt-1 text-text-secondary">
            Real-time fee revenue and creator earnings powered by Bags.fm
          </p>
        </div>

        {/* Not Configured Banner */}
        {state.notConfigured && (
          <div className="mt-6 glass-card border-neon-cyan/30 p-4">
            <p className="text-sm text-neon-cyan">
              Analytics powered by Bags.fm — connect your API key to see live data
            </p>
          </div>
        )}

        {/* Sample Data Banner */}
        {isSampleData && !state.notConfigured && !state.topTokensError && (
          <div className="mt-6 glass-card border-neon-purple/30 p-4">
            <p className="text-sm text-neon-purple">
              Sample data — live data available when tokens are launched
            </p>
          </div>
        )}

        {/* Platform Fee Summary */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse p-6">
                <div className="h-4 w-24 rounded bg-bg-tertiary" />
                <div className="mt-3 h-8 w-32 rounded bg-bg-tertiary" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="glass-card p-6">
              <p className="text-sm font-medium text-text-secondary">Total Fees Generated</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-neon-green">
                {totalFees.toFixed(2)} SOL
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm font-medium text-text-secondary">Total Creators Earning</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-neon-cyan">
                {totalCreators}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm font-medium text-text-secondary">Avg Fee per Token</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-neon-purple">
                {avgFeePerToken.toFixed(2)} SOL
              </p>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Tokens by Fees */}
          {state.topTokensLoading ? (
            <SkeletonCard rows={5} />
          ) : state.topTokensError ? (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white">Top Tokens by Fees</h2>
              <p className="mt-4 text-sm text-red-400">{state.topTokensError}</p>
            </div>
          ) : (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white">Top Tokens by Fees</h2>
              <p className="mt-1 text-xs text-text-dim">Ranked by total fees earned</p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs text-text-dim">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Token</th>
                      <th className="pb-2 pr-4 text-right">Fees (SOL)</th>
                      <th className="pb-2 text-right">Volume (SOL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTokens.map((token, i) => (
                      <tr
                        key={token.tokenMint}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="py-3 pr-4 font-mono text-xs text-neon-purple tabular-nums">
                          {i + 1}
                        </td>
                        <td className="py-3 pr-4">
                          <a
                            href={`https://bags.fm/token/${token.tokenMint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2"
                          >
                            <span className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                              {token.name || truncateWallet(token.tokenMint)}
                            </span>
                            {token.symbol && (
                              <span className="text-xs text-text-dim">{token.symbol}</span>
                            )}
                            <svg
                              className="h-3 w-3 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                            </svg>
                          </a>
                        </td>
                        <td className="py-3 pr-4 text-right font-mono tabular-nums text-neon-green">
                          {(token.totalFees || 0).toFixed(2)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums text-neon-cyan">
                          {token.volume != null ? token.volume.toFixed(1) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Creator Leaderboard */}
          {state.creatorsLoading ? (
            <SkeletonCard rows={4} />
          ) : state.creatorsError ? (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white">Creator Leaderboard</h2>
              <p className="mt-4 text-sm text-red-400">{state.creatorsError}</p>
            </div>
          ) : (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white">Creator Leaderboard</h2>
              <p className="mt-1 text-xs text-text-dim">Top creators by total earnings</p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs text-text-dim">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Creator</th>
                      <th className="pb-2 pr-4 text-right">Earnings (SOL)</th>
                      <th className="pb-2 text-right">Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCreators.map((creator, i) => (
                      <tr
                        key={creator.wallet}
                        className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="py-3 pr-4 font-mono text-xs text-neon-purple tabular-nums">
                          {i + 1}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-mono text-xs text-text-secondary">
                            {truncateWallet(creator.wallet)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right font-mono tabular-nums text-neon-green">
                          {creator.totalEarnings.toFixed(2)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums text-neon-cyan">
                          {creator.tokenCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
