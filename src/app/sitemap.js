import { siteConfig } from '../lib/seo';

export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/demo`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
