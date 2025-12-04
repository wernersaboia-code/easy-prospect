'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      // Força usar nossa API customizada
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}