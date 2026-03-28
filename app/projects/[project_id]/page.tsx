import type { Metadata } from 'next';
import { MProject } from '@/lib/models';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: Promise<{ project_id: string }>;
};

type ProjectPayload = {
  data?: unknown;
};

async function fetchProjectForMetadata(projectId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects/${projectId}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project metadata');
  }

  const payload = (await response.json()) as ProjectPayload;
  return MProject.parse(payload.data);
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects?size=100`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { data?: { projects?: Array<{ id: string }> } };
    return (payload.data?.projects ?? []).map((project) => ({ project_id: String(project.id) }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project_id } = await params;

  try {
    const project = await fetchProjectForMetadata(project_id);

    return {
      title: project.title,
      description: project.summary || project.description,
      alternates: {
        canonical: `/projects/${project.id}`,
      },
      openGraph: {
        title: project.title,
        description: project.summary || project.description,
        type: 'article',
        publishedTime: project.createdAt,
        modifiedTime: project.updatedAt,
        authors: [project.owner.name],
        images: [
          {
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.summary || project.description,
        images: ['/twitter-image.png'],
      },
    };
  } catch {
    return {
      title: 'Proje Detayı | IYTE Proje Pazarı',
      description: 'Proje detayları görüntülenemiyor.',
    };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { project_id } = await params;
  return <ProjectDetailClient projectId={project_id} />;
}
