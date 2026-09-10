import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApplicationMessages, sendApplicationMessage } from '@/lib/api/chat';

export const CHAT_KEYS = {
  all: ['application-messages'] as const,
  thread: (applicationId: string) => [...CHAT_KEYS.all, applicationId] as const,
  page: (applicationId: string, page: number, size: number) =>
    [...CHAT_KEYS.thread(applicationId), { page, size }] as const,
};

export function useApplicationMessages(
  applicationId: string,
  page = 0,
  size = 100,
  enabled = true,
) {
  return useQuery({
    queryKey: CHAT_KEYS.page(applicationId, page, size),
    queryFn: ({ signal }) =>
      getApplicationMessages(applicationId, { page, size }, signal),
    enabled: enabled && applicationId.length > 0,
  });
}

export function useSendApplicationMessage(applicationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => sendApplicationMessage(applicationId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CHAT_KEYS.thread(applicationId) });
    },
  });
}
