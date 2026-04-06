"use client";

import { useMemo, useState } from "react";

/**
 * Bags.fm fee model:
 * - 1% fee on every trade
 * - Creator gets a share of that 1% (configurable, default ~50% = 0.5% of volume)
 * - Fees are perpetual — creators earn forever
 *
 * We estimate monthly volume as a % of market cap (typical 30-100% for active tokens)
 */

const CREATOR_FEE_RATE = 0.005; // 0.5% of volume goes to creator
const MONTHLY_VOLUME_RATIO = 0.5; // assume 50% of mcap trades monthly (conservative)

const MARKET_CAP_TIERS = [
  { label: "10K", value: 10_000 },
  { label: "50K", value: 50_000 },
  { label: "100K", value: 100_000 },
  { label: "500K", value: 500_000 },
  { label: "1M", value: 1_000_000 },
];

interface EarningsProjectionProps {
  /** SOL raised / target to contextualize */
  targetSol?: number;
  /** Compact mode for the create modal */
  compact?: boolean;
}

function formatUsd(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

function formatSol(amount: number): string {
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  if (amount >= 1) return amount.toFixed(1);
  return amount.toFixed(3);
}

const SOL_PRICE = 150; // approximate SOL price in USD

export default function EarningsProjection({
  targetSol,
  compact = false,
}: EarningsProjectionProps) {
  const [selectedTier, setSelectedTier] = useState(2); // default 100K

  const projections = useMemo(() => {
    return MARKET_CAP_TIERS.map((tier) => {
      const monthlyVolume = tier.value * MONTHLY_VOLUME_RATIO;
      const monthlyEarningsUsd = monthlyVolume * CREATOR_FEE_RATE;
      const monthlyEarningsSol = monthlyEarningsUsd / SOL_PRICE;
      const yearlyEarningsUsd = monthlyEarningsUsd * 12;

      return {
        ...tier,
        monthlyVolume,
        monthlyEarningsUsd,
        monthlyEarningsSol,
        yearlyEarningsUsd,
      };
    });
  }, []);

  const selected = projections[selectedTier];

  if (compact) {
    return (
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">💰</span>
          <span className="text-xs font-semibold text-neon-green">
            Creator Earnings Projection
          </span>
        </div>

        {/* Tier selector */}
        <div className="flex gap-1 mb-2">
          {projections.map((tier, i) => (
            <button
              key={tier.label}
              type="button"
              onClick={() => setSelectedTier(i)}
              className={`flex-1 rounded px-1.5 py-1 text-[10px] font-mono font-medium transition-all ${
                selectedTier === i
                  ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  : "text-text-dim hover:text-text-secondary border border-transparent"
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed">
          If your token reaches{" "}
          <span className="font-mono font-semibold text-white">
            {formatUsd(selected.value)}
          </span>{" "}
          market cap, you&apos;d earn ~
          <span className="font-mono font-bold text-neon-green">
            {formatSol(selected.monthlyEarningsSol)} SOL
          </span>
          <span className="text-text-dim">
            {" "}
            ({formatUsd(selected.monthlyEarningsUsd)})
          </span>
          /month from trading fees — <span className="text-neon-green/80 font-medium">forever</span>.
        </p>
      </div>
    );
  }

  // Full-size version for pool detail page
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💰</span>
        <h2 className="text-lg font-bold text-white">
          Creator Earnings Projection
        </h2>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Token creators earn{" "}
        <span className="text-neon-green font-semibold">0.5% of all trading volume</span>{" "}
        through Bags.fm&apos;s perpetual fee-sharing model.
        {targetSol && (
          <>
            {" "}This pool targets{" "}
            <span className="font-mono font-semibold text-neon-cyan">
              {targetSol} SOL
            </span>{" "}
            to launch.
          </>
        )}
      </p>

      {/* Tier selector */}
      <div className="flex gap-2 mb-5">
        {projections.map((tier, i) => (
          <button
            key={tier.label}
            type="button"
            onClick={() => setSelectedTier(i)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-mono font-semibold transition-all ${
              selectedTier === i
                ? "bg-neon-green/20 text-neon-green border border-neon-green/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                : "border border-white/10 text-text-secondary hover:border-white/20 hover:text-white"
            }`}
          >
            ${tier.label}
          </button>
        ))}
      </div>

      {/* Earnings display */}
      <div className="rounded-lg border border-neon-green/20 bg-neon-green/5 p-4">
        <div className="text-center mb-3">
          <p className="text-xs text-text-dim uppercase tracking-wider mb-1">
            At {formatUsd(selected.value)} Market Cap
          </p>
          <p className="text-3xl font-bold font-mono text-neon-green">
            {formatSol(selected.monthlyEarningsSol)} SOL
            <span className="text-base text-neon-green/60 font-normal">/mo</span>
          </p>
          <p className="text-sm text-text-secondary mt-0.5">
            ≈ {formatUsd(selected.monthlyEarningsUsd)}/month
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-neon-green/10 pt-3">
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-white">
              {formatUsd(selected.monthlyVolume)}
            </p>
            <p className="text-[10px] text-text-dim">Monthly Volume</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-neon-green">
              {formatUsd(selected.yearlyEarningsUsd)}
            </p>
            <p className="text-[10px] text-text-dim">Yearly Earnings</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-sm font-bold text-neon-cyan">
              Forever
            </p>
            <p className="text-[10px] text-text-dim">Duration</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-text-dim mt-3 leading-relaxed">
        * Estimates based on 0.5% creator fee share and 50% monthly volume-to-mcap ratio.
        Actual earnings vary based on trading activity. Powered by Bags.fm fee-sharing.
      </p>
    </div>
  );
}
