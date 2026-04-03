"use client";

import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import type { AppStats } from "../types";

export function useStats(): AppStats & { initialized: boolean } {
  const { state } = useAppContext();

  const stats = useMemo<AppStats>(() => {
    return {
      activePools: state.pools.filter((p) => p.status === "active").length,
      tokensLaunched: state.pools.filter((p) => p.status === "launched").length,
      totalVolumeSol: state.pools.reduce((sum, p) => sum + p.raisedSol, 0),
      totalPlayers: Object.keys(state.users).length,
    };
  }, [state.pools, state.users]);

  return { ...stats, initialized: state.initialized };
}
