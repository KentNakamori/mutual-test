// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}