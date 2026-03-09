import { Metadata } from 'next';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: { project_id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects/${params.project_id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('Proje bulunamadı');
    
    const responseData = await res.json();
    const project = responseData.data || responseData; 

    return {
      title: project.title,
      description: project.summary || project.description,
      openGraph: {
        title: project.title,
        description: project.summary || project.description,
        type: 'article',
        publishedTime: project.createdAt,
        modifiedTime: project.updatedAt || project.createdAt,
        authors: [project.owner?.name || 'Anonim'],
        images: [
          {
            url: project.imageUrl || '/og-image.png',
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
        images: [project.imageUrl || '/twitter-image.png'],
      },
    };
  } catch (error) {
    return {
      title: 'Proje Detayı | IYTE Proje Pazarı',
      description: 'Proje detayları görüntülenemiyor.',
    };
  }
}

export default function ProjectPage({ params }: Props) {
  return <ProjectDetailClient projectId={params.project_id} />;
}