'use client';

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import ApiStatus from '@/components/shared/ApiStatus';

type ErrorWithCode = Error & { code?: number };
type ToastHandler = (message: string, description?: string) => void;

const latestProviderHandlers: {
  t?: (key: string) => string;
  showError?: ToastHandler;
  showWarning?: ToastHandler;
} = {};

export default function Providers({ children }: { children: React.ReactNode }) {
  const { error: showError, warning: showWarning } = useToast();
  const t = useTranslations('common');

  useEffect(() => {
    latestProviderHandlers.t = t;
    latestProviderHandlers.showError = showError;
    latestProviderHandlers.showWarning = showWarning;
  }, [showError, showWarning, t]);

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
          const translate = latestProviderHandlers.t ?? t;
          const showLatestError = latestProviderHandlers.showError ?? showError;
          showLatestError(translate('fetchErrorTitle'), error.message);
        }
      },
    }),
  }));

  const handleSessionExpired = useCallback(() => {
    const translate = latestProviderHandlers.t ?? t;
    const showLatestWarning = latestProviderHandlers.showWarning ?? showWarning;
    showLatestWarning(
      translate('sessionExpiredTitle'),
      translate('sessionExpiredDesc')
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
