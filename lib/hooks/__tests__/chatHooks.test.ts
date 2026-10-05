import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import * as chatApi from '../../api/chat';
import { CHAT_KEYS, useApplicationMessages, useSendApplicationMessage } from '../chatHooks';

jest.mock('../../api/chat', () => ({
  getApplicationMessages: jest.fn(),
  sendApplicationMessage: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, wrapper };
};

describe('application message hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('scopes message queries to the application and page', async () => {
    const page = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };
    (chatApi.getApplicationMessages as jest.Mock).mockResolvedValue(page);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useApplicationMessages('application-1', 0, 20), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(chatApi.getApplicationMessages).toHaveBeenCalledWith(
      'application-1',
      { page: 0, size: 20 },
      expect.any(AbortSignal),
    );
  });

  it('loads the newest page and follows a new page after sending', async () => {
    const messages = Array.from({ length: 100 }, (_, index) => ({
      id: `message-${index + 1}`, applicationId: 'application-1', senderId: 'user-1',
      body: `Message ${index + 1}`, createdAt: '2026-09-10T12:00:00',
    }));
    (chatApi.getApplicationMessages as jest.Mock).mockImplementation(
      async (_id, { page, size }) => ({
        content: messages.slice(page * size, (page + 1) * size),
        page, size, totalElements: messages.length, totalPages: Math.ceil(messages.length / size),
      }),
    );
    (chatApi.sendApplicationMessage as jest.Mock).mockImplementation(async (_id, body) => {
      const message = { ...messages[0], id: 'message-101', body };
      messages.push(message);
      return message;
    });
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => ({
      thread: useApplicationMessages('application-1'),
      send: useSendApplicationMessage('application-1'),
    }), { wrapper });
    await waitFor(() => expect(result.current.thread.isSuccess).toBe(true));
    expect(result.current.thread.data?.content.at(-1)?.id).toBe('message-100');
    await act(async () => { await result.current.send.mutateAsync('Newest message'); });
    await waitFor(() => expect(result.current.thread.data?.content.at(-1)?.body).toBe('Newest message'));
    expect(result.current.thread.data?.page).toBe(1);
  });

  it('opens a long thread at its newest page in chronological order', async () => {
    (chatApi.getApplicationMessages as jest.Mock).mockImplementation(async (_id, { page, size }) => ({
      content: Array.from({ length: page === 2 ? 50 : 100 }, (_, index) => ({
        id: `message-${page * size + index + 1}`, applicationId: 'application-1', senderId: 'user-1',
        body: `Message ${page * size + index + 1}`, createdAt: '2026-09-10T12:00:00',
      })),
      page, size, totalElements: 250, totalPages: 3,
    }));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useApplicationMessages('application-1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content[0].id).toBe('message-201');
    expect(result.current.data?.content.at(-1)?.id).toBe('message-250');
  });

  it('invalidates the visible application thread after send', async () => {
    const message = {
      id: 'message-1',
      applicationId: 'application-1',
      senderId: 'user-1',
      body: 'hello',
      createdAt: '2026-09-10T12:00:00',
    };
    (chatApi.sendApplicationMessage as jest.Mock).mockResolvedValue(message);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSendApplicationMessage('application-1'), { wrapper });
    await act(async () => {
      await result.current.mutateAsync('hello');
    });

    expect(chatApi.sendApplicationMessage).toHaveBeenCalledWith('application-1', 'hello');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: CHAT_KEYS.thread('application-1'),
    });
  });
});
