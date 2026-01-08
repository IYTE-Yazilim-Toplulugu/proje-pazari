'use client';
import { useState } from 'react';

export default function RegisterCompletePage() {
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        setResending(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: /* get from storage or form */ }),
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
