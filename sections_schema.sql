CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100) DEFAULT 'fa-solid fa-folder',
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de datos iniciales para las secciones del sistema.
INSERT INTO sections (slug, title, icon_name, position) VALUES 
('core', 'core', 'fa-solid fa-server', 0),
('desk', 'desk', 'fa-solid fa-computer-mouse', 1),
('studio', 'studio', 'fa-solid fa-headphones', 2),
('mobile', 'mobile', 'fa-solid fa-briefcase', 3)
ON CONFLICT (slug) DO NOTHING;
