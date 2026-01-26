'use client';

import { useState } from 'react';
import { useProjects, useSearchProjects } from '@/lib/hooks/projectHooks';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectStatus } from '@/lib/models';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Use search or regular fetch based on query
  const { data, isLoading, error } = searchQuery
    ? useSearchProjects(searchQuery, { 
        page: currentPage, 
        size: pageSize,
        status: statusFilter || undefined 
      })
    : useProjects({ 
        page: currentPage, 
        size: pageSize,
        status: statusFilter || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      });

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
          Projeler yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Proje Pazarı
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          IYTE öğrencilerinin birlikte çalışabileceği projeleri keşfedin
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Proje ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tüm Durumlar</option>
          <option value="OPEN">Açık</option>
          <option value="IN_PROGRESS">Devam Ediyor</option>
          <option value="COMPLETED">Tamamlandı</option>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Önceki
            </button>
            
            <span className="text-gray-700 dark:text-gray-300">
              Sayfa {currentPage + 1} / {data.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(data.totalPages - 1, p + 1))}
              disabled={currentPage >= data.totalPages - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Sonraki
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Henüz proje bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}