# MiSetup - Panel de Inventario Personal

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Un dashboard dinámico y minimalista para la gestión y presentación de equipamiento, optimizado para ofrecer una experiencia visual clara, interactiva y estructurada.

[Preview](https://misetup.melitacruces.com)

## Preview pública e instalación propia

El mismo repositorio tiene dos modos de ejecución, seleccionados con `MISETUP_MODE`:

- `preview` (predeterminado): pensado para la demo pública de Vercel. Neon se consulta dentro de una transacción `READ ONLY`; las ediciones ocurren solo en el navegador y se descartan al recargar o usar **reiniciar**. Las Server Actions de escritura también se rechazan en el servidor.
- `database`: pensado para quien clone el proyecto. Conecta a **su propia** base de datos, permite iniciar sesión como editor y persiste altas, ediciones, eliminaciones y reordenamientos.

En la preview de Vercel mantén `MISETUP_MODE=preview` y usa una `DATABASE_URL` de un rol de PostgreSQL con permisos `SELECT` únicamente. Así hay dos barreras: la aplicación y la propia base de datos.

```sql
GRANT CONNECT ON DATABASE neondb TO misetup_preview;
GRANT USAGE ON SCHEMA public TO misetup_preview;
GRANT SELECT ON equipment, sections, setup_profile, setup_events TO misetup_preview;
```

No uses en Vercel una credencial propietaria si puedes crear este rol de lectura. Las tablas y los datos de la preview deben administrarse fuera de la aplicación pública.

## Tabla de Contenidos

- [¿Qué es este proyecto?](#qué-es-este-proyecto)
- [Preview pública y datos de Neon](#preview-pública-y-datos-de-neon)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estilo y Diseño](#estilo-y-diseño)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos e Instalación](#requisitos-e-instalación)
- [Scripts y Comandos](#scripts-y-comandos)
- [Contacto](#contacto)

## ¿Qué es este proyecto?

MiSetup es una plataforma web moderna desarrollada con Next.js que funciona como un panel de control e inventario personal para espacios de trabajo, equipamiento informático, software y servicios. Permite a creadores, desarrolladores y entusiastas del hardware organizar, visualizar y gestionar sus recursos de manera centralizada.

El sistema proporciona tres vistas principales (Resumen General, Inventario por Categorías y Planificador de Upgrades), ofreciendo una experiencia fluida para explorar y probar la interfaz pública.

## Características Principales

- **Sandbox de edición:** En la preview, creación, personalización y reordenamiento viven solo en la sesión del navegador.
- **Inventario Enriquecido:** Registro completo de productos incluyendo tipo, marca, modelo, descripción, precio de compra, moneda (CLP/USD/EUR), estado (activo o wishlist), tipo de elemento (hardware, software, servicio), fechas de compra y garantía, manuales, fotografías, justificaciones de elección y notas privadas.
- **Vista Resumen (Setup Overview):** Panel general con métricas consolidadas de inversión total, volumen de equipamiento activo, stack de software utilizado, alertas de garantías próximas a vencer y timeline de evolución histórica del setup.
- **Planificador de Mejoras (Upgrade Planner):** Wishlist interactiva priorizada (alta, media, baja) para proyectar compras futuras, comparar presupuestos objetivo vs actual, registrar notas de compatibilidad y ordenar la hoja de ruta (roadmap).
- **Filtros y Búsqueda Avanzada:** Barra de herramientas interactiva para filtrar por término de búsqueda, categoría, tipo de elemento, estado, rango de precio y criterio de ordenamiento.
- **Lectura pública segura:** La preview muestra solo campos públicos de Neon, omite las notas privadas y bloquea las escrituras en el servidor.
- **Exportación e Importación Portable:** Herramienta para respaldar o restaurar el inventario completo mediante archivos JSON versionados.
- **Modo Guiado:** Panel interactivo de bienvenida y tutorial paso a paso para explorar las funcionalidades clave de la aplicación.
- **Diseño Responsivo y Minimalista:** Tema oscuro nativo (Dark Mode), tipografía limpia, micro-animaciones sutiles y adaptación completa a dispositivos móviles mediante menús colapsables.
- **Instalación persistente opcional:** Quien autoaloje el proyecto puede conectar su propia base de datos PostgreSQL y guardar sus cambios desde el modo editor.

## Arquitectura

La aplicación está construida sobre Next.js App Router. El servidor entrega los datos iniciales al dashboard y el comportamiento depende de `MISETUP_MODE`: sandbox local para la preview o persistencia protegida para una instalación propia.

```text
Next.js App Router (Single-Page App Layout)
        |
        +-- Client Side (React State)
        |      Dashboard Manager, Vistas (Overview / Inventory / Planner)
        |      Modal Editors, Toolbar, DatePicker, CustomSelect
        |
        +-- Server Actions (src/lib/actions.js)
               preview            -> SELECT público + BEGIN READ ONLY
               database           -> sesión de editor + CRUD en la base propia
```

La vista pública enmascara automáticamente los campos sensibles (como notas privadas). En `preview`, las modificaciones se descartan al reiniciar o recargar; en `database`, solo una sesión de editor válida puede persistir cambios.

## Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)

- **Core:** Next.js 16.2, React 19, HTML5.
- **Estilos:** Tailwind CSS 4 con `@tailwindcss/postcss`.
- **Iconografía:** Lucide React y FontAwesome 6.
- **Componentes:** Selector de fechas nativo personalizado, desplegables accesibles y modales reactivos.

### Backend y Base de Datos

- **Lógica de Servidor:** Next.js Server Actions.
- **Base de Datos:** Neon PostgreSQL con la librería `@neondatabase/serverless`.
- **Comunicación WebSockets:** Paquete `ws` para conexiones de baja latencia con Neon.

## Estilo y Diseño

El diseño sigue una estética minimalista orientada a desarrolladores, con una paleta monocromática oscura acentuada por tonos púrpuras para destacar elementos interactivos y estados activos.

### Paleta de Colores

| Color          | Hexadecimal | Uso principal                                 |
| :------------- | :---------- | :-------------------------------------------- |
| **Primario**   | `#9D00FF`   | Acentos principales, botones activos y focus. |
| **Fondo Base** | `#0a0a0a`   | Fondo principal de la aplicación.             |
| **Superficie** | `#0b0b0b`   | Tarjetas, paneles elevados y modales.         |
| **Borde**      | `#1e1e1e`   | Separadores y contornos de componentes.       |
| **Texto Base** | `#ededed`   | Títulos y texto principal.                    |
| **Texto Sec.** | `#9ca3af`   | Descripciones y etiquetas secundarias.        |

### Tipografía

- **Títulos y Encabezados:** Geist Sans.
- **Cuerpo de texto:** Geist Sans / Sans-serif.

## Estructura del Proyecto

```text
misetup/
|-- public/              Archivos estáticos e imágenes.
|-- src/
|   |-- app/             Rutas, layouts y configuración de Next.js.
|   |   |-- globals.css  Variables CSS y tokens de diseño.
|   |   |-- layout.jsx   Layout principal de la aplicación.
|   |   `-- page.jsx     Punto de entrada principal (Dashboard).
|   |-- components/      Componentes de interfaz de usuario.
|   |   |-- layout/      Header, Sidebar y navegación.
|   |   `-- ui/          Dashboard, EquipmentCard, UpgradePlanner, SetupOverview, etc.
|   `-- lib/             Server Actions, conexión DB, utilidades y datos iniciales.
|-- db_schema.sql        Esquema completo de la base de datos PostgreSQL.
|-- eslint.config.mjs    Configuración de ESLint.
|-- feature_schema.sql   Migraciones y campos adicionales.
|-- jsconfig.json        Alias y configuración de JavaScript.
|-- migrate.js           Script de migración de datos.
|-- next.config.mjs      Configuración de Next.js.
|-- package.json         Dependencias y scripts del proyecto.
|-- postcss.config.mjs   Configuración de PostCSS.
`-- sections_schema.sql  Esquema inicial para categorías de secciones.
```

---

## Requisitos e Instalación

Para ejecutar este proyecto en un entorno local, asegúrate de contar con:

- Node.js (versión 20.9.0 o superior).
- npm, pnpm o yarn.
- Instancia de PostgreSQL en Neon (u otro proveedor compatible).

### Pasos de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/melitacruces/misetup.git
   ```
2. Accede al directorio del proyecto:
   ```bash
   cd misetup
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno creando un archivo `.env.local` basado en `.env.example`.

   Para usar solo el sandbox local o desplegar una preview pública:

   ```env
   MISETUP_MODE=preview
   DATABASE_URL=tu_cadena_de_conexion_neon
   ```

   Para una instalación propia con cambios persistentes:

   ```env
   MISETUP_MODE=database
   DATABASE_URL=tu_cadena_de_conexion_postgresql_propia
   EDITOR_PASSWORD=una_clave_larga_y_unica
   ```

5. Para `MISETUP_MODE=database`, ejecuta `db_schema.sql` y luego `feature_schema.sql` en tu base de datos. Después abre la app, pulsa **editor** e ingresa `EDITOR_PASSWORD` para guardar cambios. Nunca apuntes este modo a la base usada por la preview pública.

---

## Scripts y Comandos

| Comando              | Descripción                                                       |
| :------------------- | :---------------------------------------------------------------- |
| `npm run dev`        | Inicia el servidor de desarrollo en modo local.                   |
| `npm run build`      | Compila y optimiza la aplicación para producción.                 |
| `npm run start`      | Inicia el servidor ejecutable de producción.                      |
| `npm run lint`       | Revisa la calidad del código utilizando ESLint.                   |
| `npm run db:migrate` | Ejecuta el script de migración con las variables de `.env.local`. |

---

## Contacto

Si tienes preguntas, sugerencias o deseas conocer más sobre el proyecto, puedes contactarme a través de:

- **Nombre:** Luis Andrés Melita Cruces
- **Correo electrónico:** melitacruces@gmail.com
- **LinkedIn:** [linkedin.com/in/melitacruces](https://linkedin.com/in/melitacruces)
- **GitHub:** [github.com/melitacruces](https://github.com/melitacruces)
- **Ubicación:** Concepción, Chile
