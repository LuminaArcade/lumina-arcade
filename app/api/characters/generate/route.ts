import { NextResponse } from "next/server";
import { generateCharacter } from "@/lib/ai";
import { insertAiCharacter } from "@/lib/supabase-data";
import type { AiCharacter } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json();

    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json(
        { error: "wallet address is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI generation is not configured" },
        { status: 503 }
      );
    }

    const generated = await generateCharacter(wallet);

    const character: AiCharacter = {
      id: crypto.randomUUID(),
      wallet,
      name: generated.name,
      description: generated.description,
      backstory: generated.backstory,
      rarity: generated.rarity,
      traits: generated.traits,
      imagePrompt: generated.imagePrompt,
      createdAt: Date.now(),
    };

    // Save to Supabase if configured
    await insertAiCharacter(character);

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Character generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate character" },
      { status: 500 }
    );
  }
}
