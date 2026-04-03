import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

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
  rarity: "common" | "rare" | "epic" | "legendary";
}

export async function generateCharacter(
  walletAddress: string
): Promise<GeneratedCharacter> {
  if (!anthropic) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const rarityRoll = parseInt(walletAddress.slice(-4), 16) % 100;
  const rarity =
    rarityRoll < 60 ? "common" :
    rarityRoll < 85 ? "rare" :
    rarityRoll < 97 ? "epic" : "legendary";

  const rarityMultiplier =
    rarity === "common" ? 1 :
    rarity === "rare" ? 1.5 :
    rarity === "epic" ? 2.5 : 5;

  const maxStat = Math.round(40 * rarityMultiplier);

  const prompt = `You are the lore master of Lumina Arcade, a neon cyberpunk SocialFi gaming world on Solana.

Generate a unique arcade character for the wallet "${walletAddress.slice(0, 8)}...".

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
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const parsed = JSON.parse(text);

  return { ...parsed, rarity };
}
