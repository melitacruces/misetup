# MiSetup

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

MiSetup es una aplicación web para documentar un espacio de trabajo personal o profesional. Permite organizar hardware, software y servicios, registrar decisiones de compra y planificar futuras mejoras desde una interfaz responsiva.

[Abrir la Demostración](https://misetup.melitacruces.com)

## Características

- Inventario organizado por secciones personalizables.
- Registro de hardware, software y servicios.
- Información de compra, garantía, enlaces, fotografías y notas privadas.
- Wishlist y planificación de upgrades por prioridad y presupuesto.
- Perfil general con métricas y línea de tiempo.
- Búsqueda, filtros, orden manual y exportación JSON.
- Persistencia opcional con PostgreSQL.
- Editor protegido mediante una sesión segura del servidor.
- Interfaz responsiva para escritorio y dispositivos móviles.

## Formas de Uso

| Configuración                      | Datos Iniciales                        | Persistencia                                   |
| :--------------------------------- | :------------------------------------- | :--------------------------------------------- |
| Sin variables de base de datos     | Inventario y timeline vacíos           | Temporal, durante la sesión del navegador      |
| `MISETUP_MODE=preview`             | Escenario incluido en `previewData.js` | Temporal, pensado para la demostración pública |
| `DATABASE_URL` y `EDITOR_PASSWORD` | Base PostgreSQL de la instalación      | Permanente                                     |

Un clon limpio no carga los equipos ni eventos de la demostración. Conserva únicamente el perfil y las secciones iniciales necesarias para comenzar a utilizar la interfaz.

### Lógica del Repositorio

El mismo repositorio sirve para publicar la demostración y para crear instalaciones personales. La fuente de datos se decide mediante la configuración de cada entorno, no mediante ramas o repositorios distintos.

```text
Repositorio en GitHub
├── Proyecto de Vercel
│   └── MISETUP_MODE=preview
│       ├── utiliza previewData.js
│       └── mantiene las ediciones en el navegador
│
└── Clon o fork de un usuario
    ├── sin DATABASE_URL
    │   └── instalación limpia con cambios temporales
    └── con DATABASE_URL y EDITOR_PASSWORD
        └── instalación limpia con persistencia PostgreSQL
```

Las variables configuradas en Vercel no se guardan en GitHub ni se transfieren a los forks y clones. Por este motivo, cada instalación comienza aislada y utiliza únicamente las credenciales y los datos definidos por su propietario.

## Requisitos

- Node.js 20.9 o superior.
- npm, pnpm o yarn.
- PostgreSQL 14 o superior para utilizar persistencia.

## Instalación Local sin Base de Datos

Este flujo permite explorar una instalación limpia. Los cambios se conservan hasta recargar la página.

```bash
git clone https://github.com/melitacruces/misetup.git
cd misetup
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Instalación con PostgreSQL

La integración funciona con PostgreSQL local o con servicios que entreguen una cadena de conexión compatible, como Supabase, Railway, Render y otros proveedores PostgreSQL.

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone https://github.com/melitacruces/misetup.git
   cd misetup
   npm install
   ```

2. Copia `.env.example` como `.env.local` y configura la instalación:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   DATABASE_URL=postgresql://usuario:clave@host:5432/misetup
   EDITOR_PASSWORD=una-clave-larga-y-unica
   POSTGRES_SSL=disable
   ```

   Utiliza la cadena de conexión proporcionada por tu servicio. `POSTGRES_SSL=disable` solo es necesario para una base local que no utilice SSL; las conexiones remotas utilizan SSL de forma predeterminada.

3. Crea las tablas y los datos iniciales:

   ```bash
   npm run db:setup
   ```

4. Inicia la aplicación:

   ```bash
   npm run dev
   ```

La instalación detecta `DATABASE_URL` automáticamente. El botón **editor** solicita `EDITOR_PASSWORD` y las altas, modificaciones, eliminaciones y reordenamientos se guardan en la base PostgreSQL elegida por el propietario.

El esquema se encuentra en [`database/schema.sql`](database/schema.sql) y la guía específica en [`database/README.md`](database/README.md).

## Configurar la Demostración Pública

Para publicar la demostración desde GitHub con Vercel:

1. Importa este repositorio en un proyecto de Vercel.
2. Añade las siguientes variables al entorno que vayas a desplegar:

   ```env
   MISETUP_MODE=preview
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
   ```

3. No configures `DATABASE_URL` ni `EDITOR_PASSWORD` en el proyecto de demostración.
4. Despliega el proyecto.

Vercel compila el mismo código disponible para los clones, pero `MISETUP_MODE=preview` selecciona el escenario de [`src/lib/previewData.js`](src/lib/previewData.js). Las ediciones se realizan en el navegador y se descartan al recargar o reiniciar el escenario.

Un fork o clon no hereda estas variables de Vercel. Sin configuración adicional, su inventario y timeline estarán vacíos; si su propietario configura una conexión PostgreSQL, la aplicación utilizará exclusivamente esa base.

## Arquitectura

```text
Next.js App Router
├── src/app
│   ├── page.jsx             Selección de la fuente de datos
│   ├── layout.jsx           Layout y metadatos
│   └── globals.css          Estilos y tokens visuales
├── src/components
│   ├── layout               Navegación principal
│   └── ui                   Inventario, editor, resumen y planner
├── src/lib
│   ├── actions.js           Autenticación, consultas y operaciones persistentes
│   ├── emptyData.js         Estado inicial de un clon sin base de datos
│   ├── previewData.js       Escenario de demostración
│   ├── setupData.js         Normalización y exportación
│   └── seo.js               Configuración SEO
└── database
    ├── schema.sql           Esquema PostgreSQL
    └── setup.mjs            Inicialización de la base
```

El dashboard se ejecuta como componente de cliente. Las credenciales, la autenticación y todas las consultas PostgreSQL permanecen en código exclusivo del servidor.

## Scripts

| Comando            | Descripción                                          |
| :----------------- | :--------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo.                    |
| `npm run build`    | Genera la compilación de producción.                 |
| `npm run start`    | Sirve la compilación de producción.                  |
| `npm run lint`     | Ejecuta ESLint.                                      |
| `npm run db:setup` | Inicializa una base PostgreSQL a partir del esquema. |

## Seguridad

- No expongas `DATABASE_URL` ni `EDITOR_PASSWORD` mediante variables `NEXT_PUBLIC_*`.
- Utiliza credenciales distintas para desarrollo y producción.
- Ejecuta PostgreSQL con un usuario limitado a la base de esta aplicación.
- Mantén `.env.local` y las credenciales reales fuera del repositorio.
- Define una contraseña de editor larga y única.

## Licencia

Este proyecto se distribuye bajo la [licencia MIT](LICENSE).
