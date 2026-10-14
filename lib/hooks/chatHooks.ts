import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApplicationMessages, sendApplicationMessage } from '@/lib/api/chat';

export const CHAT_KEYS = {
  all: ['application-messages'] as const,
  thread: (applicationId: string) => [...CHAT_KEYS.all, applicationId] as const,
  page: (applicationId: string, page: number | undefined, size: number) =>
    [...CHAT_KEYS.thread(applicationId), { page, size }] as const,
};

export function useApplicationMessages(
  applicationId: string,
  page: number | undefined = undefined,
  size = 100,
  enabled = true,
) {
  return useQuery({
    queryKey: CHAT_KEYS.page(applicationId, page, size),
    queryFn: async ({ signal }) => {
      // The backend returns oldest-first pages. Discover the newest page on
      // every refetch so sending across a page boundary stays visible.
      const first = await getApplicationMessages(applicationId, { page: page ?? 0, size }, signal);
      if (page !== undefined || first.totalPages <= 1) return first;
      return getApplicationMessages(applicationId, { page: first.totalPages - 1, size }, signal);
    },
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
