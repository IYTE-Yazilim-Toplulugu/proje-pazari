import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { useSession, useLogout } from '@/lib/hooks/authHooks';

jest.mock('@/lib/hooks/authHooks', () => ({ useSession: jest.fn(), useLogout: jest.fn() }));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../LanguageSwitcher', () => ({
  __esModule: true,
  default: ({ disabled, persistPreference }: { disabled: boolean; persistPreference: boolean }) => (
    <button disabled={disabled}>{persistPreference ? 'persist language' : 'local language'}</button>
  ),
}));

it.each([
  { isLoading: true, isError: false, data: undefined },
  { isLoading: false, isError: true, data: undefined },
  { isLoading: false, isError: true, data: { isAuthenticated: true } },
])('disables language changes while session is unresolved: %j', (session) => {
  jest.mocked(useSession).mockReturnValue(session as ReturnType<typeof useSession>);
  jest.mocked(useLogout).mockReturnValue({ mutate: jest.fn() } as unknown as ReturnType<typeof useLogout>);
  render(<Header />);
  expect(screen.getByRole('button', { name: /language/ })).toBeDisabled();
});

it.each([false, true])('enables language changes for a resolved session (authenticated=%s)', (isAuthenticated) => {
  jest.mocked(useSession).mockReturnValue({ isLoading: false, isError: false, data: { isAuthenticated } } as ReturnType<typeof useSession>);
  jest.mocked(useLogout).mockReturnValue({ mutate: jest.fn() } as unknown as ReturnType<typeof useLogout>);
  render(<Header />);
  expect(screen.getByRole('button', { name: isAuthenticated ? 'persist language' : 'local language' })).toBeEnabled();
});
