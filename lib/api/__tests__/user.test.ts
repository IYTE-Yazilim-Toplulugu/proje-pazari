import { deleteUser, updateUserLanguage, updateProfilePicture, verifyEmail } from '../user';
import { mutator, formDataMutator } from '../base';

jest.mock('../base', () => ({
  mutator: jest.fn(),
  fetcher: jest.fn(),
  formDataMutator: jest.fn(),
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

  describe('updateUserLanguage', () => {
    it('updates preferredLanguage through the profile endpoint', async () => {
      const response = { code: 0, message: 'Profile updated successfully' };
      (mutator as jest.Mock).mockResolvedValue(response);

      const result = await updateUserLanguage('en');

      expect(mutator).toHaveBeenCalledWith(
        '/api/v1/users/me',
        'put',
        expect.any(Object),
        { arg: { preferredLanguage: 'en' } },
      );
      expect(result).toBe(response);
    });
  });

  describe('updateProfilePicture', () => {
    it('posts the file as multipart/form-data to the profile-picture endpoint', async () => {
      const response = { code: 0, message: 'Profile picture updated successfully' };
      (formDataMutator as jest.Mock).mockResolvedValue(response);
      const file = new File(['content'], 'avatar.png', { type: 'image/png' });

      const result = await updateProfilePicture(file);

      expect(formDataMutator).toHaveBeenCalledWith(
        '/api/v1/users/me/profile-picture',
        'post',
        expect.any(Object),
        { arg: expect.any(FormData) },
      );
      const sentFormData = (formDataMutator as jest.Mock).mock.calls[0][3].arg as FormData;
      expect(sentFormData.get('file')).toBe(file);
      expect(result).toBe(response);
    });
  });
});
