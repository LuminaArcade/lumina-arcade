import type { Creature } from "./types";

export const CREATURES: Creature[] = [
  {
    id: "blobby",
    name: "Blobby",
    rarity: "Common",
    element: "Water",
    description: "A cheerful blob that thrives in token pools. Loyal and eager to grow.",
    xpThreshold: 0,
    componentKey: "CreatureCommon1",
  },
  {
    id: "sparky",
    name: "Sparky",
    rarity: "Common",
    element: "Electric",
    description: "Crackling with energy, Sparky powers up pools with electrifying speed.",
    xpThreshold: 100,
    componentKey: "CreatureCommon2",
  },
  {
    id: "nebula",
    name: "Nebula",
    rarity: "Rare",
    element: "Cosmic",
    description: "Born from stardust, Nebula sees patterns in the chaos of markets.",
    xpThreshold: 500,
    componentKey: "CreatureRare1",
  },
  {
    id: "frostbite",
    name: "Frostbite",
    rarity: "Rare",
    element: "Ice",
    description: "A crystalline guardian that freezes out bad actors and protects pools.",
    xpThreshold: 1000,
    componentKey: "CreatureRare2",
  },
  {
    id: "voidwalker",
    name: "Voidwalker",
    rarity: "Epic",
    element: "Void",
    description: "Peers from the abyss, harvesting dark energy to fuel legendary launches.",
    xpThreshold: 3000,
    componentKey: "CreatureEpic",
  },
  {
    id: "arcana",
    name: "Arcana",
    rarity: "Legendary",
    element: "Arcane",
    description: "The rarest of all. Masters of ancient tokenomics and infinite wisdom.",
    xpThreshold: 10000,
    componentKey: "CreatureLegendary",
  },
];

export const XP_REWARDS = {
  CREATE_POOL: 200,
  PLEDGE: 50,
  PLEDGE_PER_SOL: 10,
  POOL_LAUNCHED: 500,
};

export const STORAGE_KEYS = {
  POOLS: "lumina_pools",
  USERS: "lumina_users",
};
