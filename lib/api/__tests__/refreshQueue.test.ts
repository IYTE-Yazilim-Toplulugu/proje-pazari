import { z } from 'zod';
import Cookies from 'js-cookie';
import { fetcher } from '../base';
import { refreshToken } from '../auth';

jest.mock('../auth', () => ({ refreshToken: jest.fn() }));
jest.mock('js-cookie', () => ({ get: jest.fn(), set: jest.fn(), remove: jest.fn() }));

it.each([
  { code: 0 },
  { code: 0, data: { accessToken: 'access' } },
  { code: 0, data: { accessToken: 'access', refreshToken: '' } },
])('rejects both the refreshing and queued requests for malformed refresh %j', async (response) => {
  jest.useFakeTimers();
  const originalFetch = global.fetch;
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    jest.mocked(Cookies.get).mockReturnValue('old-token' as never);
    global.fetch = jest.fn().mockResolvedValue({ status: 401 });
    let finishRefresh!: (value: unknown) => void;
    const pending = new Promise((resolve) => { finishRefresh = resolve; });
    jest.mocked(refreshToken).mockReturnValue(pending as ReturnType<typeof refreshToken>);
    const first = fetcher('/private', z.object({}));
    // Let the first 401 start refresh, then let the second 401 join the queue.
    await Promise.resolve();
    await Promise.resolve();
    const second = fetcher('/private', z.object({}));
    await Promise.resolve();
    await Promise.resolve();
    const settled = Promise.allSettled([first, second]);
    finishRefresh(response);
    expect((await settled).map((result) => result.status)).toEqual(['rejected', 'rejected']);
    expect(Cookies.remove).toHaveBeenCalledWith('authToken', { path: '/' });
  } finally {
    global.fetch = originalFetch;
    log.mockRestore();
    error.mockRestore();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  }
});
