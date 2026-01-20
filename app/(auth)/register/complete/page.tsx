'use client';
import { useEffect, useState } from 'react';

export default function RegisterCompletePage() {
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const emailParam = params.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }
        } catch (error) {
            console.error('Error reading email from query parameters:', error);
        }
    }, []);

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
            <h1 className="form-title">Verify Your Email</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                We've sent a verification email to your IYTE email address.
            </p>

            {resent ? (
                <p className="text-center text-green-600 dark:text-green-400">
                    Verification email resent successfully!
                </p>
            ) : (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="form-button-secondary"
                >
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
            )}
        </div>
    );
}
