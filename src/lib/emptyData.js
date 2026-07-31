import { DEFAULT_PROFILE } from '@/lib/setupData';

export const EMPTY_SECTIONS = [
  {
    id: 1,
    slug: 'core',
    title: 'core',
    icon_name: 'fa-solid fa-server',
    position: 0,
  },
  {
    id: 2,
    slug: 'desk',
    title: 'desk',
    icon_name: 'fa-solid fa-computer-mouse',
    position: 1,
  },
  {
    id: 3,
    slug: 'studio',
    title: 'studio',
    icon_name: 'fa-solid fa-headphones',
    position: 2,
  },
  {
    id: 4,
    slug: 'mobile',
    title: 'mobile',
    icon_name: 'fa-solid fa-briefcase',
    position: 3,
  },
];

export const EMPTY_PROFILE = {
  ...DEFAULT_PROFILE,
  tagline: 'Documenta las herramientas que forman parte de tu espacio.',
  description:
    'Activa el modo editor para agregar tu primer equipo, software o servicio.',
  wishlist_budget: 0,
};

export const EMPTY_SETUP = {
  items: [],
  sections: EMPTY_SECTIONS,
  profile: EMPTY_PROFILE,
  events: [],
};
