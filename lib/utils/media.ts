/**
 * The backend returns media references either as an absolute URL or as a bare
 * storage path (e.g. "proje-pazari-avatars/users/{userId}/avatar.png"). Bare
 * paths aren't valid for next/image, whose remotePatterns require a full
 * "https://<api-host>/api/v1/files/..." URL — resolve them against that route.
 */
export function resolveMediaUrl(value?: string | null): string | undefined {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const path = value.replace(/^\/+/, '');
    return `${apiBaseUrl}/api/v1/files/${path}`;
}
