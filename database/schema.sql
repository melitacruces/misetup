-- Esquema de referencia para instalaciones propias de MiSetup.
-- La preview pública no ejecuta ni importa este archivo.

BEGIN;

CREATE TABLE IF NOT EXISTS sections (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100) NOT NULL DEFAULT 'fa-solid fa-folder',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS setup_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title VARCHAR(120) NOT NULL DEFAULT 'MiSetup - Panel de Inventario Personal',
  tagline VARCHAR(240),
  description TEXT,
  default_currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  wishlist_budget NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (wishlist_budget >= 0),
  show_prices BOOLEAN NOT NULL DEFAULT TRUE,
  github_url TEXT,
  template_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL REFERENCES sections(slug)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  type VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(255),
  description TEXT,
  icon_name VARCHAR(100) NOT NULL DEFAULT 'fa-solid fa-box',
  website_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  item_kind VARCHAR(20) NOT NULL DEFAULT 'hardware'
    CHECK (item_kind IN ('hardware', 'software', 'service')),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'wishlist')),
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  purchase_price NUMERIC(14, 2) CHECK (purchase_price IS NULL OR purchase_price >= 0),
  target_price NUMERIC(14, 2) CHECK (target_price IS NULL OR target_price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  purchase_date DATE,
  warranty_until DATE,
  private_notes TEXT,
  choice_reason TEXT,
  manual_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  photo_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  wishlist_priority SMALLINT NOT NULL DEFAULT 2
    CHECK (wishlist_priority BETWEEN 1 AND 3),
  planned_for DATE,
  roadmap_position INTEGER NOT NULL DEFAULT 0,
  compatibility_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS setup_events (
  id BIGSERIAL PRIMARY KEY,
  equipment_id BIGINT REFERENCES equipment(id) ON DELETE SET NULL,
  event_type VARCHAR(20) NOT NULL DEFAULT 'note'
    CHECK (event_type IN ('added', 'purchased', 'upgraded', 'planned', 'note')),
  title VARCHAR(160) NOT NULL,
  description TEXT,
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(14, 2) CHECK (amount IS NULL OR amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sections_position_idx
  ON sections(position);

CREATE INDEX IF NOT EXISTS equipment_category_position_idx
  ON equipment(category, position);

CREATE INDEX IF NOT EXISTS equipment_status_roadmap_idx
  ON equipment(status, wishlist_priority, planned_for, roadmap_position);

CREATE INDEX IF NOT EXISTS setup_events_timeline_idx
  ON setup_events(occurred_on DESC, created_at DESC);

INSERT INTO sections (slug, title, icon_name, position) VALUES
  ('core', 'core', 'fa-solid fa-server', 0),
  ('desk', 'desk', 'fa-solid fa-computer-mouse', 1),
  ('studio', 'studio', 'fa-solid fa-headphones', 2),
  ('mobile', 'mobile', 'fa-solid fa-briefcase', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO setup_profile (
  id,
  title,
  tagline,
  description,
  default_currency,
  wishlist_budget,
  show_prices
) VALUES (
  1,
  'MiSetup - Panel de Inventario Personal',
  'Hardware, software y herramientas que hacen funcionar mi espacio.',
  'Un registro vivo de las decisiones y próximos upgrades de mi setup.',
  'CLP',
  0,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
