"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export function useCurrentUser() {
  const { publicKey } = useWallet();
  const { state, dispatch, syncToDb } = useAppContext();
  const wallet = publicKey?.toBase58() ?? null;

  useEffect(() => {
    if (wallet && !state.users[wallet]) {
      const user = {
        wallet,
        displayName: wallet.slice(0, 4) + "..." + wallet.slice(-4),
        xp: 0,
        poolsCreated: [] as string[],
        poolsPledged: [] as string[],
        creaturesUnlocked: ["blobby"],
        joinedAt: Date.now(),
      };
      const action = { type: "UPSERT_USER" as const, user };
      dispatch(action);
      syncToDb(action);
    }
  }, [wallet, state.users, dispatch, syncToDb]);

  return {
    wallet,
    user: wallet ? state.users[wallet] ?? null : null,
    isConnected: !!wallet,
  };
}
