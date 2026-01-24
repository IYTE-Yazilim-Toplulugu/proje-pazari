'use client';

import {useLocale, useTranslations} from 'next-intl';
import {locales} from '@/i18n';
import {useTransition} from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
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