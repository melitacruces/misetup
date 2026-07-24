export const GITHUB_REPOSITORY = 'https://github.com/melitacruces/misetup';
export const TEMPLATE_URL = `${GITHUB_REPOSITORY}/fork`;

export const ITEM_STATUS = [
  { value: 'active', label: 'activo' },
  { value: 'wishlist', label: 'wishlist' },
];

export const ITEM_KINDS = [
  { value: 'hardware', label: 'hardware' },
  { value: 'software', label: 'software' },
  { value: 'service', label: 'servicio' },
];

export const PRIORITIES = [
  { value: 1, label: 'alta' },
  { value: 2, label: 'media' },
  { value: 3, label: 'baja' },
];

export const DEFAULT_PROFILE = {
  id: 1,
  title: 'MiSetup - Panel de Inventario Personal',
  tagline: 'Hardware, software y herramientas que hacen funcionar mi espacio.',
  description:
    'Un registro vivo de las decisiones, herramientas y próximos upgrades de mi setup.',
  default_currency: 'CLP',
  wishlist_budget: 0,
  show_prices: true,
  github_url: GITHUB_REPOSITORY,
  template_url: TEMPLATE_URL,
};

export function normalizeProfileTitle(value) {
  const title = String(value || '').trim();
  if (!title || title.toLowerCase() === 'misetup' || title.toLowerCase() === 'misetup - dashboard interactivo') {
    return 'MiSetup - Panel de Inventario Personal';
  }
  return title;
}

const ITEM_DEFAULTS = {
  item_kind: 'hardware',
  status: 'active',
  is_public: true,
  tags: [],
  purchase_price: null,
  target_price: null,
  currency: 'CLP',
  purchase_date: '',
  warranty_until: '',
  private_notes: '',
  choice_reason: '',
  manual_urls: [],
  photo_urls: [],
  wishlist_priority: 2,
  planned_for: '',
  roadmap_position: 0,
  compatibility_notes: '',
};

function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  if (!value) return [];
  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

const TYPE_IMAGE_FALLBACKS = {
  laptop: '/images/laptop_macbook.jpg',
  notebook: '/images/laptop_macbook.jpg',
  pc: '/images/laptop_macbook.jpg',
  nas: '/images/nas_synology.jpg',
  servidor: '/images/nas_synology.jpg',
  server: '/images/nas_synology.jpg',
  monitor: '/images/monitor_lg.jpg',
  pantalla: '/images/monitor_lg.jpg',
  ultrawide_monitor: '/images/monitor_dell.jpg',
  keyboard: '/images/keyboard_keychron.jpg',
  teclado: '/images/keyboard_keychron.jpg',
  mouse: '/images/mouse_mxmaster.jpg',
  raton: '/images/mouse_mxmaster.jpg',
  headphones: '/images/headphones_sony.jpg',
  audifonos: '/images/headphones_sony.jpg',
  auriculares: '/images/headphones_sony.jpg',
  microphone: '/images/mic_shure.jpg',
  microfono: '/images/mic_shure.jpg',
  mic: '/images/mic_shure.jpg',
  design_suite: '/images/software_figma.jpg',
  software: '/images/software_figma.jpg',
  figma: '/images/software_figma.jpg',
  phone: '/images/phone_iphone.jpg',
  celular: '/images/phone_iphone.jpg',
  telefono: '/images/phone_iphone.jpg',
  audio_interface: '/images/audio_volt.jpg',
  interfaz: '/images/audio_volt.jpg',
  tablet: '/images/tablet_ipad.jpg',
  ipad: '/images/tablet_ipad.jpg',
};

const CATEGORY_IMAGE_FALLBACKS = {
  core: '/images/laptop_macbook.jpg',
  desk: '/images/keyboard_keychron.jpg',
  studio: '/images/headphones_sony.jpg',
  mobile: '/images/phone_iphone.jpg',
};

export function getFallbackImage(type, category) {
  const normalizedType = String(type || '').toLowerCase().trim();
  if (TYPE_IMAGE_FALLBACKS[normalizedType]) {
    return TYPE_IMAGE_FALLBACKS[normalizedType];
  }
  const normalizedCat = String(category || '').toLowerCase().trim();
  return CATEGORY_IMAGE_FALLBACKS[normalizedCat] || '/images/keyboard_keychron.jpg';
}

export function normalizeEquipmentItem(item = {}) {
  const photoUrls = normalizeStringArray(item.photo_urls).slice(0, 1);
  const finalPhotoUrls =
    photoUrls.length > 0
      ? photoUrls
      : [getFallbackImage(item.type, item.category)];

  return {
    ...ITEM_DEFAULTS,
    ...item,
    tags: normalizeStringArray(item.tags),
    manual_urls: normalizeStringArray(item.manual_urls),
    photo_urls: finalPhotoUrls,
    purchase_date: normalizeDate(item.purchase_date),
    warranty_until: normalizeDate(item.warranty_until),
    planned_for: normalizeDate(item.planned_for),
    purchase_price:
      item.purchase_price === null || item.purchase_price === undefined
        ? null
        : Number(item.purchase_price),
    target_price:
      item.target_price === null || item.target_price === undefined
        ? null
        : Number(item.target_price),
    wishlist_priority: Number(item.wishlist_priority || 2),
    roadmap_position: Number(item.roadmap_position || 0),
  };
}

export function normalizeProfile(profile = {}) {
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    title: normalizeProfileTitle(profile.title),
    wishlist_budget:
      profile.wishlist_budget === null || profile.wishlist_budget === undefined
        ? 0
        : Number(profile.wishlist_budget),
    show_prices: profile.show_prices !== false,
  };
}

export function normalizeEvent(event = {}) {
  return {
    ...event,
    occurred_on: normalizeDate(event.occurred_on),
    amount:
      event.amount === null || event.amount === undefined
        ? null
        : Number(event.amount),
  };
}

export function parseListInput(value) {
  return normalizeStringArray(value);
}

export function formatMoney(value, currency = 'CLP') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—';
  }

  try {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: String(currency || 'CLP').toUpperCase(),
      maximumFractionDigits: String(currency).toUpperCase() === 'CLP' ? 0 : 2,
    }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toLocaleString('es-CL')}`;
  }
}

export function isSafeExternalUrl(value) {
  if (!value) return false;
  if (
    typeof value === 'string' &&
    (value.startsWith('/') || value.startsWith('data:image/'))
  ) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function buildSetupExport({
  profile,
  sections,
  items,
  events,
  preview,
  includePrivate,
}) {
  const exportedProfile = normalizeProfile(profile);
  if (!includePrivate && exportedProfile.show_prices === false) {
    exportedProfile.wishlist_budget = null;
  }

  const publicItems = items
    .filter(item => includePrivate || item.is_public !== false)
    .map(item => {
      const normalized = normalizeEquipmentItem(item);
      if (includePrivate) return normalized;
      const { private_notes: _privateNotes, ...publicItem } = normalized;
      if (profile.show_prices === false) {
        publicItem.purchase_price = null;
        publicItem.target_price = null;
      }
      return publicItem;
    });

  return {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    source: preview ? 'preview' : 'personal',
    profile: exportedProfile,
    sections: [...sections].sort((a, b) => a.position - b.position),
    equipment: publicItems.sort((a, b) => {
      if (a.category !== b.category) {
        return String(a.category).localeCompare(String(b.category));
      }
      return a.position - b.position;
    }),
    timeline: events
      .filter(event => includePrivate || event.is_public !== false)
      .map(normalizeEvent)
      .sort((a, b) => String(b.occurred_on).localeCompare(String(a.occurred_on))),
  };
}
