'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">{t('errorTitle')}</h2>
      <p className="text-muted-foreground mb-6">
        {t('errorDesc')}
      </p>
      <Button onClick={reset}>{t('tryAgain')}</Button>
    </div>
  );
}
