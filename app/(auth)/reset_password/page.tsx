'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordString() {
    const router = useRouter();
    const SearchParams = useSearchParams();
    const token = SearchParams.get('token');

    // Implementation similar to forgot password
}