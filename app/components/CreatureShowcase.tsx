"use client";

import Link from "next/link";
import {
  CreatureCommon1,
  CreatureCommon2,
  CreatureRare1,
  CreatureRare2,
  CreatureEpic,
  CreatureLegendary,
} from "./creatures";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { ArrowRight } from "./icons";
import type { ComponentType } from "react";

const componentMap: Record<string, ComponentType<{ className?: string }>> = {
  CreatureCommon1,
  CreatureCommon2,
  CreatureRare1,
  CreatureRare2,
  CreatureEpic,
  CreatureLegendary,
};

const rarityColors: Record<string, { badge: string; border: string; glow: string }> = {
  Common: {
    badge: "bg-neon-green/20 text-neon-green",
    border: "group-hover:border-neon-green/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  },
  Rare: {
    badge: "bg-neon-cyan/20 text-neon-cyan",
    border: "group-hover:border-neon-cyan/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  },
  Epic: {
    badge: "bg-neon-purple/20 text-neon-purple",
    border: "group-hover:border-neon-purple/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
  Legendary: {
    badge: "bg-neon-gold/20 text-neon-gold",
    border: "group-hover:border-neon-gold/40",
    glow: "group-hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]",
  },
};

export default function CreatureShowcase() {
  const { characters, isConnected } = useCharacters();

  return (
    <section id="characters" className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Collect. Battle. Evolve.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
          AI-generated characters with unique abilities and rarity tiers
        </p>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-cyan neon-glow-cyan" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((creature) => {
          const colors = rarityColors[creature.rarity];
          const Component = componentMap[creature.componentKey];
          const locked = isConnected && !creature.unlocked;

          return (
            <div
              key={creature.id}
              className={`glass-card group relative overflow-hidden p-6 text-center transition-all ${colors.border} ${colors.glow}`}
            >
              <span
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase ${colors.badge}`}
              >
                {creature.rarity}
              </span>

              <div className={`mx-auto h-36 w-36 ${locked ? "opacity-30 grayscale" : ""}`}>
                {Component && <Component className="h-full w-full animate-float" />}
              </div>

              {locked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-lg bg-bg-primary/80 px-4 py-2 text-sm font-semibold text-text-secondary backdrop-blur-sm">
                    <svg className="mx-auto mb-1 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {creature.xpNeeded.toLocaleString("en-US")} XP needed
                  </div>
                </div>
              )}

              <h3 className="mt-4 text-xl font-bold text-white">{creature.name}</h3>
              <span className="mt-1 inline-block rounded border border-white/10 px-2 py-0.5 text-xs text-text-secondary">
                {creature.element}
              </span>
              <p className="mt-2 text-sm text-text-secondary">{creature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/characters"
          className="inline-flex items-center gap-1 font-semibold text-neon-cyan transition-colors hover:text-neon-cyan/80"
        >
          View Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
