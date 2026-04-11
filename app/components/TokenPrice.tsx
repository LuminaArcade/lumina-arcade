"use client";

import { useState, useEffect, useCallback } from "react";

const SOL_MINT = "So11111111111111111111111111111111111111112";

export default function TokenPrice({
  tokenMint,
  ticker,
}: {
  tokenMint: string;
  ticker: string;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/bags/trade?inputMint=${SOL_MINT}&outputMint=${tokenMint}&amount=1`
      );
      if (!res.ok) throw new Error("Quote failed");
      const data = await res.json();
      // The quote returns how many tokens you get for 1 lamport of SOL
      // We want price in SOL per token, so we invert
      if (data.outAmount) {
        setPrice(1 / Number(data.outAmount));
        setError(false);
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

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
      </span>
    );
  }

  if (error || price === null) {
    return (
      <span className="text-xs text-text-dim">Price unavailable</span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className="text-text-secondary">${ticker}:</span>
      <span className="font-mono text-neon-cyan tabular-nums">
        {price < 0.0001 ? price.toExponential(2) : price.toFixed(6)}
      </span>
      <span className="text-text-dim">SOL</span>
      <button
        onClick={() => {
          setLoading(true);
          fetchPrice();
        }}
        className="ml-0.5 text-text-dim transition-colors hover:text-neon-cyan"
        title="Refresh price"
      >
        <svg
          className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <path d="M21 3v9h-9" />
        </svg>
      </button>
    </span>
  );
}
