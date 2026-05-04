'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { user as userApi } from '@/lib/api';
import { useSession } from '@/lib/hooks/authHooks';
import { ProjectApplicationStatusEnum } from '@/lib/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


export default function ApplicationsPage() {
  const { data: authContext, isLoading: isAuthLoading } = useSession();
  const router = useRouter();
  const t = useTranslations('profile');
  const tApplications = useTranslations('projects.applications');

  const {
    data: applicationsResponse,
    isLoading: isApplicationsLoading,
    isError,
  } = useQuery({
    queryKey: ['my-applications'],
    queryFn: userApi.getMyApplications,
    enabled: authContext?.isAuthenticated === true,
  });

  useEffect(() => {
    if (!isAuthLoading && !authContext?.isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, authContext, router]);

  const isLoading = isAuthLoading || isApplicationsLoading;
  const applications = applicationsResponse?.applications ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-5 w-80" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-36" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authContext?.isAuthenticated) {
    return null;
  }

  const formatDate = (dateValue?: string | null) => {
    if (!dateValue) {
      return '-';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(date);
  };

  const getStatusBadgeVariant = (status?: string | null) => {
    if (status === ProjectApplicationStatusEnum.enum.APPROVED) {
      return 'default' as const;
    }

    if (status === ProjectApplicationStatusEnum.enum.REJECTED) {
      return 'destructive' as const;
    }

    return 'secondary' as const;
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('myApplications')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('applicationsPageDesc')}
          </p>
        </div>

        {isError ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('applicationsPageError')}
              </p>
            </CardContent>
          </Card>
        ) : applications.length ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.applicationId ?? `${application.projectId}-${application.createdAt}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {application.projectTitle ?? 'Isimsiz proje'}
                    </CardTitle>
                    <CardDescription>
                      Basvuru tarihi: {formatDate(application.createdAt)}
                    </CardDescription>
                  </div>

                  <Badge variant={getStatusBadgeVariant(application.status)}>
                    {application.status ?? 'PENDING'}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <div>
                <h2 className="text-lg font-semibold">{tApplications('noApplicationsTitle')}</h2>
              </div>
              <Button onClick={() => router.push('/projects')}>
                {tApplications('viewProjects')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
