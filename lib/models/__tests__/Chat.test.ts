import {
  MApplicationMessage,
  MApplicationMessagePage,
  MSendApplicationMessageRequest,
} from '../Chat';

describe('application message schemas', () => {
  const message = {
    id: 'message-1',
    applicationId: 'application-1',
    senderId: 'user-1',
    body: '<strong>plain text</strong>',
    createdAt: '2026-09-10T12:00:00',
  };

  it('parses the backend message and paged list contract', () => {
    expect(MApplicationMessage.parse(message)).toEqual(message);
    expect(
      MApplicationMessagePage.parse({
        content: [message],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
      }),
    ).toEqual({
      content: [message],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
  });

  it('trims valid send input and rejects blank or over-limit bodies', () => {
    expect(MSendApplicationMessageRequest.parse({ body: '  hello  ' })).toEqual({
      body: 'hello',
    });
    expect(() => MSendApplicationMessageRequest.parse({ body: '   ' })).toThrow();
    expect(() =>
      MSendApplicationMessageRequest.parse({ body: 'x'.repeat(2_001) }),
    ).toThrow();
  });

  it('rejects response pages outside the backend bounds', () => {
    expect(() =>
      MApplicationMessagePage.parse({
        content: [],
        page: 0,
        size: 101,
        totalElements: 0,
        totalPages: 0,
      }),
    ).toThrow();
  });
});
