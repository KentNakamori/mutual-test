// src/components/ReactQueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import PrismLoader from './PrismLoader';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // 1ブラウザタブ = 1クライアントを保証
  const [client] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={client}>
      <PrismLoader />
      {children}
    </QueryClientProvider>
  );
}
