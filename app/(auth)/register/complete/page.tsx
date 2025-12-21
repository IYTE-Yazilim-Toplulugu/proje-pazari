'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { authModel } from '@/lib/models';
import { RegisterCompleteStatusSchema } from '@/lib/models/Auth';

const RegisterCompletePage = () => {
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {

        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const result = authModel.RegisterCompleteQuerySchema.safeParse(query);

        if (!result.success) {
            setMessage('Invalid verification link. Please try again.');
            return;
        }

        switch (result.data.code) {
            case RegisterCompleteStatusSchema.enum.Success:
                setMessage('Your account has been successfully verified! You can now log in.');
                break;
            case RegisterCompleteStatusSchema.enum.UserNotFound:
            case RegisterCompleteStatusSchema.enum.FailedParse:
                setMessage('This verification link is invalid or has expired.');
                break;
            case RegisterCompleteStatusSchema.enum.InternalError:
            default:
                setMessage('An internal error occurred. Please contact support.');
                break;
        }
    }, []);

    return (
        <div>
            <h1>Registration Verification</h1>
            <p>{message}</p>
            <Link href="/login">Go to Login</Link>
        </div>
    );
};

export default RegisterCompletePage;
