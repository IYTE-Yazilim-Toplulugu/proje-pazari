import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

// ---------------------------------------------------------------------------
// Content-Security-Policy
// ---------------------------------------------------------------------------
// Directives are kept in an array for readability and joined at build time.
// Start with Report-Only so violations are logged without breaking the app.
// Promote to enforcing (Content-Security-Policy) once no violations remain.
// ---------------------------------------------------------------------------
const cspDirectives = [
  "default-src 'self'",
  // Next.js injects inline scripts for hydration, RSC payloads, and route
  // prefetching — 'unsafe-inline' and 'unsafe-eval' are required for now.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Next.js injects inline <style> tags for font declarations.
  "style-src 'self' 'unsafe-inline'",
  // next/image optimises remote images from the two API domains.
  // data: is needed for base64 blur placeholders; blob: for canvas exports.
  "img-src 'self' data: blob: https://api.projepazari.site https://api.projepazari.iyte.edu.tr",
  // next/font/google self-hosts fonts at build time — no external CDN needed.
  "font-src 'self'",
  // API calls go to both backend domains.
  "connect-src 'self' https://api.projepazari.site https://api.projepazari.iyte.edu.tr",
  // Mirror the existing X-Frame-Options: SAMEORIGIN.
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

const cspHeaderValue = cspDirectives.join('; ');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.projepazari.site',
        pathname: '/api/v1/files/**',
      },
      {
        protocol: 'https',
        hostname: 'api.projepazari.iyte.edu.tr',
        pathname: '/api/v1/files/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Deprecated in modern browsers — CSP supersedes this header.
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // CSP — Report-Only mode: violations are logged to the browser
          // console but resources are NOT blocked. Promote to the enforcing
          // "Content-Security-Policy" header once no violations remain.
          { key: 'Content-Security-Policy-Report-Only', value: cspHeaderValue },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
