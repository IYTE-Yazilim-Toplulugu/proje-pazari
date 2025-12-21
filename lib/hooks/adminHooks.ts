import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { admin } from '../api';
import { adminModel } from '../models';

// The key for caching and invalidating our features data
const FEATURES_QUERY_KEY = ['features'];

/**
 * Hook to fetch all feature flags.
 * Handles data fetching, caching, and background refetching.
 */
export const useFeatures = () => {
    return useQuery({
        queryKey: FEATURES_QUERY_KEY,
        queryFn: admin.getFeatures,
    });
};

/**
 * Hook to change a feature flag.
 * Handles the mutation state and invalidates the feature list on success
 * to trigger an automatic refetch.
 */
export const useChangeFeature = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: adminModel.ChangeFeaturePayload) => admin.changeFeature(payload),
        onSuccess: () => {
            // When this mutation succeeds, the list of features is stale.
            // Invalidate the query to force a refetch and update the UI.
            queryClient.invalidateQueries({ queryKey: FEATURES_QUERY_KEY });
        },
        onError: (error) => {
            // Optional: Add global error handling, like a toast notification
            console.error('Failed to change feature:', error);
        },
    });
};

/**
 * Hook to clean all feature flags.
 * Also invalidates the feature list on success.
 */
export const useCleanFeatures = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: admin.cleanFeatures,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FEATURES_QUERY_KEY });
        },
        onError: (error) => {
            console.error('Failed to clean features:', error);
        },
    });
};
