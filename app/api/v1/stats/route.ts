import { NextResponse } from "next/server";
import { fetchPools, fetchUsers } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const [pools, users] = await Promise.all([fetchPools(), fetchUsers()]);

    const poolList = pools ?? [];
    const userMap = users ?? {};

    const activePools = poolList.filter((p) => p.status === "active").length;
    const launchedPools = poolList.filter((p) => p.status === "launched").length;
    const expiredPools = poolList.filter((p) => p.status === "expired").length;
    const totalVolumeSol = poolList.reduce((sum, p) => sum + p.raisedSol, 0);
    const totalPledges = poolList.reduce((sum, p) => sum + p.pledges.length, 0);
    const totalPlayers = Object.keys(userMap).length;
    const totalXp = Object.values(userMap).reduce((sum, u) => sum + u.xp, 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          pools: { total: poolList.length, active: activePools, launched: launchedPools, expired: expiredPools },
          volume: { totalSol: Math.round(totalVolumeSol * 10) / 10, totalPledges },
          players: { total: totalPlayers, totalXp },
          updatedAt: Date.now(),
        },
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
