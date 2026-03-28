"use client";

import { useTranslations } from 'next-intl';

type PasswordStrengthIndicatorProps = {
  password?: string;
};

const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
};

export default function PasswordStrengthIndicator({ password = '' }: PasswordStrengthIndicatorProps) {
  const t = useTranslations('auth.register.passwordStrength');
  const score = getStrength(password);

  const labels = [t('veryWeak'), t('weak'), t('medium'), t('strong'), t('veryStrong')];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="mb-1 flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full ${index < score ? 'bg-[var(--color-primary)]' : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{t('label')}: {labels[score]}</p>
    </div>
  );
}
