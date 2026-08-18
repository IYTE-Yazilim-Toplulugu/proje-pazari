import { resolveMediaUrl } from '../media';

describe('resolveMediaUrl', () => {
    const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    beforeEach(() => {
        process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.projepazari.site';
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    });

    it('resolves a bare MinIO storage path to a browser-usable /api/v1/files/ URL', () => {
        const storagePath = 'proje-pazari-avatars/users/42/avatar.png';

        expect(resolveMediaUrl(storagePath)).toBe(
            'https://api.projepazari.site/api/v1/files/proje-pazari-avatars/users/42/avatar.png',
        );
    });

    it('strips a leading slash on the storage path to avoid a double slash', () => {
        expect(resolveMediaUrl('/proje-pazari-avatars/users/42/avatar.png')).toBe(
            'https://api.projepazari.site/api/v1/files/proje-pazari-avatars/users/42/avatar.png',
        );
    });

    it('returns an already-absolute URL unchanged', () => {
        const absoluteUrl = 'https://api.projepazari.iyte.edu.tr/api/v1/files/proje-pazari-avatars/users/42/avatar.png';

        expect(resolveMediaUrl(absoluteUrl)).toBe(absoluteUrl);
    });

    it('resolves an API-relative path without prefixing /api/v1/files/ twice', () => {
        expect(resolveMediaUrl('/api/v1/files/profiles/avatar.png')).toBe(
            'https://api.projepazari.site/api/v1/files/profiles/avatar.png',
        );
    });

    it('resolves an API-relative path that has no leading slash', () => {
        expect(resolveMediaUrl('api/v1/files/profiles/avatar.png')).toBe(
            'https://api.projepazari.site/api/v1/files/profiles/avatar.png',
        );
    });

    it('does not treat a storage path that merely starts with "api" as API-relative', () => {
        expect(resolveMediaUrl('api-uploads/users/42/avatar.png')).toBe(
            'https://api.projepazari.site/api/v1/files/api-uploads/users/42/avatar.png',
        );
    });

    describe('when NEXT_PUBLIC_API_BASE_URL has a trailing slash', () => {
        beforeEach(() => {
            process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.projepazari.site/';
        });

        it('resolves a bare storage path without a double slash', () => {
            expect(resolveMediaUrl('proje-pazari-avatars/users/42/avatar.png')).toBe(
                'https://api.projepazari.site/api/v1/files/proje-pazari-avatars/users/42/avatar.png',
            );
        });

        it('resolves an API-relative path without a double slash', () => {
            expect(resolveMediaUrl('/api/v1/files/profiles/avatar.png')).toBe(
                'https://api.projepazari.site/api/v1/files/profiles/avatar.png',
            );
        });
    });

    it.each([undefined, null, ''])('returns undefined for %p', (value) => {
        expect(resolveMediaUrl(value)).toBeUndefined();
    });
});
