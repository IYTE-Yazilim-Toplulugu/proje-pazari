// Ensure env is set before importing modules that validate it
process.env.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const { logoutAction } = require('../actions');

const mockDelete = jest.fn();
const mockGet = jest.fn((key: string) => {
  if (key === 'refreshToken') return { value: 'refresh-token-123' };
  if (key === 'authToken') return { value: 'access-token-abc' };
  return undefined;
});
const mockCookies = jest.fn();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

describe('logoutAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.mockResolvedValue({
      get: mockGet,
      delete: mockDelete,
    });
    // Ensure fetch is present
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it('sends Authorization header and refreshToken in body, then clears cookies', async () => {
    await logoutAction();

    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    const [calledUrl, options] = (global as any).fetch.mock.calls[0];
    expect(calledUrl).toContain('/api/v1/auth/logout');
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer access-token-abc');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ refreshToken: 'refresh-token-123' });

    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
  });

  it('still clears cookies when the backend logout call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global as any).fetch = jest.fn().mockRejectedValueOnce(new Error('fetch failed'));

    await expect(logoutAction()).resolves.toBeUndefined();

    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', 'fetch failed');

    consoleErrorSpy.mockRestore();
  });

  it('clears cookies even when there is no refresh token cookie', async () => {
    mockGet.mockImplementationOnce(() => undefined);

    await logoutAction();

    expect((global as any).fetch).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
  });
});

