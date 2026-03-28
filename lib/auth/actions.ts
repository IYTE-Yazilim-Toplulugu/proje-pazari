'use server';
import { cookies } from 'next/headers';

import { auth } from '@/lib/api';
import { authModel } from '@/lib/models';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function loginAction(data: authModel.LoginRequest) {
    try {
        const response = await auth.login(data);

        if (response.accessToken && response.refreshToken) {
            (await cookies()).set(AUTH_TOKEN_KEY, response.accessToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                httpOnly: false,
            });
            (await cookies()).set(REFRESH_TOKEN_KEY, response.refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                httpOnly: true,
            });
        }
        return { success: true };
    } catch (error: unknown) {
        // Return the error message if the API call fails
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
