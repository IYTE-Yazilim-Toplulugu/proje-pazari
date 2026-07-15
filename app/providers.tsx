'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import ApiStatus from '@/components/shared/ApiStatus';
import { ResponseCodeSchema } from '@/lib/models/Api';

type ErrorWithCode = Error & { code?: number };

export default function Providers({ children }: { children: React.ReactNode }) {
  const { error: showError, warning: showWarning } = useToast();
  const t = useTranslations('common');

  // useToast()/useTranslations() return fresh references on every render, so we
  // read them through a ref (updated in an effect, never during render) instead
  // of putting them in the deps below. That keeps the cache subscription and the
  // session-expired listener registered exactly once — otherwise they would be
  // torn down and re-added every render, and an `auth:session-expired` event
  // arriving in that gap would be silently dropped.
  const handlersRef = useRef({ t, showError, showWarning });
  useEffect(() => {
    handlersRef.current = { t, showError, showWarning };
  }, [showError, showWarning, t]);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
          if (error instanceof Error && 'code' in error) {
            const code = (error as ErrorWithCode).code;
            if (typeof code === 'number' && code >= ResponseCodeSchema.enum.BAD_REQUEST && code <= ResponseCodeSchema.enum.VALIDATION_ERROR) return false;
          }
          return failureCount < 2;
        },
      },
    },
  }));

  // Surface query errors via a cache subscription instead of a QueryCache
  // `onError` closure captured at client-creation time. Reads the latest
  // handlers from the ref so the subscription is set up only once.
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        const error = event.action.error;
        console.error('Query error:', error);
        if (error instanceof Error) {
          const { t: translate, showError: showLatestError } = handlersRef.current;
          showLatestError(translate('fetchErrorTitle'), error.message);
        }
      }
    });
    return unsubscribe;
  }, [queryClient]);

  const handleSessionExpired = useCallback(() => {
    const { t: translate, showWarning: showLatestWarning } = handlersRef.current;
    showLatestWarning(
      translate('sessionExpiredTitle'),
      translate('sessionExpiredDesc')
    );
    queryClient.clear();
  }, [queryClient]);

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
