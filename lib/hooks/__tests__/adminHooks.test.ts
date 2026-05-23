import React, { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { admin } from '../../api';
import { useChangeFeature } from '../adminHooks';
import { useToast } from '../useToast';

jest.mock('../../api', () => ({
    admin: {
        getFeatures: jest.fn(),
        changeFeature: jest.fn(),
    },
}));

jest.mock('../useToast', () => ({
    useToast: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => {
        const messages: Record<string, string> = {
            featureUpdateErrorTitle: 'Feature flag update failed',
            featureUpdateErrorDescription: 'Please try updating the feature flag again.',
        };

        return messages[key] ?? key;
    },
}));

const changeFeatureMock = admin.changeFeature as jest.Mock;
const useToastMock = useToast as jest.Mock;

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

describe('useChangeFeature', () => {
    const showError = jest.fn();
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        useToastMock.mockReturnValue({ error: showError });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('invalidates the features query when the feature flag update succeeds', async () => {
        const { queryClient, wrapper } = createWrapper();
        const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
        changeFeatureMock.mockResolvedValueOnce({ code: 0 });

        const { result } = renderHook(() => useChangeFeature(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ key: 'Feed', enabled: true });
        });

        expect(changeFeatureMock).toHaveBeenCalledWith({ key: 'Feed', enabled: true });
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['features'] });
        expect(showError).not.toHaveBeenCalled();
    });

    it('shows visible toast feedback and logs when the feature flag update fails', async () => {
        const { wrapper } = createWrapper();
        const error = new Error('Backend rejected the update');
        changeFeatureMock.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useChangeFeature(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ key: 'Feed', enabled: false }).catch(() => undefined);
        });

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                'Feature flag update failed',
                'Backend rejected the update',
            );
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to change feature:', error);
    });

    it('uses a generic toast description when the mutation error has no message', async () => {
        const { wrapper } = createWrapper();
        changeFeatureMock.mockRejectedValueOnce('request failed');

        const { result } = renderHook(() => useChangeFeature(), { wrapper });

        await act(async () => {
            await result.current.mutateAsync({ key: 'Feed', enabled: false }).catch(() => undefined);
        });

        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(
                'Feature flag update failed',
                'Please try updating the feature flag again.',
            );
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to change feature:', 'request failed');
    });
});
