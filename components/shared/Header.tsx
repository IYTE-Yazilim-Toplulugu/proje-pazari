"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-(--color-nav-bg) border-b border-(--color-border) shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-bold text-(--color-primary) hover:text-(--color-primary-dark) transition-colors"
        >
          Proje Pazarı
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    isActive
                      ? "font-semibold text-(--color-nav-active) border-b-2 border-(--color-nav-active) pb-0.5"
                      : "text-(--color-nav-inactive) hover:text-(--color-primary) transition-colors"
                  }
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
