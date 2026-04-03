"use client";

import { useCharacters } from "@/lib/hooks/useCharacters";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useAiCharacters } from "@/lib/hooks/useAiCharacters";
import { useToast } from "@/app/components/Toast";
import {
  CreatureCommon1,
  CreatureCommon2,
  CreatureRare1,
  CreatureRare2,
  CreatureEpic,
  CreatureLegendary,
} from "@/app/components/creatures";
import type { ComponentType } from "react";
import type { AiCharacter } from "@/lib/types";

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
    border: "border-neon-green/40 shadow-[0_0_20px_rgba(74,222,128,0.15)]",
    glow: "",
  },
  Rare: {
    badge: "bg-neon-cyan/20 text-neon-cyan",
    border: "border-neon-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    glow: "",
  },
  Epic: {
    badge: "bg-neon-purple/20 text-neon-purple",
    border: "border-neon-purple/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    glow: "",
  },
  Legendary: {
    badge: "bg-neon-gold/20 text-neon-gold",
    border: "border-neon-gold/40 shadow-[0_0_25px_rgba(251,191,36,0.2)]",
    glow: "",
  },
};

const aiRarityColors: Record<string, { badge: string; border: string }> = {
  common: {
    badge: "bg-neon-green/20 text-neon-green",
    border: "border-neon-green/40 shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  },
  rare: {
    badge: "bg-neon-cyan/20 text-neon-cyan",
    border: "border-neon-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  },
  epic: {
    badge: "bg-neon-purple/20 text-neon-purple",
    border: "border-neon-purple/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
  legendary: {
    badge: "bg-neon-gold/20 text-neon-gold",
    border: "border-neon-gold/40 shadow-[0_0_25px_rgba(251,191,36,0.2)]",
  },
};

function AiCharacterCard({ character }: { character: AiCharacter }) {
  const colors = aiRarityColors[character.rarity];
  return (
    <div className={`glass-card relative overflow-hidden p-6 ${colors.border}`}>
      <span
        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase ${colors.badge}`}
      >
        {character.rarity}
      </span>
      <div className="absolute left-4 top-4">
        <span className="rounded-full bg-neon-purple/20 px-2 py-0.5 text-xs font-semibold text-neon-purple">
          AI Generated
        </span>
      </div>

      {/* Character icon based on element */}
      <div className="mx-auto mt-4 flex h-32 w-32 items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 animate-float">
          <span className="text-4xl">
            {character.traits.element === "Fire" ? "🔥" :
             character.traits.element === "Ice" ? "❄️" :
             character.traits.element === "Lightning" ? "⚡" :
             character.traits.element === "Void" ? "🌀" : "💜"}
          </span>
        </div>
      </div>

      <h3 className="mt-4 text-center text-xl font-bold text-white">
        {character.name}
      </h3>
      <div className="mt-1 flex justify-center gap-2">
        <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-text-secondary">
          {character.traits.element}
        </span>
        <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-text-secondary">
          {character.traits.class}
        </span>
        <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-text-secondary">
          {character.traits.weapon}
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-text-secondary">
        {character.description}
      </p>
      <p className="mt-1 text-center text-xs text-text-dim italic">
        {character.backstory}
      </p>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
          <p className="text-xs text-text-dim">PWR</p>
          <p className="font-mono text-sm font-bold text-neon-pink">
            {character.traits.power}
          </p>
        </div>
        <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
          <p className="text-xs text-text-dim">SPD</p>
          <p className="font-mono text-sm font-bold text-neon-cyan">
            {character.traits.speed}
          </p>
        </div>
        <div className="rounded-lg bg-bg-tertiary/50 px-3 py-2 text-center">
          <p className="text-xs text-text-dim">LCK</p>
          <p className="font-mono text-sm font-bold text-neon-green">
            {character.traits.luck}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CharactersPage() {
  const { characters, isConnected } = useCharacters();
  const { user } = useCurrentUser();
  const { myCharacters, generateCharacter, generating, error } = useAiCharacters();
  const { addToast } = useToast();

  const unlockedCount = characters.filter((c) => c.unlocked).length;

  async function handleGenerate() {
    const char = await generateCharacter();
    if (char) {
      addToast(
        `Generated ${char.rarity} character: ${char.name}!`,
        "success"
      );
    } else if (error) {
      addToast(error, "error");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Characters
            </h1>
            <p className="mt-1 text-text-secondary">
              Collect creatures by earning XP or generate unique AI characters
            </p>
          </div>
          {isConnected && user && (
            <div className="glass-card px-4 py-2 text-sm">
              <span className="text-text-secondary">Your XP: </span>
              <span className="font-mono font-bold text-neon-purple">
                {user.xp.toLocaleString("en-US")}
              </span>
              <span className="ml-3 text-text-secondary">Collected: </span>
              <span className="font-mono font-bold text-neon-green">
                {unlockedCount}/{characters.length}
              </span>
            </div>
          )}
        </div>

        {!isConnected && (
          <div className="mt-6 glass-card p-4 text-center text-sm text-text-secondary">
            Connect your wallet to see your collection progress and unlock status.
          </div>
        )}

        {/* AI Character Generation Section */}
        {isConnected && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  AI-Generated Characters
                </h2>
                <p className="mt-0.5 text-sm text-text-secondary">
                  Unique characters generated by AI based on your wallet
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                  generating
                    ? "bg-bg-tertiary text-text-dim cursor-wait"
                    : "bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                }`}
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Character"
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-neon-pink/30 bg-neon-pink/10 px-4 py-2 text-sm text-neon-pink">
                {error}
              </div>
            )}

            {myCharacters.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myCharacters.map((char) => (
                  <AiCharacterCard key={char.id} character={char} />
                ))}
              </div>
            ) : (
              <div className="mt-4 glass-card p-8 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
                  <svg className="h-8 w-8 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <p className="text-text-secondary">
                  No AI characters yet. Click &quot;Generate Character&quot; to create your first unique character!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Collection Creatures */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white">XP Collection</h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Unlock creatures by earning XP through pool activity
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((creature) => {
            const colors = rarityColors[creature.rarity];
            const Component = componentMap[creature.componentKey];
            const locked = isConnected && !creature.unlocked;

            return (
              <div
                key={creature.id}
                className={`glass-card relative overflow-hidden p-6 text-center transition-all ${
                  creature.unlocked && isConnected ? colors.border : ""
                }`}
              >
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase ${colors.badge}`}
                >
                  {creature.rarity}
                </span>

                <div className={`mx-auto h-40 w-40 ${locked ? "opacity-25 grayscale" : ""}`}>
                  {Component && (
                    <Component className="h-full w-full animate-float" />
                  )}
                </div>

                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-lg bg-bg-primary/80 px-5 py-3 text-center backdrop-blur-sm">
                      <svg
                        className="mx-auto mb-1 h-6 w-6 text-text-secondary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <p className="text-sm font-semibold text-text-secondary">
                        {creature.xpNeeded.toLocaleString("en-US")} XP needed
                      </p>
                      <p className="mt-0.5 text-xs text-text-dim">
                        Unlocks at {creature.xpThreshold.toLocaleString("en-US")} XP
                      </p>
                    </div>
                  </div>
                )}

                {creature.unlocked && isConnected && (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-neon-green/20 px-2 py-0.5 text-xs font-semibold text-neon-green">
                      Collected
                    </span>
                  </div>
                )}

                <h3 className="mt-4 text-xl font-bold text-white">
                  {creature.name}
                </h3>
                <span className="mt-1 inline-block rounded border border-white/10 px-2 py-0.5 text-xs text-text-secondary">
                  {creature.element}
                </span>
                <p className="mt-2 text-sm text-text-secondary">
                  {creature.description}
                </p>
                <p className="mt-2 text-xs text-text-dim">
                  Requires {creature.xpThreshold.toLocaleString("en-US")} XP
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
