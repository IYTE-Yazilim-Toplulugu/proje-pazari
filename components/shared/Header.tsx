'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession, useLogout } from '@/lib/hooks/authHooks';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const { data: session, isLoading } = useSession();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo/iyte-icon.svg"
            alt="IYTE"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {t('projectMarket')}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('projects')}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/my-projects')}>
                  Projelerim
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/applications')}>
                  Başvurularım
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-destructive focus:text-destructive"
                >
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                {t('login')}
              </Button>
              <Button size="sm" onClick={() => router.push('/register')}>
                {t('register')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
