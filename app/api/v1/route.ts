import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isBagsConfigured } from "@/lib/bags";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      name: "Lumina Arcade API",
      version: "1.0.0",
      description: "Public API for Lumina Arcade — the gamified SocialFi arcade on Solana, powered by Bags.fm",
      status: "ok",
      services: {
        database: isSupabaseConfigured() ? "connected" : "not_configured",
        bags: isBagsConfigured() ? "connected" : "not_configured",
      },
      endpoints: {
        "GET /api/v1": "This endpoint — API info and health check",
        "GET /api/v1/pools": "List pools (query: status, creator, limit, offset, sort)",
        "GET /api/v1/pools/:id": "Get pool details with pledges",
        "GET /api/v1/leaderboard": "Get player leaderboard (query: limit, offset)",
        "GET /api/v1/stats": "Get platform statistics",
        "GET /api/v1/characters/:wallet": "Get AI characters for a wallet",
      },
      links: {
        website: "https://luminaarcade.com",
        github: "https://github.com/LuminaArcade",
        bags: "https://bags.fm",
      },
    },
    { headers: CORS_HEADERS }
  );
}
