import { useMutation, useQueryClient } from '@tanstack/react-query';

import { user } from '../api';
import { useApiError } from './useApiError';

/** Hook to update the authenticated user's profile. */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: user.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (error) => {
            console.error('Profile update failed:', error);
            handleError(error);
        },
    });
};
