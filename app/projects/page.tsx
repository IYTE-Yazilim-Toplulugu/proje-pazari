'use client';

import { useState, useEffect } from 'react';
import { useProjects, useSearchProjects } from '@/lib/hooks/projectHooks';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectStatus } from '@/lib/models';
import { useTranslations } from 'next-intl';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const pageSize = 12;

  const projectsResult = useProjects({
    page: currentPage,
    size: pageSize,
    status: statusFilter || undefined,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  }, !searchQuery);

  const searchResult = useSearchProjects(debouncedQuery, {
    page: currentPage,
    size: pageSize,
    status: statusFilter || undefined,
  });

  const { data, isLoading, error } = debouncedQuery ? searchResult : projectsResult;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 dark:text-red-400">{t('loadingError')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{t('allStatuses')}</option>
          <option value="DRAFT">{t('status.DRAFT')}</option>
          <option value="OPEN">{t('status.OPEN')}</option>
          <option value="IN_PROGRESS">{t('status.IN_PROGRESS')}</option>
          <option value="COMPLETED">{t('status.COMPLETED')}</option>
          <option value="CANCELLED">{t('status.CANCELLED')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : data && (data.projects?.length ?? 0) > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {t('prevPage')}
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              {t('page', { current: currentPage + 1, total: data.totalPages ?? 1 })}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min((data.totalPages ?? 1) - 1, p + 1))}
              disabled={currentPage >= (data.totalPages ?? 1) - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {t('nextPage')}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t('noProjectsFound')}</p>
        </div>
      )}
    </div>
  );
}
