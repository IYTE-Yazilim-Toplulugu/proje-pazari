'use client';
import React from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useUserLanguage } from '@/lib/hooks/authHooks';
import { useState } from 'react';

function AuthLanguageSync() {
    useUserLanguage();
    return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AuthLanguageSync />
                {children}
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
