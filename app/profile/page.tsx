'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/hooks/authHooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import EmptyState from '@/components/shared/EmptyState';
import { user as userApi } from '@/lib/api';

export default function ProfilePage() {
  const { data: authContext, isLoading: isAuthLoading } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userApi.getCurrentUser,
    enabled: authContext?.isAuthenticated === true,
  });

  const isLoading = isAuthLoading || isUserLoading;

  useEffect(() => {
    if (!isAuthLoading && !authContext?.isAuthenticated) {
      router.push('/login');
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
  const avatarInitial = (user.firstName ?? user.email).charAt(0).toUpperCase();

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
                      alt={displayName}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center font-semibold text-4xl bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm bg-[color-mix(in_oklab,var(--color-primary)_16%,white)] text-[var(--color-primary-dark)]">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg text-[var(--color-text-inverse)] bg-[var(--color-btn-primary)] hover:bg-[var(--color-btn-primary-hover)]"
            >
              {isEditing ? 'İptal' : 'Düzenle'}
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
                    Hakkımda
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {user.description}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Sosyal Bağlantılar
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
            Projelerim
          </h2>
          <EmptyState
            title="Henüz proje bulunmuyor"
            description="İlk projenizi oluşturduğunuzda burada listelenecek."
          />
        </div>

        {/* User's Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Başvurularım
          </h2>
          <EmptyState
            title="Henüz başvuru bulunmuyor"
            description="Projelere başvurduğunuzda durumlarını burada takip edebilirsiniz."
          />
        </div>
      </div>
    </div>
  );
}
