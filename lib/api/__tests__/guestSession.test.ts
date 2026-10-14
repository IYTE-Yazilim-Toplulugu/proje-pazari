import { z } from 'zod';
import Cookies from 'js-cookie';
import { fetcher } from '../base';
import { refreshToken } from '../auth';

jest.mock('../auth', () => ({ refreshToken: jest.fn() }));
jest.mock('js-cookie', () => ({ get: jest.fn(), set: jest.fn(), remove: jest.fn() }));

const publicPaths = ['/verify-email', '/reset-password', '/forgot-password', '/terms', '/privacy'];
const unauthorized = { status: 401, ok: false, json: async () => ({ code: 5, message: 'Not authenticated' }) };

describe('guest and expired session handling', () => {
  let dispatch: jest.SpyInstance;
  let timeout: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    dispatch = jest.spyOn(window, 'dispatchEvent');
    timeout = jest.spyOn(global, 'setTimeout');
    global.fetch = jest.fn().mockResolvedValue(unauthorized);
    jest.mocked(Cookies.get).mockReturnValue(undefined as never);
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it.each([...publicPaths, '/my-projects', '/applications', '/admin'])('does not expire or redirect a tokenless guest on %s', async path => {
    window.history.replaceState({}, '', path);
    await expect(fetcher('/api/v1/users/me', z.object({}))).rejects.toThrow('Not authenticated');
    expect(refreshToken).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:session-expired' }));
    expect(timeout).not.toHaveBeenCalled();
  });

  it.each(publicPaths)('clears a failed refresh without redirecting away from %s', async path => {
    window.history.replaceState({}, '', path);
    jest.mocked(Cookies.get).mockReturnValue('expired' as never);
    jest.mocked(refreshToken).mockRejectedValue(new Error('Refresh rejected'));
    await expect(fetcher('/api/v1/users/me', z.object({}))).rejects.toThrow('Session expired');
    expect(Cookies.remove).toHaveBeenCalledWith('authToken', { path: '/' });
    expect(Cookies.remove).toHaveBeenCalledWith('refreshToken', { path: '/' });
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:session-expired' }));
    expect(timeout).not.toHaveBeenCalled();
  });

  it('expires a partial session on a protected page and schedules the real login route', async () => {
    window.history.replaceState({}, '', '/my-projects');
    jest.mocked(Cookies.get).mockImplementation(((key: string) => key === 'authToken' ? 'stale' : undefined) as typeof Cookies.get);
    await expect(fetcher('/api/v1/users/me', z.object({}))).rejects.toThrow('Not authenticated');
    expect(Cookies.remove).toHaveBeenCalledWith('authToken', { path: '/' });
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:session-expired' }));
    expect(timeout).toHaveBeenCalledWith(expect.any(Function), 1500);
  });
});
