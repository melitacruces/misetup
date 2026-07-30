# MiSetup - Panel de Inventario Personal

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Aplicación web para documentar, explorar y administrar un setup personal o profesional. Reúne inventario, historial de cambios y planificación de upgrades en una interfaz clara, interactiva y adaptable a dispositivos móviles.

[Ver Preview](https://misetup.melitacruces.com)

## Preview Pública e Instalación Propia

El repositorio ofrece dos modos de ejecución, definidos mediante <code>MISETUP_MODE</code>:

- <code>preview</code> (predeterminado): crea un sandbox para la demo pública. Sin una variable de conexión, usa exclusivamente el conjunto de datos de ejemplo versionado en el repositorio. Si se configura una base de datos, la aplicación solo consulta los campos públicos dentro de una transacción de lectura. Las ediciones se mantienen únicamente en el navegador y se descartan al recargar o seleccionar **reiniciar**.
- <code>database</code>: pensado para una instalación propia. Conecta a una base de datos PostgreSQL controlada por quien la instala y permite persistir altas, cambios, eliminaciones y reordenamientos tras iniciar una sesión de editor.

> **Clon limpio:** un fork, clon local o nuevo despliegue de este repositorio no recibe las credenciales ni los datos de la preview oficial. Con <code>MISETUP_MODE=preview</code> y sin <code>DATABASE_URL</code>, <code>POSTGRES_URL</code> ni <code>POSTGRES_URL_NON_POOLING</code>, la app muestra solo el escenario de ejemplo incluido en <code>src/lib/previewData.js</code>.

Para una preview desplegada en Vercel que consulte datos de PostgreSQL, mantén <code>MISETUP_MODE=preview</code> y utiliza una credencial de solo lectura. Así se combinan dos barreras: la aplicación bloquea las operaciones de escritura y la base de datos no las autoriza.

```sql
GRANT CONNECT ON DATABASE neondb TO misetup_preview;
GRANT USAGE ON SCHEMA public TO misetup_preview;
GRANT SELECT ON equipment, sections, setup_profile, setup_events TO misetup_preview;
```

Sustituye los nombres de base de datos y rol por los de tu entorno. Evita usar en Vercel una credencial propietaria cuando puedas crear un rol exclusivo de lectura. Los datos de la preview deben administrarse fuera de la aplicación pública.

### Desplegar en Vercel

Para publicar un fork o clon como una demo independiente y limpia:

1. Importa el repositorio en Vercel.
2. Define <code>MISETUP_MODE=preview</code> y <code>NEXT_PUBLIC_SITE_URL</code> con el dominio de ese despliegue.
3. No añadas <code>DATABASE_URL</code>, <code>POSTGRES_URL</code>, <code>POSTGRES_URL_NON_POOLING</code> ni <code>EDITOR_PASSWORD</code>.
4. Despliega. La app utilizará los datos de ejemplo locales y cualquier edición será temporal en el navegador.

La preview oficial puede usar una base distinta mediante un rol de solo lectura. Esas variables deben vivir únicamente en la configuración de Vercel de ese proyecto; para aislar los despliegues de ramas, asígnalas al entorno **Production** y no a **Preview**. Nunca copies las variables de la preview oficial a un fork o a una instalación de terceros.

## Tabla de Contenidos

- [Descipción del Proyecto](#descripción-del-proyecto)
- [Preview Pública e Instalación Propia](#preview-pública-e-instalación-propia)
- [Desplegar en Vercel](#desplegar-en-vercel)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estilo y Diseño](#estilo-y-diseño)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos e Instalación](#requisitos-e-instalación)
- [Scripts y Comandos](#scripts-y-comandos)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Descipción del Proyecto

MiSetup es una plataforma desarrollada con Next.js para llevar un registro vivo de hardware, software y servicios que componen un espacio de trabajo. Centraliza información práctica —como precio, garantía, documentación, etiquetas, fotografías y notas— junto con las decisiones de compra y próximos upgrades.

La aplicación se organiza en tres vistas: **Resumen general**, **Inventario por secciones** y **Planificador de upgrades**. Puede utilizarse como una preview editable sin persistencia o como una instalación personal con datos propios.

## Características Principales

- **Dos modos de uso:** Sandbox editable en la preview y persistencia protegida para instalaciones con base de datos propia.
- **Inventario detallado:** Registra tipo, marca, modelo, descripción, categoría, estado, clase de elemento (hardware, software o servicio), etiquetas, enlaces, precio, moneda, fechas de compra y garantía.
- **Información contextual:** Cada elemento puede incluir fotografías, manuales, motivo de elección, compatibilidad y notas privadas para mantenimiento, seriales o recordatorios.
- **Resumen del setup:** Muestra métricas de inversión, elementos activos, software, secciones, alertas de garantía y una línea de tiempo de la evolución del setup.
- **Planificador de mejoras:** Gestiona una wishlist con prioridad, precio objetivo, fecha estimada y notas de compatibilidad; permite ajustar el presupuesto y comparar hasta tres alternativas.
- **Búsqueda y filtros:** Busca por tipo, marca, modelo o etiqueta; filtra por estado y clase; y ordena por posición manual, nombre, precio o fecha.
- **Editor completo:** Permite crear, modificar, eliminar y reordenar elementos y secciones, personalizar el perfil del setup y registrar hitos en el timeline.
- **Privacidad configurable:** Los visitantes solo reciben elementos y eventos públicos. Las notas privadas nunca se exponen en la vista pública y los precios pueden ocultarse desde el perfil.
- **Exportación portable:** Descarga un respaldo JSON versionado del setup; en vista pública respeta la visibilidad de los elementos y de los precios.
- **Modo guiado:** La preview incluye un recorrido interactivo para conocer la creación de secciones, elementos, ordenamiento y exportación.
- **Diseño responsivo y accesible:** Tema oscuro, navegación móvil, controles con etiquetas accesibles, foco visible y respeto por la preferencia de reducción de movimiento.

## Arquitectura

La aplicación utiliza Next.js App Router. El servidor obtiene los datos iniciales y el dashboard de React gestiona la exploración, el editor y el sandbox local. El comportamiento de lectura y escritura depende de <code>MISETUP_MODE</code>.

```text
Next.js App Router
        |
        +-- Servidor
        |     src/app/page.jsx
        |     src/lib/actions.js
        |       preview  -> lectura pública y de solo lectura; fallback a datos incluidos
        |       database -> PostgreSQL propia y sesión de editor para operaciones CRUD
        |
        +-- Cliente (React)
              Dashboard, Overview, Inventory y Upgrade Planner
              editor de elementos, secciones, perfil, timeline y exportación JSON
```

En modo <code>preview</code>, las operaciones de edición no llegan al servidor: solo cambian el estado del navegador. En modo <code>database</code>, las Server Actions validan la sesión de editor antes de persistir cambios y luego actualizan la ruta principal.

## Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)

- **Core:** Next.js 16 y React 19.
- **Estilos:** Tailwind CSS 4 con <code>@tailwindcss/postcss</code>.
- **Tipografías:** Geist Sans y Geist Mono, cargadas con <code>next/font</code>.
- **Iconografía:** Lucide React y Font Awesome 6.
- **Experiencia de uso:** Componentes propios para selectores, fechas, navegación, modales y modo guiado.

### Backend y Base de Datos

- **Lógica de servidor:** Next.js Server Actions, cookies de sesión y revalidación de rutas.
- **Base de datos:** PostgreSQL o Neon PostgreSQL mediante <code>@neondatabase/serverless</code>.
- **Conectividad:** <code>ws</code> como constructor WebSocket para el cliente de Neon en el entorno de Node.js.
- **Metadatos:** Sitemap, robots, manifest, Open Graph y datos estructurados generados desde el App Router.

## Estilo y Diseño

El diseño utiliza una estética oscura y minimalista orientada a inventarios tecnológicos. La jerarquía visual combina superficies negras, bordes definidos y acentos púrpura para destacar acciones, estados y foco de teclado.

### Paleta de Colores

| Color          | Hexadecimal          | Uso principal                           |
| :------------- | :------------------- | :-------------------------------------- |
| **Primario**   | <code>#9D00FF</code> | Acciones, estados activos y foco.       |
| **Fondo base** | <code>#0A0A0A</code> | Fondo principal de la aplicación.       |
| **Panel**      | <code>#070707</code> | Paneles y controles elevados.           |
| **Superficie** | <code>#0B0B0B</code> | Superficies secundarias.                |
| **Borde**      | <code>#333333</code> | Separadores y contornos de componentes. |
| **Texto base** | <code>#EDEDED</code> | Títulos y contenido principal.          |

### Tipografía

- **Títulos y contenido:** Geist Sans.
- **Valores técnicos y código:** Geist Mono.

## Estructura del Proyecto

```text
misetup/
|-- public/              Archivos estáticos, iconos e imágenes.
|-- src/
|   |-- app/             Rutas, metadatos, layouts y estados de Next.js.
|   |   |-- globals.css  Tokens, estilos globales y animaciones.
|   |   |-- layout.jsx   Layout raíz, fuentes y metadatos SEO.
|   |   └-- page.jsx     Carga inicial del dashboard.
|   |-- components/
|   |   |-- layout/      Header, Sidebar y navegación.
|   |   └-- ui/          Dashboard, inventario, editor, planner y overview.
|   └-- lib/             Server Actions, datos de preview, utilidades y SEO.
|-- db_schema.sql        Esquema completo e idempotente de PostgreSQL.
|-- setup_database.js    Inicialización segura de una base propia.
|-- feature_schema.sql   Migración de campos para instalaciones antiguas.
|-- migrate.js           Migración de categorías heredadas.
|-- eslint.config.mjs    Configuración de ESLint.
|-- jsconfig.json        Alias y configuración de JavaScript.
|-- next.config.mjs      Configuración de Next.js.
|-- package.json         Dependencias y scripts del proyecto.
└-- postcss.config.mjs   Configuración de PostCSS.
```

---

## Requisitos e Instalación

Para ejecutar el proyecto localmente necesitas:

- Node.js 20.9.0 o superior.
- npm, pnpm o yarn.
- Una instancia de PostgreSQL o Neon solo si usarás el modo <code>database</code> o quieres alimentar la preview con datos externos.

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

4. Crea <code>.env.local</code> a partir de <code>.env.example</code> y elige uno de los siguientes modos.

   Para explorar el sandbox local o desplegar una preview pública limpia, no añadas una cadena de conexión:

   ```env
   MISETUP_MODE=preview
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Si quieres que la preview lea datos públicos desde PostgreSQL, añade una credencial de solo lectura:

   ```env
   MISETUP_MODE=preview
   DATABASE_URL=tu_cadena_de_conexion_postgresql_de_solo_lectura
   ```

   Para una instalación propia con cambios persistentes:

   ```env
   MISETUP_MODE=database
   DATABASE_URL=tu_cadena_de_conexion_postgresql_propia
   EDITOR_PASSWORD=una_clave_larga_y_unica
   ```

   También se aceptan <code>POSTGRES_URL</code> y <code>POSTGRES_URL_NON_POOLING</code> para mantener la compatibilidad con instalaciones anteriores.

5. Solo en <code>MISETUP_MODE=database</code>, inicializa la base de datos:

   ```bash
   npm run db:setup
   ```

   El comando se niega a ejecutarse en modo <code>preview</code>, crea las tablas necesarias y puede repetirse sin duplicar los datos iniciales de ejemplo. Después abre la app, pulsa **editor** e ingresa <code>EDITOR_PASSWORD</code> para guardar cambios. Nunca apuntes el modo <code>database</code> a la base usada por una preview pública.

   <code>feature_schema.sql</code> y <code>npm run db:migrate</code> están disponibles únicamente para actualizar instalaciones antiguas.

6. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Scripts y Comandos

| Comando                         | Descripción                                                                       |
| :------------------------------ | :-------------------------------------------------------------------------------- |
| <code>npm run dev</code>        | Inicia el servidor de desarrollo.                                                 |
| <code>npm run build</code>      | Compila y optimiza la aplicación para producción.                                 |
| <code>npm run start</code>      | Sirve la compilación de producción.                                               |
| <code>npm run lint</code>       | Revisa el código con ESLint.                                                      |
| <code>npm run db:setup</code>   | Inicializa de forma idempotente una base propia en modo <code>database</code>.    |
| <code>npm run db:migrate</code> | Normaliza las categorías de instalaciones antiguas en modo <code>database</code>. |

---

## Licencia

El código se publica bajo la [licencia MIT](LICENSE). La licencia cubre el código y los assets versionados; no incluye credenciales, variables de entorno ni datos de instalaciones o previews externas.

## Contacto

Si tienes preguntas, sugerencias o deseas conocer más sobre el proyecto, puedes contactarme a través de:

- **Nombre:** Luis Andrés Melita Cruces
- **Correo electrónico:** melitacruces@gmail.com
- **LinkedIn:** [linkedin.com/in/melitacruces](https://linkedin.com/in/melitacruces)
- **GitHub:** [github.com/melitacruces](https://github.com/melitacruces)
- **Ubicación:** Concepción, Chile
