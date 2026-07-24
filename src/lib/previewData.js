import {
  GITHUB_REPOSITORY,
  TEMPLATE_URL,
  normalizeEquipmentItem,
} from '@/lib/setupData';

export const PREVIEW_SECTIONS = [
  { id: 1, slug: 'core', title: 'core', icon_name: 'fa-solid fa-server', position: 0 },
  { id: 2, slug: 'desk', title: 'desk', icon_name: 'fa-solid fa-computer-mouse', position: 1 },
  { id: 3, slug: 'studio', title: 'studio', icon_name: 'fa-solid fa-headphones', position: 2 },
  { id: 4, slug: 'mobile', title: 'mobile', icon_name: 'fa-solid fa-briefcase', position: 3 },
];
export const PREVIEW_PROFILE = {
  id: 1,
  title: 'MiSetup - Panel de Inventario Personal',
  tagline: 'Un setup híbrido para desarrollar, diseñar y crear contenido.',
  description:
    'Este escenario de ejemplo combina inventario, decisiones de compra y un roadmap de upgrades. Todo lo que cambies aquí permanece solo en tu navegador.',
  default_currency: 'CLP',
  wishlist_budget: 8500000,
  show_prices: true,
  github_url: GITHUB_REPOSITORY,
  template_url: TEMPLATE_URL,
};

