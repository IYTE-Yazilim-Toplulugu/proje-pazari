"use client";

import { useTranslations } from 'next-intl';
import type { ProjectApplication } from '@/lib/models';
import { ProjectApplicationStatusEnum } from '@/lib/models';

type ApplicationsListProps = {
  applications: ProjectApplication[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
};

export default function ApplicationsList({
  applications,
  onApprove,
  onReject,
  loading = false,
}: ApplicationsListProps) {
  const t = useTranslations('projects.applications');

  if (!applications.length) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{t('empty')}</p>;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.applicationId}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{application.applicantName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{application.applicantEmail}</p>
            </div>
            <span className="rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
              {application.status}
            </span>
          </div>

          <p className="mb-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
            {t('noMessage')}
          </p>

          {application.status === ProjectApplicationStatusEnum.enum.PENDING ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onApprove(application.applicationId)}
                disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('approve')}
              </button>
              <button
                onClick={() => onReject(application.applicationId)}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('reject')}
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}