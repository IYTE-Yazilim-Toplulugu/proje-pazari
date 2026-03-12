'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const t = useTranslations('auth.resetPassword');

    const ResetPasswordSchema = z.object({
        password: z.string().min(8, t('newPassword')),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('confirmPassword'),
        path: ["confirmPassword"],
    });

    type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

    // Implementation similar to forgot password
    return <div>{t('title')}</div>;
}

export default function ResetPasswordPage() {
    const t = useTranslations('auth.resetPassword');
    return (
        <Suspense fallback={<div>{t('submitBtn')}</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}