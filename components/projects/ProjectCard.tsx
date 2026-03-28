'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/models';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  
  const statusColors = {
    DRAFT: 'bg-gray-500',
    OPEN: 'bg-green-500',
    IN_PROGRESS: 'bg-[var(--color-primary)]',
    COMPLETED: 'bg-purple-500',
    CANCELLED: 'bg-red-500',
  };

  return (
    <Link href={`/projects/${project.id}`} aria-label={`${project.title} ${t('details.viewProject')}`}>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
            {project.title}
          </h3>
            <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColors[project.status]}`}>
              {t(`status.${project.status}`)}
            </span>
        </div>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.summary}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] text-[var(--color-primary-dark)]"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Owner & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {project.owner.profilePictureUrl ? (
              <Image
                src={project.owner.profilePictureUrl}
                alt={project.owner.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                {project.owner.name.charAt(0)}
              </div>
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {project.owner.name}
            </span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('card.applicationCount', { count: project.applicationsCount })}
          </div>
        </div>
      </article>
    </Link>
  );
}
