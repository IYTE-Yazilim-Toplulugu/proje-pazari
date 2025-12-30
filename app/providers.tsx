'use client';

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/lib/hooks/useToast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { error: showError } = useToast();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && 'code' in error) {
            const code = (error as any).code;
            if (code >= 400 && code < 500) return false;
          }
          return failureCount < 2;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        // Global error handling
        console.error('Query error:', error);
        // Show toast notification
        if (error instanceof Error) {
          showError('Veri yüklenirken hata oluştu', error.message);
        }
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
