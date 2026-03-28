'use client';

import { useState } from 'react';

type ApplicationFormProps = {
  onSubmit: (message: string) => Promise<void> | void;
  submitting?: boolean;
};

export default function ApplicationForm({
  onSubmit,
  submitting = false,
}: ApplicationFormProps) {
  const [message, setMessage] = useState('');

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(message);
      }}
    >
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        placeholder="Kendinizi ve katkini kisaca anlatin"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[var(--color-btn-primary)] px-4 py-2 font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Gonderiliyor' : 'Basvuruyu gonder'}
      </button>
    </form>
  );
}
