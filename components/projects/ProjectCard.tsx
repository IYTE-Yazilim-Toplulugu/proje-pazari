'use client';

import Link from 'next/link';
import type { Project, ProjectStatus } from '@/lib/models';
import { ProjectStatusEnum } from '@/lib/models';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  
  const statusColors: Record<ProjectStatus, string> = {
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
            <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColors[project.status ?? ProjectStatusEnum.enum.DRAFT]}`}>
              {t(`status.${project.status ?? ProjectStatusEnum.enum.DRAFT}`)}
            </span>
        </div>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.summary}
        </p>

        {/* Skills */}
        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.requiredSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] text-[var(--color-primary-dark)]"
              >
                {skill}
              </span>
            ))}
            {project.requiredSkills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{project.requiredSkills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Owner & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
              {project.ownerName?.charAt(0) ?? '?'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {project.ownerName}
            </span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('card.applicationCount', { count: project.applicationCount ?? 0 })}
          </div>
        </div>
      </article>
    </Link>
  );
}
