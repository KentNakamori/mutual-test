"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 