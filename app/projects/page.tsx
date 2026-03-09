import { Suspense } from 'react';
import ProjectsGridSkeleton from '@/components/projects/ProjectsGridSkeleton';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsGridSkeleton />}>
      <ProjectsGrid />
    </Suspense>
  );
}