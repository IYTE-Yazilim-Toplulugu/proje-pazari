'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Bir şeyler ters gitti!</h2>
      <p className="text-muted-foreground mb-6">
        Lütfen sayfayı yenilemeyi deneyin.
      </p>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  );
}
