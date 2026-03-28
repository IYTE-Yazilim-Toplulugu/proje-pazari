"use client";

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const createApplicationSchema = (t: (key: string) => string) =>
  z.object({
    message: z
      .string()
      .min(50, t('errors.messageMin'))
      .max(500, t('errors.messageMax')),
  });

type ApplicationFormValues = {
  message: string;
};

type ApplicationFormProps = {
  onSubmit: (message: string) => Promise<void>;
  submitting?: boolean;
};

export default function ApplicationForm({ onSubmit, submitting = false }: ApplicationFormProps) {
  const t = useTranslations('projects.applicationForm');
  const [characters, setCharacters] = useState(0);

  const schema = useMemo(() => createApplicationSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: '',
    },
  });

  const onFormSubmit = async (values: ApplicationFormValues) => {
    await onSubmit(values.message);
    reset();
    setCharacters(0);
  };

  const messageField = register('message', {
    onChange: (event) => {
      const value = (event.target as HTMLTextAreaElement).value;
      setCharacters(value.length);
    },
  });

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="application-message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('messageLabel')}
        </label>
        <textarea
          id="application-message"
          {...messageField}
          rows={5}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder={t('messagePlaceholder')}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
        ) : null}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('counter', { count: characters })}</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--color-btn-primary)] px-4 py-3 font-semibold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-btn-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
