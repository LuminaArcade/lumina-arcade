export type PoolStatus = "active" | "launched" | "expired";
export type CreatureRarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface Pledge {
  wallet: string;
  amount: number;
  timestamp: number;
}

export interface Pool {
  id: string;
  name: string;
  ticker: string;
  description: string;
  creatorWallet: string;
  creatorName: string;
  targetSol: number;
  raisedSol: number;
  participants: string[];
  pledges: Pledge[];
  status: PoolStatus;
  createdAt: number;
  expiresAt: number;
  launchedAt?: number;
  tokenMint?: string;
  bagsUrl?: string;
}

export interface UserProfile {
  wallet: string;
  displayName: string;
  xp: number;
  poolsCreated: string[];
  poolsPledged: string[];
  creaturesUnlocked: string[];
  joinedAt: number;
  referredBy?: string;       // wallet that referred this user
  referralCount: number;     // how many users this person referred
  referralXpEarned: number;  // total XP earned from referrals
}

export interface Creature {
  id: string;
  name: string;
  rarity: CreatureRarity;
  element: string;
  description: string;
  xpThreshold: number;
  componentKey: string;
}

export interface LeaderboardEntry {
  wallet: string;
  displayName: string;
  xp: number;
  rank: number;
  totalPledged: number;
  poolsCreated: number;
}

export interface AppStats {
  activePools: number;
  tokensLaunched: number;
  totalVolumeSol: number;
  totalPlayers: number;
}

export interface AiCharacter {
  id: string;
  wallet: string;
  name: string;
  description: string;
  backstory: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  traits: {
    element: string;
    weapon: string;
    class: string;
    power: number;
    speed: number;
    luck: number;
  };
  imagePrompt: string;
  createdAt: number;
}
