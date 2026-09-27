import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import Providers from '../providers';

jest.mock('@/lib/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/components/shared/ApiStatus', () => ({ __esModule: true, default: () => null }));
jest.mock('@tanstack/react-query-devtools', () => ({ ReactQueryDevtools: () => null }));
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({ error: jest.fn(), warning: jest.fn() }),
}));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

it('session expiry clears authenticated data without restarting in-flight verification', async () => {
  let client!: QueryClient;
  let finishVerification!: (value: string) => void;
  let finishSession!: (value: { isAuthenticated: boolean }) => void;
  const sessionRefresh = new Promise<{ isAuthenticated: boolean }>(resolve => { finishSession = resolve; });
  const verification = new Promise<string>(resolve => { finishVerification = resolve; });
  const verify = jest.fn(() => verification);
  function Probe() {
    const queryClient = useQueryClient();
    useEffect(() => { client = queryClient; }, [queryClient]);
    const session = useQuery({
      queryKey: ['session'],
      queryFn: () => sessionRefresh,
      initialData: { isAuthenticated: true },
      staleTime: 0,
    });
    const result = useQuery({ queryKey: ['verify-email', 'synthetic-token'], queryFn: verify, staleTime: Infinity });
    return <div>{session.data?.isAuthenticated ? 'Authenticated' : 'Guest'} {result.data}</div>;
  }
  render(<Providers><Probe /></Providers>);
  await waitFor(() => expect(verify).toHaveBeenCalledTimes(1));
  client.setQueryData(['currentUser'], { email: 'private@example.test' });
  client.setQueryData(['myApplications'], ['private-application']);

  act(() => { window.dispatchEvent(new CustomEvent('auth:session-expired')); });

  await waitFor(() => expect(screen.getByText(/Guest/)).toBeInTheDocument());
  expect(client.getQueryData(['session'])).toBeNull();
  expect(client.getQueryData(['currentUser'])).toBeUndefined();
  expect(client.getQueryData(['myApplications'])).toBeUndefined();
  await act(async () => { finishSession({ isAuthenticated: true }); });
  expect(client.getQueryData(['session'])).toBeNull();
  await act(async () => { finishVerification('Verified'); });
  expect(await screen.findByText('Guest Verified')).toBeInTheDocument();
  expect(verify).toHaveBeenCalledTimes(1);
});
