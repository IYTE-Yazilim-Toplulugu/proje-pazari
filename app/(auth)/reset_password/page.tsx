'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/lib/api/auth';

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
    const [succeeded, setSucceeded] = useState(false);
    const { success, error: showError } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            await resetPassword(token!, data.password);
            setSucceeded(true);
            success(t('successTitle'), t('successDesc'));
            setTimeout(() => router.push('/login'), 2000);
        } catch {
            showError('Error', t('errors.generic'));
        }
    };

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <div className="mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('tokenMissing')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('tokenMissingDesc')}
                    </p>
                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
                        {t('requestNewLink')}
                    </Link>
                </div>
            </div>
        );
    }

    if (succeeded) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <div className="mb-4 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('successTitle')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('successDesc')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    {t('title')}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('newPassword')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder={t('placeholders.newPassword')}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('confirmPassword')}
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            placeholder={t('placeholders.confirmPassword')}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? t('submitting') : t('submitBtn')}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                            ← {t('backToLogin')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const t = useTranslations('auth.resetPassword');
    return (
        <Suspense fallback={<div>{t('loading')}</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
