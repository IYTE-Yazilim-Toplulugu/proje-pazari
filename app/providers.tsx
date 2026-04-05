'use client';

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import ApiStatus from '@/components/shared/ApiStatus';

type ErrorWithCode = Error & { code?: number };

export default function Providers({ children }: { children: React.ReactNode }) {
  const { error: showError } = useToast();
  const t = useTranslations('common');
  const tRef = useRef(t);
  tRef.current = t;

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
          if (error instanceof Error && 'code' in error) {
            const code = (error as ErrorWithCode).code;
            if (typeof code === 'number' && code >= 400 && code < 500) return false;
          }
          return failureCount < 2;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query error:', error);
        if (error instanceof Error) {
          showError(tRef.current('fetchErrorTitle'), error.message);
        }
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ApiStatus />
      <AuthProvider>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
