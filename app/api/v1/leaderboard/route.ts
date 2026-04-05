import { NextRequest, NextResponse } from "next/server";
import { fetchUsers } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { LeaderboardEntry } from "@/lib/types";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const users = await fetchUsers();
    if (!users) {
      return NextResponse.json(
        { success: true, data: [], pagination: { total: 0, limit, offset, hasMore: false } },
        { headers: CORS_HEADERS }
      );
    }

    const sorted = Object.values(users)
      .sort((a, b) => b.xp - a.xp);

    const total = sorted.length;

    const leaderboard: LeaderboardEntry[] = sorted
      .slice(offset, offset + limit)
      .map((user, i) => ({
        wallet: user.wallet,
        displayName: user.displayName,
        xp: user.xp,
        rank: offset + i + 1,
        totalPledged: 0, // Would need to compute from pools
        poolsCreated: user.poolsCreated.length,
      }));

    return NextResponse.json(
      {
        success: true,
        data: leaderboard,
        pagination: { total, limit, offset, hasMore: offset + limit < total },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
