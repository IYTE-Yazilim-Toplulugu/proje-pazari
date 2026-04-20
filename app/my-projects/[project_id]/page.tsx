import ProjectDetailClient from './ProjectDetailClient';

export default async function ProjectDetailPage({ params }: { params: Promise<{ project_id: string }> }) {
  const { project_id } = await params;
  return <ProjectDetailClient projectId={project_id} />;
}
