'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyEmail, useResendVerificationEmail, type VerifyEmailStatus } from '@/lib/hooks/authHooks';

const emailSchema = z.string().email();

type Tone = 'success' | 'info' | 'error';

const toneClasses: Record<Tone, string> = {
    success: 'text-green-500',
    info: 'text-blue-500',
    error: 'text-red-500',
};

function StateIcon({ tone }: { tone: Tone }) {
    const paths: Record<Tone, string> = {
        success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        error: 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    };

    return (
        <div className={`mb-4 ${toneClasses[tone]}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[tone]} />
            </svg>
        </div>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                {children}
            </div>
        </div>
    );
}

/**
 * Lets the user request a fresh verification email.
 *
 * Shown only for states a new email can actually fix — an expired or invalid
 * token. The address is collected here because the verification token is opaque
 * to the frontend, so the page has no other way to know whose email this is.
 */
function ResendForm() {
    const t = useTranslations('auth.verifyEmail.resend');
    const [email, setEmail] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const { mutate, isPending, isSuccess, isError } = useResendVerificationEmail();

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!emailSchema.safeParse(email).success) {
            setValidationError(t('invalidEmail'));
            return;
        }

        setValidationError(null);
        mutate(email);
    };

    if (isSuccess) {
        return (
            <p className="text-sm text-green-600 dark:text-green-400 mb-6" role="status">
                {t('success')}
            </p>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3 text-left mb-6" noValidate>
            <Label htmlFor="resend-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('prompt')}
            </Label>
            <Input
                id="resend-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('emailPlaceholder')}
                aria-label={t('emailLabel')}
                className={validationError ? 'border-red-500' : ''}
            />
            {validationError && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
            )}
            {isError && (
                <p className="text-sm text-red-600 dark:text-red-400">{t('error')}</p>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? t('sending') : t('submitBtn')}
            </Button>
        </form>
    );
}

function VerifyEmailContent() {
    const t = useTranslations('auth.verifyEmail');
    const searchParams = useSearchParams();
    // An empty `?token=` is treated the same as no token at all: both mean the
    // link is unusable, and neither is worth a request.
    const token = searchParams.get('token')?.trim() || null;

    const { data: status, isPending } = useVerifyEmail(token);

    if (!token) {
        return (
            <Card>
                <StateIcon tone="error" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('tokenMissingTitle')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('tokenMissingDesc')}</p>
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('backToLogin')}
                </Link>
            </Card>
        );
    }

    if (isPending || !status) {
        return (
            <Card>
                <div
                    className="mb-4 h-16 w-16 mx-auto rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"
                    role="status"
                    aria-label={t('loading')}
                />
                <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </Card>
        );
    }

    const presentation: Record<VerifyEmailStatus, { tone: Tone; title: string; desc: string }> = {
        success: { tone: 'success', title: t('successTitle'), desc: t('successDesc') },
        alreadyVerified: { tone: 'info', title: t('alreadyVerifiedTitle'), desc: t('alreadyVerifiedDesc') },
        invalidToken: { tone: 'error', title: t('invalidTitle'), desc: t('invalidDesc') },
        expiredToken: { tone: 'error', title: t('expiredTitle'), desc: t('expiredDesc') },
        error: { tone: 'error', title: t('errorTitle'), desc: t('errorDesc') },
    };

    const { tone, title, desc } = presentation[status];
    // A generic failure may be transient (network, 5xx), so a new email would not
    // necessarily help — only offer the resend where a fresh token is the fix.
    const canResend = status === 'invalidToken' || status === 'expiredToken';
    const canLogIn = status === 'success' || status === 'alreadyVerified';

    return (
        <Card>
            <StateIcon tone={tone} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{desc}</p>

            {canResend && <ResendForm />}

            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                {canLogIn ? t('goToLogin') : t('backToLogin')}
            </Link>
        </Card>
    );
}

export default function VerifyEmailPage() {
    const t = useTranslations('auth.verifyEmail');
    return (
        <Suspense fallback={<Card><p className="text-gray-600 dark:text-gray-400">{t('loading')}</p></Card>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
