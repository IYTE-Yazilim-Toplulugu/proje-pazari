import { apiModel, authModel } from '../models';
import { mutator } from './base';

const apiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || '';

/** [POST] /api/v1/auth/login - Performs login action. */
export const login = (payload: authModel.LoginRequest) =>
    mutator('/api/v1/auth/login', 'post', apiModel.TokenResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/logout - Deletes the specified session. */
export const logout = (payload: authModel.LogoutRequest) =>
    mutator('/api/v1/auth/logout', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/register - Registers a new user. */
export const register = (payload: authModel.RegisterRequest | authModel.OAuthRegisterRequest) =>
    mutator('/api/v1/auth/register', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/refresh - Refreshes the user session. */
export const refreshToken = (payload: authModel.RefreshTokenRequest) =>
    mutator('/api/v1/auth/refresh', 'post', apiModel.TokenResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/forgot-password - Sends password reset email. */
export async function forgotPassword(email: string): Promise<apiModel.BasicResponse> {
    return mutator('/api/v1/auth/forgot-password', 'post', apiModel.BasicResponseSchema, {
        arg: { email },
    });
    const json = await response.json();
    const parsed = apiModel.RefreshResponseSchema.parse(json);
    return parsed.data!;
};

/** [POST] /api/v1/auth/reset-password - Resets user password with token. */
export async function resetPassword(
    token: string,
    password: string
): Promise<apiModel.BasicResponse> {
    return mutator('/api/v1/auth/reset-password', 'post', apiModel.BasicResponseSchema, {
        arg: { token, password },
    });
}

/** [POST] /api/v1/auth/resend-verification - Resends verification email. */
export async function resendVerificationEmail(
    email: string
): Promise<apiModel.BasicResponse> {
    return mutator('/api/v1/auth/resend-verification', 'post', apiModel.BasicResponseSchema, {
        arg: { email },
    });
}

/**
 * [GET] /api/v1/auth/status - Returns if the user is authenticated.
 * **BROKEN FOR NOW BECAUSE OF FURKAN's ASS IS HUGE**
 * */
export const getStatus = () => fetcher('/api/v1/auth/status', z.boolean());

/** [POST] /api/v1/auth/resend-verification - Resends verification email. */
export const resendVerificationEmail = (email: string) =>
    mutator('/api/v1/auth/resend-verification', 'post', apiModel.BasicResponseSchema, { arg: { email } });

// --- OAuth Redirect Helpers ---

type OAuthService = 'google' | 'meta' | 'microsoft';

export const getOAuthRedirectUrl = (serviceId: OAuthService): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/oauth/${serviceId}/redirect`;
};
