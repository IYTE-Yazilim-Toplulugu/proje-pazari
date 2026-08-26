import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import LanguageSwitcher from '../LanguageSwitcher';
import { setLocale } from '@/lib/actions/locale';
import { updateUserLanguage } from '@/lib/api/user';
import { useApiError } from '@/lib/hooks/useApiError';

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/actions/locale', () => ({
  setLocale: jest.fn(),
}));

jest.mock('@/lib/api/user', () => ({
  updateUserLanguage: jest.fn(),
}));

jest.mock('@/lib/hooks/useApiError', () => ({
  useApiError: jest.fn(),
}));

const useLocaleMock = useLocale as jest.Mock;
const useRouterMock = useRouter as jest.Mock;
const setLocaleMock = setLocale as jest.Mock;
const updateUserLanguageMock = updateUserLanguage as jest.Mock;
const useApiErrorMock = useApiError as jest.Mock;

describe('LanguageSwitcher', () => {
  const refresh = jest.fn();
  const handleError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useLocaleMock.mockReturnValue('tr');
    useRouterMock.mockReturnValue({ refresh });
    useApiErrorMock.mockReturnValue({ handleError });
    setLocaleMock.mockResolvedValue(undefined);
    updateUserLanguageMock.mockResolvedValue({ code: 0 });
  });

  const renderSwitcher = ({
    disabled = false,
    persistPreference = false,
  }: {
    disabled?: boolean;
    persistPreference?: boolean;
  } = {}) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    render(
      <QueryClientProvider client={queryClient}>
        <LanguageSwitcher disabled={disabled} persistPreference={persistPreference} />
      </QueryClientProvider>,
    );

    return { invalidateQueries };
  };

  it('changes only the local locale for a guest', async () => {
    const { invalidateQueries } = renderSwitcher();

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    await waitFor(() => {
      expect(setLocaleMock).toHaveBeenCalledWith('en');
      expect(refresh).toHaveBeenCalled();
    });
    expect(updateUserLanguageMock).not.toHaveBeenCalled();
    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it('persists an authenticated preference before changing the local locale', async () => {
    const { invalidateQueries } = renderSwitcher({ persistPreference: true });

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    await waitFor(() => {
      expect(updateUserLanguageMock).toHaveBeenCalledWith('en');
      expect(setLocaleMock).toHaveBeenCalledWith('en');
      expect(refresh).toHaveBeenCalled();
    });

    expect(updateUserLanguageMock.mock.invocationCallOrder[0])
      .toBeLessThan(setLocaleMock.mock.invocationCallOrder[0]);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['session'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['currentUser'] });
  });

  it('keeps the current locale and surfaces an authenticated persistence failure', async () => {
    const error = new Error('Could not persist language');
    updateUserLanguageMock.mockRejectedValueOnce(error);
    renderSwitcher({ persistPreference: true });

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    await waitFor(() => {
      expect(handleError).toHaveBeenCalledWith(error);
    });
    expect(setLocaleMock).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('does not switch while authentication state is loading', () => {
    renderSwitcher({ disabled: true });

    expect(screen.getByRole('button', { name: 'EN' })).toBeDisabled();
  });
});
