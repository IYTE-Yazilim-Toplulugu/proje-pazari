'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { user as userApi } from '@/lib/api';
import type { userModel } from '@/lib/models';
import { useTranslations } from 'next-intl';



interface ProfileEditFormData {
  name: string;
  surname: string;
  description?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface ProfileEditFormProps {
  user: userModel.MUser;
  onSave: () => void;
}

export default function ProfileEditForm({ user, onSave }: ProfileEditFormProps) {
  const t = useTranslations('profile.edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const ProfileEditSchema = z.object({
    name: z.string().min(2, t("errors.nameMin")),
    surname: z.string().min(2, t("errors.surnameMin")),
    description: z.string().max(500, t("errors.descriptionMax")).optional(),
    phone: z.string().regex(/^\+?[\d\s\-()]{10,20}$/, t("errors.phoneInvalid")).optional().or(z.literal('')),
    linkedinUrl: z.string().url(t("errors.urlInvalid")).or(z.literal('')).optional(),
    githubUrl: z.string().url(t("errors.urlInvalid")).or(z.literal('')).optional(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileEditFormData>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      description: user.description || '',
      phone: user.phone || '',
      linkedinUrl: user.linkedinUrl || '',
      githubUrl: user.githubUrl || '',
    },
  });

  const onSubmit = async (data: ProfileEditFormData) => {
    setSaving(true);
    setError(null);
    try {
      await userApi.updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      onSave();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : t("errors.updateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("name")} *
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("surname")} *
          </label>
          <input
            {...register('surname')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {errors.surname && (
            <p className="text-sm text-red-600 mt-1">{errors.surname.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("about")}
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={t("placeholders.about")}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("phone")}
        </label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={t("placeholders.phone")}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("linkedin")}
        </label>
        <input
          {...register('linkedinUrl')}
          type="url"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={t("placeholders.linkedin")}
        />
        {errors.linkedinUrl && (
          <p className="text-sm text-red-600 mt-1">{errors.linkedinUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("github")}
        </label>
        <input
          {...register('githubUrl')}
          type="url"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={t("placeholders.github")}
        />
        {errors.githubUrl && (
          <p className="text-sm text-red-600 mt-1">{errors.githubUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                 py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? t("saving") : t("save")}
      </button>
    </form>
  );
}