import { NextRequest, NextResponse } from "next/server";
import { fetchPools, insertPool } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { generateSeedData } from "@/lib/seed";
import { loadFromStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Pool } from "@/lib/types";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// GET /api/v1/pools — List pools with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // active, launched, expired
    const creator = searchParams.get("creator"); // wallet address
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") || "created_desc"; // created_desc, created_asc, raised_desc, progress_desc

    let pools: Pool[] = [];

    if (isSupabaseConfigured()) {
      const fetched = await fetchPools();
      pools = fetched ?? [];
    }

    // If no pools from Supabase, the API returns empty (no seed data for public API)

    // Apply filters
    if (status) {
      pools = pools.filter((p) => p.status === status);
    }
    if (creator) {
      pools = pools.filter((p) => p.creatorWallet === creator);
    }

    // Sort
    switch (sort) {
      case "created_asc":
        pools.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "raised_desc":
        pools.sort((a, b) => b.raisedSol - a.raisedSol);
        break;
      case "progress_desc":
        pools.sort((a, b) => (b.raisedSol / b.targetSol) - (a.raisedSol / a.targetSol));
        break;
      default: // created_desc
        pools.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Pagination
    const total = pools.length;
    pools = pools.slice(offset, offset + limit);

    // Strip heavy data from list view (pledges array can be large)
    const poolSummaries = pools.map((p) => ({
      id: p.id,
      name: p.name,
      ticker: p.ticker,
      description: p.description,
      creatorWallet: p.creatorWallet,
      creatorName: p.creatorName,
      targetSol: p.targetSol,
      raisedSol: p.raisedSol,
      progress: Math.min(100, Math.round((p.raisedSol / p.targetSol) * 100)),
      participantCount: p.participants.length,
      pledgeCount: p.pledges.length,
      status: p.status,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
      launchedAt: p.launchedAt,
      tokenMint: p.tokenMint,
    }));

    return NextResponse.json(
      {
        success: true,
        data: poolSummaries,
        pagination: { total, limit, offset, hasMore: offset + limit < total },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pools" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
