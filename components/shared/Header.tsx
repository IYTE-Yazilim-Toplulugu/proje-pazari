'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useSession } from '@/lib/hooks/authHooks';

export default function Header() {
  const t = useTranslations('nav');
  const { data: session } = useSession();

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo/iyte-icon.svg" 
            alt="IYTE" 
            width={32} 
            height={32} 
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {t('projectMarket')}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {t('home')}
          </Link>
          
          <Link href="/projects" className="hover:text-blue-600 transition-colors">
            {t('projects')}
          </Link>

          {session ? (
            <>
              <Link href="/profile" className="hover:text-blue-600 transition-colors">
                {t('profile')}
              </Link>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                {t('logout')}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                {t('login')}
              </Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}