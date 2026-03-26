export type PoolStatus = 'open' | 'launched' | 'failed';
export type PoolType   = 'solo' | 'community';
export type ThresholdType = 'sol' | 'contributors';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface User {
  id: string;
  privy_id: string;
  wallet?: string;
  twitter_id?: string;
  twitter_handle?: string;
  twitter_avatar?: string;
  username?: string;
  total_xp: number;
  level: number;
  total_fees_earned: number;
  created_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url: string;
  ipfs_cid: string;
  metadata_uri: string;
  rarity: Rarity;
  traits: CharacterTraits;
  xp: number;
  level: number;
  created_at: string;
}

export interface CharacterTraits {
  element: string;
  weapon: string;
  class: string;
  power: number;
  speed: number;
  luck: number;
}

export interface Pool {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  token_symbol: string;
  token_name: string;
  image_url?: string;
  metadata_uri?: string;
  pool_type: PoolType;
  threshold_type: ThresholdType;
  threshold_value: number;
  sol_raised: number;
  contributor_count: number;
  status: PoolStatus;
  bags_token_mint?: string;
  bags_tx_hash?: string;
  fee_share_config: FeeShareEntry[];
  launch_at?: string;
  created_at: string;
  updated_at: string;
  creator?: User;
  pledges?: Pledge[];
}

export interface FeeShareEntry {
  address: string;
  bps: number;
}

export interface Pledge {
  id: string;
  pool_id: string;
  user_id: string;
  amount_sol: number;
  tx_hash?: string;
  xp_awarded: number;
  created_at: string;
  user?: User;
}

export interface XPEvent {
  id: string;
  user_id: string;
  event_type: 'pledge' | 'launch' | 'claim' | 'referral' | 'daily';
  xp_amount: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LeaderboardEntry {
  user: User;
  character?: Character;
  rank: number;
  total_pledged: number;
  pools_launched: number;
  fees_earned: number;
}

export interface ApiSuccess<T> { data: T; }
export interface ApiError { error: string; code?: string; }
