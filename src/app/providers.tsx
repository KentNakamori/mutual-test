'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // 必要に応じてデフォルトオプションを設定
          staleTime: 5000,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}