'use client';

import { useLocale } from 'next-intl';
import { locales } from '@/i18n-config';
import type { Locale } from '@/i18n-config';
import { setLocale } from '@/lib/actions/locale';
import { updateUserLanguage } from '@/lib/api/user';
import { useApiError } from '@/lib/hooks/useApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const refreshProfile = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['session'] }),
      queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
    ]);
  };

  const { mutate: switchLocale, isPending } = useMutation({
    retry: false,
    mutationFn: async (newLocale: Locale) => {
      if (persistPreference) {
        await updateUserLanguage(newLocale);
      }

      try {
        await setLocale(newLocale);
      } catch (error) {
        if (persistPreference) {
          try {
            // Restore the preference to the locale still displayed by the UI.
            await updateUserLanguage(locale as Locale);
          } catch (rollbackError) {
            handleError(rollbackError);
          } finally {
            // Refetch even if rollback fails so cached profile data stays truthful.
            await refreshProfile();
            router.refresh();
          }
        }
        throw error;
      }
    },
    onSuccess: async () => {
      if (persistPreference) {
        await refreshProfile();
      }
      router.refresh();
    },
    onError: (error) => handleError(error),
  });

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
