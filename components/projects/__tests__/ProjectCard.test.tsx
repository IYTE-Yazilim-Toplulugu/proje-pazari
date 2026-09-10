import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import type { Project } from '@/lib/models';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ProjectCard', () => {
  it('renders and links with the canonical project response fields', () => {
    const project: Project = {
      projectId: 'project-123',
      projectName: 'Canonical Project',
      ownerName: 'Ada Lovelace',
      status: 'OPEN',
      summary: 'A project using the standardized backend contract.',
      applicationCount: 2,
      requiredSkills: ['TypeScript'],
    };

    render(<ProjectCard project={project} />);

    expect(screen.getByRole('heading', { name: 'Canonical Project' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/project-123');
  });
});
