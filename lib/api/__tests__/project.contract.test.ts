import { getProject, getProjects, searchProjects } from '../project';

const project = {
  projectId: 'project-123',
  ownerId: 'owner-123',
  ownerName: 'Ada Lovelace',
  ownerEmail: 'ada@std.iyte.edu.tr',
  projectName: 'Canonical project',
  description: 'A project returned by the backend',
  summary: 'Persisted summary',
  applicationCount: 3,
  status: 'OPEN',
  maxTeamSize: 5,
  requiredSkills: ['TypeScript'],
  category: 'Web Development',
  deadline: null,
  createdAt: '2026-09-22T12:00:00',
};

const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

function respondWith(data: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ code: 0, message: 'Projects retrieved successfully', data }),
  });
}

it('preserves canonical identity and summary through the detail HTTP client', async () => {
  respondWith(project);
  expect(await getProject('project-123')).toMatchObject({
    projectId: 'project-123',
    projectName: 'Canonical project',
    summary: 'Persisted summary',
  });
});

it.each([
  ['list', () => getProjects({ page: 1, size: 10, status: 'OPEN' })],
  ['search', () => searchProjects('Canonical', { page: 1, size: 10 })],
] as const)('preserves canonical identity and backend pagination through the %s HTTP client', async (_name, request) => {
  respondWith({ projects: [project], currentPage: 1, totalPages: 3, totalElements: 21 });
  const result = await request();
  expect(result.projects[0]).toMatchObject({
    projectId: 'project-123',
    projectName: 'Canonical project',
    ownerId: 'owner-123',
    applicationCount: 3,
  });
  expect(result).toMatchObject({ currentPage: 1, totalPages: 3, totalElements: 21 });
});
