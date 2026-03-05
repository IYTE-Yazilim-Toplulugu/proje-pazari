import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projepazari.iyte.edu.tr';

  const staticPages = [
    '',
    '/projects',
    '/about',
    '/login',
    '/register',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const projects = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects?size=1000`, {
      next: { revalidate: 3600 }
    })
      .then((res) => res.json())
      .then((data) => data.data?.projects || []);

    const projectPages = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...projectPages];
    
  } catch (error) {
    console.error('Sitemap oluşturulurken hata oluştu:', error);
    return staticPages;
  }
}