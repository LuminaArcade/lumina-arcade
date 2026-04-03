"use client";

import { useMemo } from "react";
import { CREATURES } from "../constants";
import { useCurrentUser } from "./useCurrentUser";
import type { Creature } from "../types";

export interface CharacterWithStatus extends Creature {
  unlocked: boolean;
  xpNeeded: number;
}

export function useCharacters() {
  const { user, isConnected } = useCurrentUser();

  const characters = useMemo<CharacterWithStatus[]>(() => {
    const userXp = user?.xp ?? 0;

    return CREATURES.map((creature) => ({
      ...creature,
      unlocked: isConnected
        ? (user?.creaturesUnlocked ?? []).includes(creature.id)
        : false,
      xpNeeded: Math.max(0, creature.xpThreshold - userXp),
    }));
  }, [user, isConnected]);

  return { characters, isConnected };
}
