'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function RegisterCompletePage() {
    const t = useTranslations('auth.register.complete');
    const searchParams = useSearchParams();
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleResend = async () => {
        if (!email) {
            console.error('Cannot resend verification email: email is missing.');
            return;
        }

        setResending(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setResent(true);
        } catch (error) {
            console.error('Error resending verification:', error);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">{t('verifyTitle')}</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                {t('verifyDesc')}
            </p>

            {resent ? (
                <p className="text-center text-green-600 dark:text-green-400">
                    {t('resendSuccess')}
                </p>
            ) : (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="form-button-secondary"
                >
                    {resending ? t('sending') : t('resendBtn')}
                </button>
            )}
        </div>
    );
}
