import { NextRequest, NextResponse } from "next/server";
import { getClaimablePositions, getClaimTransactions, isBagsConfigured } from "@/lib/bags";

// GET: Get claimable positions for a wallet
export async function GET(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json({ error: "Bags API not configured" }, { status: 503 });
  }

  try {
    const wallet = new URL(req.url).searchParams.get("wallet");
    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet param" }, { status: 400 });
    }

    const positions = await getClaimablePositions(wallet);
    return NextResponse.json({ positions });
  } catch (error: any) {
    console.error("Claimable positions error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Get claim transactions for a specific token
export async function POST(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json({ error: "Bags API not configured" }, { status: 503 });
  }

  try {
    const { wallet, tokenMint } = await req.json();
    if (!wallet || !tokenMint) {
      return NextResponse.json(
        { error: "Missing: wallet, tokenMint" },
        { status: 400 }
      );
    }

    const transactions = await getClaimTransactions(wallet, tokenMint);
    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("Claim tx error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
