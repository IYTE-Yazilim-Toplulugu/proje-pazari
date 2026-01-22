'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/lib/hooks/projectHooks';
import { useSession } from '@/lib/hooks/authHooks';
import Image from 'next/image';
import ApplicationForm from '@/components/projects/ApplicationForm';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.project_id as string;

    const { data: project, isLoading, error } = useProject(projectId);
    const { data: session } = useSession();

    const [showApplicationForm, setShowApplicationForm] = useState(false);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-600 dark:text-red-400">Proje bulunamadı.</p>
                <button
                    onClick={() => router.push('/projects')}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                >
                    Projelere Dön
                </button>
            </div>
        );
    }

    const isOwner = session?.user?.id === project.owner.id;
    const canApply = session && !isOwner && project.status === 'OPEN';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                    ← Geri Dön
                </button>

                {/* Project Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {project.title}
                        </h1>
                        <span className={`px-3 py-1 text-sm font-medium text-white rounded-full 
                           ${project.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-500'}`}>
                            {project.status}
                        </span>
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        {project.owner.profilePictureUrl ? (
                            <Image
                                src={project.owner.profilePictureUrl}
                                alt={project.owner.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {project.owner.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {project.owner.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Proje Sahibi
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            Özet
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {project.summary}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            Açıklama
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            {project.description}
                        </div>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Etiketler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {project.applicationsCount}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Başvuru</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Oluşturulma</p>
                        </div>
                    </div>

                    {/* Application Button/Form */}
                    {canApply && (
                        <div className="mt-6">
                            {!showApplicationForm ? (
                                <button
                                    onClick={() => setShowApplicationForm(true)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                           py-3 px-4 rounded-lg transition-colors"
                                >
                                    Projeye Başvur
                                </button>
                            ) : (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Başvuru Formu</h3>
                                    <ApplicationForm
                                        projectId={projectId}
                                        onSuccess={() => {
                                            setShowApplicationForm(false);
                                            // Show success toast
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {isOwner && (
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                                Düzenle
                            </button>
                            <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg">
                                Başvuruları Gör ({project.applicationsCount})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
