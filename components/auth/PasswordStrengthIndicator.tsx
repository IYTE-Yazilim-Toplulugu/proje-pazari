'use client';

import { getPasswordStrength, PasswordStrength } from '@/lib/utils/password';

type PasswordStrengthIndicatorProps = {
  password?: string;
};

const STRENGTH_UI: Record<PasswordStrength, { label: string; width: string; color: string }> = {
  weak:   { label: 'Weak',   width: '33%',  color: 'bg-red-500' },
  medium: { label: 'Medium', width: '66%',  color: 'bg-yellow-500' },
  strong: { label: 'Strong', width: '100%', color: 'bg-green-600' },
};

export default function PasswordStrengthIndicator({
  password = '',
}: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null;
  }

  const { strength } = getPasswordStrength(password);
  const ui = STRENGTH_UI[strength];

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded ${ui.color}`}
          style={{ width: ui.width }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{ui.label}</p>
    </div>
  );
}
