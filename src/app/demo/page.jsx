import { DEMO_EQUIPMENT, DEMO_SECTIONS } from '../../lib/demoData';
import Dashboard from '../../components/Dashboard';
import { defaultOpenGraphImage, siteConfig } from '../../lib/seo';

const title = 'Mi Setup | Demo Interactiva';
const description =
  'Prueba MiSetup con datos de ejemplo para organizar secciones, hardware, software y herramientas digitales desde el modo editor.';

export const metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: '/demo',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title,
    description,
    url: '/demo',
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [defaultOpenGraphImage.url],
  },
};

export default function DemoPage() {
  return (
    <Dashboard 
      demo 
      initialData={DEMO_EQUIPMENT} 
      initialSections={DEMO_SECTIONS} 
    />
  );
}
