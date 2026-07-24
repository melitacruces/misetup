-- Esquema completo de base de datos PostgreSQL / Neon para MiSetup

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100),
  website_url TEXT,
  position INT DEFAULT 0,
  item_kind VARCHAR(20) NOT NULL DEFAULT 'hardware',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  purchase_price NUMERIC(12,2),
  target_price NUMERIC(12,2),
  currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  purchase_date DATE,
  warranty_until DATE,
  private_notes TEXT,
  choice_reason TEXT,
  manual_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  photo_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  wishlist_priority SMALLINT DEFAULT 2,
  planned_for DATE,
  roadmap_position INT NOT NULL DEFAULT 0,
  compatibility_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS equipment_category_position_idx
  ON equipment (category, position);

CREATE INDEX IF NOT EXISTS equipment_status_roadmap_idx
  ON equipment (status, wishlist_priority, planned_for, roadmap_position);

CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100) DEFAULT 'fa-solid fa-folder',
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sections (slug, title, icon_name, position) VALUES 
  ('core', 'core', 'fa-solid fa-server', 0),
  ('desk', 'desk', 'fa-solid fa-computer-mouse', 1),
  ('studio', 'studio', 'fa-solid fa-headphones', 2),
  ('mobile', 'mobile', 'fa-solid fa-briefcase', 3)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS setup_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title VARCHAR(120) NOT NULL DEFAULT 'MiSetup',
  tagline VARCHAR(240),
  description TEXT,
  default_currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  wishlist_budget NUMERIC(12,2) DEFAULT 0,
  show_prices BOOLEAN NOT NULL DEFAULT TRUE,
  github_url TEXT,
  template_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO setup_profile (id, title, tagline, description, default_currency, wishlist_budget, show_prices, github_url, template_url)
