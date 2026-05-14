'use server';
import { cookies } from 'next/headers';

import { auth } from '@/lib/api';
import { authModel } from '@/lib/models';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function loginAction(data: authModel.LoginRequest) {
    try {
        const response = await auth.login(data);

        if (response.data?.accessToken && response.data?.refreshToken) {
            // Cookies are intentionally not httpOnly: the client-side API layer (js-cookie)
            // must be able to read them to attach the JWT as an Authorization header on
            // every outgoing request. The secure flag is enabled in production.
            (await cookies()).set(AUTH_TOKEN_KEY, response.data.accessToken, {
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH_COOKIE_MAX_AGE,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });
            (await cookies()).set(REFRESH_TOKEN_KEY, response.data.refreshToken, {
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH_COOKIE_MAX_AGE,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });
        }
        return { success: true };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export async function logoutAction() {
    // Clear the cookie from the server
    (await cookies()).delete(AUTH_TOKEN_KEY);
    (await cookies()).delete(REFRESH_TOKEN_KEY);
}
