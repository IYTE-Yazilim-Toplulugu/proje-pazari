"use client";

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectCardSkeleton from '@/components/projects/ProjectCardSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import { ProjectStatus } from '@/lib/models';
import { useProjects, useSearchProjects } from '@/lib/hooks/projectHooks';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const listParams = {
    page: currentPage,
    size: pageSize,
    status: statusFilter || undefined,
    sortBy: 'createdAt',
    sortDirection: 'DESC' as const,
  };

  const searchParams = {
    page: currentPage,
    size: pageSize,
    status: statusFilter || undefined,
  };

  const isSearchMode = searchQuery.trim().length > 0;
  const listQuery = useProjects(listParams);
  const searchQueryResult = useSearchProjects(searchQuery, searchParams);
  const activeQuery = isSearchMode ? searchQueryResult : listQuery;
  const { data, isLoading, error } = activeQuery;

  const hasProjects = (data?.projects?.length ?? 0) > 0;

  const paginationLabel = useMemo(() => {
    if (!data) return '';
    return t('page', { current: currentPage + 1, total: Math.max(1, data.totalPages) });
  }, [data, currentPage, t]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('pageTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('filterByStatus')}</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as ProjectStatus | '');
            setCurrentPage(0);
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">{t('allStatuses')}</option>
          <option value="OPEN">{t('status.OPEN')}</option>
          <option value="IN_PROGRESS">{t('status.IN_PROGRESS')}</option>
          <option value="COMPLETED">{t('status.COMPLETED')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="py-12 text-center">
          <p className="text-red-600 dark:text-red-400">{t('loadingError')}</p>
        </div>
      ) : null}

      {!isLoading && !error && hasProjects ? (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="rounded-lg bg-[var(--color-btn-primary)] px-4 py-2 text-[var(--color-text-inverse)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--color-btn-primary-hover)]"
            >
              {t('prevPage')}
            </button>

            <span className="text-gray-700 dark:text-gray-300">{paginationLabel}</span>

            <button
              onClick={() => setCurrentPage((p) => Math.min((data?.totalPages ?? 1) - 1, p + 1))}
              disabled={currentPage >= ((data?.totalPages ?? 1) - 1)}
              className="rounded-lg bg-[var(--color-btn-primary)] px-4 py-2 text-[var(--color-text-inverse)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--color-btn-primary-hover)]"
            >
              {t('nextPage')}
            </button>
          </div>
        </>
      ) : null}

      {!isLoading && !error && !hasProjects ? (
        <EmptyState
          title={t('noProjectsFound')}
          description={isSearchMode ? t('searchPlaceholder') : t('filterByStatus')}
        />
      ) : null}
    </div>
  );
}
