'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          appearance: {
            theme: 'dark',
            accentColor: '#00FFFF',
          },
          loginMethods: ['wallet', 'twitter'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0F0F22',
              color: '#F0F0FF',
              border: '1px solid rgba(0,255,255,0.2)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
            },
          }}
        />
      </PrivyProvider>
    </QueryClientProvider>
  );
}
