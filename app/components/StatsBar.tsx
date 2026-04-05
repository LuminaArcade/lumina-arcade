"use client";

import { useStats } from "@/lib/hooks/useStats";
import CountUpNumber from "./CountUpNumber";

export default function StatsBar() {
  const { activePools, tokensLaunched, totalVolumeSol, totalPlayers, initialized } = useStats();

  const stats = [
    {
      value: activePools,
      label: "Active Pools",
      prefix: "",
      suffix: "",
      decimals: 0,
      icon: (
        <svg className="h-6 w-6 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v12" /><path d="M6 12h12" />
        </svg>
      ),
    },
    {
      value: tokensLaunched,
      label: "Tokens Launched",
      prefix: "",
      suffix: "",
      decimals: 0,
      icon: (
        <svg className="h-6 w-6 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
      ),
    },
    {
      value: totalVolumeSol,
      label: "Total Volume (SOL)",
      prefix: "",
      suffix: " SOL",
      decimals: 1,
      icon: (
        <svg className="h-6 w-6 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      value: totalPlayers,
      label: "Players",
      prefix: "",
      suffix: "",
      decimals: 0,
      icon: (
        <svg className="h-6 w-6 text-neon-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <section className="border-y border-white/5 bg-bg-secondary/50 py-8 md:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center ${
              i < 3 ? "md:border-r md:border-white/10" : ""
            }`}
          >
            <div className="mb-2 flex justify-center">{stat.icon}</div>
            <p className="font-mono text-2xl font-bold text-neon-cyan md:text-3xl">
              {initialized ? (
                <CountUpNumber
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  duration={1800}
                />
              ) : (
                "—"
              )}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-text-secondary md:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
