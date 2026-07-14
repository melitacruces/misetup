import { ImageResponse } from 'next/og';
import { siteConfig } from '../lib/seo';

export const alt = 'MiSetup dashboard de inventario para setups';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          border: '1px solid #262626',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              backgroundColor: '#9d00ff',
              color: '#ffffff',
              fontSize: '56px',
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                color: '#9d00ff',
                fontSize: '28px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              setup manager
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {siteConfig.name}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.12,
            }}
          >
            Organiza tu hardware, software y herramientas digitales.
          </div>
          <div
            style={{
              color: '#bdbdbd',
              fontSize: '28px',
              lineHeight: 1.35,
            }}
          >
            Un dashboard interactivo para visualizar y gestionar el ecosistema de un setup personal o profesional.
          </div>
        </div>
      </div>
    ),
    size
  );
}
