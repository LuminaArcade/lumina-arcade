"use client";

import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import type { LeaderboardEntry } from "../types";

export function useLeaderboard(limit?: number) {
  const { state } = useAppContext();

  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    const entries = Object.values(state.users)
      .map((user) => {
        const totalPledged = state.pools.reduce((sum, pool) => {
          return (
            sum +
            pool.pledges
              .filter((p) => p.wallet === user.wallet)
              .reduce((s, p) => s + p.amount, 0)
          );
        }, 0);

        return {
          wallet: user.wallet,
          displayName: user.displayName,
          xp: user.xp,
          rank: 0,
          totalPledged,
          poolsCreated: user.poolsCreated.length,
        };
      })
      .sort((a, b) => b.xp - a.xp);

    // Assign ranks
    entries.forEach((e, i) => {
      e.rank = i + 1;
    });

    return limit ? entries.slice(0, limit) : entries;
  }, [state.users, state.pools, limit]);

  return { leaderboard, initialized: state.initialized };
}