export const PREVIEW_EQUIPMENT = [
  {
    "id": 1,
    "category": "core",
    "type": "laptop",
    "brand": "Apple",
    "model": "MacBook Pro M3 Max",
    "description": "16 pulgadas. 64 GB RAM. 2 TB SSD.",
    "icon_name": "fa-solid fa-laptop",
    "website_url": "https://apple.com/macbook-pro",
    "position": 0,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "desarrollo",
      "edición",
      "movilidad"
    ],
    "purchase_price": 4299990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2024-03-18",
    "warranty_until": "2027-03-18",
    "choice_reason": "Centraliza desarrollo, edición de video y trabajo móvil sin duplicar proyectos entre equipos.",
    "manual_urls": [
      "https://support.apple.com/mac/macbook-pro"
    ],
    "private_notes": "AppleCare+ activo hasta marzo 2027. Respaldo semanal Time Machine en NAS Synology.",
    "compatibility_notes": "Conexión directa vía Thunderbolt 4 al monitor 5K y periféricos de escritorio.",
    "photo_urls": [
      "/images/laptop_macbook.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 2,
    "category": "core",
    "type": "nas",
    "brand": "Synology",
    "model": "DS923+",
    "description": "NAS de cuatro bahías con 16 TB útiles y snapshots.",
    "icon_name": "fa-solid fa-server",
    "website_url": "https://synology.com/products/DS923+",
    "position": 1,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "backup",
      "storage",
      "red"
    ],
    "purchase_price": 1180000,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-08-12",
    "warranty_until": "2026-08-12",
    "choice_reason": "Mantiene proyectos, biblioteca multimedia y respaldos fuera del equipo principal.",
    "manual_urls": [
      "https://global.download.synology.com/download/Document/Hardware/HIG/DiskStation/23-year/DS923+/spa/DS923_Plus_HIG_spa.pdf"
    ],
    "private_notes": "Garantía por vencer próximamente. Configurado RAID 5 con discos WD Red Plus.",
    "compatibility_notes": "Integrado mediante SMB/NFS en la red local y acceso remoto seguro VPN.",
    "photo_urls": [
      "/images/nas_synology.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 3,
    "category": "desk",
    "type": "monitor",
    "brand": "LG",
    "model": "UltraFine 5K",
    "description": "Panel 27 pulgadas 5K con cobertura P3.",
    "icon_name": "fa-solid fa-display",
    "website_url": "https://lg.com",
    "position": 0,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "color",
      "5k",
      "usb-c"
    ],
    "purchase_price": 1099990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-11-03",
    "warranty_until": "2026-11-03",
    "choice_reason": "La densidad de píxeles y el color consistente son claves para diseño y edición.",
    "manual_urls": [
      "https://lg.com/support/product/27MD5KL-B"
    ],
    "private_notes": "Garantía extiende hasta nov 2026. Calibrado mensual con calibrador SpyderX Elite.",
    "compatibility_notes": "Carga el portátil a 94W mediante un solo cable Thunderbolt 3.",
    "photo_urls": [
      "/images/monitor_lg.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 4,
    "category": "desk",
    "type": "keyboard",
    "brand": "Keychron",
    "model": "Q1 Pro",
    "description": "Teclado mecánico inalámbrico con switches Banana.",
    "icon_name": "fa-solid fa-keyboard",
    "website_url": "https://keychron.com/products/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard",
    "position": 1,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "mecánico",
      "bluetooth",
      "qmk"
    ],
    "purchase_price": 239990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2024-05-20",
    "warranty_until": "2026-09-20",
    "choice_reason": "Permite alternar entre dispositivos y ajustar capas para edición y desarrollo.",
    "manual_urls": [
      "https://www.keychron.com/pages/q1-pro-user-manual"
    ],
    "private_notes": "Garantía extendida hasta sep 2026. Mapeado personalizado vía VIA.",
    "compatibility_notes": "Soporta conexión multidispositivo Bluetooth 5.1 y cable USB-C.",
    "photo_urls": [
      "/images/keyboard_keychron.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 5,
    "category": "desk",
    "type": "mouse",
    "brand": "Logitech",
    "model": "MX Master 3S",
    "description": "Mouse inalámbrico silencioso con rueda electromagnética.",
    "icon_name": "fa-solid fa-computer-mouse",
    "website_url": "https://logitech.com/products/mice/mx-master-3s",
    "position": 2,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "ergonomía",
      "productividad"
    ],
    "purchase_price": 99990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2024-05-20",
    "warranty_until": "2026-10-20",
    "choice_reason": "Los perfiles por aplicación reducen fricción al cambiar entre edición y navegador.",
    "manual_urls": [
      "https://support.logi.com/hc/es/articles/5258933230615-Getting-Started-MX-Master-3S"
    ],
    "private_notes": "Garantía activa en Logitech. Receptor Logi Bolt conectado al hub.",
    "compatibility_notes": "Sincronizado vía Logi Options+ en macOS y Windows.",
    "photo_urls": [
      "/images/mouse_mxmaster.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 6,
    "category": "studio",
    "type": "headphones",
    "brand": "Sony",
    "model": "WH-1000XM5",
    "description": "Audífonos over-ear con cancelación activa de ruido.",
    "icon_name": "fa-solid fa-headphones",
    "website_url": "https://sony.com/electronics/headband-headphones/wh-1000xm5",
    "position": 0,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "audio",
      "anc",
      "bluetooth"
    ],
    "purchase_price": 329990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-06-15",
    "warranty_until": "2025-06-15",
    "choice_reason": "Aísla el espacio de trabajo y sirve tanto para edición ligera como para llamadas.",
    "manual_urls": [
      "https://helpguide.sony.net/mdr/wh1000xm5/v1/es/index.html"
    ],
    "private_notes": "Garantía del fabricante vencida en junio 2025. Excelente estado funcional.",
    "compatibility_notes": "Conexión multipunto activa entre MacBook y teléfono móvil.",
    "photo_urls": [
      "/images/headphones_sony.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 7,
    "category": "studio",
    "type": "microphone",
    "brand": "Shure",
    "model": "SM7B",
    "description": "Micrófono dinámico para voz y streaming.",
    "icon_name": "fa-solid fa-microphone",
    "website_url": "https://shure.com/products/microphones/sm7b",
    "position": 1,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "voz",
      "streaming",
      "audio"
    ],
    "purchase_price": 429990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-09-01",
    "warranty_until": "2025-09-01",
    "choice_reason": "Tolera bien una habitación sin tratamiento acústico completo.",
    "manual_urls": [
      "https://pubs.shure.com/guide/SM7B/es-ES"
    ],
    "private_notes": "Garantía vencida en septiembre 2025. Montado en brazo Rode PSA1+.",
    "compatibility_notes": "Requiere interfaz XLR con buena ganancia limpia (+60dB).",
    "photo_urls": [
      "/images/mic_shure.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 8,
    "category": "core",
    "type": "design_suite",
    "brand": "Figma",
    "model": "Professional",
    "description": "Diseño de producto, prototipos y sistema visual.",
    "icon_name": "fa-solid fa-bezier-curve",
    "website_url": "https://figma.com",
    "position": 2,
    "item_kind": "software",
    "status": "active",
    "is_public": true,
    "tags": [
      "diseño",
      "colaboración",
      "prototipos"
    ],
    "purchase_price": 180000,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2025-01-05",
    "warranty_until": "2026-01-05",
    "choice_reason": "Conecta exploración visual, prototipos y handoff en una sola herramienta.",
    "manual_urls": [
      "https://help.figma.com"
    ],
    "private_notes": "Suscripción anual finalizada en ene 2026 (pendiente renovación).",
    "compatibility_notes": "Ejecución en navegador y app nativa macOS con sincronización en la nube.",
    "photo_urls": [
      "/images/software_figma.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 9,
    "category": "mobile",
    "type": "phone",
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "description": "256 GB, titanio natural y cámara ProRAW.",
    "icon_name": "fa-solid fa-mobile-screen",
    "website_url": "https://apple.com/iphone-15-pro",
    "position": 0,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "mobile",
      "cámara"
    ],
    "purchase_price": 1299990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-10-10",
    "warranty_until": "2024-10-10",
    "choice_reason": "Funcionó como cámara secundaria y dispositivo de pruebas móviles.",
    "manual_urls": [
      "https://support.apple.com/manuals/iphone"
    ],
    "private_notes": "Garantía inicial Apple expirada en oct 2024. Batería a 92% de salud.",
    "compatibility_notes": "Puerto USB-C de 10Gbps para transferencia directa de video ProRes.",
    "photo_urls": [
      "/images/phone_iphone.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 10,
    "category": "desk",
    "type": "macro_pad",
    "brand": "Elgato",
    "model": "Stream Deck MK.2",
    "description": "Consola de control con 15 teclas LCD personalizables.",
    "icon_name": "fa-solid fa-gamepad",
    "website_url": "https://www.elgato.com/products/stream-deck-mk2",
    "position": 3,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "productividad",
      "automatización",
      "desk"
    ],
    "purchase_price": 159990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2024-02-14",
    "warranty_until": "2027-02-14",
    "choice_reason": "Automatiza atajos de desarrollo, control de OBS y comandos de terminal con un solo toque.",
    "manual_urls": [
      "https://help.elgato.com/hc/en-us/categories/360001237372-Stream-Deck"
    ],
    "private_notes": "Garantía extendida hasta feb 2027. Perfiles configurados para VS Code y OBS.",
    "compatibility_notes": "Conexión USB-C con soporte para plugins de macOS y Windows.",
    "photo_urls": [
      "/images/keyboard_keychron.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 11,
    "category": "mobile",
    "type": "powerbank",
    "brand": "Anker",
    "model": "Prime 20,000mAh 200W",
    "description": "Batería portátil de 20,000 mAh con pantalla inteligente y carga de 200W.",
    "icon_name": "fa-solid fa-battery-full",
    "website_url": "https://www.anker.com/products/a1336",
    "position": 1,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": [
      "mobile",
      "carga",
      "viajes"
    ],
    "purchase_price": 129990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2024-01-20",
    "warranty_until": "2026-01-20",
    "choice_reason": "Permite cargar el MacBook Pro a velocidad máxima durante sesiones de trabajo fuera de casa.",
    "manual_urls": [
      "https://support.anker.com"
    ],
    "private_notes": "Garantía vencida en ene 2026. Incluye cable USB-C de 240W.",
    "compatibility_notes": "Carga rápida compatible con Power Delivery 3.1 de Apple.",
    "photo_urls": [
      "/images/phone_iphone.jpg"
    ],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  },
  {
    "id": 12,
    "category": "desk",
    "type": "ultrawide_monitor",
    "brand": "Dell",
    "model": "U4025QW",
    "description": "Monitor 40 pulgadas 5K2K con Thunderbolt.",
    "icon_name": "fa-solid fa-display",
    "website_url": "https://dell.com",
    "position": 4,
    "item_kind": "hardware",
    "status": "wishlist",
    "is_public": true,
    "tags": [
      "upgrade",
      "display",
      "thunderbolt"
    ],
    "purchase_price": null,
    "target_price": 1899990,
    "currency": "CLP",
    "purchase_date": "",
    "warranty_until": "",
    "choice_reason": "Reemplazaría la configuración de dos pantallas por una superficie continua.",
    "manual_urls": [
      "https://www.dell.com/support/home/product-support/product/u4025qw-monitor/docs"
    ],
    "private_notes": "Monitorear ofertas de fin de año o importación directa empresarial.",
    "wishlist_priority": 1,
    "planned_for": "2026-11-15",
    "roadmap_position": 0,
    "compatibility_notes": "Reemplazaría la configuración de dos pantallas por una superficie continua con panel IPS Black a 120Hz.",
    "photo_urls": [
      "/images/monitor_dell.jpg"
    ]
  },
  {
    "id": 13,
    "category": "studio",
    "type": "audio_interface",
    "brand": "Universal Audio",
    "model": "Volt 276",
    "description": "Interfaz USB de dos canales con compresor integrado.",
    "icon_name": "fa-solid fa-sliders",
    "website_url": "https://uaudio.com/audio-interfaces/volt-276-usb.html",
    "position": 2,
    "item_kind": "hardware",
    "status": "wishlist",
    "is_public": true,
    "tags": [
      "audio",
      "upgrade",
      "usb-c"
    ],
    "purchase_price": null,
    "target_price": 349990,
    "currency": "CLP",
    "purchase_date": "",
    "warranty_until": "",
    "choice_reason": "Simplificaría grabación y monitoreo con controles físicos más directos.",
    "manual_urls": [
      "https://help.uaudio.com/hc/en-us/categories/4404092496276-Volt-Audio-Interfaces"
    ],
    "private_notes": "Sustituirá la interfaz actual para procesamiento analógico sin latencia.",
    "wishlist_priority": 2,
    "planned_for": "2027-01-20",
    "roadmap_position": 1,
    "compatibility_notes": "Compatible con el SM7B; evaluar si requiere Cloudlifter para mantener bajo ruido.",
    "photo_urls": [
      "/images/audio_volt.jpg"
    ]
  },
  {
    "id": 14,
    "category": "mobile",
    "type": "tablet",
    "brand": "Apple",
    "model": "iPad Pro 11 M4",
    "description": "Tablet OLED para bocetos, revisión y trabajo móvil.",
    "icon_name": "fa-solid fa-tablet-screen-button",
    "website_url": "https://apple.com/ipad-pro",
    "position": 2,
    "item_kind": "hardware",
    "status": "wishlist",
    "is_public": true,
    "tags": [
      "mobile",
      "dibujo",
      "review"
    ],
    "purchase_price": null,
    "target_price": 1199990,
    "currency": "CLP",
    "purchase_date": "",
    "warranty_until": "",
    "choice_reason": "Añadiría una superficie de dibujo y revisión sin depender del escritorio.",
    "manual_urls": [
      "https://support.apple.com/manuals/ipad"
    ],
    "private_notes": "Considerar compra junto con el Smart Folio o Magic Keyboard para movilidad.",
    "wishlist_priority": 3,
    "planned_for": "2026-09-30",
    "roadmap_position": 2,
    "compatibility_notes": "Encaja con Sidecar y el flujo de Figma; requiere Apple Pencil por separado.",
    "photo_urls": [
      "/images/tablet_ipad.jpg"
    ]
  },
  {
    "id": 15,
    "category": "core",
    "type": "desktop",
    "brand": "Apple",
    "model": "Mac Studio M4",
    "description": "Estación de trabajo de escritorio con 128 GB RAM unificada y 2 TB SSD.",
    "icon_name": "fa-solid fa-desktop",
    "website_url": "https://apple.com/mac-studio",
    "position": 3,
    "item_kind": "hardware",
    "status": "wishlist",
    "is_public": true,
    "tags": [
      "core",
      "upgrade",
      "rendimiento"
    ],
    "purchase_price": null,
    "target_price": 3899990,
    "currency": "CLP",
    "purchase_date": "",
    "warranty_until": "",
    "choice_reason": "Servirá como nodo principal de compilación y renderizado continuo de alta exigencia.",
    "manual_urls": [
      "https://support.apple.com/mac/mac-studio"
    ],
    "private_notes": "Reemplazará el equipo principal en el escritorio cuando el flujo de renderizado aumente.",
    "wishlist_priority": 1,
    "planned_for": "2026-12-01",
    "roadmap_position": 3,
    "compatibility_notes": "Soporta hasta 4 monitores 6K simultáneos vía puertos Thunderbolt traseros.",
    "photo_urls": [
      "/images/laptop_macbook.jpg"
    ]
  },
  {
    "id": 16,
    "category": "studio",
    "type": "monitores_estudio",
    "brand": "Yamaha",
    "model": "HS5 (Par)",
    "description": "Monitores de estudio activos de campo cercano bi-amplificados de 70W.",
    "icon_name": "fa-solid fa-volume-high",
    "website_url": "https://usa.yamaha.com/products/audio_visual/speaker_systems/hs_series/index.html",
    "position": 3,
    "item_kind": "hardware",
    "status": "wishlist",
    "is_public": true,
    "tags": [
      "audio",
      "monitores",
      "mezcla"
    ],
    "purchase_price": null,
    "target_price": 419990,
    "currency": "CLP",
    "purchase_date": "",
    "warranty_until": "",
    "choice_reason": "Proporcionará respuesta de frecuencia plana para mezcla precisa de audio y podcast.",
    "manual_urls": [
      "https://usa.yamaha.com/files/download/other_assets/2/329522/hs8_hs7_hs5_hs8s_es_om_c0.pdf"
    ],
    "private_notes": "Instalar sobre aisladores de espuma IsoAcoustics para evitar resonancia con el escritorio.",
    "wishlist_priority": 2,
    "planned_for": "2026-10-15",
    "roadmap_position": 4,
    "compatibility_notes": "Conexión balanceada XLR/TRS a la interfaz de audio de escritorio.",
    "photo_urls": [
      "/images/headphones_sony.jpg"
    ]
  },
  {
    "id": 17,
    "category": "studio",
    "type": "monitors",
    "brand": "Audio-Technica",
    "model": "ATH-M50X",
    "description": "Audífonos cerrados de monitoreo profesional con drivers de 45mm y respuesta plana.",
    "icon_name": "fa-solid fa-headphones",
    "website_url": "https://www.audio-technica.com/en-us/ath-m50x",
    "position": 4,
    "item_kind": "hardware",
    "status": "active",
    "is_public": true,
    "tags": ["audio", "monitoreo", "estudio"],
    "purchase_price": 149990,
    "target_price": null,
    "currency": "CLP",
    "purchase_date": "2023-04-10",
    "warranty_until": "2025-04-10",
    "choice_reason": "Referencia de la industria para mezcla y revisión de audio con aislamiento pasivo y plegado compacto.",
    "manual_urls": ["https://www.audio-technica.com/en-us/support/ath-m50x"],
    "private_notes": "Almohadillas reemplazadas por Brainwavz de cuero. Se usan como segundo par de monitoreo en el estudio.",
    "compatibility_notes": "Conector desmontable de 2.5mm con cables incluidos: recto 1.2m, espiral 1.2–3m y recto 3m.",
    "photo_urls": ["/images/headphones_sony.jpg"],
    "wishlist_priority": 2,
    "planned_for": "",
    "roadmap_position": 0
  }
];

