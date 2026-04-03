"use client";

import WalletProvider from "@/lib/context/WalletProvider";
import { AppProvider } from "@/lib/context/AppContext";
import { ToastProvider } from "@/app/components/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AppProvider>
        <ToastProvider>{children}</ToastProvider>
      </AppProvider>
    </WalletProvider>
  );
}
