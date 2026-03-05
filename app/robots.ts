import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projepazari.iyte.edu.tr';

  return {
    rules: [
      {
        userAgent: '*', 
        allow: '/', 
        disallow: [
          '/admin/',
          '/api/',
          '/profile/',
          '/oauth/',
          '/reset_password',
          '/register/complete'
        ], 
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}