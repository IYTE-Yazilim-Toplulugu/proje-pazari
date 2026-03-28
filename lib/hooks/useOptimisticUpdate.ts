import { useQueryClient } from '@tanstack/react-query';

type QueryKeyLike = readonly unknown[];

export function useOptimisticUpdate<T>(queryKey: QueryKeyLike) {
    const queryClient = useQueryClient();

    const updateOptimistically = (
        updater: (old: T | undefined) => T,
            mutation: Promise<unknown>
        ) => {
            //Snapshot previous value
            const previousData = queryClient.getQueryData<T>(queryKey);
            //Optimistically update to new value
            queryClient.setQueryData<T>(queryKey,updater);
            //Handle mutation
            mutation
                .then(() => {
                    // Invalidate to refetch
                    queryClient.invalidateQueries({ queryKey });
                })
                .catch(() => {
                    //Rollback on error
                    queryClient.setQueryData<T>(queryKey, previousData);
                });
        };

    return { updateOptimistically };
}
