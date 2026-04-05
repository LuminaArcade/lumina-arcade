"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useBags } from "@/lib/hooks/useBags";
import { useToast } from "@/app/components/Toast";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const WRAPPED_SOL = "So11111111111111111111111111111111111111112";

export default function TradePage() {
  const { wallet, isConnected } = useCurrentUser();
  const { getQuote, swap, trading, error, clearError } = useBags();
  const { addToast } = useToast();

  const [inputMint, setInputMint] = useState(WRAPPED_SOL);
  const [outputMint, setOutputMint] = useState("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Fetch quote when inputs change
  useEffect(() => {
    if (!outputMint || !amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoadingQuote(true);
      try {
        const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
        const q = await getQuote(inputMint, outputMint, lamports);
        setQuote(q);
      } catch {
        setQuote(null);
      }
      setLoadingQuote(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputMint, outputMint, amount, getQuote]);

  async function handleSwap() {
    if (!quote) return;
    clearError();
    const result = await swap(quote);
    if (result) {
      addToast("Swap successful!", "success");
      setAmount("");
      setQuote(null);
    } else if (error) {
      addToast(error, "error");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Trade</h1>
        <p className="mt-1 text-text-secondary">
          Swap tokens launched on Bags.fm
        </p>

        <div className="mt-8 glass-card p-6">
          {!isConnected ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-purple/10">
                <svg className="h-8 w-8 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <p className="text-text-secondary">Connect your wallet to start trading</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* From */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-dim">
                  You pay
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.01"
                    className="flex-1 rounded-lg border border-white/10 bg-bg-tertiary px-4 py-3 font-mono text-lg text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50"
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-bg-tertiary px-4">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan" />
                    <span className="font-mono text-sm font-semibold text-white">SOL</span>
                  </div>
                </div>
              </div>

              {/* Swap direction arrow */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const tmp = inputMint;
                    setInputMint(outputMint || WRAPPED_SOL);
                    setOutputMint(tmp === WRAPPED_SOL ? "" : tmp);
                    setQuote(null);
                  }}
                  className="rounded-full border border-white/10 bg-bg-tertiary p-2.5 text-text-secondary transition-all hover:border-neon-purple/30 hover:bg-neon-purple/10 hover:text-neon-purple"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
                  </svg>
                </button>
              </div>

              {/* To */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-dim">
                  You receive
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg border border-white/10 bg-bg-tertiary px-4 py-3">
                    {loadingQuote ? (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-neon-purple" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="font-mono text-sm text-text-dim">Fetching quote...</span>
                      </div>
                    ) : quote ? (
                      <span className="font-mono text-lg text-white">
                        {(parseInt(quote.outAmount) / Math.pow(10, quote.routePlan?.[0]?.outputMintDecimals || 9)).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                      </span>
                    ) : (
                      <span className="font-mono text-lg text-text-dim">0.0</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={outputMint}
                    onChange={(e) => setOutputMint(e.target.value.trim())}
                    placeholder="Token mint..."
                    className="w-40 rounded-lg border border-white/10 bg-bg-tertiary px-3 py-3 font-mono text-xs text-white placeholder-text-dim outline-none transition-colors focus:border-neon-purple/50"
                  />
                </div>
              </div>

              {/* Quote details */}
              {quote && (
                <div className="rounded-lg border border-white/5 bg-bg-primary/50 px-4 py-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-dim">Price Impact</span>
                    <span className={`font-mono ${parseFloat(quote.priceImpactPct) > 5 ? "text-neon-pink" : "text-text-secondary"}`}>
                      {parseFloat(quote.priceImpactPct).toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-text-dim">Min Received</span>
                    <span className="font-mono text-text-secondary">
                      {(parseInt(quote.minOutAmount) / Math.pow(10, quote.routePlan?.[0]?.outputMintDecimals || 9)).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-text-dim">Slippage</span>
                    <span className="font-mono text-text-secondary">{quote.slippageBps / 100}%</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-neon-pink/30 bg-neon-pink/10 px-4 py-2 text-sm text-neon-pink">
                  {error}
                </div>
              )}

              {/* Swap button */}
              <button
                onClick={handleSwap}
                disabled={!quote || trading}
                className={`w-full rounded-lg py-3.5 text-sm font-semibold transition-all ${
                  !quote || trading
                    ? "bg-bg-tertiary text-text-dim cursor-not-allowed"
                    : "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                }`}
              >
                {trading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Swapping...
                  </span>
                ) : !outputMint ? (
                  "Enter token address"
                ) : !quote ? (
                  "Enter amount"
                ) : (
                  "Swap"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 glass-card p-4">
          <h3 className="text-sm font-semibold text-white">Powered by Bags.fm</h3>
          <p className="mt-1 text-xs text-text-dim">
            Trade any token launched on Bags.fm. Paste the token mint address to get started.
            Tokens launched through Lumina Arcade pools can be traded here once they go live.
          </p>
        </div>
      </div>
    </div>
  );
}