export const PREVIEW_EVENTS = [
  {
    "id": 1,
    "equipment_id": null,
    "event_type": "added",
    "title": "Montaje inicial del escritorio y workspace",
    "description": "Instalación del escritorio elevable de madera de nogal y primer monitor dual para desarrollo.",
    "occurred_on": "2022-04-15",
    "amount": 650000,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 2,
    "equipment_id": 2,
    "event_type": "added",
    "title": "Montaje de NAS Synology DS923+",
    "description": "Servidor de almacenamiento en red para copias de seguridad de proyectos y multimedia en RAID 5.",
    "occurred_on": "2023-08-12",
    "amount": 1180000,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 3,
    "equipment_id": 7,
    "event_type": "purchased",
    "title": "Estudio de audio: Micrófono Shure SM7B",
    "description": "Incorporación de micrófono dinámico con brazo articulado Rode PSA1+ para streaming y podcasting.",
    "occurred_on": "2023-09-01",
    "amount": 429990,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 4,
    "equipment_id": 3,
    "event_type": "purchased",
    "title": "Visualización 5K: Monitor LG UltraFine",
    "description": "Reemplazo de pantalla principal por panel 27\" 5K con precisión de color P3.",
    "occurred_on": "2023-11-03",
    "amount": 1099990,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 5,
    "equipment_id": 1,
    "event_type": "upgraded",
    "title": "Adquisición de MacBook Pro M3 Max",
    "description": "Actualización del equipo principal a M3 Max con 64 GB de RAM unificada para compilación y edición de video.",
    "occurred_on": "2024-03-18",
    "amount": 4299990,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 6,
    "equipment_id": 4,
    "event_type": "purchased",
    "title": "Teclado mecánico Keychron Q1 Pro y MX Master 3S",
    "description": "Renovación de periféricos principales con switches Banana custom y soporte QMK/VIA.",
    "occurred_on": "2024-05-20",
    "amount": 339980,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 7,
    "equipment_id": 8,
    "event_type": "note",
    "title": "Renovación Suite Figma Professional",
    "description": "Suscripción anual activada para desarrollo del sistema visual de diseño de producto.",
    "occurred_on": "2025-01-05",
    "amount": 180000,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 8,
    "equipment_id": 1,
    "event_type": "note",
    "title": "Verificación de Garantías y Mantenimiento",
    "description": "Inspección física del setup, recanalizado de cables y verificación de estado de garantía AppleCare+ y Synology.",
    "occurred_on": "2025-06-15",
    "amount": 0,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 9,
    "equipment_id": 12,
    "event_type": "planned",
    "title": "Hito planeado: Monitor UltraWide Dell 5K2K",
    "description": "Planificado reemplazo de monitores duales por superficie panorámica continua de 40\" a 120Hz.",
    "occurred_on": "2026-11-15",
    "amount": 1899990,
    "currency": "CLP",
    "is_public": true
  },
  {
    "id": 10,
    "equipment_id": 13,
    "event_type": "planned",
    "title": "Hito planeado: Interfaz Universal Audio Volt 276",
    "description": "Migración de cadena de audio a procesamiento analógico integrado con compresor 1176.",
    "occurred_on": "2027-01-20",
    "amount": 349990,
    "currency": "CLP",
    "is_public": true
  }
];
