'use server';

import {cookies} from 'next/headers';
import {Locale, locales} from '@/i18n-config';

const COOKIE_DURATION = 365 * 24 * 60 * 60;
const COOKIE_NAME = 'NEXT_LOCALE';

export async function setLocale(locale: Locale) {
    if (!locales.includes(locale)) {
        throw new Error('Invalid locale');
    }

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, locale, {
        httpOnly: true,
        maxAge: COOKIE_DURATION,
        path: '/',
        sameSite: 'lax'
    });
}