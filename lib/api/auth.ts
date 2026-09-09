import { mutator } from './base';
import { apiModel, authModel } from '../models';

// ============================================================================
// ÇALIŞAN ENDPOINT'LER (Prefix'leri düzeltildi)
// ============================================================================

/** [POST] /api/v1/auth/login - Performs login action. */
export const login = (payload: authModel.LoginRequest) =>
    mutator('/api/v1/auth/login', 'post', apiModel.TokenResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/register - Registers a new user. */
export const register = (payload: authModel.RegisterRequest) =>
    mutator('/api/v1/auth/register', 'post', apiModel.BasicResponseSchema, { arg: payload });

/** [POST] /api/v1/auth/refresh?refreshToken=... - Refreshes the user session. */
export const refreshToken = (payload: authModel.RefreshTokenRequest) =>
    mutator(`/api/v1/auth/refresh?refreshToken=${encodeURIComponent(payload.refreshToken)}`, 'post', apiModel.TokenResponseSchema, { arg: null });

/** [POST] /api/v1/auth/resend-verification - Resends verification email. */
export const resendVerificationEmail = (email: string) =>
    mutator('/api/v1/auth/resend-verification', 'post', apiModel.BasicResponseSchema, { arg: { email } });


// ============================================================================
// DİKKAT: BACKEND'DE HENÜZ OLMAYANLAR! (Bunlar çağrılırsa 404 atar)
// ============================================================================

// NOTE: There is intentionally no `logout` helper here. The logout request must run
// server-side (it is issued from the `logoutAction` server action), but `mutator`/`http`
// reads the access token via js-cookie, which is browser-only. See `lib/auth/actions.ts`.

/** [POST] /api/v1/auth/forgot-password - Sends password reset email. */
export async function forgotPassword(email: string): Promise<apiModel.BasicResponse> {
    return mutator('/api/v1/auth/forgot-password', 'post', apiModel.BasicResponseSchema, {
        arg: { email },
    });
}

/** [POST] /api/v1/auth/reset-password - Resets user password with token. */
export async function resetPassword(token: string, newPassword: string): Promise<apiModel.BasicResponse> {
    return mutator('/api/v1/auth/reset-password', 'post', apiModel.BasicResponseSchema, {
        arg: { token, newPassword },
    });
}
