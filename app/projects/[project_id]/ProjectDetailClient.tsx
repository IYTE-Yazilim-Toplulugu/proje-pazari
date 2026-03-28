"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import StructuredData from '@/components/seo/StructuredData';
import { useProject } from '@/lib/hooks/projectHooks';
import { useSession } from '@/lib/hooks/authHooks';

type ProjectDetailClientProps = {
  projectId: string;
};

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const t = useTranslations('projects');
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(projectId);
  const { data: session } = useSession();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-32 rounded bg-gray-200 dark:bg-gray-700" />
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

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    author: {
      '@type': 'Person',
      name: project.owner.name,
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
  };

  const isOwner = false;
  const canApply = !!session?.isAuthenticated && !isOwner && project.status === 'OPEN';

  return (
    <>
      <StructuredData data={projectSchema} />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            ← {t('prevPage')}
          </button>

          <div className="mb-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
            <div className="mb-6 flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-white">
                {t(`status.${project.status}`)}
              </span>
            </div>

            <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-6 dark:border-gray-700">
              {project.owner.profilePictureUrl ? (
                <Image
                  src={project.owner.profilePictureUrl}
                  alt={project.owner.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-semibold text-[var(--color-text-inverse)]">
                  {project.owner.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{project.owner.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('details.owner')}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.requirements')}</h2>
              <p className="text-gray-700 dark:text-gray-300">{project.summary}</p>
            </div>

            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.team')}</h2>
              <div className="prose max-w-none dark:prose-invert">{project.description}</div>
            </div>

            {project.tags?.length ? (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] px-3 py-1 text-sm text-[var(--color-primary-dark)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {canApply ? (
              <div className="mt-6">
                <button
                  onClick={() => setShowApplicationForm((s) => !s)}
                  className="w-full rounded-lg bg-[var(--color-btn-primary)] px-4 py-3 font-semibold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-btn-primary-hover)]"
                >
                  {t('details.apply')}
                </button>
              </div>
            ) : null}

            {showApplicationForm ? (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">{t('details.apply')}</div>
            ) : null}

            {isOwner ? (
              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {t('details.applications')}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}