import { apiModel, authModel } from '../models';
import { mutator } from './base';

const apiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || '';

/** [POST] /api/v1/auth/login - Performs login action. Returns unwrapped login data. */
export const login = async (payload: authModel.LoginRequest): Promise<apiModel.LoginResult> => {
    const response = await mutator('/api/v1/auth/login', 'post', apiModel.LoginResponseSchema, { arg: payload });
    return response.data!;
};

/** [POST] /api/v1/auth/logout - Deletes the specified session. */
export const logout = (payload: { refreshToken: string }) =>
    mutator('/api/v1/auth/logout', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/register - Registers a new user. */
export const register = (payload: authModel.RegisterRequest | authModel.OAuthRegisterRequest) =>
    mutator('/api/v1/auth/register', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/refresh?refreshToken=... - Refreshes the session. Returns unwrapped refresh data. */
export const refreshToken = async (token: string): Promise<apiModel.RefreshResult> => {
    const response = await fetch(`${apiBaseUrl()}/api/v1/auth/refresh?refreshToken=${encodeURIComponent(token)}`, {
        method: 'POST',
    });
    const json = await response.json();
    const parsed = apiModel.RefreshResponseSchema.parse(json);
    return parsed.data!;
};

/** [POST] /api/v1/auth/forgot-password - Sends password reset email. */
export const forgotPassword = (email: string) =>
    mutator('/api/v1/auth/forgot-password', 'post', apiModel.BasicResponseSchema, { arg: { email } });

/** [POST] /api/v1/auth/reset-password - Resets user password with token. */
export const resetPassword = (token: string, password: string) =>
    mutator('/api/v1/auth/reset-password', 'post', apiModel.BasicResponseSchema, { arg: { token, password } });

/** [POST] /api/v1/auth/resend-verification - Resends verification email. */
export const resendVerificationEmail = (email: string) =>
    mutator('/api/v1/auth/resend-verification', 'post', apiModel.BasicResponseSchema, { arg: { email } });

// --- OAuth Redirect Helpers ---

type OAuthService = 'google' | 'meta' | 'microsoft';

export const getOAuthRedirectUrl = (serviceId: OAuthService): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/oauth/${serviceId}/redirect`;
};
