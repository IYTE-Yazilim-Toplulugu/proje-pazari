import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/shared/Header";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://projepazari.iyte.edu.tr'),
  
  title: {
    default: 'IYTE Proje Pazarı',
    template: '%s | IYTE Proje Pazarı',
  },
  description: 'İzmir Yüksek Teknoloji Enstitüsü öğrencilerinin projeler üzerinde işbirliği yapabileceği platform',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'IYTE Proje Pazarı',
    description: 'İzmir Yüksek Teknoloji Enstitüsü öğrencileri için proje işbirliği platformu',
    url: 'https://projepazari.iyte.edu.tr',
    siteName: 'IYTE Proje Pazarı',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IYTE Proje Pazarı',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IYTE Proje Pazarı',
    description: 'İzmir Yüksek Teknoloji Enstitüsü öğrencileri için proje işbirliği platformu',
    images: ['/twitter-image.png'],
    creator: '@iyteyazilim',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <Providers>
                        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                            <Header />
                            <main className="flex-grow">
                                {children}
                            </main>
                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}