-- Archivo de documentación de esquema para la base de datos PostgreSQL (Neon)
-- Esta tabla contiene todo el inventario de my_setup.

CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,           -- Ejemplo: 'core', 'desk', 'studio', 'mobile'
    type VARCHAR(100) NOT NULL,              -- Ejemplo: 'chasis', 'monitor', 'teclado'
    brand VARCHAR(100),                      -- Ejemplo: 'Razer', 'Logitech'
    model VARCHAR(255),                      -- Ejemplo: 'Pro X Superlight'
    description TEXT,                        -- Puntos de características separados por puntos
    icon_name VARCHAR(100),                  -- Clase de FontAwesome, ej: 'fa-solid fa-mouse'
    website_url TEXT,                        -- Enlace a la web oficial del producto
    position INT DEFAULT 0,                  -- Posición de ordenación para la lista
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
