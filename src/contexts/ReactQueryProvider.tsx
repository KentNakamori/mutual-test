// src/contexts/ReactQueryProvider.tsx
"use client";

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("React Query Error:", error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1分
      gcTime: 1000 * 60 * 5, // 5分 (以前のcacheTimeがgcTimeに変更されました)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}