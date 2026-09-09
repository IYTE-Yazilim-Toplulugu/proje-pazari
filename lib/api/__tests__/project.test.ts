import { searchProjects, updateProjectApplicationStatus } from '../project';
import { fetcher, mutator } from '../base';
import { MProjectListResponse, ProjectApplicationStatusEnum } from '@/lib/models';

jest.mock('../base', () => ({
  fetcher: jest.fn(),
  mutator: jest.fn(),
}));

describe('Project API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProjectApplicationStatus', () => {
    it('uses PUT for approving an application review', async () => {
      const response = { code: 0, message: 'Application reviewed successfully' };
      (mutator as jest.Mock).mockResolvedValue(response);

      const result = await updateProjectApplicationStatus(
        'application-123',
        ProjectApplicationStatusEnum.enum.APPROVED,
      );

      expect(mutator).toHaveBeenCalledWith(
        '/api/v1/applications/application-123/review',
        'put',
        expect.any(Object),
        { arg: { status: 'APPROVED', reviewMessage: '' } },
      );
      expect(result).toBe(response);
    });

    it('uses PUT for rejecting an application review', async () => {
      const response = { code: 0, message: 'Application reviewed successfully' };
      (mutator as jest.Mock).mockResolvedValue(response);

      const result = await updateProjectApplicationStatus(
        'application-456',
        ProjectApplicationStatusEnum.enum.REJECTED,
      );

      expect(mutator).toHaveBeenCalledWith(
        '/api/v1/applications/application-456/review',
        'put',
        expect.any(Object),
        { arg: { status: 'REJECTED', reviewMessage: '' } },
      );
      expect(result).toBe(response);
    });
  });

  describe('searchProjects', () => {
    it('returns the backend-provided project page without fabricating pagination', async () => {
      const response = {
        projects: [
          {
            id: 'project-123',
            ownerId: 'owner-123',
            ownerName: 'Ada Lovelace',
            title: 'Searchable Project',
            applicationCount: 4,
            status: 'OPEN',
          },
        ],
        currentPage: 2,
        totalPages: 5,
        totalElements: 49,
      };
      (fetcher as jest.Mock).mockResolvedValue(response);

      const result = await searchProjects('machine learning', { page: 2, size: 12 });

      expect(fetcher).toHaveBeenCalledWith(
        '/api/v1/search/projects?q=machine+learning&page=2&size=12',
        MProjectListResponse,
      );
      expect(result).toBe(response);
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(5);
      expect(result.totalElements).toBe(49);
    });
  });
});
