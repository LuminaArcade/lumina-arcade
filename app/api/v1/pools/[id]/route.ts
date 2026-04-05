import { NextRequest, NextResponse } from "next/server";
import { fetchPools } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// GET /api/v1/pools/:id — Pool detail with pledges
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const pools = await fetchPools();
    const pool = pools?.find((p) => p.id === id);

    if (!pool) {
      return NextResponse.json(
        { success: false, error: "Pool not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...pool,
          progress: Math.min(100, Math.round((pool.raisedSol / pool.targetSol) * 100)),
          participantCount: pool.participants.length,
          pledgeCount: pool.pledges.length,
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
