import { auth } from '@/lib/api';

import { logoutAction } from '../actions';

const mockDelete = jest.fn();
const mockGet = jest.fn();
const mockCookies = jest.fn();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

jest.mock('@/lib/api', () => ({
  auth: {
    logout: jest.fn(),
  },
}));

describe('logoutAction', () => {
  const logoutMock = auth.logout as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.mockResolvedValue({
      get: mockGet,
      delete: mockDelete,
    });
    mockGet.mockReturnValue({ value: 'refresh-token-123' });
  });

  it('calls the backend logout endpoint before clearing cookies', async () => {
    logoutMock.mockResolvedValueOnce({ data: { code: 0 } });

    await logoutAction();

    expect(logoutMock).toHaveBeenCalledWith({ refreshToken: 'refresh-token-123' });
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
  });

  it('still clears cookies when the backend logout call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logoutMock.mockRejectedValueOnce(new Error('logout failed'));

    await expect(logoutAction()).resolves.toBeUndefined();

    expect(logoutMock).toHaveBeenCalledWith({ refreshToken: 'refresh-token-123' });
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', 'logout failed');

    consoleErrorSpy.mockRestore();
  });

  it('clears cookies even when there is no refresh token cookie', async () => {
    mockGet.mockReturnValueOnce(undefined);

    await logoutAction();

    expect(logoutMock).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
  });
});