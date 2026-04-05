import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";

// Lazy initialization (same pattern as supabase.ts - avoids build-time failures)
let _sdk: any = null;
let _initialized = false;

function getBagsApiKey(): string {
  return process.env.BAGS_API_KEY ?? "";
}

function getRpcUrl(): string {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
}

export function isBagsConfigured(): boolean {
  return !!getBagsApiKey();
}

async function getSdk() {
  if (_initialized) return _sdk;
  _initialized = true;
  if (!isBagsConfigured()) return null;

  try {
    const { BagsSDK } = await import("@bagsfm/bags-sdk");
    const connection = new Connection(getRpcUrl(), "confirmed");
    _sdk = new BagsSDK(getBagsApiKey(), connection, "confirmed");
    return _sdk;
  } catch (e) {
    console.error("Failed to init Bags SDK:", e);
    return null;
  }
}

// --- Token Launch ---

export interface LaunchTokenParams {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  launchWallet: string; // Base58 pubkey
  initialBuyLamports?: number;
  twitter?: string;
  website?: string;
}

export interface LaunchTokenResult {
  tokenMint: string;
  metadataUrl: string;
  status: string;
  launchTransaction?: string; // base64 serialized VersionedTransaction for client signing
}

export async function createTokenInfo(params: {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  twitter?: string;
  website?: string;
}) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const result = await sdk.tokenLaunch.createTokenInfoAndMetadata({
    imageUrl: params.imageUrl,
    name: params.name,
    symbol: params.symbol,
    description: params.description,
    twitter: params.twitter,
    website: params.website,
  });

  return {
    tokenMint: result.tokenMint,
    metadataUrl: result.tokenMetadata,
    status: result.tokenLaunch.status,
    image: result.tokenLaunch.image,
  };
}

export async function createLaunchTransaction(params: {
  metadataUrl: string;
  tokenMint: string;
  launchWallet: string;
  initialBuyLamports: number;
  configKey: string;
}) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const tx: VersionedTransaction = await sdk.tokenLaunch.createLaunchTransaction({
    metadataUrl: params.metadataUrl,
    tokenMint: new PublicKey(params.tokenMint),
    launchWallet: new PublicKey(params.launchWallet),
    initialBuyLamports: params.initialBuyLamports,
    configKey: new PublicKey(params.configKey),
  });

  // Serialize the transaction for client-side signing
  const serialized = Buffer.from(tx.serialize()).toString("base64");
  return { transaction: serialized };
}

// --- Fee Share Config ---

export async function createFeeShareConfig(params: {
  payer: string;
  baseMint: string;
  feeClaimers: Array<{ wallet: string; bps: number }>;
}) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const { WRAPPED_SOL_MINT } = await import("@bagsfm/bags-sdk");

  const result = await sdk.config.createBagsFeeShareConfig({
    payer: new PublicKey(params.payer),
    baseMint: new PublicKey(params.baseMint),
    feeClaimers: params.feeClaimers.map((fc) => ({
      user: new PublicKey(fc.wallet),
      userBps: fc.bps,
    })),
  });

  return {
    configKey: result.meteoraConfigKey.toBase58(),
    transactions: result.transactions.map((tx: VersionedTransaction) =>
      Buffer.from(tx.serialize()).toString("base64")
    ),
  };
}

// --- Trading ---

export async function getTradeQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const quote = await sdk.trade.getQuote({
    inputMint: new PublicKey(params.inputMint),
    outputMint: new PublicKey(params.outputMint),
    amount: params.amount,
    slippageMode: "auto" as const,
    slippageBps: params.slippageBps,
  });

  return quote;
}

export async function createSwapTransaction(params: {
  quoteResponse: any;
  userPublicKey: string;
}) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const result = await sdk.trade.createSwapTransaction({
    quoteResponse: params.quoteResponse,
    userPublicKey: new PublicKey(params.userPublicKey),
  });

  return {
    transaction: Buffer.from(result.transaction.serialize()).toString("base64"),
    computeUnitLimit: result.computeUnitLimit,
    lastValidBlockHeight: result.lastValidBlockHeight,
  };
}

// --- Fee Claiming ---

export async function getClaimablePositions(wallet: string) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const positions = await sdk.fee.getAllClaimablePositions(new PublicKey(wallet));
  return positions.map((p: any) => ({
    baseMint: p.baseMint,
    claimableAmount: p.claimableDisplayAmount ?? (p.totalClaimableLamportsUserShare / 1e9),
    isMigrated: p.isMigrated ?? false,
    isCustomFeeVault: p.isCustomFeeVault,
  }));
}

export async function getClaimTransactions(wallet: string, tokenMint: string) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  const txs = await sdk.fee.getClaimTransactions(
    new PublicKey(wallet),
    new PublicKey(tokenMint)
  );

  return txs.map((tx: any) => Buffer.from(tx.serialize()).toString("base64"));
}

// --- Analytics ---

export async function getTokenLifetimeFees(tokenMint: string) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  return sdk.state.getTokenLifetimeFees(new PublicKey(tokenMint));
}

export async function getTokenCreators(tokenMint: string) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  return sdk.state.getTokenCreators(new PublicKey(tokenMint));
}

export async function getTopTokensByFees() {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  return sdk.state.getTopTokensByLifetimeFees();
}

export async function getTokenClaimStats(tokenMint: string) {
  const sdk = await getSdk();
  if (!sdk) throw new Error("Bags SDK not configured");

  return sdk.state.getTokenClaimStats(new PublicKey(tokenMint));
}