VALUES (
  1,
  'MiSetup - Panel de Inventario Personal',
  'Un setup híbrido para desarrollar, diseñar y crear contenido.',
  'Este escenario de ejemplo combina inventario, decisiones de compra y un roadmap de upgrades.',
  'CLP',
  8500000,
  true,
  'https://github.com/melitacruces/misetup',
  'https://github.com/melitacruces/misetup'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS setup_events (
  id BIGSERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE SET NULL,
  event_type VARCHAR(20) NOT NULL DEFAULT 'note',
  title VARCHAR(160) NOT NULL,
  description TEXT,
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12,2) CHECK (amount IS NULL OR amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS setup_events_timeline_idx
  ON setup_events (occurred_on DESC, created_at DESC);

-- Inserción de datos iniciales de demostración para el modo preview.
INSERT INTO equipment (
  category, type, brand, model, description, icon_name, website_url,
  position, item_kind, status, is_public, tags, purchase_price, target_price,
  currency, purchase_date, warranty_until, private_notes, choice_reason,
  manual_urls, photo_urls, wishlist_priority, planned_for, roadmap_position, compatibility_notes
) VALUES
  ('core', 'laptop', 'Apple', 'MacBook Pro M3 Max', '16 pulgadas. 64 GB RAM. 2 TB SSD.', 'fa-solid fa-laptop', 'https://apple.com/macbook-pro', 0, 'hardware', 'active', true, ARRAY['desarrollo','edición','movilidad'], 4299990, NULL, 'CLP', '2024-03-18', '2027-03-18', 'AppleCare+ activo hasta marzo 2027. Respaldo semanal Time Machine en NAS Synology.', 'Centraliza desarrollo, edición de video y trabajo móvil sin duplicar proyectos entre equipos.', ARRAY['https://support.apple.com/mac/macbook-pro'], ARRAY['/images/laptop_macbook.jpg'], 2, NULL, 0, 'Conexión directa vía Thunderbolt 4 al monitor 5K y periféricos de escritorio.'),
  ('core', 'nas', 'Synology', 'DS923+', 'NAS de cuatro bahías con 16 TB útiles y snapshots.', 'fa-solid fa-server', 'https://synology.com/products/DS923+', 1, 'hardware', 'active', true, ARRAY['backup','storage','red'], 1180000, NULL, 'CLP', '2023-08-12', '2026-08-12', 'Garantía por vencer próximamente. Configurado RAID 5 con discos WD Red Plus.', 'Mantiene proyectos, biblioteca multimedia y respaldos fuera del equipo principal.', ARRAY['https://global.download.synology.com/download/Document/Hardware/HIG/DiskStation/23-year/DS923+/spa/DS923_Plus_HIG_spa.pdf'], ARRAY['/images/nas_synology.jpg'], 2, NULL, 0, 'Integrado mediante SMB/NFS en la red local y acceso remoto seguro VPN.'),
  ('desk', 'monitor', 'LG', 'UltraFine 5K', 'Panel 27 pulgadas 5K con cobertura P3.', 'fa-solid fa-display', 'https://lg.com', 0, 'hardware', 'active', true, ARRAY['color','5k','usb-c'], 1099990, NULL, 'CLP', '2023-11-03', '2026-11-03', 'Garantía extiende hasta nov 2026. Calibrado mensual con calibrador SpyderX Elite.', 'La densidad de píxeles y el color consistente son claves para diseño y edición.', ARRAY['https://lg.com/support/product/27MD5KL-B'], ARRAY['/images/monitor_lg.jpg'], 2, NULL, 0, 'Carga el portátil a 94W mediante un solo cable Thunderbolt 3.'),
  ('desk', 'keyboard', 'Keychron', 'Q1 Pro', 'Teclado mecánico inalámbrico con switches Banana.', 'fa-solid fa-keyboard', 'https://keychron.com/products/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard', 1, 'hardware', 'active', true, ARRAY['mecánico','bluetooth','qmk'], 239990, NULL, 'CLP', '2024-05-20', '2026-09-20', 'Garantía extendida hasta sep 2026. Mapeado personalizado vía VIA.', 'Permite alternar entre dispositivos y ajustar capas para edición y desarrollo.', ARRAY['https://www.keychron.com/pages/q1-pro-user-manual'], ARRAY['/images/keyboard_keychron.jpg'], 2, NULL, 0, 'Soporta conexión multidispositivo Bluetooth 5.1 y cable USB-C.'),
  ('desk', 'mouse', 'Logitech', 'MX Master 3S', 'Mouse inalámbrico silencioso con rueda electromagnética.', 'fa-solid fa-computer-mouse', 'https://logitech.com/products/mice/mx-master-3s', 2, 'hardware', 'active', true, ARRAY['ergonomía','productividad'], 99990, NULL, 'CLP', '2024-05-20', '2026-10-20', 'Garantía activa en Logitech. Receptor Logi Bolt conectado al hub.', 'Los perfiles por aplicación reducen fricción al cambiar entre edición y navegador.', ARRAY['https://support.logi.com/hc/es/articles/5258933230615-Getting-Started-MX-Master-3S'], ARRAY['/images/mouse_mxmaster.jpg'], 2, NULL, 0, 'Sincronizado vía Logi Options+ en macOS y Windows.'),
  ('studio', 'headphones', 'Sony', 'WH-1000XM5', 'Audífonos over-ear con cancelación activa de ruido.', 'fa-solid fa-headphones', 'https://sony.com/electronics/headband-headphones/wh-1000xm5', 0, 'hardware', 'active', true, ARRAY['audio','anc','bluetooth'], 329990, NULL, 'CLP', '2023-06-15', '2025-06-15', 'Garantía del fabricante vencida en junio 2025. Excelente estado funcional.', 'Aísla el espacio de trabajo y sirve tanto para edición ligera como para llamadas.', ARRAY['https://helpguide.sony.net/mdr/wh1000xm5/v1/es/index.html'], ARRAY['/images/headphones_sony.jpg'], 2, NULL, 0, 'Conexión multipunto activa entre MacBook y teléfono móvil.'),
  ('studio', 'microphone', 'Shure', 'SM7B', 'Micrófono dinámico para voz y streaming.', 'fa-solid fa-microphone', 'https://shure.com/products/microphones/sm7b', 1, 'hardware', 'active', true, ARRAY['voz','streaming','audio'], 429990, NULL, 'CLP', '2023-09-01', '2025-09-01', 'Garantía vencida en septiembre 2025. Montado en brazo Rode PSA1+.', 'Tolera bien una habitación sin tratamiento acústico completo.', ARRAY['https://pubs.shure.com/guide/SM7B/es-ES'], ARRAY['/images/mic_shure.jpg'], 2, NULL, 0, 'Requiere interfaz XLR con buena ganancia limpia (+60dB).'),
  ('core', 'design_suite', 'Figma', 'Professional', 'Diseño de producto, prototipos y sistema visual.', 'fa-solid fa-bezier-curve', 'https://figma.com', 2, 'software', 'active', true, ARRAY['diseño','colaboración','prototipos'], 180000, NULL, 'CLP', '2025-01-05', '2026-01-05', 'Suscripción anual finalizada en ene 2026 (pendiente renovación).', 'Conecta exploración visual, prototipos y handoff en una sola herramienta.', ARRAY['https://help.figma.com'], ARRAY['/images/software_figma.jpg'], 2, NULL, 0, 'Ejecución en navegador y app nativa macOS con sincronización en la nube.'),
  ('mobile', 'phone', 'Apple', 'iPhone 15 Pro', '256 GB, titanio natural y cámara ProRAW.', 'fa-solid fa-mobile-screen', 'https://apple.com/iphone-15-pro', 0, 'hardware', 'active', true, ARRAY['mobile','cámara'], 1299990, NULL, 'CLP', '2023-10-10', '2024-10-10', 'Garantía inicial Apple expirada en oct 2024. Batería a 92% de salud.', 'Funcionó como cámara secundaria y dispositivo de pruebas móviles.', ARRAY['https://support.apple.com/manuals/iphone'], ARRAY['/images/phone_iphone.jpg'], 2, NULL, 0, 'Puerto USB-C de 10Gbps para transferencia directa de video ProRes.'),
  ('desk', 'macro_pad', 'Elgato', 'Stream Deck MK.2', 'Consola de control con 15 teclas LCD personalizables.', 'fa-solid fa-gamepad', 'https://www.elgato.com/products/stream-deck-mk2', 3, 'hardware', 'active', true, ARRAY['productividad','automatización','desk'], 159990, NULL, 'CLP', '2024-02-14', '2027-02-14', 'Garantía extendida hasta feb 2027. Perfiles configurados para VS Code y OBS.', 'Automatiza atajos de desarrollo, control de OBS y comandos de terminal con un solo toque.', ARRAY['https://help.elgato.com/hc/en-us/categories/360001237372-Stream-Deck'], ARRAY['/images/keyboard_keychron.jpg'], 2, NULL, 0, 'Conexión USB-C con soporte para plugins de macOS y Windows.'),
  ('mobile', 'powerbank', 'Anker', 'Prime 20,000mAh 200W', 'Batería portátil de 20,000 mAh con pantalla inteligente y carga de 200W.', 'fa-solid fa-battery-full', 'https://www.anker.com/products/a1336', 1, 'hardware', 'active', true, ARRAY['mobile','carga','viajes'], 129990, NULL, 'CLP', '2024-01-20', '2026-01-20', 'Garantía vencida en ene 2026. Incluye cable USB-C de 240W.', 'Permite cargar el MacBook Pro a velocidad máxima durante sesiones de trabajo fuera de casa.', ARRAY['https://support.anker.com'], ARRAY['/images/phone_iphone.jpg'], 2, NULL, 0, 'Carga rápida compatible con Power Delivery 3.1 de Apple.'),
  ('desk', 'ultrawide_monitor', 'Dell', 'U4025QW', 'Monitor 40 pulgadas 5K2K con Thunderbolt.', 'fa-solid fa-display', 'https://dell.com', 4, 'hardware', 'wishlist', true, ARRAY['upgrade','display','thunderbolt'], NULL, 1899990, 'CLP', NULL, NULL, 'Monitorear ofertas de fin de año o importación directa empresarial.', 'Reemplazaría la configuración de dos pantallas por una superficie continua.', ARRAY['https://www.dell.com/support/home/product-support/product/u4025qw-monitor/docs'], ARRAY['/images/monitor_dell.jpg'], 1, '2026-11-15', 0, 'Reemplazaría la configuración de dos pantallas por una superficie continua con panel IPS Black a 120Hz.'),
  ('studio', 'audio_interface', 'Universal Audio', 'Volt 276', 'Interfaz USB de dos canales con compresor integrado.', 'fa-solid fa-sliders', 'https://uaudio.com/audio-interfaces/volt-276-usb.html', 2, 'hardware', 'wishlist', true, ARRAY['audio','upgrade','usb-c'], NULL, 349990, 'CLP', NULL, NULL, 'Sustituirá la interfaz actual para procesamiento analógico sin latencia.', 'Simplificaría grabación y monitoreo con controles físicos más directos.', ARRAY['https://help.uaudio.com/hc/en-us/categories/4404092496276-Volt-Audio-Interfaces'], ARRAY['/images/audio_volt.jpg'], 2, '2027-01-20', 1, 'Compatible con el SM7B; evaluar si requiere Cloudlifter para mantener bajo ruido.'),
  ('mobile', 'tablet', 'Apple', 'iPad Pro 11 M4', 'Tablet OLED para bocetos, revisión y trabajo móvil.', 'fa-solid fa-tablet-screen-button', 'https://apple.com/ipad-pro', 2, 'hardware', 'wishlist', true, ARRAY['mobile','dibujo','review'], NULL, 1199990, 'CLP', NULL, NULL, 'Considerar compra junto con el Smart Folio o Magic Keyboard para movilidad.', 'Añadiría una superficie de dibujo y revisión sin depender del escritorio.', ARRAY['https://support.apple.com/manuals/ipad'], ARRAY['/images/tablet_ipad.jpg'], 3, '2026-09-30', 2, 'Encaja con Sidecar y el flujo de Figma; requiere Apple Pencil por separado.'),
  ('core', 'desktop', 'Apple', 'Mac Studio M4', 'Estación de trabajo de escritorio con 128 GB RAM unificada y 2 TB SSD.', 'fa-solid fa-desktop', 'https://apple.com/mac-studio', 3, 'hardware', 'wishlist', true, ARRAY['core','upgrade','rendimiento'], NULL, 3899990, 'CLP', NULL, NULL, 'Reemplazará el equipo principal en el escritorio cuando el flujo de renderizado aumente.', 'Servirá como nodo principal de compilación y renderizado continuo de alta exigencia.', ARRAY['https://support.apple.com/mac/mac-studio'], ARRAY['/images/laptop_macbook.jpg'], 1, '2026-12-01', 3, 'Soporta hasta 4 monitores 6K simultáneos vía puertos Thunderbolt traseros.'),
  ('studio', 'monitores_estudio', 'Yamaha', 'HS5 (Par)', 'Monitores de estudio activos de campo cercano bi-amplificados de 70W.', 'fa-solid fa-volume-high', 'https://usa.yamaha.com/products/audio_visual/speaker_systems/hs_series/index.html', 3, 'hardware', 'wishlist', true, ARRAY['audio','monitores','mezcla'], NULL, 419990, 'CLP', NULL, NULL, 'Instalar sobre aisladores de espuma IsoAcoustics para evitar resonancia con el escritorio.', 'Proporcionará respuesta de frecuencia plana para mezcla precisa de audio y podcast.', ARRAY['https://usa.yamaha.com/files/download/other_assets/2/329522/hs8_hs7_hs5_hs8s_es_om_c0.pdf'], ARRAY['/images/headphones_sony.jpg'], 2, '2026-10-15', 4, 'Conexión balanceada XLR/TRS a la interfaz de audio de escritorio.'),
  ('studio', 'monitors', 'Audio-Technica', 'ATH-M50X', 'Audífonos cerrados de monitoreo profesional con drivers de 45mm y respuesta plana.', 'fa-solid fa-headphones', 'https://www.audio-technica.com/en-us/ath-m50x', 4, 'hardware', 'active', true, ARRAY['audio','monitoreo','estudio'], 149990, NULL, 'CLP', '2023-04-10', '2025-04-10', 'Almohadillas reemplazadas por Brainwavz de cuero. Se usan como segundo par de monitoreo en el estudio.', 'Referencia de la industria para mezcla y revisión de audio con aislamiento pasivo y plegado compacto.', ARRAY['https://www.audio-technica.com/en-us/support/ath-m50x'], ARRAY['/images/headphones_sony.jpg'], 2, NULL, 0, 'Conector desmontable de 2.5mm con cables incluidos: recto 1.2m, espiral 1.2-3m y recto 3m.')
ON CONFLICT DO NOTHING;

INSERT INTO setup_events (equipment_id, event_type, title, description, occurred_on, amount, currency, is_public) VALUES
  (NULL, 'added', 'Montaje inicial del escritorio y workspace', 'Instalación del escritorio elevable de madera de nogal y primer monitor dual para desarrollo.', '2022-04-15', 650000, 'CLP', true),
  (2, 'added', 'Montaje de NAS Synology DS923+', 'Servidor de almacenamiento en red para copias de seguridad de proyectos y multimedia en RAID 5.', '2023-08-12', 1180000, 'CLP', true),
  (7, 'purchased', 'Estudio de audio: Micrófono Shure SM7B', 'Incorporación de micrófono dinámico con brazo articulado Rode PSA1+ para streaming y podcasting.', '2023-09-01', 429990, 'CLP', true),
  (3, 'purchased', 'Visualización 5K: Monitor LG UltraFine', 'Reemplazo de pantalla principal por panel 27" 5K con precisión de color P3.', '2023-11-03', 1099990, 'CLP', true),
  (1, 'upgraded', 'Adquisición de MacBook Pro M3 Max', 'Actualización del equipo principal a M3 Max con 64 GB de RAM unificada para compilación y edición de video.', '2024-03-18', 4299990, 'CLP', true),
  (4, 'purchased', 'Teclado mecánico Keychron Q1 Pro y MX Master 3S', 'Renovación de periféricos principales con switches Banana custom y soporte QMK/VIA.', '2024-05-20', 339980, 'CLP', true),
  (8, 'note', 'Renovación Suite Figma Professional', 'Suscripción anual activada para desarrollo del sistema visual de diseño de producto.', '2025-01-05', 180000, 'CLP', true),
  (1, 'note', 'Verificación de Garantías y Mantenimiento', 'Inspección física del setup, recanalizado de cables y verificación de estado de garantía AppleCare+ y Synology.', '2025-06-15', 0, 'CLP', true),
  (12, 'planned', 'Hito planeado: Monitor UltraWide Dell 5K2K', 'Planificado reemplazo de monitores duales por superficie panorámica continua de 40" a 120Hz.', '2026-11-15', 1899990, 'CLP', true),
  (13, 'planned', 'Hito planeado: Interfaz Universal Audio Volt 276', 'Migración de cadena de audio a procesamiento analógico integrado con compresor 1176.', '2027-01-20', 349990, 'CLP', true)
ON CONFLICT DO NOTHING;
