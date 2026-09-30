import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://korascore.com';

  const routes = [
    '',
    '/matches/today',
    '/matches/yesterday',
    '/matches/tomorrow',
    '/news',
    '/league/eng.1',
    '/league/esp.1',
    '/league/uefa.champions',
    '/league/ita.1',
    '/league/ger.1',
    '/league/sau.1',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes('matches') || route === '' ? 'always' : 'daily',
    priority: route === '' || route === '/matches/today' ? 1.0 : 0.8,
  }));
}
