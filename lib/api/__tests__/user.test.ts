import { deleteUser } from '../user';
import { mutator } from '../base';

jest.mock('../base', () => ({
  mutator: jest.fn(),
  fetcher: jest.fn(),
}));

describe('User API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteUser', () => {
    it('deletes the authenticated user without requiring a user id', async () => {
      const response = { code: 0, message: 'User deleted successfully' };
      (mutator as jest.Mock).mockResolvedValue(response);

      const result = await deleteUser();

      expect(mutator).toHaveBeenCalledWith(
        '/api/v1/users/me',
        'delete',
        expect.any(Object),
        { arg: {} },
      );
      expect(result).toBe(response);
    });
  });
});
