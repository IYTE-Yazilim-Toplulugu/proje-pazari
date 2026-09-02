import { handleResponse, mutator } from '../base';
import { BasicResponseSchema } from '../../models/Api';

describe('handleResponse', () => {
  it('treats registration verification response code as success', async () => {
    const body = {
      code: 11,
      message: 'User registered successfully',
      timestamp: '2026-05-12T12:00:00',
    };
    const response = {
      status: 201,
      ok: true,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;

    await expect(handleResponse(response, BasicResponseSchema)).resolves.toEqual(body);
  });

  it('treats CREATED response code as success', async () => {
    const body = {
      code: 2,
      message: 'Resource created successfully',
      timestamp: '2026-05-12T12:00:00',
    };
    const response = {
      status: 201,
      ok: true,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;

    await expect(handleResponse(response, BasicResponseSchema)).resolves.toEqual(body);
  });
});

describe('dev request logging', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const okResponse = () =>
    ({
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue({
        code: 1,
        message: 'OK',
        timestamp: '2026-05-12T12:00:00',
      }),
    }) as unknown as Response;

  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'group').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue(okResponse());
  });

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true });
    jest.restoreAllMocks();
  });

  const loggedUrl = () =>
    logSpy.mock.calls.find(([label]) => label === 'URL:')?.[1] as string | undefined;

  it('redacts the token query parameter from the logged URL', async () => {
    await mutator(
      '/api/v1/auth/verify-email?token=super-secret-token',
      'get',
      BasicResponseSchema,
      { arg: {} }
    );

    expect(loggedUrl()).toContain('token=%5BREDACTED%5D');
    expect(loggedUrl()).not.toContain('super-secret-token');
  });

  it('redacts the refreshToken query parameter from the logged URL', async () => {
    await mutator(
      '/api/v1/auth/refresh?refreshToken=super-secret-refresh',
      'post',
      BasicResponseSchema,
      { arg: null }
    );

    expect(loggedUrl()).not.toContain('super-secret-refresh');
  });

  it('leaves the actual request URL untouched', async () => {
    await mutator(
      '/api/v1/auth/verify-email?token=super-secret-token',
      'get',
      BasicResponseSchema,
      { arg: {} }
    );

    const [requestedUrl] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestedUrl).toContain('token=super-secret-token');
  });

  it('leaves non-sensitive query parameters readable', async () => {
    await mutator('/api/v1/projects?page=2&size=20', 'get', BasicResponseSchema, { arg: {} });

    expect(loggedUrl()).toContain('page=2');
    expect(loggedUrl()).toContain('size=20');
  });
});
