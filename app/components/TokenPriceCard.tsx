"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SOL_MINT = "So11111111111111111111111111111111111111112";

export default function TokenPriceCard({
  tokenMint,
  ticker,
}: {
  tokenMint: string;
  ticker: string;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/bags/trade?inputMint=${SOL_MINT}&outputMint=${tokenMint}&amount=1`
      );
      if (!res.ok) throw new Error("Quote failed");
      const data = await res.json();
      if (data.outAmount) {
        setPrice(1 / Number(data.outAmount));
        setError(false);
        setLastUpdated(new Date());
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [tokenMint]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Token Price</h3>
        <button
          onClick={() => {
            setLoading(true);
            fetchPrice();
          }}
          className="rounded-lg p-1.5 text-text-dim transition-colors hover:bg-white/5 hover:text-neon-cyan"
          title="Refresh price"
        >
          <svg
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            <path d="M21 3v9h-9" />
          </svg>
        </button>
      </div>

      {loading && price === null ? (
        <div className="space-y-3">
          <div className="h-8 w-40 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-4 w-24 animate-pulse rounded bg-bg-tertiary" />
        </div>
      ) : error && price === null ? (
        <p className="text-sm text-text-dim">Price unavailable</p>
      ) : (
        <>
          <div className="mb-1">
            <span className="text-sm text-text-secondary">${ticker}</span>
          </div>
          <p className="font-mono text-2xl font-bold tabular-nums text-neon-cyan">
            {price !== null
              ? price < 0.0001
                ? price.toExponential(2)
                : price.toFixed(6)
              : "--"}
            <span className="ml-2 text-sm font-normal text-text-secondary">
              SOL
            </span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
            <div>
              <p className="text-xs text-text-dim">24h Change</p>
              <p className="font-mono text-sm text-text-secondary">N/A</p>
            </div>
            <div>
              <p className="text-xs text-text-dim">Last Updated</p>
              <p className="font-mono text-sm text-text-secondary">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString()
                  : "--"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/trade?token=${tokenMint}`}
              className="flex-1 rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              Trade on Lumina Arcade
            </Link>
            <a
              href={`https://bags.fm/token/${tokenMint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-neon-purple/40 px-4 py-2.5 text-center text-sm font-semibold text-neon-purple transition-all hover:bg-neon-purple/10"
            >
              View on Bags.fm ↗
            </a>
          </div>
        </>
      )}
    </div>
  );
}
