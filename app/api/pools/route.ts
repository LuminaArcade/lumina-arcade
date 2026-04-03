import { NextResponse } from "next/server";
import { fetchPools, insertPool } from "@/lib/supabase-data";

export async function GET() {
  const pools = await fetchPools();
  if (pools === null) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  return NextResponse.json({ pools });
}

export async function POST(request: Request) {
  try {
    const pool = await request.json();
    const success = await insertPool(pool);
    if (!success) {
      return NextResponse.json({ error: "Failed to create pool" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
