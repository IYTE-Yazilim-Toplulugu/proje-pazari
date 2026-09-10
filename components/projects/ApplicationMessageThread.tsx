'use client';

import { type FormEvent, useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { useApplicationMessages, useSendApplicationMessage } from '@/lib/hooks/chatHooks';

type ApplicationMessageThreadProps = {
  applicationId: string;
  currentUserId?: string;
};

export default function ApplicationMessageThread({
  applicationId,
  currentUserId,
}: ApplicationMessageThreadProps) {
  const t = useTranslations('projects.applications.chat');
  const locale = useLocale();
  const inputId = useId();
  const [body, setBody] = useState('');
  const messagesQuery = useApplicationMessages(applicationId);
  const sendMutation = useSendApplicationMessage(applicationId);
  const messages = messagesQuery.data?.content ?? [];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody || sendMutation.isPending) {
      return;
    }
    try {
      await sendMutation.mutateAsync(trimmedBody);
      setBody('');
    } catch {
      // The mutation state renders a localized, retry-safe error below the composer.
    }
  };

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date);
  };

  return (
    <section
      aria-label={t('title')}
      className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
    >
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('title')}</h4>

      <div className="mt-3 max-h-72 space-y-3 overflow-y-auto" aria-live="polite">
        {messagesQuery.isLoading ? (
          <p role="status" className="text-sm text-gray-500 dark:text-gray-400">
            {t('loading')}
          </p>
        ) : messagesQuery.isError ? (
          <div role="alert" className="text-sm text-red-600 dark:text-red-400">
            <p>{t('loadError')}</p>
            <button
              type="button"
              onClick={() => messagesQuery.refetch()}
              className="mt-2 font-medium underline underline-offset-2"
            >
              {t('retry')}
            </button>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('empty')}</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              return (
                <li
                  key={message.id}
                  data-testid={`message-${message.id}`}
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                    isCurrentUser
                      ? 'ml-auto bg-[var(--color-primary)] text-white'
                      : 'mr-auto bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
                  }`}
                >
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-3 text-xs opacity-75">
                    <span>{isCurrentUser ? t('you') : t('participant')}</span>
                    <time dateTime={message.createdAt}>{formatTimestamp(message.createdAt)}</time>
                  </div>
                  <p className="break-words whitespace-pre-wrap">{message.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="mt-4 space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-800 dark:text-gray-200">
          {t('inputLabel')}
        </label>
        <textarea
          id={inputId}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          rows={3}
          disabled={sendMutation.isPending}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('characterCount', { count: body.length })}
          </span>
          <button
            type="submit"
            disabled={!body.trim() || sendMutation.isPending}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendMutation.isPending ? t('sending') : t('send')}
          </button>
        </div>
        {sendMutation.isError ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {t('sendError')}
          </p>
        ) : null}
      </form>
    </section>
  );
}
