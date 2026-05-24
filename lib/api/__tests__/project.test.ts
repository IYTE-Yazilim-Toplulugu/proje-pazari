import { updateProjectApplicationStatus } from '../project';
import { mutator } from '../base';
import { ProjectApplicationStatusEnum } from '@/lib/models';

jest.mock('../base', () => ({
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
});
