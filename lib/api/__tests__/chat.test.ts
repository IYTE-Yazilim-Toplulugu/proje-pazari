import { getApplicationMessages, sendApplicationMessage } from '../chat';
import { fetcher, mutator } from '../base';
import { MApplicationMessagePage, MApplicationMessageResponse } from '@/lib/models/Chat';

jest.mock('../base', () => ({
  fetcher: jest.fn(),
  mutator: jest.fn(),
}));

describe('application message API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists a bounded page for one application', async () => {
    const page = {
      content: [],
      page: 2,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    };
    (fetcher as jest.Mock).mockResolvedValue(page);

    await expect(
      getApplicationMessages('application-1', { page: 2, size: 10 }),
    ).resolves.toBe(page);
    expect(fetcher).toHaveBeenCalledWith(
      '/api/v1/applications/application-1/messages?page=2&size=10',
      MApplicationMessagePage,
      undefined,
    );
  });

  it('sends only the plain-text body and returns the created message', async () => {
    const message = {
      id: 'message-1',
      applicationId: 'application-1',
      senderId: 'server-derived-user',
      body: 'hello',
      createdAt: '2026-09-10T12:00:00',
    };
    (mutator as jest.Mock).mockResolvedValue({ code: 2, data: message });

    await expect(sendApplicationMessage('application-1', '  hello  ')).resolves.toEqual(
      message,
    );
    expect(mutator).toHaveBeenCalledWith(
      '/api/v1/applications/application-1/messages',
      'post',
      MApplicationMessageResponse,
      { arg: { body: 'hello' } },
    );
  });
});
