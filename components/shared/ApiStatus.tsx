'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ApiStatus() {
    const t = useTranslations('apiStatus');
    const queryClient = useQueryClient();
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (process.env.NODE_ENV !== 'development') return null;

    const queries = queryClient.getQueryCache().getAll();
    const failedQueries = queries.filter(q => q.state.status === 'error');

    return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-semibold mb-2">{t('title')}</h3>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isOnline ? t('online') : t('offline')}</span>
        </div>
        <div>{t('totalQueries', { count: queries.length })}</div>
        <div className="text-red-500">{t('failedQueries', { count: failedQueries.length })}</div>
      </div>
    </div>
  );
}