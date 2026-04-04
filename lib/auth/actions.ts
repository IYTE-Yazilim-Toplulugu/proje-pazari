'use server';
import { cookies } from 'next/headers';

import { auth } from '@/lib/api';
import { authModel } from '@/lib/models';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function loginAction(data: authModel.LoginRequest) {
    try {
        const response = await auth.login(data);

        // 2. On success, set the cookie from the server
        if (response.data?.accessToken && response.data?.refreshToken) {
            (await cookies()).set(AUTH_TOKEN_KEY, response.data.accessToken, {
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: true,
            });
            (await cookies()).set(REFRESH_TOKEN_KEY, response.data.refreshToken, {
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: true,
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
