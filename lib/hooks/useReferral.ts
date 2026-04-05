"use client";

import { useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { useCurrentUser } from "./useCurrentUser";
import { XP_REWARDS } from "../constants";

const REFERRAL_STORAGE_KEY = "lumina_referrer";

export function useReferral() {
  const { state, dispatch, syncToDb } = useAppContext();
  const { wallet, user } = useCurrentUser();

  // Capture referral from URL on page load (using window.location to avoid useSearchParams SSR issue)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref.length > 30) {
      // Don't store self-referral
      if (ref !== wallet) {
        sessionStorage.setItem(REFERRAL_STORAGE_KEY, ref);
      }
    }
  }, [wallet]);

  // When user connects wallet, check if they were referred
  useEffect(() => {
    if (!wallet || !user || !state.initialized) return;

    // If user already has a referrer, skip
    if (user.referredBy) return;

    const referrer = sessionStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!referrer || referrer === wallet) return;

    // Check referrer exists in state
    const referrerUser = state.users[referrer];
    if (!referrerUser) return;

    // Mark this user as referred
    const updatedUser = { ...user, referredBy: referrer };
    const upsertAction = { type: "UPSERT_USER" as const, user: updatedUser };
    dispatch(upsertAction);
    syncToDb(upsertAction);

    // Give referrer XP for the signup
    const referrerXpAction = {
      type: "ADD_XP" as const,
      wallet: referrer,
      amount: XP_REWARDS.REFERRAL_SIGNUP,
    };
    dispatch(referrerXpAction);
    syncToDb(referrerXpAction);

    // Clean up
    sessionStorage.removeItem(REFERRAL_STORAGE_KEY);
  }, [wallet, user, state.initialized, state.users, dispatch, syncToDb]);

  // Get the stored referrer (for use in pledge/create flows)
  const getReferrer = useCallback((): string | null => {
    if (!wallet) return null;
    // Check user's stored referrer first
    const currentUser = state.users[wallet];
    if (currentUser?.referredBy) return currentUser.referredBy;
    // Check session storage
    return sessionStorage.getItem(REFERRAL_STORAGE_KEY);
  }, [wallet, state.users]);

  // Award referral bonus XP (called after pledge or pool creation)
  const awardReferralBonus = useCallback(
    (action: "pledge" | "create_pool") => {
      if (!wallet) return;

      const referrer = getReferrer();
      if (!referrer || referrer === wallet) return;
      if (!state.users[referrer]) return;

      const amount =
        action === "pledge"
          ? XP_REWARDS.REFERRAL_PLEDGE
          : XP_REWARDS.REFERRAL_CREATE_POOL;

      // Bonus XP to referrer
      const referrerXp = { type: "ADD_XP" as const, wallet: referrer, amount };
      dispatch(referrerXp);
      syncToDb(referrerXp);

      // Bonus XP to referred user too
      const userXp = { type: "ADD_XP" as const, wallet, amount };
      dispatch(userXp);
      syncToDb(userXp);
    },
    [wallet, getReferrer, state.users, dispatch, syncToDb]
  );

  // Generate referral link
  const getReferralLink = useCallback(
    (path: string = "/") => {
      if (!wallet) return null;
      const base = typeof window !== "undefined" ? window.location.origin : "https://luminaarcade.com";
      const url = new URL(path, base);
      url.searchParams.set("ref", wallet);
      return url.toString();
    },
    [wallet]
  );

  // Get referral stats for current user
  const referralStats = {
    referralCount: user?.referralCount ?? 0,
    referralXpEarned: user?.referralXpEarned ?? 0,
    referredBy: user?.referredBy ?? null,
    referralLink: getReferralLink(),
  };

  return {
    getReferrer,
    awardReferralBonus,
    getReferralLink,
    referralStats,
  };
}
