import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projepazari.iyte.edu.tr';

  const staticPages = ['', '/projects', '/login', '/register', '/forgot_password'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects?size=100`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return staticPages;
    }

    const payload = await res.json();
    const projects = payload?.data?.projects ?? [];

    const projectPages = projects.map((project: { id: string; updatedAt?: string; createdAt?: string }) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
