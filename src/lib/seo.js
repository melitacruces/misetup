const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://misetup.melitacruces.com').replace(/\/$/, '');

export const siteConfig = {
  name: 'MiSetup',
  title: 'MiSetup - Panel de Inventario Personal',
  description:
    'Inventario y planner de upgrades para documentar y hacer evolucionar un setup personal o profesional.',
  url: siteUrl,
  locale: 'es_CL',
  creator: 'Luis Andres Melita Cruces',
  keywords: [
    'MiSetup',
    'setup manager',
    'inventario de hardware',
    'dashboard de equipamiento',
    'gestor de setup',
    'upgrade planner',
    'wishlist de hardware',
    'inventario de setup',
    'herramientas digitales',
    'equipamiento tecnologico',
    'Next.js dashboard',
  ],
  links: {
    github: 'https://github.com/melitacruces',
    linkedin: 'https://linkedin.com/in/melitacruces',
  },
};

export const defaultOpenGraphImage = {
  url: '/og.png',
  width: 1731,
  height: 909,
  alt: 'MiSetup dashboard de inventario para setups',
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: 'es-CL',
      publisher: {
        '@id': `${siteConfig.url}/#person`,
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteConfig.url}/#webapp`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-CL',
      isAccessibleForFree: true,
      creator: {
        '@id': `${siteConfig.url}/#person`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.creator,
      url: siteConfig.url,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
      ],
    },
  ],
};
