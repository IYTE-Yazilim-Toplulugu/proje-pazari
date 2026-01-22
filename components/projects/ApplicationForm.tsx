'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ApplicationSchema = z.object({
    message: z.string().min(50, 'Mesaj en az 50 karakter olmalı').max(500),
});

type ApplicationForm = z.infer<typeof ApplicationSchema>;

interface ApplicationFormProps {
    projectId: string;
    onSuccess: () => void;
}

export default function ApplicationForm({ projectId, onSuccess }: ApplicationFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ApplicationForm>({
        resolver: zodResolver(ApplicationSchema),
    });

    const onSubmit = async (data: ApplicationForm) => {
        setSubmitting(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects/${projectId}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${/* get token */}`,
                },
                body: JSON.stringify(data),
            });
            onSuccess();
        } catch (error) {
            console.error('Application error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Neden bu projeye katılmak istiyorsunuz?
                </label>
                <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Projeye katkılarınızı ve deneyiminizi açıklayın..."
                />
                {errors.message && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.message.message}
                    </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {register('message').ref?.value?.length || 0} / 500 karakter
                </p>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 
                 disabled:cursor-not-allowed"
            >
                {submitting ? 'Gönderiliyor...' : 'Başvur'}
            </button>
        </form>
    );
}
