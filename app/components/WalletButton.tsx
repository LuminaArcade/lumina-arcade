"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletIcon } from "./icons";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function WalletButton({ className = "" }: { className?: string }) {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  useCurrentUser(); // ensures user profile is created on connect

  if (connecting) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 rounded-lg bg-neon-purple/50 px-5 py-2.5 text-sm font-semibold text-white ${className}`}
      >
        Connecting...
      </button>
    );
  }

  if (publicKey) {
    const addr = publicKey.toBase58();
    const short = addr.slice(0, 4) + "..." + addr.slice(-4);
    return (
      <button
        onClick={() => disconnect()}
        className={`flex items-center gap-2 rounded-lg border border-neon-purple px-5 py-2.5 text-sm font-semibold text-neon-purple transition-all hover:bg-neon-purple/10 ${className}`}
      >
        <WalletIcon className="h-4 w-4" />
        {short}
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className={`flex items-center gap-2 rounded-lg bg-neon-purple px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] ${className}`}
    >
      <WalletIcon className="h-4 w-4" />
      Connect Wallet
    </button>
  );
}
