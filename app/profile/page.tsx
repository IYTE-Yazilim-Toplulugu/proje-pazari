'use client';

import { useState, useEffect } from 'react';
import { useSession, useDeleteAccount } from '@/lib/hooks/authHooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { user as userApi } from '@/lib/api';

export default function ProfilePage() {
  const { data: authContext, isLoading: isAuthLoading } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteAccountMutation = useDeleteAccount();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userApi.getCurrentUser,
    enabled: authContext?.isAuthenticated === true,
  });

  const isLoading = isAuthLoading || isUserLoading;

  useEffect(() => {
    if (!isAuthLoading && !authContext?.isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthLoading, authContext, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!authContext?.isAuthenticated || !user) {
    return null;
  }

  const displayName = (user.fullName ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()) || user.email;
  const avatarInitial = (user.firstName ?? user.email ?? '').charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              {isEditing ? (
                <ProfilePictureUpload
                  currentUrl={user.profilePictureUrl ?? undefined}
                  onUpload={async (file) => {
                    console.log('Uploading file:', file.name);
                  }}
                />
              ) : (
                <div className="relative">
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.fullName ?? ''}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-4xl">
                      {user.firstName?.charAt(0) ?? '?'}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.fullName ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
            >
              {isEditing ? t('cancelButton') : t('editButton')}
            </button>
          </div>

          {isEditing ? (
            <ProfileEditForm user={user} onSave={() => setIsEditing(false)} />
          ) : (
            <>
              {/* Bio/Description */}
              {user.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('aboutSection')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {user.description}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('contactSection')}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">{t('emailLabel')}</span>
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('socialSection')}
                </h2>
                <div className="flex gap-3">
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182]"
                    >
                      LinkedIn
                    </a>
                  )}
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User's Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('myProjects')}
          </h2>
          <Link
            href="/my-projects"
            className="inline-block px-4 py-2 rounded-lg text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
          >
            {t('viewProjects')}
          </Link>
        </div>

        {/* User's Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('myApplications')}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/applications"
              className="inline-block px-4 py-2 rounded-lg text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
            >
              {t('viewApplications')}
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-6 border border-red-200 dark:border-red-900">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            {t('deleteAccount.sectionTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('deleteAccount.description')}
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteAccountMutation.isPending}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {t('deleteAccount.button')}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('deleteAccount.dialogTitle')}
        description={t('deleteAccount.dialogDescription')}
        onConfirm={() => deleteAccountMutation.mutate()}
        confirmText={t('deleteAccount.confirmButton')}
        variant="destructive"
      />
    </div>
  );
}
