import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { user } from '../../api';
import { logoutAction } from '../../auth/actions';
import { useDeleteAccount } from '../authHooks';
import { useApiError } from '../useApiError';

jest.mock('../../api', () => ({
    auth: {},
    user: {
        getCurrentUser: jest.fn(),
        deleteUser: jest.fn(),
    },
}));

jest.mock('../../auth/actions', () => ({
    loginAction: jest.fn(),
    logoutAction: jest.fn(),
}));

jest.mock('../../auth/permissions', () => ({
    getAuthContextFromUser: jest.fn(),
}));

jest.mock('../useApiError', () => ({
    useApiError: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useLocale: jest.fn(() => 'tr'),
}));

const deleteUserMock = user.deleteUser as jest.Mock;
const logoutActionMock = logoutAction as jest.Mock;
const useApiErrorMock = useApiError as jest.Mock;
const useRouterMock = useRouter as jest.Mock;

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

describe('useDeleteAccount', () => {
    const handleError = jest.fn();
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useApiErrorMock.mockReturnValue({ handleError });
        useRouterMock.mockReturnValue({ push });
        logoutActionMock.mockResolvedValue(undefined);
    });

    it('clears cached auth state, clears auth cookies, and redirects to login on success', async () => {
        const { queryClient, wrapper } = createWrapper();
        const clearSpy = jest.spyOn(queryClient, 'clear');
        deleteUserMock.mockResolvedValueOnce({ code: 0, message: 'User deleted successfully' });

        const { result } = renderHook(() => useDeleteAccount(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync();
        });

        expect(deleteUserMock).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(logoutActionMock).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith('/tr/login');
        expect(handleError).not.toHaveBeenCalled();
    });

    it('shows the error UI and preserves auth state when deletion fails', async () => {
        const { queryClient, wrapper } = createWrapper();
        const clearSpy = jest.spyOn(queryClient, 'clear');
        const error = new Error('Account deletion failed');
        deleteUserMock.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteAccount(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync().catch(() => undefined);
        });

        await waitFor(() => {
            expect(handleError).toHaveBeenCalledWith(error);
        });
        expect(clearSpy).not.toHaveBeenCalled();
        expect(logoutActionMock).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });
});
