'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const ResetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordContent() {
    const t = useTranslations('auth.resetPassword');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Implementation similar to forgot password
    return <div>{t('title')}</div>;
}

export default function ResetPasswordPage() {
    const t = useTranslations('auth.resetPassword');
    return (
        <Suspense fallback={<div>{t('loading')}</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}