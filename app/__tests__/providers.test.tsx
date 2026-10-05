import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import Providers from '../providers';
import { useSession, useVerifyEmail } from '@/lib/hooks/authHooks';
import { user } from '@/lib/api';
import { ApiError } from '@/lib/api/base';
import { ResponseCodeSchema } from '@/lib/models/Api';
import type { MUser } from '@/lib/models/User';

jest.mock('@/lib/env', () => ({ env: { NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080' } }));
jest.mock('@/lib/api', () => ({ user: { getCurrentUser: jest.fn(), verifyEmail: jest.fn() } }));
jest.mock('@/lib/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/components/shared/ApiStatus', () => ({ __esModule: true, default: () => null }));
jest.mock('@tanstack/react-query-devtools', () => ({ ReactQueryDevtools: () => null }));
const mockShowError = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({ error: mockShowError, warning: jest.fn() }),
}));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

it('session expiry clears authenticated data without restarting real verification/session hooks', async () => {
  let client!: QueryClient;
  let finishVerification!: () => void;
  let finishSession!: (value: MUser) => void;
  const sessionRefresh = new Promise<MUser>(resolve => { finishSession = resolve; });
  const verification = new Promise<Awaited<ReturnType<typeof user.verifyEmail>>>(resolve => { finishVerification = () => resolve({ code: 0 }); });
  jest.mocked(user.getCurrentUser).mockReturnValue(sessionRefresh);
  jest.mocked(user.verifyEmail).mockReturnValue(verification);
  function Probe() {
    const queryClient = useQueryClient();
    useEffect(() => { client = queryClient; }, [queryClient]);
    const session = useSession();
    const result = useVerifyEmail('synthetic-token');
    return <div>{session.data?.isAuthenticated ? 'Authenticated' : 'Guest'} {result.data}</div>;
  }
  render(<Providers><Probe /></Providers>);
  await waitFor(() => expect(user.verifyEmail).toHaveBeenCalledTimes(1));
  act(() => { client.setQueryData(['session'], { id: 'user-1', role: 'USER' }); });
  await screen.findByText(/Authenticated/);
  client.setQueryData(['currentUser'], { email: 'private@example.test' });
  client.setQueryData(['my-applications', 'user-1'], ['private-application']);

  act(() => { window.dispatchEvent(new CustomEvent('auth:session-expired')); });

  await waitFor(() => expect(screen.getByText(/Guest/)).toBeInTheDocument());
  expect(client.getQueryData(['session'])).toBeNull();
  expect(client.getQueryData(['currentUser'])).toBeUndefined();
  expect(client.getQueryData(['my-applications', 'user-1'])).toBeUndefined();
  await act(async () => { finishSession({ id: 'user-1', role: 'USER' } as MUser); });
  expect(client.getQueryData(['session'])).toBeNull();
  await act(async () => { finishVerification(); });
  expect(await screen.findByText('Guest success')).toBeInTheDocument();
  expect(user.verifyEmail).toHaveBeenCalledTimes(1);
});

it('does not toast an expected guest session 401 over verification', async () => {
  jest.mocked(user.getCurrentUser).mockRejectedValue(new ApiError('Not authenticated', ResponseCodeSchema.enum.UNAUTHORIZED));
  jest.mocked(user.verifyEmail).mockResolvedValue(undefined as never);
  function Probe() {
    const session = useSession();
    const result = useVerifyEmail('guest-token');
    return <div>{session.isError ? 'Guest' : 'Loading'} {result.data}</div>;
  }
  render(<Providers><Probe /></Providers>);
  expect(await screen.findByText('Guest success')).toBeInTheDocument();
  expect(mockShowError).not.toHaveBeenCalled();
});

it('still toasts unexpected session failures', async () => {
  jest.mocked(user.getCurrentUser).mockRejectedValue(new ApiError('Server unavailable', ResponseCodeSchema.enum.INTERNAL_SERVER_ERROR));
  function Probe() { useSession(); return null; }
  render(<Providers><Probe /></Providers>);
  await waitFor(() => expect(mockShowError).toHaveBeenCalledWith('fetchErrorTitle', 'Server unavailable'), { timeout: 10000 });
}, 15000);
