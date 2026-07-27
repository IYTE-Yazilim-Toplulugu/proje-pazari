'use client';

import { useLocale } from 'next-intl';
import { locales } from '@/i18n-config';
import type { Locale } from '@/i18n-config';
import { setLocale } from '@/lib/actions/locale';
import { updateUserLanguage } from '@/lib/api/user';
import { useApiError } from '@/lib/hooks/useApiError';
import { useQueryClient } from '@tanstack/react-query';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  disabled?: boolean;
  persistPreference?: boolean;
}

export default function LanguageSwitcher({
  disabled = false,
  persistPreference = false,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { handleError } = useApiError();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    startTransition(async () => {
      try {
        if (persistPreference) {
          await updateUserLanguage(newLocale);
        }

        await setLocale(newLocale);

        if (persistPreference) {
          void queryClient.invalidateQueries({ queryKey: ['session'] });
          void queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }

        router.refresh();
      } catch (error) {
        handleError(error);
      }
    });
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={disabled || isPending || locale === loc}
          className={`px-3 py-1 rounded transition-colors ${
            locale === loc 
              ? 'bg-[var(--color-btn-primary)] text-[var(--color-text-inverse)]' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          } disabled:opacity-50`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
