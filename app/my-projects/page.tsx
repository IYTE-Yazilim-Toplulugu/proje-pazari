'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/hooks/authHooks';
import { useQuery } from '@tanstack/react-query';
import { user as userApi } from '@/lib/api';
import { getProjects } from '@/lib/api/project';
import ProjectCard from '@/components/projects/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/models';

async function fetchAllMyProjects(userId: string): Promise<Project[]> {
  const all: Project[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const response = await getProjects({ page, size: 20 });
    all.push(...(response.projects ?? []).filter((p: Project) => p.ownerId === userId));
    totalPages = response.totalPages ?? 1;
    page++;
  }

  return all;
}

export default function MyProjectsPage() {
  const { data: authContext, isLoading: isAuthLoading } = useSession();
  const router = useRouter();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userApi.getCurrentUser,
    enabled: authContext?.isAuthenticated === true,
  });

  const { data: myProjects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ['myProjects', user?.id],
    queryFn: () => fetchAllMyProjects(user!.id!),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isAuthLoading && !authContext?.isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, authContext, router]);

  const isLoading = isAuthLoading || isUserLoading || isProjectsLoading;

  if (!isAuthLoading && !authContext?.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Projelerim
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : myProjects.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Henüz hiç proje oluşturmadınız.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <ProjectCard key={project.id ?? ''} project={project} href={`/my-projects/${project.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
