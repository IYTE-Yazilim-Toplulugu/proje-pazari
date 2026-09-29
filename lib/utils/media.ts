const FILES_ROUTE = 'api/v1/files';

/**
 * The backend returns media references in three shapes, depending on the storage
 * adapter in use:
 *
 * - an absolute URL ("https://<api-host>/api/v1/files/...")
 * - an API-relative path ("/api/v1/files/profiles/avatar.png"), from LocalStorageAdapter
 * - a bare storage path ("proje-pazari-avatars/users/{userId}/avatar.png"), from MinIO
 *
 * Only the first is valid for next/image, whose remotePatterns require a full
 * "https://<api-host>/api/v1/files/..." URL — resolve the other two against that
 * route, without prefixing a path that already carries it.
 */
export function resolveMediaUrl(value?: string | null): string | undefined {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;

    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
    const path = value.replace(/^\/+/, '');
    if (path === FILES_ROUTE || path.startsWith(`${FILES_ROUTE}/`)) {
        return `${apiBaseUrl}/${path}`;
    }

    return `${apiBaseUrl}/${FILES_ROUTE}/${path}`;
}
