import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import { MProject } from '@/lib/models';
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

it.each([undefined, '/my-projects/project-123'])(
  'renders a canonical backend project with a valid detail link (override=%s)',
  (href) => {
    const project = MProject.parse({
      projectId: 'project-123',
      projectName: 'Canonical project',
      description: 'A project from the backend',
      status: 'OPEN',
      requiredSkills: ['TypeScript'],
      applicationCount: 2,
    });
    render(
      <ProjectCard project={project} href={href} />,
    );
    expect(screen.getByRole('heading', { name: 'Canonical project' })).toBeVisible();
    expect(screen.getByRole('link')).toHaveAttribute('href', href ?? '/projects/project-123');
  },
);
