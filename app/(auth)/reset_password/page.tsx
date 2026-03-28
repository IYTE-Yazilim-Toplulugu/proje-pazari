'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';

function ResetPasswordContent() {
  const t = useTranslations('common');

  return (
    <main className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Reset Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('common');

  return (
    <Suspense fallback={<div className="text-center py-10">{t('loading')}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
