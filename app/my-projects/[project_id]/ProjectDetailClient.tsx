"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import StructuredData from '@/components/seo/StructuredData';
import ApplicationsList from '@/components/projects/ApplicationsList';
import { useToast } from '@/lib/hooks/useToast';
import { useApiError } from '@/lib/hooks/useApiError';
import { useSession } from '@/lib/hooks/authHooks';
import {
  useProjectApplications,
  useProjectDetail,
  useUpdateApplicationStatus,
  useUpdateProjectStatus,
} from '@/lib/hooks/projectHooks';
import { ProjectApplicationStatusEnum, ProjectStatusEnum } from '@/lib/models';
import type { ProjectApplicationStatus, ProjectStatus } from '@/lib/models';

type ProjectDetailClientProps = {
  projectId: string;
};

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const t = useTranslations('projects');
  const router = useRouter();
  const { success } = useToast();
  const { handleError } = useApiError();
  const { data: project, isLoading, error } = useProjectDetail(projectId);
  const { data: session, isLoading: isSessionLoading } = useSession();

  const isOwner = !!session?.userId && !!project && String(session.userId) === project.ownerId;

  useEffect(() => {
    if (!isSessionLoading && !isLoading && project && !isOwner) {
      router.replace(`/projects/${projectId}`);
    }
  }, [isSessionLoading, isLoading, project, isOwner, projectId, router]);

  const {
    data: applications = [],
    isLoading: applicationsLoading,
  } = useProjectApplications(projectId, isOwner);

  const reviewMutation = useUpdateApplicationStatus(projectId);
  const statusMutation = useUpdateProjectStatus(projectId);

  const handleReview = async (
    applicationId: string,
    status: Extract<ProjectApplicationStatus, 'APPROVED' | 'REJECTED'>,
  ) => {
    try {
      await reviewMutation.mutateAsync({ applicationId, status });
      success(
        status === ProjectApplicationStatusEnum.enum.APPROVED
          ? t('applications.approvedTitle')
          : t('applications.rejectedTitle'),
        t('applications.updateDescription'),
      );
    } catch (mutationError) {
      handleError(mutationError);
    }
  };

  const handleStatusChange = async (status: ProjectStatus) => {
    try {
      await statusMutation.mutateAsync(status);
      success(t(`status.${status}`), '');
    } catch (mutationError) {
      handleError(mutationError);
    }
  };

  const nextStatuses: Record<string, ProjectStatus[]> = {
    DRAFT: [ProjectStatusEnum.enum.OPEN, ProjectStatusEnum.enum.CANCELLED],
    OPEN: [ProjectStatusEnum.enum.IN_PROGRESS, ProjectStatusEnum.enum.CANCELLED],
    IN_PROGRESS: [ProjectStatusEnum.enum.COMPLETED, ProjectStatusEnum.enum.CANCELLED],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (isLoading || isSessionLoading) {
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
          onClick={() => router.push('/my-projects')}
          className="mt-4 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
        >
          {t('prevPage')}
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    author: { '@type': 'Person', name: project.ownerName },
    dateCreated: project.createdAt,
  };

  return (
    <>
      <StructuredData data={projectSchema} />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => router.push('/my-projects')}
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

            <div className="mb-10">
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.description')}</h2>
              <div className="prose max-w-none dark:prose-invert">{project.description}</div>
            </div>

            {project.requiredSkills?.length ? (
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.requirements')}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] px-3 py-1 text-sm text-[var(--color-primary-dark)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {(nextStatuses[project.status ?? ''] ?? []).length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Proje Durumu</h2>
                <div className="flex flex-wrap gap-2">
                  {(nextStatuses[project.status ?? ''] ?? []).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={statusMutation.isPending}
                      className="rounded-lg bg-[var(--color-btn-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t(`status.${status}`)} olarak işaretle
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.applications')}</h2>
              <ApplicationsList
                applications={applications}
                loading={applicationsLoading || reviewMutation.isPending}
                onApprove={(id) => handleReview(id, ProjectApplicationStatusEnum.enum.APPROVED)}
                onReject={(id) => handleReview(id, ProjectApplicationStatusEnum.enum.REJECTED)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
