import { useRouter } from 'next/navigation';

import { ZodError } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAuthContextFromUser } from '../auth/permissions';
import { loginAction, logoutAction } from '../auth/actions';
import { userModel, apiModel, authModel } from "../models";
import { auth, user } from '../api';
import { ApiError } from '../api/base';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { setLocale } from '../actions/locale';
import { getCurrentUser } from '../api/user';


// The query key for the main user session from our previous discussion
const SESSION_QUERY_KEY = ['session'];

export const useSession = () => {
    return useQuery({
        queryKey: SESSION_QUERY_KEY,
        queryFn: user.getCurrentUser, // Fetches the MUser object
        staleTime: 5 * 60 * 1000, // Fetch user data every 5 minutes
        retry: (failureCount, error) => {
            // A. Check for our custom ApiError
            if (error instanceof ZodError) {
                console.error('Data validation error:', error);
                return false;
            }

            if (error instanceof ApiError) {
                if (
                    error.code === apiModel.ResponseCodeSchema.enum.Unauthorized ||
                    error.code === apiModel.ResponseCodeSchema.enum.Forbidden ||
                    error.code === apiModel.ResponseCodeSchema.enum.NotFound
                ) {
                    return false; // Do not retry
                }
            }

            // 3 by default, but I trust to my backend bro
            return failureCount < 0;
        },
        // **IMPORTANT**: Transform the fetched user data into our AuthContext
        select: (user: userModel.MUser | null) => {
            if (!user) {
                return authModel.GUEST_CONTEXT;
            }
            // Only run the transform if we actually HAVE a user.
            return getAuthContextFromUser(user);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: loginAction,
        onSuccess: (result) => {
            if (result.success) {
                // If the action was successful, refetch the session
                queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
                router.push('/'); // arbitrary post-login page
            } else {
                // If the action returned an error, we throw it so React Query's `error` state is populated
                throw new Error(result.error || 'An unknown error occurred.');
            }
        },
        onError: (error: Error) => {
            // This will now catch the error we threw above
            console.error('Login failed:', error.message);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            // Update the UI instantly and redirect
            queryClient.setQueryData(SESSION_QUERY_KEY, authModel.GUEST_CONTEXT);
            router.push('/login');
        },
    });
};

/** Hook for user registration. */
export const useRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (payload: authModel.RegisterRequest | authModel.OAuthRegisterRequest) => auth.register(payload),
        onSuccess: (_data, variables) => {
            // If registered with password, show message to check email
            if ('password' in variables && variables.password) {
                alert('Registration successful! Please check your email to verify your account.');
                router.push('/login');
            } else {
                // If registered with OAuth, proceed to login to get a token
                alert('Registration successful! Logging you in...');
                // Here you would typically call the login mutation
            }
        },
    });
};

/** Hook to get a lightweight boolean status of authentication. */
export const useAuthStatus = () => {
    return useQuery({
        queryKey: ['authStatus'],
        queryFn: auth.getStatus,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUserLanguage = () => {
    const currentLocale = useLocale();

    const { data: user } = useQuery({
        queryKey: SESSION_QUERY_KEY,
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
    })

    useEffect(() => {
        if (user?.language && user.language !== currentLocale) {
            setLocale(user.language as 'tr' | 'en');
        }
    }, [user?.language, currentLocale]);
}