import { z } from 'zod';

import { fetcher, mutator } from './base';
import { apiModel, authModel } from '../models';

// --- API Calls ---

/** [POST] /auth - Performs login action. */
export const login = (payload: authModel.LoginRequest) =>
    mutator('/auth/login', 'post', apiModel.TokenResponseSchema, { arg: payload });

/** [POST] /auth/logout - Deletes the specified session. */
export const logout = (payload: authModel.LogoutRequest) =>
    mutator('/auth/logout', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /auth/register - Registers a new user. */
export const register = (payload: authModel.RegisterRequest | authModel.OAuthRegisterRequest) =>
    mutator('/auth/register', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /auth/refresh - Refreshes the user session. */
export const refreshToken = (payload: authModel.RefreshTokenRequest) =>
    mutator('/auth/refresh', 'post', apiModel.TokenResponseSchema, { arg: payload });

/** [POST] /auth/forgot-password - Sends password reset email. */
export async function forgotPassword(email: string): Promise<apiModel.BasicResponse> {
    return mutator('/auth/forgot-password', 'post', apiModel.BasicResponseSchema, {
        arg: { email },
    });
}

/** [POST] /auth/reset-password - Resets user password with token. */
export async function resetPassword(
    token: string,
    password: string
): Promise<apiModel.BasicResponse> {
    return mutator('/auth/reset-password', 'post', apiModel.BasicResponseSchema, {
        arg: { token, password },
    });
}

/** [POST] /auth/resend-verification - Resends verification email. */
export async function resendVerificationEmail(
    email: string
): Promise<apiModel.BasicResponse> {
    return mutator('/auth/resend-verification', 'post', apiModel.BasicResponseSchema, {
        arg: { email },
    });
}

/**
 * [GET] /auth/status - Returns if the user is authenticated.
 * **BROKEN FOR NOW BECAUSE OF FURKAN's ASS IS HUGE**
 * */
export const getStatus = () => fetcher('/auth/status', z.boolean());


// --- OAuth Redirect Helpers ---

type OAuthService = 'google' | 'meta' | 'microsoft';

/**
 * Returns the redirect URL for the specified OAuth service.
 * This URL should be used in an `<a>` tag or `window.location.href`.
 * @param serviceId The OAuth service to redirect to.
 */
export const getOAuthRedirectUrl = (serviceId: OAuthService): string => {
    // Make sure to use your actual base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/oauth/${serviceId}/redirect`;
};
