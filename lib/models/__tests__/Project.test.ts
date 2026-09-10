import { MProjectListResponse } from '../Project';

describe('MProjectListResponse', () => {
  const projectPage = {
    projects: [
      {
        projectId: 'project-123',
        ownerId: 'owner-123',
        ownerName: 'Ada Lovelace',
        ownerEmail: 'ada@std.iyte.edu.tr',
        projectName: 'Searchable Project',
        description: 'A project returned by search.',
        applicationCount: 7,
        status: 'OPEN',
        requiredSkills: ['TypeScript'],
      },
    ],
    currentPage: 1,
    totalPages: 3,
    totalElements: 25,
  };

  it('parses flat owner fields, applicationCount, and pagination metadata', () => {
    const parsed = MProjectListResponse.parse(projectPage);

    expect(parsed.projects[0]).toMatchObject({
      projectId: 'project-123',
      projectName: 'Searchable Project',
      ownerId: 'owner-123',
      ownerName: 'Ada Lovelace',
      applicationCount: 7,
    });
    expect(parsed.projects[0]).not.toHaveProperty('id');
    expect(parsed.projects[0]).not.toHaveProperty('title');
    expect(parsed).toMatchObject({
      currentPage: 1,
      totalPages: 3,
      totalElements: 25,
    });
  });

  it('rejects the legacy unpaged search array', () => {
    expect(MProjectListResponse.safeParse(projectPage.projects).success).toBe(false);
  });

  it('requires backend pagination metadata', () => {
    const pageWithoutTotalPages: Partial<typeof projectPage> = { ...projectPage };
    delete pageWithoutTotalPages.totalPages;

    expect(MProjectListResponse.safeParse(pageWithoutTotalPages).success).toBe(false);
  });
});
