import { siteConfig } from '../lib/seo';

export default function manifest() {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'es-CL',
    icons: [
      {
        src: '/images/d.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/d.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
