import Anthropic from '@anthropic-ai/sdk';
import type { Character, Pool } from './types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GeneratedCharacter {
  name: string;
  description: string;
  backstory: string;
  traits: {
    element: string;
    weapon: string;
    class: string;
    power: number;
    speed: number;
    luck: number;
  };
  imagePrompt: string;
  rarity: Character['rarity'];
}

export async function generateCharacter(
  twitterHandle: string,
  walletAddress: string
): Promise<GeneratedCharacter> {
  const rarityRoll = parseInt(walletAddress.slice(-4), 16) % 100;
  const rarity =
    rarityRoll < 60 ? 'common' :
    rarityRoll < 85 ? 'rare'   :
    rarityRoll < 97 ? 'epic'   : 'legendary';

  const rarityMultiplier =
    rarity === 'common'    ? 1   :
    rarity === 'rare'      ? 1.5 :
    rarity === 'epic'      ? 2.5 : 5;

  const maxStat = Math.round(40 * rarityMultiplier);

  const prompt = `You are the lore master of Lumina Arcade, a neon cyberpunk SocialFi gaming world.

Generate a unique arcade character for the user "@${twitterHandle}" based on their wallet "${walletAddress.slice(0, 8)}...".

Rarity tier: ${rarity.toUpperCase()}

Return ONLY valid JSON (no markdown, no explanation):
{
  "name": "character name (2-3 words, cyberpunk/arcade style)",
  "description": "one-sentence character description",
  "backstory": "two-sentence origin story in a neon arcade world",
  "traits": {
    "element": "one of: Fire | Ice | Lightning | Void | Neon",
    "weapon": "one of: Laser | Katana | Cannon | Hex | Pulse",
    "class": "one of: Mage | Warrior | Rogue | Phantom | Warlord",
    "power": ${Math.min(maxStat, 95)},
    "speed": ${Math.min(maxStat - 5, 90)},
    "luck": ${Math.min(maxStat - 3, 85)}
  },
  "imagePrompt": "detailed visual prompt for an AI image generator, neon arcade game character art style, full body, dark background with glowing effects, cyberpunk aesthetic"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const parsed = JSON.parse(text);

  return { ...parsed, rarity };
}

export interface GeneratedTokenMetadata {
  name: string;
  symbol: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
}

export async function generateTokenMetadata(pool: Pool): Promise<GeneratedTokenMetadata> {
  const prompt = `You are a crypto token marketing expert for Lumina Arcade, a gamified SocialFi platform on Solana.

Generate compelling token metadata for this community pool:

Pool name: "${pool.name}"
Token symbol: "${pool.token_symbol}"
Description: "${pool.description}"
Contributors: ${pool.contributor_count}
SOL raised: ${pool.sol_raised}

Return ONLY valid JSON:
{
  "name": "${pool.token_name}",
  "symbol": "${pool.token_symbol}",
  "description": "2-3 sentence compelling token description",
  "attributes": [
    { "trait_type": "Platform", "value": "Lumina Arcade" },
    { "trait_type": "Launch Type", "value": "Community Pool" },
    { "trait_type": "Contributors", "value": ${pool.contributor_count} },
    { "trait_type": "Category", "value": "GameFi/SocialFi" }
  ]
}`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}
