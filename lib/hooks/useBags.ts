"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

export interface ClaimablePosition {
  baseMint: string;
  claimableAmount: number;
  isMigrated: boolean;
  isCustomFeeVault: boolean;
}

export function useBags() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [launching, setLaunching] = useState(false);
  const [trading, setTrading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Launch a token via Bags
  const launchToken = useCallback(
    async (params: {
      name: string;
      symbol: string;
      description: string;
      imageUrl?: string;
      initialBuyLamports?: number;
      feeClaimers?: Array<{ wallet: string; bps: number }>;
    }) => {
      if (!publicKey || !signTransaction || !signAllTransactions) {
        setError("Wallet not connected");
        return null;
      }

      setLaunching(true);
      setError(null);

      try {
        const res = await fetch("/api/bags/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...params,
            launchWallet: publicKey.toBase58(),
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Launch failed");
        }

        const data = await res.json();

        // Sign and send fee share config transactions first
        if (data.feeShareTransactions?.length > 0) {
          const feeShareTxs = data.feeShareTransactions.map(
            (txStr: string) => VersionedTransaction.deserialize(Buffer.from(txStr, "base64"))
          );
          const signedFeeShareTxs = await signAllTransactions(feeShareTxs);
          for (const tx of signedFeeShareTxs) {
            const sig = await connection.sendRawTransaction(tx.serialize());
            await connection.confirmTransaction(sig, "confirmed");
          }
        }

        // Sign and send launch transaction
        const launchTx = VersionedTransaction.deserialize(
          Buffer.from(data.launchTransaction, "base64")
        );
        const signedLaunchTx = await signTransaction(launchTx);
        const launchSig = await connection.sendRawTransaction(signedLaunchTx.serialize());
        await connection.confirmTransaction(launchSig, "confirmed");

        return {
          tokenMint: data.tokenMint,
          metadataUrl: data.metadataUrl,
          image: data.image,
          signature: launchSig,
        };
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setLaunching(false);
      }
    },
    [publicKey, signTransaction, signAllTransactions, connection]
  );

  // Get trade quote
  const getQuote = useCallback(
    async (inputMint: string, outputMint: string, amount: number) => {
      try {
        const res = await fetch(
          `/api/bags/trade?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`
        );
        if (!res.ok) throw new Error("Quote failed");
        return await res.json();
      } catch (e: any) {
        setError(e.message);
        return null;
      }
    },
    []
  );

  // Execute swap
  const swap = useCallback(
    async (quoteResponse: any) => {
      if (!publicKey || !signTransaction) {
        setError("Wallet not connected");
        return null;
      }

      setTrading(true);
      setError(null);

      try {
        const res = await fetch("/api/bags/trade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toBase58(),
          }),
        });

        if (!res.ok) throw new Error("Swap tx creation failed");
        const data = await res.json();

        const tx = VersionedTransaction.deserialize(
          Buffer.from(data.transaction, "base64")
        );
        const signed = await signTransaction(tx);
        const sig = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(sig, "confirmed");

        return { signature: sig };
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setTrading(false);
      }
    },
    [publicKey, signTransaction, connection]
  );

  // Get claimable fee positions
  const getClaimable = useCallback(async (): Promise<ClaimablePosition[]> => {
    if (!publicKey) return [];

    try {
      const res = await fetch(`/api/bags/fees?wallet=${publicKey.toBase58()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.positions || [];
    } catch {
      return [];
    }
  }, [publicKey]);

  // Claim fees for a token
  const claimFees = useCallback(
    async (tokenMint: string) => {
      if (!publicKey || !signAllTransactions) {
        setError("Wallet not connected");
        return null;
      }

      setClaiming(true);
      setError(null);

      try {
        const res = await fetch("/api/bags/fees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: publicKey.toBase58(),
            tokenMint,
          }),
        });

        if (!res.ok) throw new Error("Claim tx creation failed");
        const data = await res.json();

        if (!data.transactions?.length) {
          throw new Error("No fees to claim");
        }

        const txs = data.transactions.map(
          (txStr: string) => VersionedTransaction.deserialize(Buffer.from(txStr, "base64"))
        );
        const signed = await signAllTransactions(txs);
        const signatures: string[] = [];
        for (const tx of signed) {
          const sig = await connection.sendRawTransaction(tx.serialize());
          await connection.confirmTransaction(sig, "confirmed");
          signatures.push(sig);
        }

        return { signatures };
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setClaiming(false);
      }
    },
    [publicKey, signAllTransactions, connection]
  );

  return {
    launchToken,
    launching,
    getQuote,
    swap,
    trading,
    getClaimable,
    claimFees,
    claiming,
    error,
    clearError: () => setError(null),
  };
}
