import { NextRequest, NextResponse } from "next/server";
import { fetchAiCharacters } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const allChars = await fetchAiCharacters();
    const walletChars = allChars.filter((c) => c.wallet === wallet);

    return NextResponse.json(
      {
        success: true,
        data: walletChars,
        total: walletChars.length,
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
