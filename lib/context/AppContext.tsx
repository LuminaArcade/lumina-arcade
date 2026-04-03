"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { Pool, UserProfile, AiCharacter } from "../types";
import { CREATURES, STORAGE_KEYS } from "../constants";
import { loadFromStorage, saveToStorage } from "../storage";
import { generateSeedData } from "../seed";
import { isSupabaseConfigured } from "../supabase";
import {
  fetchPools,
  fetchUsers,
  insertPool,
  insertPledge,
  upsertUser,
  addXpToUser,
  fetchAiCharacters,
  insertAiCharacter,
} from "../supabase-data";

interface AppState {
  pools: Pool[];
  users: Record<string, UserProfile>;
  aiCharacters: AiCharacter[];
  initialized: boolean;
  useSupabase: boolean;
}

export type Action =
  | { type: "INIT"; pools: Pool[]; users: Record<string, UserProfile>; aiCharacters: AiCharacter[]; useSupabase: boolean }
  | { type: "ADD_POOL"; pool: Pool }
  | { type: "PLEDGE_TO_POOL"; poolId: string; wallet: string; amount: number }
  | { type: "UPSERT_USER"; user: UserProfile }
  | { type: "ADD_XP"; wallet: string; amount: number }
  | { type: "ADD_AI_CHARACTER"; character: AiCharacter };

function recalcCreatures(xp: number): string[] {
  return CREATURES.filter((c) => xp >= c.xpThreshold).map((c) => c.id);
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT":
      return {
        pools: action.pools,
        users: action.users,
        aiCharacters: action.aiCharacters,
        initialized: true,
        useSupabase: action.useSupabase,
      };

    case "ADD_POOL": {
      const user = state.users[action.pool.creatorWallet];
      const updatedUser = user
        ? { ...user, poolsCreated: [...user.poolsCreated, action.pool.id] }
        : undefined;
      return {
        ...state,
        pools: [...state.pools, action.pool],
        users: updatedUser
          ? { ...state.users, [updatedUser.wallet]: updatedUser }
          : state.users,
      };
    }

    case "PLEDGE_TO_POOL": {
      const { poolId, wallet, amount } = action;
      const pools = state.pools.map((p) => {
        if (p.id !== poolId) return p;
        const newRaised = p.raisedSol + amount;
        const newParticipants = p.participants.includes(wallet)
          ? p.participants
          : [...p.participants, wallet];
        const launched = newRaised >= p.targetSol;
        return {
          ...p,
          raisedSol: Math.min(newRaised, p.targetSol),
          participants: newParticipants,
          pledges: [...p.pledges, { wallet, amount, timestamp: Date.now() }],
          status: launched ? ("launched" as const) : p.status,
          launchedAt: launched && !p.launchedAt ? Date.now() : p.launchedAt,
        };
      });

      const user = state.users[wallet];
      const updatedUser = user
        ? {
            ...user,
            poolsPledged: user.poolsPledged.includes(poolId)
              ? user.poolsPledged
              : [...user.poolsPledged, poolId],
          }
        : undefined;

      return {
        ...state,
        pools,
        users: updatedUser
          ? { ...state.users, [wallet]: updatedUser }
          : state.users,
      };
    }

    case "UPSERT_USER":
      return {
        ...state,
        users: { ...state.users, [action.user.wallet]: action.user },
      };

    case "ADD_XP": {
      const user = state.users[action.wallet];
      if (!user) return state;
      const newXp = user.xp + action.amount;
      return {
        ...state,
        users: {
          ...state.users,
          [action.wallet]: {
            ...user,
            xp: newXp,
            creaturesUnlocked: recalcCreatures(newXp),
          },
        },
      };
    }

    case "ADD_AI_CHARACTER":
      return {
        ...state,
        aiCharacters: [action.character, ...state.aiCharacters],
      };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  syncToDb: (action: Action) => void;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    pools: [],
    users: {},
    aiCharacters: [],
    initialized: false,
    useSupabase: false,
  });

  // Load data — try Supabase first, fall back to localStorage + seed
  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured) {
        const [pools, users, aiChars] = await Promise.all([
          fetchPools(),
          fetchUsers(),
          fetchAiCharacters(),
        ]);

        if (pools !== null && users !== null) {
          // Supabase is live
          if (pools.length === 0 && Object.keys(users).length === 0) {
            // DB is empty — seed it and use seed data locally
            const seed = generateSeedData();
            // Seed users first (pools reference creator_wallet)
            for (const user of Object.values(seed.users)) {
              upsertUser(user);
            }
            // Then seed pools
            for (const pool of seed.pools) {
              insertPool(pool);
              // Seed pledges
              for (const pledge of pool.pledges) {
                insertPledge(pool.id, pledge.wallet, pledge.amount);
              }
            }
            dispatch({
              type: "INIT",
              pools: seed.pools,
              users: seed.users,
              aiCharacters: [],
              useSupabase: true,
            });
          } else {
            dispatch({
              type: "INIT",
              pools,
              users,
              aiCharacters: aiChars,
              useSupabase: true,
            });
          }
          return;
        }
      }

      // Fallback: localStorage + seed
      let pools = loadFromStorage<Pool[]>(STORAGE_KEYS.POOLS, []);
      let users = loadFromStorage<Record<string, UserProfile>>(STORAGE_KEYS.USERS, {});

      if (pools.length === 0 && Object.keys(users).length === 0) {
        const seed = generateSeedData();
        pools = seed.pools;
        users = seed.users;
      }

      dispatch({ type: "INIT", pools, users, aiCharacters: [], useSupabase: false });
    }

    init();
  }, []);

  // Persist to localStorage when not using Supabase
  useEffect(() => {
    if (!state.initialized || state.useSupabase) return;
    saveToStorage(STORAGE_KEYS.POOLS, state.pools);
    saveToStorage(STORAGE_KEYS.USERS, state.users);
  }, [state.pools, state.users, state.initialized, state.useSupabase]);

  // Sync actions to Supabase in background
  const syncToDb = useCallback(
    async (action: Action) => {
      if (!state.useSupabase) return;

      switch (action.type) {
        case "ADD_POOL":
          await insertPool(action.pool);
          break;
        case "PLEDGE_TO_POOL":
          await insertPledge(action.poolId, action.wallet, action.amount);
          break;
        case "UPSERT_USER":
          await upsertUser(action.user);
          break;
        case "ADD_XP":
          await addXpToUser(action.wallet, action.amount);
          break;
        case "ADD_AI_CHARACTER":
          await insertAiCharacter(action.character);
          break;
      }
    },
    [state.useSupabase]
  );

  return (
    <AppContext.Provider value={{ state, dispatch, syncToDb }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
