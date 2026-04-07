'use client';

import { getPasswordStrength } from '@/lib/utils/password';

type PasswordStrengthIndicatorProps = {
  password?: string;
};

export default function PasswordStrengthIndicator({
  password = '',
}: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{strength.label}</p>
    </div>
  );
}
