'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import ApiStatus from '@/components/shared/ApiStatus';

type ErrorWithCode = Error & { code?: number };

export default function Providers({ children }: { children: React.ReactNode }) {
  const { error: showError, warning: showWarning } = useToast();
  const t = useTranslations('common');

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
  }));

  // Surface query errors via a cache subscription instead of a QueryCache
  // `onError` closure captured at client-creation time. The effect re-runs when
  // the translation/toast handlers change, so it always uses the current ones
  // without resorting to refs read during render or module-level state.
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        const error = event.action.error;
        console.error('Query error:', error);
        if (error instanceof Error) {
          showError(t('fetchErrorTitle'), error.message);
        }
      }
    });
    return unsubscribe;
  }, [queryClient, showError, t]);

  const handleSessionExpired = useCallback(() => {
    showWarning(
      t('sessionExpiredTitle'),
      t('sessionExpiredDesc')
    );
    queryClient.clear();
  }, [queryClient, showWarning, t]);

  useEffect(() => {
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [handleSessionExpired]);

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
