'use server';
import { cookies } from 'next/headers';

import { auth } from '@/lib/api';
import { authModel } from '@/lib/models';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function loginAction(data: authModel.LoginRequest) {
    try {
        // 1. The Server Action calls your external API
        const response = await auth.login(data);

        // 2. On success, set the cookie from the server
        if (response.token && response.refresh_token) {
            (await cookies()).set(AUTH_TOKEN_KEY, response.token, {
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: false,
            });
            (await cookies()).set(REFRESH_TOKEN_KEY, response.refresh_token, {
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: true, // Refresh token should be httpOnly for security
            });
        }
        return { success: true };
    } catch (error: any) {
        // Return the error message if the API call fails
        return { success: false, error: error.message };
    }
}

export async function logoutAction() {
    // Clear the cookie from the server
    (await cookies()).delete(AUTH_TOKEN_KEY);
    (await cookies()).delete(REFRESH_TOKEN_KEY);
}
