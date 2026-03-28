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
    <header className="w-full border-b shadow-sm py-4 bg-[var(--color-nav-bg)] border-[var(--color-border)]">
      <div className="container mx-auto px-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo/iyte-icon.svg" 
            alt="IYTE" 
            width={32} 
            height={32} 
          />
          <span className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-nav-active)] transition-colors">
              {t('projectMarket')}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-[var(--color-nav-inactive)] hover:text-[var(--color-nav-active)] transition-colors">
            {t('home')}
          </Link>
          
          <Link href="/projects" className="text-[var(--color-nav-inactive)] hover:text-[var(--color-nav-active)] transition-colors">
            {t('projects')}
          </Link>

          {session ? (
            <>
              <Link href="/profile" className="text-[var(--color-nav-inactive)] hover:text-[var(--color-nav-active)] transition-colors">
                {t('profile')}
              </Link>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                {t('logout')}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[var(--color-nav-inactive)] hover:text-[var(--color-nav-active)] transition-colors">
                {t('login')}
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 rounded-md transition-colors bg-[var(--color-btn-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)]"
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
