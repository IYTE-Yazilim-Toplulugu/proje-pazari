'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProjects, useSearchProjects } from '@/lib/hooks/projectHooks';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectStatus } from '@/lib/models';

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

  const projectsQuery = useProjects(listParams);
  const searchProjectsQuery = useSearchProjects(searchQuery, searchParams);
  const isSearchMode = searchQuery.trim().length > 0;
  const activeQuery = isSearchMode ? searchProjectsQuery : projectsQuery;
  const { data, isLoading, error } = activeQuery;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          {t('loadingError')}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('pageTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('filterByStatus')}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        >
          <option value="">{t('allStatuses')}</option>
          <option value="OPEN">{t('status.OPEN')}</option>
          <option value="IN_PROGRESS">{t('status.IN_PROGRESS')}</option>
          <option value="COMPLETED">{t('status.COMPLETED')}</option>
        </select>
      </div>

      {/* Projects Grid */}
      {data && data.projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
            >
              {t('prevPage')}
            </button>
            
            <span className="text-gray-700 dark:text-gray-300">
              {t('page', { current: currentPage + 1, total: data.totalPages })}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(data.totalPages - 1, p + 1))}
              disabled={currentPage >= data.totalPages - 1}
              className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
            >
              {t('nextPage')}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {t('noProjectsFound')}
          </p>
        </div>
      )}
    </div>
  );
}
