"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import Button from "@/components/shared/Button";
import { useLogout, useSession } from "@/lib/hooks/authHooks";

export default function Header() {
  const t = useTranslations("nav");
  const tAdmin = useTranslations("admin");
  const { data: session, isLoading } = useSession();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session?.isAuthenticated;
  const isAdmin = !!session?.permissions?.includes("AdminPanel");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-background-secondary)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-primary)_12%,white)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[var(--color-text-primary)]">
                  U
                </span>
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-white p-2 shadow-lg dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {t("profile")}
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/admin");
                      }}
                      className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {tAdmin("featureFlags")}
                    </button>
                  ) : null}
                  <div className="my-2 border-t border-[var(--color-border)]" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>{t("login")}</Button>
              <Button
                variant="custom"
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
