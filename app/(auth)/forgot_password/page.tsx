'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/lib/hooks/useToast';

const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid Email address'),
});
type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const { success, error: showError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            // Call API to send password reset email
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            setSubmitted(true);
            success('Email Sent', 'Password reset instructions have been sent to your email.');
        } catch (error) {
            showError('Error', 'Failed to send reset email. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="form-container">
                <h1 className="form-title">Check Your Email</h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    If an account exists with that email, we've sent password reset instructions.
                </p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h1 className="form-title">Forgot Password</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="form-wrapper">
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                        placeholder="you@std.iyte.edu.tr"
                    />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <button type="submit" className="form-button">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}
