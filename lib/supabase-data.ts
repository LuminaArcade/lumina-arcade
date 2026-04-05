import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Pool, UserProfile, Pledge, AiCharacter } from "./types";

// ─── Pools ───────────────────────────────────────────

export async function fetchPools(): Promise<Pool[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: pools, error } = await supabase
    .from("pools")
    .select("*, pledges(*)")
    .order("created_at", { ascending: false });

  if (error || !pools) return null;

  return pools.map(mapPoolFromDb);
}

export async function fetchPool(id: string): Promise<Pool | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("pools")
    .select("*, pledges(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapPoolFromDb(data);
}

export async function insertPool(pool: Pool): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("pools").insert({
    id: pool.id,
    name: pool.name,
    ticker: pool.ticker,
    description: pool.description,
    creator_wallet: pool.creatorWallet,
    creator_name: pool.creatorName,
    target_sol: pool.targetSol,
    raised_sol: pool.raisedSol,
    participants: pool.participants,
    status: pool.status,
    created_at: new Date(pool.createdAt).toISOString(),
    expires_at: new Date(pool.expiresAt).toISOString(),
    launched_at: pool.launchedAt ? new Date(pool.launchedAt).toISOString() : null,
  });

  return !error;
}

export async function insertPledge(
  poolId: string,
  wallet: string,
  amount: number
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error: pledgeError } = await supabase.from("pledges").insert({
    pool_id: poolId,
    wallet,
    amount,
  });

  if (pledgeError) return false;

  // Update pool raised_sol, participants, and status
  const { data: pool } = await supabase
    .from("pools")
    .select("raised_sol, target_sol, participants, status")
    .eq("id", poolId)
    .single();

  if (pool) {
    const newRaised = Math.min(pool.raised_sol + amount, pool.target_sol);
    const participants = pool.participants.includes(wallet)
      ? pool.participants
      : [...pool.participants, wallet];
    const launched = newRaised >= pool.target_sol;

    await supabase
      .from("pools")
      .update({
        raised_sol: newRaised,
        participants,
        status: launched ? "launched" : pool.status,
        launched_at: launched && pool.status !== "launched" ? new Date().toISOString() : undefined,
      })
      .eq("id", poolId);
  }

  return true;
}

// ─── Users ───────────────────────────────────────────

export async function fetchUsers(): Promise<Record<string, UserProfile> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false });

  if (error || !data) return null;

  const users: Record<string, UserProfile> = {};
  for (const row of data) {
    users[row.wallet] = mapUserFromDb(row);
  }
  return users;
}

export async function upsertUser(user: UserProfile): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("profiles").upsert({
    wallet: user.wallet,
    display_name: user.displayName,
    xp: user.xp,
    pools_created: user.poolsCreated,
    pools_pledged: user.poolsPledged,
    creatures_unlocked: user.creaturesUnlocked,
    joined_at: new Date(user.joinedAt).toISOString(),
  });

  return !error;
}

export async function addXpToUser(wallet: string, amount: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data } = await supabase
    .from("profiles")
    .select("xp")
    .eq("wallet", wallet)
    .single();

  if (!data) return false;

  const { error } = await supabase
    .from("profiles")
    .update({ xp: data.xp + amount })
    .eq("wallet", wallet);

  return !error;
}

// ─── AI Characters ───────────────────────────────────

export async function fetchAiCharacters(wallet?: string): Promise<AiCharacter[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase.from("ai_characters").select("*").order("created_at", { ascending: false });
  if (wallet) query = query.eq("wallet", wallet);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map(mapAiCharacterFromDb);
}

export async function insertAiCharacter(character: AiCharacter): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("ai_characters").insert({
    id: character.id,
    wallet: character.wallet,
    name: character.name,
    description: character.description,
    backstory: character.backstory,
    rarity: character.rarity,
    traits: character.traits,
    image_prompt: character.imagePrompt,
    created_at: new Date(character.createdAt).toISOString(),
  });

  return !error;
}

// ─── Mappers ─────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapPoolFromDb(row: any): Pool {
  return {
    id: row.id,
    name: row.name,
    ticker: row.ticker,
    description: row.description,
    creatorWallet: row.creator_wallet,
    creatorName: row.creator_name,
    targetSol: row.target_sol,
    raisedSol: row.raised_sol,
    participants: row.participants ?? [],
    pledges: (row.pledges ?? []).map((p: any): Pledge => ({
      wallet: p.wallet,
      amount: p.amount,
      timestamp: new Date(p.created_at).getTime(),
    })),
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
    launchedAt: row.launched_at ? new Date(row.launched_at).getTime() : undefined,
  };
}

function mapUserFromDb(row: any): UserProfile {
  return {
    wallet: row.wallet,
    displayName: row.display_name,
    xp: row.xp,
    poolsCreated: row.pools_created ?? [],
    poolsPledged: row.pools_pledged ?? [],
    creaturesUnlocked: row.creatures_unlocked ?? [],
    joinedAt: new Date(row.joined_at).getTime(),
    referralCount: row.referral_count ?? 0,
    referralXpEarned: row.referral_xp_earned ?? 0,
  };
}

function mapAiCharacterFromDb(row: any): AiCharacter {
  return {
    id: row.id,
    wallet: row.wallet,
    name: row.name,
    description: row.description,
    backstory: row.backstory,
    rarity: row.rarity,
    traits: row.traits,
    imagePrompt: row.image_prompt,
    createdAt: new Date(row.created_at).getTime(),
  };
}
