"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

const STORAGE_KEY_PREFIX = "lumina_premium_";

export function useTokenGate() {
  const { wallet, isConnected } = useCurrentUser();
  const tokenMint = process.env.NEXT_PUBLIC_GATE_TOKEN_MINT ?? null;
  const gateConfigured = !!tokenMint;

  const [isPremium, setIsPremium] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isConnected || !wallet) {
      setIsPremium(false);
      setIsChecking(false);
      return;
    }

    // If no gate token is configured, everyone gets access
    if (!gateConfigured) {
      setIsPremium(true);
      setIsChecking(false);
      return;
    }

    // Simulate check: read from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + wallet);
      setIsPremium(stored === "true");
    } catch {
      setIsPremium(false);
    }
    setIsChecking(false);
  }, [wallet, isConnected, gateConfigured]);

  const simulatePurchase = useCallback(() => {
    if (!wallet) return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + wallet, "true");
      setIsPremium(true);
    } catch {
      // localStorage not available
    }
  }, [wallet]);

  return { isPremium, isChecking, tokenMint, simulatePurchase, gateConfigured };
}
