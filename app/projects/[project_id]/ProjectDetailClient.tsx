"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import StructuredData from '@/components/seo/StructuredData';
import ApplicationForm from '@/components/projects/ApplicationForm';
import ApplicationsList from '@/components/projects/ApplicationsList';
import { useToast } from '@/lib/hooks/useToast';
import { useApiError } from '@/lib/hooks/useApiError';
import { useSession } from '@/lib/hooks/authHooks';
import {
  useApplyToProject,
  useProjectApplications,
  useProjectDetail,
  useUpdateApplicationStatus,
  useWithdrawApplication,
} from '@/lib/hooks/projectHooks';

type ProjectDetailClientProps = {
  projectId: string;
};

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const t = useTranslations('projects');
  const router = useRouter();
  const { success } = useToast();
  const { handleError } = useApiError();
  const { data: project, isLoading, error } = useProjectDetail(projectId);
  const { data: session } = useSession();
  const {
    data: applications = [],
    isLoading: applicationsLoading,
  } = useProjectApplications(projectId, !!session?.isAuthenticated);
  const applyMutation = useApplyToProject(projectId);
  const withdrawMutation = useWithdrawApplication(projectId);
  const reviewMutation = useUpdateApplicationStatus(projectId);
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

  const isOwner = session?.userId != null && String(session.userId) === project.owner.id;
  const canApply = !!session?.isAuthenticated && !isOwner && project.status === 'OPEN';
  const myApplication = applications.find((application) => String(application.user.id) === String(session?.userId));

  const handleApply = async (message: string) => {
    try {
      await applyMutation.mutateAsync({ message });
      success(t('applicationForm.successTitle'), t('applicationForm.successDescription'));
      setShowApplicationForm(false);
    } catch (mutationError) {
      handleError(mutationError);
    }
  };

  const handleWithdraw = async () => {
    if (!myApplication) {
      return;
    }

    try {
      await withdrawMutation.mutateAsync({ applicationId: myApplication.id });
      success(t('applicationForm.withdrawSuccessTitle'), t('applicationForm.withdrawSuccessDescription'));
    } catch (mutationError) {
      handleError(mutationError);
    }
  };

  const handleReview = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await reviewMutation.mutateAsync({ applicationId, status });
      success(
        status === 'APPROVED' ? t('applications.approvedTitle') : t('applications.rejectedTitle'),
        t('applications.updateDescription'),
      );
    } catch (mutationError) {
      handleError(mutationError);
    }
  };

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

            {project.requirements ? (
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.requirements')}</h2>
                <p className="text-gray-700 dark:text-gray-300">{project.requirements}</p>
              </div>
            ) : null}

            {project.teamMembers?.length ? (
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.teamMembers')}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.map((member) => (
                    <span
                      key={member.id}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3 py-1 text-sm text-[var(--color-text-primary)]"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

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
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                {!myApplication ? (
                  <>
                    <button
                      onClick={() => setShowApplicationForm((s) => !s)}
                      className="w-full rounded-lg bg-[var(--color-btn-primary)] px-4 py-3 font-semibold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-btn-primary-hover)]"
                    >
                      {t('details.apply')}
                    </button>

                    {showApplicationForm ? (
                      <div className="mt-4">
                        <ApplicationForm onSubmit={handleApply} submitting={applyMutation.isPending} />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-elevated)] p-4">
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {t('applicationForm.currentStatus', { status: myApplication.status })}
                    </p>
                    {myApplication.status === 'PENDING' ? (
                      <button
                        onClick={handleWithdraw}
                        disabled={withdrawMutation.isPending}
                        className="mt-3 rounded-lg bg-[var(--color-btn-danger)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {t('applicationForm.withdraw')}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {isOwner ? (
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{t('details.applications')}</h2>
                <ApplicationsList
                  applications={applications}
                  loading={applicationsLoading || reviewMutation.isPending}
                  onApprove={(id) => handleReview(id, 'APPROVED')}
                  onReject={(id) => handleReview(id, 'REJECTED')}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
