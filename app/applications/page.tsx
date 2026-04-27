'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/lib/hooks/authHooks';

export default function ApplicationsPage() {
  const { data: authContext, isLoading: isAuthLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !authContext?.isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, authContext, router]);

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-10 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!authContext?.isAuthenticated) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Basvurularim</h1>
        <p className="text-muted-foreground">Basvurular listesi bu sayfada gosterilecek.</p>
      </div>
    </main>
  );
}
