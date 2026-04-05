import { NextRequest, NextResponse } from "next/server";
import { createTokenInfo, createFeeShareConfig, createLaunchTransaction, isBagsConfigured } from "@/lib/bags";

// POST: Create token info + fee share config, return launch transaction
export async function POST(req: NextRequest) {
  if (!isBagsConfigured()) {
    return NextResponse.json(
      { error: "Bags API not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { name, symbol, description, imageUrl, launchWallet, feeClaimers, initialBuyLamports, twitter, website } = body;

    if (!name || !symbol || !launchWallet) {
      return NextResponse.json(
        { error: "Missing required fields: name, symbol, launchWallet" },
        { status: 400 }
      );
    }

    // Step 1: Create token metadata
    const tokenInfo = await createTokenInfo({
      name,
      symbol,
      description: description || `${name} - launched on Lumina Arcade`,
      imageUrl: imageUrl || "https://luminaarcade.com/og-image.png",
      twitter,
      website,
    });

    // Step 2: Create fee share config (creator gets 100% by default)
    const claimers = feeClaimers?.length > 0
      ? feeClaimers
      : [{ wallet: launchWallet, bps: 10000 }];

    const feeConfig = await createFeeShareConfig({
      payer: launchWallet,
      baseMint: tokenInfo.tokenMint,
      feeClaimers: claimers,
    });

    // Step 3: Create launch transaction
    const launchTx = await createLaunchTransaction({
      metadataUrl: tokenInfo.metadataUrl,
      tokenMint: tokenInfo.tokenMint,
      launchWallet,
      initialBuyLamports: initialBuyLamports || 0,
      configKey: feeConfig.configKey,
    });

    return NextResponse.json({
      tokenMint: tokenInfo.tokenMint,
      metadataUrl: tokenInfo.metadataUrl,
      image: tokenInfo.image,
      configKey: feeConfig.configKey,
      feeShareTransactions: feeConfig.transactions,
      launchTransaction: launchTx.transaction,
    });
  } catch (error: any) {
    console.error("Bags launch error:", error);
    return NextResponse.json(
      { error: error.message || "Token launch failed" },
      { status: 500 }
    );
  }
}
