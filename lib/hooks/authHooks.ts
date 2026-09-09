import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { ZodError } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAuthContextFromUser } from '../auth/permissions';
import { loginAction, logoutAction } from '../auth/actions';
import { userModel, apiModel, authModel } from "../models";
import { auth, user } from '../api';
import { ApiError } from '../api/base';
import { useApiError } from './useApiError';


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
                    error.code === apiModel.ResponseCodeSchema.enum.UNAUTHORIZED ||
                    error.code === apiModel.ResponseCodeSchema.enum.NOT_FOUND
                ) {
                    return false; // Do not retry
                }
            }

            // 3 by default, but I trust to my backend bro
            return failureCount < 3;
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
    const locale = useLocale();

    return useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            // Update the UI instantly and redirect
            queryClient.setQueryData(SESSION_QUERY_KEY, null);
            router.push(`/${locale}/login`);
        },
        onError: (error: Error) => {
            console.error('Logout failed:', error.message);
        },
    });
};

/**
 * Hook to delete the authenticated user's account.
 * On success, reuses the logout mutation to clear auth cookies, drop the
 * cached session/user data, and perform a locale-aware redirect to login.
 */
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    const logout = useLogout();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: user.deleteUser,
        onSuccess: async () => {
            queryClient.clear();
            await logout.mutateAsync();
        },
        onError: (error) => {
            console.error('Account deletion failed:', error);
            handleError(error);
        },
    });
};

/**
 * The outcome of an email-verification attempt.
 *
 * Every backend failure is mapped onto one of these instead of being surfaced as
 * a thrown error — see `useVerifyEmail` for why.
 */
export type VerifyEmailStatus =
    | 'success'
    | 'invalidToken'
    | 'expiredToken'
    | 'alreadyVerified'
    | 'error';

function mapVerifyEmailError(error: unknown): VerifyEmailStatus {
    if (error instanceof ApiError) {
        switch (error.errorCode) {
            case apiModel.ErrorCode.INVALID_VERIFICATION_TOKEN:
                return 'invalidToken';
            case apiModel.ErrorCode.VERIFICATION_TOKEN_EXPIRED:
                return 'expiredToken';
            case apiModel.ErrorCode.EMAIL_ALREADY_VERIFIED:
                return 'alreadyVerified';
        }
    }

    // Log the message only — never the token, which is not part of these errors.
    console.error(
        'Email verification failed:',
        error instanceof Error ? error.message : 'Unknown error'
    );
    return 'error';
}

/**
 * Hook that verifies an email address from a verification-link token.
 *
 * The query function deliberately never rejects: it resolves to a
 * `VerifyEmailStatus` instead. Two reasons — the page renders a distinct state
 * for each outcome rather than a generic error, and the global query-cache
 * subscription in `app/providers.tsx` raises an error toast for any query that
 * lands in an error state, which would stack a generic toast on top of the
 * page's own message.
 *
 * React Query also dedupes in-flight requests per key, so React Strict Mode's
 * double effect invocation in development still results in exactly one request.
 *
 * @param token The verification token from the URL, or null when absent.
 */
export const useVerifyEmail = (token: string | null) => {
    return useQuery({
        queryKey: ['verify-email', token],
        enabled: Boolean(token),
        queryFn: async (): Promise<VerifyEmailStatus> => {
            try {
                await user.verifyEmail(token as string);
                return 'success';
            } catch (error) {
                return mapVerifyEmailError(error);
            }
        },
        // A verification token is single-use: never retry it and never refetch it.
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
};

/** Hook to request a fresh verification email for the given address. */
export const useResendVerificationEmail = () => {
    return useMutation({
        mutationFn: (email: string) => auth.resendVerificationEmail(email),
        onError: (error: Error) => {
            console.error('Resending the verification email failed:', error.message);
        },
    });
};

/** Hook for user registration. */
export const useRegister = () => {
    const router = useRouter();
    const locale = useLocale();
    return useMutation({
        mutationFn: (payload: authModel.RegisterRequest) => auth.register(payload),
        onSuccess: (result, variables) => {
            alert('Registration successful! Please check your email to verify your account.');
            if (result.code === apiModel.ResponseCodeSchema.enum.REGISTERED_NEEDS_VERIFICATION) {
                router.push(`/${locale}/register/complete?email=${encodeURIComponent(variables.email)}`);
                return;
            }

            router.push(`/${locale}/login`);
        },
    });
};