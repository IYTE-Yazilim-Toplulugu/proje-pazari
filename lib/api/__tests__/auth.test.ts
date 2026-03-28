import {
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
} from '../auth';
import { mutator } from '../base';

// Mock the base mutator
jest.mock('../base', () => ({
  mutator: jest.fn(),
}));

describe('Auth API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('should call mutator with correct parameters', async () => {
      const email = 'test@std.iyte.edu.tr';
      const mockResponse = { success: true, message: 'Email sent' };

      (mutator as jest.Mock).mockResolvedValue(mockResponse);

      const result = await forgotPassword(email);

      expect(mutator).toHaveBeenCalledWith(
        '/auth/forgot-password',
        'post',
        expect.any(Object),
        { arg: { email } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from API', async () => {
      const email = 'test@std.iyte.edu.tr';
      const mockError = new Error('Network error');

      (mutator as jest.Mock).mockRejectedValue(mockError);

      await expect(forgotPassword(email)).rejects.toThrow('Network error');
    });
  });

  describe('resetPassword', () => {
    it('should call mutator with correct parameters', async () => {
      const token = 'reset-token-123';
      const password = 'newPassword123';
      const mockResponse = { success: true, message: 'Password reset' };

      (mutator as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resetPassword(token, password);

      expect(mutator).toHaveBeenCalledWith(
        '/auth/reset-password',
        'post',
        expect.any(Object),
        { arg: { token, password } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid token errors', async () => {
      const token = 'invalid-token';
      const password = 'newPassword123';
      const mockError = new Error('Invalid or expired token');

      (mutator as jest.Mock).mockRejectedValue(mockError);

      await expect(resetPassword(token, password)).rejects.toThrow(
        'Invalid or expired token'
      );
    });
  });

  describe('resendVerificationEmail', () => {
    it('should call mutator with correct parameters', async () => {
      const email = 'test@std.iyte.edu.tr';
      const mockResponse = { success: true, message: 'Verification email sent' };

      (mutator as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resendVerificationEmail(email);

      expect(mutator).toHaveBeenCalledWith(
        '/auth/resend-verification',
        'post',
        expect.any(Object),
        { arg: { email } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle rate limit errors', async () => {
      const email = 'test@std.iyte.edu.tr';
      const mockError = new Error('Too many requests');

      (mutator as jest.Mock).mockRejectedValue(mockError);

      await expect(resendVerificationEmail(email)).rejects.toThrow(
        'Too many requests'
      );
    });

    it('should handle user not found errors', async () => {
      const email = 'nonexistent@std.iyte.edu.tr';
      const mockError = new Error('User not found');

      (mutator as jest.Mock).mockRejectedValue(mockError);

      await expect(resendVerificationEmail(email)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete forgot password flow', async () => {
      const email = 'test@std.iyte.edu.tr';
      const token = 'reset-token-123';
      const newPassword = 'newSecurePassword123';

      // Step 1: Request password reset
      (mutator as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Reset email sent',
      });

      await forgotPassword(email);

      // Step 2: Reset password with token
      (mutator as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Password reset successful',
      });

      await resetPassword(token, newPassword);

      expect(mutator).toHaveBeenCalledTimes(2);
      expect(mutator).toHaveBeenNthCalledWith(
        1,
        '/auth/forgot-password',
        'post',
        expect.any(Object),
        { arg: { email } }
      );
      expect(mutator).toHaveBeenNthCalledWith(
        2,
        '/auth/reset-password',
        'post',
        expect.any(Object),
        { arg: { token, password: newPassword } }
      );
    });

    it('should handle complete verification resend flow', async () => {
      const email = 'test@std.iyte.edu.tr';

      // First attempt
      (mutator as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Verification email sent',
      });

      await resendVerificationEmail(email);

      // Resend attempt
      (mutator as jest.Mock).mockResolvedValueOnce({
        code: 0,
        message: 'Verification email resent',
      });

      await resendVerificationEmail(email);

      expect(mutator).toHaveBeenCalledTimes(2);
      expect(mutator).toHaveBeenCalledWith(
        '/auth/resend-verification',
        'post',
        expect.any(Object),
        { arg: { email } }
      );
    });
  });
});
