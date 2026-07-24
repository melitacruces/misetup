BEGIN;

ALTER TABLE equipment
  ADD COLUMN IF NOT EXISTS item_kind VARCHAR(20) NOT NULL DEFAULT 'hardware',
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS target_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  ADD COLUMN IF NOT EXISTS purchase_date DATE,
  ADD COLUMN IF NOT EXISTS warranty_until DATE,
  ADD COLUMN IF NOT EXISTS private_notes TEXT,
  ADD COLUMN IF NOT EXISTS choice_reason TEXT,
  ADD COLUMN IF NOT EXISTS manual_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS wishlist_priority SMALLINT DEFAULT 2,
  ADD COLUMN IF NOT EXISTS planned_for DATE,
  ADD COLUMN IF NOT EXISTS roadmap_position INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compatibility_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'equipment_item_kind_check'
      AND conrelid = 'equipment'::regclass
  ) THEN
    ALTER TABLE equipment
      ADD CONSTRAINT equipment_item_kind_check
      CHECK (item_kind IN ('hardware', 'software', 'service'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'equipment_status_check'
      AND conrelid = 'equipment'::regclass
  ) THEN
    ALTER TABLE equipment
      ADD CONSTRAINT equipment_status_check
      CHECK (status IN ('active', 'wishlist'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'equipment_price_check'
      AND conrelid = 'equipment'::regclass
  ) THEN
    ALTER TABLE equipment
      ADD CONSTRAINT equipment_price_check
      CHECK (
        (purchase_price IS NULL OR purchase_price >= 0)
        AND (target_price IS NULL OR target_price >= 0)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'equipment_priority_check'
      AND conrelid = 'equipment'::regclass
  ) THEN
    ALTER TABLE equipment
      ADD CONSTRAINT equipment_priority_check
      CHECK (wishlist_priority IS NULL OR wishlist_priority BETWEEN 1 AND 3);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS equipment_category_position_idx
  ON equipment (category, position);

CREATE INDEX IF NOT EXISTS equipment_status_roadmap_idx
  ON equipment (status, wishlist_priority, planned_for, roadmap_position);

CREATE TABLE IF NOT EXISTS setup_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title VARCHAR(120) NOT NULL DEFAULT 'MiSetup - Panel de Inventario Personal',
  tagline VARCHAR(240),
  description TEXT,
  default_currency VARCHAR(3) NOT NULL DEFAULT 'CLP',
  wishlist_budget NUMERIC(12,2) DEFAULT 0,
  show_prices BOOLEAN NOT NULL DEFAULT TRUE,
  github_url TEXT,
  template_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO setup_profile (
  id,
  title,
  tagline,
  description,
  default_currency,
  wishlist_budget,
  show_prices,
  github_url,
  template_url
) VALUES (
  1,
  'MiSetup - Panel de Inventario Personal',
  'Hardware, software y herramientas que hacen funcionar mi espacio.',
  'Un registro vivo de las decisiones, herramientas y próximos upgrades de mi setup.',
  'CLP',
  0,
  TRUE,
  'https://github.com/melitacruces/misetup',
  'https://github.com/melitacruces/misetup/fork'
) ON CONFLICT (id) DO NOTHING;

UPDATE setup_profile
SET title = 'MiSetup - Panel de Inventario Personal'
WHERE title = 'MiSetup' OR title = 'miSetup';

DO $$
DECLARE
  equipment_id_type TEXT;
BEGIN
  SELECT udt_name
  INTO equipment_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'equipment'
    AND column_name = 'id';

  IF equipment_id_type NOT IN ('uuid', 'int4') THEN
    RAISE EXCEPTION 'equipment.id debe ser UUID o INTEGER; tipo encontrado: %', equipment_id_type;
  END IF;

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS setup_events (
      id BIGSERIAL PRIMARY KEY,
      equipment_id %s REFERENCES equipment(id) ON DELETE SET NULL,
      event_type VARCHAR(20) NOT NULL DEFAULT ''note'',
      title VARCHAR(160) NOT NULL,
      description TEXT,
      occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
      amount NUMERIC(12,2),
      currency VARCHAR(3) NOT NULL DEFAULT ''CLP'',
      is_public BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )',
    CASE WHEN equipment_id_type = 'uuid' THEN 'UUID' ELSE 'INTEGER' END
  );
END
$$;

CREATE INDEX IF NOT EXISTS setup_events_timeline_idx
  ON setup_events (occurred_on DESC, created_at DESC);

COMMIT;
