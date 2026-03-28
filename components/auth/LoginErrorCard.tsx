import { useTranslations } from 'next-intl';

type LoginErrorCardProps = {
  message: string;
};

export default function LoginErrorCard({ message }: LoginErrorCardProps) {
  const t = useTranslations('auth.login.errors');

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
    >
      <strong className="font-semibold">{t('title')}:</strong> {message}
    </div>
  );
}
