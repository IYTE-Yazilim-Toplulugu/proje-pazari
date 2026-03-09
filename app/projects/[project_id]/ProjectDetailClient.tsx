'use client';

import StructuredData from '@/components/seo/StructuredData';
import { useProject } from '@/lib/hooks/projectHooks'; 

export default function ProjectDetailClient({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading || !project) return <div>Yükleniyor...</div>;

  // TODO: Check backend response for correct field names
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    author: {
      '@type': 'Person',
      name: project.owner?.name || 'Anonim',
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt || project.createdAt,
  };

  return (
    <>
      <StructuredData data={projectSchema} />
      <div className="container mx-auto py-8">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </div>
    </>
  );
}