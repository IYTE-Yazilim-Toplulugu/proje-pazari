import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-nav-bg)]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{t("title")}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{t("description")}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{t("pages")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-nav-active)]">
                  {t("projects")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{t("legal")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-nav-active)]">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-nav-active)]">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{t("contact")}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              IYTE Yazılım Topluluğu
              <br />
              yazilim@iyte.edu.tr
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-text-secondary)]">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
