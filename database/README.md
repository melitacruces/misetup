# Integración con PostgreSQL

MiSetup incluye persistencia PostgreSQL para instalaciones propias. El esquema crea un perfil y cuatro secciones iniciales; el inventario y la línea de tiempo comienzan vacíos.

## Configuración

1. Copia `.env.example` como `.env.local`.
2. Configura las variables privadas del servidor:

   ```env
   DATABASE_URL=postgresql://usuario:clave@localhost:5432/misetup
   EDITOR_PASSWORD=una-clave-larga-y-unica
   POSTGRES_SSL=disable
   ```

   `POSTGRES_SSL=disable` solo es necesario para una base local sin SSL.

3. Inicializa las tablas:

   ```bash
   npm run db:setup
   ```

4. Inicia la aplicación:

   ```bash
   npm run dev
   ```

Al detectar `DATABASE_URL`, la página obtiene los datos desde PostgreSQL. El botón **editor** solicita `EDITOR_PASSWORD` y las altas, modificaciones, eliminaciones y reordenamientos se guardan en la base.

## Seguridad

- Mantén `DATABASE_URL` y `EDITOR_PASSWORD` exclusivamente en el servidor.
- Utiliza credenciales distintas para desarrollo y producción.
- Ejecuta PostgreSQL con un usuario limitado a la base de esta aplicación.
- No habilites `MISETUP_MODE=preview` en una instalación persistente.
