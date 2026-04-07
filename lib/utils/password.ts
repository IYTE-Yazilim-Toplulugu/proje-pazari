export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export type PasswordStrengthResult = {
  label: PasswordStrength;
  width: '33%' | '66%' | '100%';
  color: 'bg-red-500' | 'bg-yellow-500' | 'bg-green-600';
};

export const PASSWORD_RULES = {
  minLength: (val: string) => val.length >= 8,
  hasLowercase: (val: string) => /[a-z]/.test(val),
  hasUppercase: (val: string) => /[A-Z]/.test(val),
  hasDigit: (val: string) => /\d/.test(val),
  hasSpecial: (val: string) => /[^A-Za-z0-9]/.test(val),
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const score = Object.values(PASSWORD_RULES).filter((check) => check(password)).length;

  if (score <= 2) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
  if (score <= 4) return { label: 'Medium', width: '66%', color: 'bg-yellow-500' };
  return { label: 'Strong', width: '100%', color: 'bg-green-600' };
}
