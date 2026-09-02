import { deleteUser, verifyEmail } from '../user';
import { mutator } from '../base';

jest.mock('../base', () => ({
  mutator: jest.fn(),
  fetcher: jest.fn(),
}));

describe('User API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyEmail', () => {
    it('should call the auth verify-email endpoint with GET and token', async () => {
      const token = 'token+123/abc?';
      const mockResponse = { code: 0, message: 'Email verified' };

      (mutator as jest.Mock).mockResolvedValue(mockResponse);

      const result = await verifyEmail(token);

      expect(mutator).toHaveBeenCalledWith(
        `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
        'get',
        expect.any(Object),
        { arg: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should surface request failures', async () => {
      const token = 'expired-token';
      const mockError = new Error('Invalid or expired token');

      (mutator as jest.Mock).mockRejectedValue(mockError);

      await expect(verifyEmail(token)).rejects.toThrow('Invalid or expired token');
    });
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
