'use client';

import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n-config';
import { setLocale } from '@/lib/actions/locale';
import { updateUserLanguage } from '@/lib/api/user';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/hooks/authHooks';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: user } = useSession();

  const switchLocale = (newLocale: string) => {
    startTransition(async () => {
      await setLocale(newLocale as any);
      if (user) {
          try {
            await updateUserLanguage(newLocale as 'tr' | 'en');
          } catch (error) {
            console.error('Failed to save language preference:', error);
          }
        }
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending || locale === loc}
          className={`px-3 py-1 rounded transition-colors ${
            locale === loc 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          } disabled:opacity-50`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}