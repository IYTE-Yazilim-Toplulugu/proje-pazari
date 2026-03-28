'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useProject } from '@/lib/hooks/projectHooks';
import { useSession } from '@/lib/hooks/authHooks';
import Image from 'next/image';

export default function ProjectDetailPage() {
  const t = useTranslations('projects');
  const params = useParams();
  const router = useRouter();
  const projectId = params.project_id as string;

  const { data: project, isLoading, error } = useProject(projectId);
  const { data: session } = useSession();

  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 dark:text-red-400">{t('loadingError')}</p>
        <button
          onClick={() => router.push('/projects')}
          className="mt-4 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
        >
          {t('prevPage')}
        </button>
      </div>
    );
  }

  const isOwner = false;
  const canApply = !!session?.isAuthenticated && !isOwner && project.status === 'OPEN';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] flex items-center gap-2"
        >
          ← {t('prevPage')}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-[var(--color-primary)]">
              {t(`status.${project.status}`)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            {project.owner.profilePictureUrl ? (
              <Image
                src={project.owner.profilePictureUrl}
                alt={project.owner.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                {project.owner.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{project.owner.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('details.owner')}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('details.requirements')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{project.summary}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('details.team')}
            </h2>
            <div className="prose dark:prose-invert max-w-none">{project.description}</div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] text-[var(--color-primary-dark)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {canApply && (
            <div className="mt-6">
              <button
                onClick={() => setShowApplicationForm((s) => !s)}
                className="w-full text-[var(--color-text-inverse)] font-semibold py-3 px-4 rounded-lg transition-colors bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
              >
                {t('details.apply')}
              </button>
            </div>
          )}

          {showApplicationForm && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {t('details.apply')}
            </div>
          )}

          {isOwner && (
            <div className="mt-6">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {t('details.applications')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
