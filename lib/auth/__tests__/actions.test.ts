import { logoutAction } from '../actions';

jest.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080',
  },
}));

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
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 });
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

  it('still clears cookies when the backend responds with a non-ok status', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(logoutAction()).resolves.toBeUndefined();

    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Logout failed:',
      'Logout request failed with status 500'
    );

    consoleErrorSpy.mockRestore();
  });

  it('clears cookies even when there is no refresh token cookie', async () => {
    mockGet.mockImplementationOnce(() => undefined);

    await logoutAction();

    expect((global as any).fetch).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');
  });

  it('skips the backend call when the access token is missing', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // logoutAction reads refreshToken first, then authToken
    mockGet
      .mockImplementationOnce(() => ({ value: 'refresh-token-123' }))
      .mockImplementationOnce(() => undefined);

    await logoutAction();

    // The backend endpoint is isAuthenticated() and blacklists the access token from
    // the Authorization header, so the request could only ever fail without one.
    expect((global as any).fetch).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping backend logout: access token missing, refresh token cannot be revoked.'
    );
    expect(mockDelete).toHaveBeenCalledWith('authToken');
    expect(mockDelete).toHaveBeenCalledWith('refreshToken');

    consoleWarnSpy.mockRestore();
  });
});
