"use client";

import { useState } from "react";
import Link from "next/link";
import { CreatureCommon1, CreatureRare1, CreatureLegendary } from "./creatures";
import CreatePoolModal from "./CreatePoolModal";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 37) % 90)}%`,
  top: `${10 + ((i * 53) % 75)}%`,
  size: 2 + (i % 4),
  duration: 4 + (i % 5),
  delay: (i % 7) * 0.8,
  color: ["#a855f7", "#22d3ee", "#ec4899", "#4ade80"][i % 4],
}));

export default function HeroSection() {
  const [showCreatePool, setShowCreatePool] = useState(false);

  return (
    <section className="scan-line-overlay relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 grid-bg" />

      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-neon-purple/20 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-neon-cyan/15 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-neon-pink/10 blur-[100px]" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.4,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="hidden md:block absolute left-[5%] top-[30%] animate-float z-[5]" style={{ animationDuration: "6s" }}>
        <CreatureCommon1 className="w-32 h-32 opacity-80" />
      </div>
      <div className="hidden md:block absolute right-[8%] top-[15%] animate-float z-[5]" style={{ animationDuration: "7s", animationDelay: "-2s" }}>
        <CreatureRare1 className="w-28 h-28 opacity-70" />
      </div>
      <div className="hidden lg:block absolute right-[12%] bottom-[20%] animate-float z-[5]" style={{ animationDuration: "5s", animationDelay: "-4s" }}>
        <CreatureLegendary className="w-36 h-36 opacity-75" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
          Built on Bags.fm
        </p>
        <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
          <span className="gradient-text animate-text-glow">
            Pool. Launch. Dominate.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
          Create community token pools, launch tokens, and earn XP in the ultimate SocialFi arcade.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => setShowCreatePool(true)}
            className="rounded-lg bg-neon-purple px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-neon-purple/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            Launch Pool
          </button>
          <Link
            href="/pools"
            className="rounded-lg border border-neon-cyan px-8 py-3.5 text-lg font-semibold text-neon-cyan transition-all hover:bg-neon-cyan/10"
          >
            Explore Pools
          </Link>
        </div>
      </div>

      <CreatePoolModal
        isOpen={showCreatePool}
        onClose={() => setShowCreatePool(false)}
      />
    </section>
  );
}
