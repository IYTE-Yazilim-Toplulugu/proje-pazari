import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { user } from '../../api';
import { useUpdateProfile } from '../userHooks';
import { useApiError } from '../useApiError';

jest.mock('../../api', () => ({
    user: {
        updateUser: jest.fn(),
    },
}));

jest.mock('../useApiError', () => ({
    useApiError: jest.fn(),
}));

const updateUserMock = user.updateUser as jest.Mock;
const useApiErrorMock = useApiError as jest.Mock;

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

describe('useUpdateProfile', () => {
    const handleError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useApiErrorMock.mockReturnValue({ handleError });
    });

    it('invalidates the session and currentUser queries on success', async () => {
        const { queryClient, wrapper } = createWrapper();
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
        updateUserMock.mockResolvedValueOnce({ code: 0, message: 'Profile updated successfully' });

        const { result } = renderHook(() => useUpdateProfile(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ userId: 'u1', firstName: 'Ada' });
        });

        expect(updateUserMock.mock.calls[0][0]).toEqual({ userId: 'u1', firstName: 'Ada' });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['session'] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['currentUser'] });
        expect(handleError).not.toHaveBeenCalled();
    });

    it('surfaces the error via useApiError and skips invalidation on failure', async () => {
        const { queryClient, wrapper } = createWrapper();
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
        const error = new Error('Profile update failed');
        updateUserMock.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useUpdateProfile(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ userId: 'u1', firstName: 'Ada' }).catch(() => undefined);
        });

        await waitFor(() => {
            expect(handleError).toHaveBeenCalledWith(error);
        });
        expect(invalidateSpy).not.toHaveBeenCalled();
    });
});
