'use client';
import React from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useUserLanguage } from '@/lib/hooks/authHooks';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    useUserLanguage();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
