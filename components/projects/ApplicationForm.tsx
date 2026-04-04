'use client';

import { useApplyToProject } from '@/lib/hooks/projectHooks';
import { useTranslations } from 'next-intl';

interface ApplicationFormProps {
    projectId: string;
    onSuccess: () => void;
}

export default function ApplicationForm({ projectId, onSuccess }: ApplicationFormProps) {
    const t = useTranslations('projects.applicationForm');
    const { mutate: apply, isPending, error } = useApplyToProject();

    const handleApply = () => {
        apply(projectId, { onSuccess });
    };

    return (
        <div className="space-y-4">
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                </p>
            )}
            <button
                onClick={handleApply}
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                           py-3 px-4 rounded-lg transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
            >
                {isPending ? t('submitting') : t('confirmApplication')}
            </button>
        </div>
    );
}
