import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // Default locale - can be extended to support dynamic locale detection
    const locale = 'tr';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
