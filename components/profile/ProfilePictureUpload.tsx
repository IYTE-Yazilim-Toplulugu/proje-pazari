'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
}

export default function ProfilePictureUpload({ currentUrl, onUpload }: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Yükleme sırasında bir hata oluştu');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-block">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Profil fotoğrafı"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              <span role="img" aria-label="Varsayılan profil">👤</span>
            </div>
          )}
        </div>

        <label
          className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white
                        rounded-full p-2 cursor-pointer transition-colors"
          aria-label="Profil fotoğrafı yükle"
        >
          <span aria-hidden="true">{uploading ? '⏳' : '📷'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            aria-label="Profil fotoğrafı seç"
          />
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}