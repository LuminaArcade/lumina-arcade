import { NextRequest, NextResponse } from "next/server";
import { getTokenLifetimeFees, getTokenCreators, getTopTokensByFees, getTokenClaimStats, isBagsConfigured } from "@/lib/bags";

export async function GET(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json({ error: "Bags API not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const tokenMint = searchParams.get("tokenMint");

    switch (action) {
      case "lifetime-fees": {
        if (!tokenMint) return NextResponse.json({ error: "Missing tokenMint" }, { status: 400 });
        const fees = await getTokenLifetimeFees(tokenMint);
        return NextResponse.json({ fees });
      }
      case "creators": {
        if (!tokenMint) return NextResponse.json({ error: "Missing tokenMint" }, { status: 400 });
        const creators = await getTokenCreators(tokenMint);
        return NextResponse.json({ creators });
      }
      case "top-tokens": {
        const tokens = await getTopTokensByFees();
        return NextResponse.json({ tokens });
      }
      case "claim-stats": {
        if (!tokenMint) return NextResponse.json({ error: "Missing tokenMint" }, { status: 400 });
        const stats = await getTokenClaimStats(tokenMint);
        return NextResponse.json({ stats });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
