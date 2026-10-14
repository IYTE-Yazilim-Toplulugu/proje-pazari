import { resolveMediaUrl, withMediaVersion } from '../media';

describe('withMediaVersion', () => {
    const url = 'https://api.projepazari.site/api/v1/files/proje-pazari-avatars/users/42/avatar.png';

    it('appends the version so a replaced avatar at the same path is refetched', () => {
        expect(withMediaVersion(url, 1700000000000)).toBe(`${url}?v=1700000000000`);
    });

    it('leaves the URL unchanged without a version', () => {
        expect(withMediaVersion(url, undefined)).toBe(url);
    });

    it('does not modify URLs that already have a query string, such as presigned URLs', () => {
        const presigned = `${url}?X-Amz-Signature=abc`;
        expect(withMediaVersion(presigned, 1)).toBe(presigned);
    });

    it('returns undefined when there is no URL', () => {
        expect(withMediaVersion(undefined, 1)).toBeUndefined();
    });
});

describe('resolveMediaUrl', () => {
    const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    beforeEach(() => {
        process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.projepazari.site';
    });

    afterAll(() => {
        // Assigning undefined would leave the string "undefined" for later suites.
        if (originalApiBaseUrl === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
        else process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
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
