import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { user } from '../../api';
import { useUpdateProfile, useUploadProfilePicture } from '../userHooks';
import { useApiError } from '../useApiError';

jest.mock('../../api', () => ({
    user: {
        updateUser: jest.fn(),
        updateProfilePicture: jest.fn(),
    },
}));

jest.mock('../useApiError', () => ({
    useApiError: jest.fn(),
}));

const updateUserMock = user.updateUser as jest.Mock;
const updateProfilePictureMock = user.updateProfilePicture as jest.Mock;
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
            await result.current.mutateAsync({ firstName: 'Ada' });
        });

        expect(updateUserMock.mock.calls[0][0]).toEqual({ firstName: 'Ada' });
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
            await result.current.mutateAsync({ firstName: 'Ada' }).catch(() => undefined);
        });

        await waitFor(() => {
            expect(handleError).toHaveBeenCalledWith(error);
        });
        expect(invalidateSpy).not.toHaveBeenCalled();
    });
});

describe('useUploadProfilePicture', () => {
    const handleError = jest.fn();
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });

    beforeEach(() => {
        jest.clearAllMocks();
        useApiErrorMock.mockReturnValue({ handleError });
    });

    it('invalidates the session and currentUser queries on success', async () => {
        const { queryClient, wrapper } = createWrapper();
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
        updateProfilePictureMock.mockResolvedValueOnce({ code: 0, message: 'Profile picture updated successfully' });

        const { result } = renderHook(() => useUploadProfilePicture(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync(file);
        });

        expect(updateProfilePictureMock).toHaveBeenCalledWith(file, expect.anything());
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['session'] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['currentUser'] });
        expect(handleError).not.toHaveBeenCalled();
    });

    it('settles only after the current user has been refetched', async () => {
        const { wrapper } = createWrapper();
        let finishRefetch!: () => void;
        const getCurrentUser = jest.fn()
            .mockResolvedValueOnce({ profilePictureUrl: 'old' })
            .mockImplementationOnce(() => new Promise(resolve => {
                finishRefetch = () => resolve({ profilePictureUrl: 'new' });
            }));
        updateProfilePictureMock.mockResolvedValueOnce({ code: 0, message: 'ok' });

        // An active observer, like the profile page, so invalidation refetches.
        const { result } = renderHook(() => ({
            currentUser: useQuery({ queryKey: ['currentUser'], queryFn: getCurrentUser }),
            upload: useUploadProfilePicture(),
        }), { wrapper });
        await waitFor(() => expect(result.current.currentUser.isSuccess).toBe(true));

        let settled = false;
        let upload!: Promise<unknown>;
        act(() => {
            upload = result.current.upload.mutateAsync(file).then(() => { settled = true; });
        });

        await waitFor(() => expect(getCurrentUser).toHaveBeenCalledTimes(2));
        expect(settled).toBe(false);

        await act(async () => {
            finishRefetch();
            await upload;
        });
        expect(settled).toBe(true);
        await waitFor(() => expect(result.current.currentUser.data).toEqual({ profilePictureUrl: 'new' }));
    });

    it('surfaces the error via useApiError and rethrows when the upload fails', async () => {
        const { queryClient, wrapper } = createWrapper();
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
        const error = new Error('Upload failed');
        updateProfilePictureMock.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useUploadProfilePicture(), { wrapper });

        await act(async () => {
            await expect(result.current.mutateAsync(file)).rejects.toThrow('Upload failed');
        });

        expect(handleError).toHaveBeenCalledWith(error);
        expect(invalidateSpy).not.toHaveBeenCalled();
    });
});
