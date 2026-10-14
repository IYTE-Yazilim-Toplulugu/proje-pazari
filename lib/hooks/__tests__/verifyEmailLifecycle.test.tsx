import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery, focusManager, onlineManager } from '@tanstack/react-query';
import { useVerifyEmail } from '../authHooks';
import { user } from '@/lib/api';

jest.mock('next-intl', () => ({ useLocale: () => 'tr' }));
jest.mock('@/lib/env', () => ({ env: { NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080' } }));
jest.mock('@/lib/api', () => ({ user: { verifyEmail: jest.fn() } }));

it('does not refetch a stale verification on visibility or reconnect while ordinary queries do', async () => {
  jest.mocked(user.verifyEmail).mockResolvedValue({ code: 0 });
  const ordinary = jest.fn(async () => 'ordinary');
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  const { result, unmount } = renderHook(() => ({
    verification: useVerifyEmail('synthetic-token'),
    control: useQuery({ queryKey: ['control'], queryFn: ordinary, staleTime: 0 }),
  }), { wrapper });
  try {
    await waitFor(() => expect(result.current.verification.data).toBe('success'));
    await act(async () => { await client.invalidateQueries({ refetchType: 'none' }); });
    await act(async () => {
      window.dispatchEvent(new Event('visibilitychange'));
    });
    await waitFor(() => expect(ordinary).toHaveBeenCalledTimes(2));
    expect(user.verifyEmail).toHaveBeenCalledTimes(1);
    await act(async () => {
      window.dispatchEvent(new Event('offline'));
      window.dispatchEvent(new Event('online'));
    });
    await waitFor(() => expect(ordinary).toHaveBeenCalledTimes(3));
    expect(user.verifyEmail).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    client.clear();
    focusManager.setFocused(undefined);
    onlineManager.setOnline(true);
  }
});
