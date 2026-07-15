import { deleteUser, updateProfilePicture } from '../user';
import { mutator, formDataMutator } from '../base';

jest.mock('../base', () => ({
  mutator: jest.fn(),
  fetcher: jest.fn(),
  formDataMutator: jest.fn(),
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
