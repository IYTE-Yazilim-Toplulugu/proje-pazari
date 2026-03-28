'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useProjects } from '@/lib/hooks/projectHooks';
import ProjectCard from '@/components/projects/ProjectCard';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const tProjects = useTranslations('projects');

  const { data, isLoading } = useProjects({ page: 0, size: 6, status: 'OPEN' });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link 
          href="/projects" 
          className="inline-block mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          {t('cta')}
        </Link>
      </div>

      {!isLoading && data && data.projects.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {tProjects('status.OPEN')} {tProjects('title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}