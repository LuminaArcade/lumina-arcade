"use client";

import { useCallback, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { XP_REWARDS } from "../constants";
import type { Pool } from "../types";

export function usePools() {
  const { state, dispatch, syncToDb } = useAppContext();

  const createPool = useCallback(
    (
      pool: Pick<Pool, "name" | "ticker" | "description" | "creatorWallet" | "creatorName" | "targetSol" | "expiresAt">
    ) => {
      const newPool: Pool = {
        ...pool,
        id: crypto.randomUUID(),
        raisedSol: 0,
        participants: [],
        pledges: [],
        status: "active",
        createdAt: Date.now(),
      };
      const addPoolAction = { type: "ADD_POOL" as const, pool: newPool };
      dispatch(addPoolAction);
      syncToDb(addPoolAction);

      const xpAction = {
        type: "ADD_XP" as const,
        wallet: pool.creatorWallet,
        amount: XP_REWARDS.CREATE_POOL,
      };
      dispatch(xpAction);
      syncToDb(xpAction);

      return newPool.id;
    },
    [dispatch, syncToDb]
  );

  const pledgeToPool = useCallback(
    (poolId: string, wallet: string, amount: number) => {
      const pledgeAction = { type: "PLEDGE_TO_POOL" as const, poolId, wallet, amount };
      dispatch(pledgeAction);
      syncToDb(pledgeAction);

      const xp = XP_REWARDS.PLEDGE + Math.floor(amount * XP_REWARDS.PLEDGE_PER_SOL);
      const xpAction = { type: "ADD_XP" as const, wallet, amount: xp };
      dispatch(xpAction);
      syncToDb(xpAction);

      // Check if pool just launched — give creator bonus
      const pool = state.pools.find((p) => p.id === poolId);
      if (pool && pool.raisedSol + amount >= pool.targetSol) {
        const bonusAction = {
          type: "ADD_XP" as const,
          wallet: pool.creatorWallet,
          amount: XP_REWARDS.POOL_LAUNCHED,
        };
        dispatch(bonusAction);
        syncToDb(bonusAction);
      }
    },
    [dispatch, syncToDb, state.pools]
  );

  const getPool = useCallback(
    (id: string) => state.pools.find((p) => p.id === id),
    [state.pools]
  );

  const activePools = state.pools.filter((p) => p.status === "active");

  const hotPools = [...state.pools]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.raisedSol / b.targetSol - a.raisedSol / a.targetSol)
    .slice(0, 6);

  // Trending pools: ranked by recent pledge momentum (last 24h activity)
  const trendingPools = [...state.pools]
    .filter((p) => p.status === "active")
    .map((pool) => {
      const oneDayAgo = Date.now() - 86_400_000;
      const recentPledges = pool.pledges.filter((p) => p.timestamp > oneDayAgo);
      const recentVolume = recentPledges.reduce((sum, p) => sum + p.amount, 0);
      const recentCount = recentPledges.length;
      // Momentum score: weighted combination of recent volume + pledge count + recency
      const momentum = recentVolume * 2 + recentCount * 5;
      return { pool, momentum, recentVolume, recentCount };
    })
    .filter((t) => t.momentum > 0)
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 6);

  // Check for expired pools
  useEffect(() => {
    if (!state.initialized) return;

    const checkExpired = () => {
      const now = Date.now();
      state.pools.forEach((pool) => {
        if (pool.status === "active" && pool.expiresAt <= now) {
          // Mark as expired locally (fire and forget DB sync)
          dispatch({ type: "EXPIRE_POOL" as any, poolId: pool.id });
        }
      });
    };

    checkExpired();
    const interval = setInterval(checkExpired, 60000); // check every minute
    return () => clearInterval(interval);
  }, [state.initialized, state.pools, dispatch]);

  return {
    pools: state.pools,
    activePools,
    hotPools,
    trendingPools,
    createPool,
    pledgeToPool,
    getPool,
    initialized: state.initialized,
  };
}
