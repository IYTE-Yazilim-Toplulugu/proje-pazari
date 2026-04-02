import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Proje Pazarı</h3>
            <p className="text-sm text-muted-foreground">
              IYTE öğrencilerinin projeler üzerinde işbirliği yapabileceği platform.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Sayfalar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projeler
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hakkında
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">İletişim</h3>
            <p className="text-sm text-muted-foreground">
              IYTE Yazılım Topluluğu<br />
              yazilim@iyte.edu.tr
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} IYTE Yazılım Topluluğu. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
