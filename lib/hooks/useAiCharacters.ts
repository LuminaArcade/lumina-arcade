"use client";

import { useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { useCurrentUser } from "./useCurrentUser";
import type { AiCharacter } from "../types";

export function useAiCharacters() {
  const { state, dispatch, syncToDb } = useAppContext();
  const { wallet } = useCurrentUser();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myCharacters = wallet
    ? state.aiCharacters.filter((c) => c.wallet === wallet)
    : [];

  const allCharacters = state.aiCharacters;

  const generateCharacter = useCallback(async (): Promise<AiCharacter | null> => {
    if (!wallet) {
      setError("Connect your wallet first");
      return null;
    }

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/characters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const { character } = await res.json();

      const action = { type: "ADD_AI_CHARACTER" as const, character };
      dispatch(action);
      syncToDb(action);

      return character;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      return null;
    } finally {
      setGenerating(false);
    }
  }, [wallet, dispatch, syncToDb]);

  return {
    myCharacters,
    allCharacters,
    generateCharacter,
    generating,
    error,
  };
}
