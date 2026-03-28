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
  const isAdmin = !!session?.permissions?.includes("UseModerationPanel");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-nav-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-nav-bg)]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <Image src="/logo/iyte-icon.svg" alt="IYTE" width={32} height={32} />
          <span className="text-xl font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-nav-active)]">
            {t("projectMarket")}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-[var(--color-nav-inactive)] transition-colors hover:text-[var(--color-nav-active)]">
            {t("home")}
          </Link>
          <Link href="/projects" className="text-sm font-medium text-[var(--color-nav-inactive)] transition-colors hover:text-[var(--color-nav-active)]">
            {t("projects")}
          </Link>
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
