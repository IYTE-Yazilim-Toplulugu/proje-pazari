"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useSession } from "@/lib/hooks/authHooks";

export default function Header() {
  const t = useTranslations("nav");
  const tAdmin = useTranslations("admin");
  const { data: session, isLoading } = useSession();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const isAuthenticated = !!session?.isAuthenticated;
  const isAdmin = !!session?.permissions?.includes("AdminPanel");

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

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-background-secondary)]" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-background-secondary)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-primary)_12%,white)]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/profile")}>{t("profile")}</DropdownMenuItem>
                {isAdmin ? <DropdownMenuItem onClick={() => router.push("/admin")}>{tAdmin("featureFlags")}</DropdownMenuItem> : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logout()}
                >
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>{t("login")}</Button>
              <Button
                size="sm"
                onClick={() => router.push("/register")}
                className="bg-[var(--color-btn-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)]"
              >
                {t("register")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
