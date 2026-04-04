import ProjectDetailClient from './ProjectDetailClient';

export default function ProjectDetailPage({ params }: { params: { project_id: string } }) {
  return <ProjectDetailClient projectId={params.project_id} />;
}
