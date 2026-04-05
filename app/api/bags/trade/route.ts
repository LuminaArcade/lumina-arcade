import { NextRequest, NextResponse } from "next/server";
import { getTradeQuote, createSwapTransaction, isBagsConfigured } from "@/lib/bags";

// GET: Get trade quote
export async function GET(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json({ error: "Bags API not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const inputMint = searchParams.get("inputMint");
    const outputMint = searchParams.get("outputMint");
    const amount = searchParams.get("amount");

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { error: "Missing params: inputMint, outputMint, amount" },
        { status: 400 }
      );
    }

    const quote = await getTradeQuote({
      inputMint,
      outputMint,
      amount: parseInt(amount),
      slippageBps: parseInt(searchParams.get("slippageBps") || "100"),
    });

    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("Trade quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create swap transaction
export async function POST(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json({ error: "Bags API not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { quoteResponse, userPublicKey } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { error: "Missing: quoteResponse, userPublicKey" },
        { status: 400 }
      );
    }

    const result = await createSwapTransaction({ quoteResponse, userPublicKey });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Swap tx error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
