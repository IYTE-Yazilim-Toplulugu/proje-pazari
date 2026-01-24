import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import { locales, type Locale } from './i18n-config';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  if (localeCookie && locales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale;
  }
  
  return 'tr';
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});