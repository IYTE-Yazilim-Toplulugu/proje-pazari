'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/hooks/authHooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
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
                    // TODO: Implement profile picture upload API call
                    console.log('Uploading file:', file.name);
                  }}
                />
              ) : (
                <div className="relative">
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-4xl">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name} {user.surname}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {user.role}
                  </span>
                  {user.is_verified && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                      ✓ Doğrulanmış
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">Telefon:</span>
                      <span className="text-gray-900 dark:text-white">{user.phone}</span>
                    </div>
                  )}
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
          {/* TODO: List user's projects */}
          <p className="text-gray-600 dark:text-gray-400">
            Henüz proje bulunmuyor.
          </p>
        </div>

        {/* User's Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Başvurularım
          </h2>
          {/* TODO: List user's applications */}
          <p className="text-gray-600 dark:text-gray-400">
            Henüz başvuru bulunmuyor.
          </p>
        </div>
      </div>
    </div>
  );
}