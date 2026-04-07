export type PasswordFlags = {
  minLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
};

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export type PasswordStrengthResult = {
  flags: PasswordFlags;
  strength: PasswordStrength;
  score: number;
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const flags: PasswordFlags = {
    minLength: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(flags).filter(Boolean).length;
  const strength: PasswordStrength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

  return { flags, strength, score };
}
