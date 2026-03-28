'use client';

type PasswordStrengthIndicatorProps = {
  password?: string;
};

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { label: 'Weak', width: '33%', color: 'bg-red-500' };
  }
  if (score <= 4) {
    return { label: 'Medium', width: '66%', color: 'bg-yellow-500' };
  }
  return { label: 'Strong', width: '100%', color: 'bg-green-600' };
}

export default function PasswordStrengthIndicator({
  password = '',
}: PasswordStrengthIndicatorProps) {
  if (!password) {
    return null;
  }

  const strength = getStrength(password);

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
