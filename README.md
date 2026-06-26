# 🚀 MiSetup - Panel de Inventario Personal

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> **Un dashboard dinámico y minimalista para la gestión de equipamiento, optimizado para ofrecer la mejor experiencia visual y organizativa.**

---

## ▶️ Live Preview

**🔗 [Visitar Sitio Web](https://misetup.melitacruces.com/demo)**

---

## 📋 Tabla de Contenidos

- [🔍 ¿Qué es este proyecto?](#-qué-es-este-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [🎨 Estilo y Diseño](#-estilo-y-diseño)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Requisitos e Instalación](#-requisitos-e-instalación)
- [📦 Scripts y Comandos](#-scripts-y-comandos)
- [🌐 Despliegue](#-despliegue)
- [📧 Contacto](#-contacto)

---

## 🔍 ¿Qué es este proyecto?

Este proyecto es una plataforma web moderna construida con Next.js que funciona como un gestor de espacios (setup) o dashboard de equipamiento. Permite a los usuarios organizar, visualizar y gestionar diferentes secciones y artículos de forma estructurada e interactiva.

El objetivo principal es ofrecer una interfaz de usuario altamente pulida, rápida y fácil de usar, donde la gestión del contenido sea intuitiva. Está enfocado en proporcionar una experiencia fluida tanto para la visualización pública como para la administración de los elementos del setup.

---

## ✨ Características Principales

- **Gestión Dinámica de Secciones:** Creación y organización de secciones personalizadas para categorizar el equipamiento.
- **Interfaz Moderna y Responsiva:** Diseño minimalista con un modo oscuro nativo, animaciones sutiles y soporte total para dispositivos móviles.
- **Base de Datos Integrada:** Persistencia de datos eficiente utilizando PostgreSQL (Vercel Postgres) para asegurar la integridad y rapidez en consultas.
- **Arquitectura Optimizada:** Construido sobre Next.js para aprovechar Server Components, Server Actions y un rendimiento excepcional.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)

- **Core:** Next.js 16, React 19, HTML5.
- **Estilos:** Tailwind CSS v4.
- **Otras librerías:** Lucide React (Iconos).

### Backend & Base de Datos

- **Lógica del Servidor:** Next.js (Server Actions).
- **Base de Datos:** PostgreSQL (Vercel Postgres).

---

## 🎨 Estilo y Diseño

El diseño está fuertemente inspirado en interfaces minimalistas modernas, enfocado a desarrolladores y entusiastas del hardware. Destaca un _dark mode_ nativo por defecto que reduce la fatiga visual, bordes sutiles y un esquema de colores monocromático acentuado por un color de marca vibrante (púrpura) para resaltar las interacciones principales y el estado de focus.

### Paleta de Colores

| Color          | Hexadecimal | Uso principal                                 |
| :------------- | :---------- | :-------------------------------------------- |
| **Primario**   | `#9D00FF`   | Acentos principales, estados activos y focus. |
| **Fondo Base** | `#0a0a0a`   | Fondo principal de la aplicación (Dark Mode). |
| **Superficie** | `#0b0b0b`   | Tarjetas, modales y paneles elevados.         |
| **Texto Base** | `#ededed`   | Texto principal de párrafos y títulos.        |

### Tipografía

- **Títulos:** Geist Sans.
- **Cuerpo de texto:** Geist Sans / Arial.

---

## 📁 Estructura del Proyecto

```text
📂 misetup
 ┣ 📂 public          # Archivos estáticos.
 ┣ 📂 src             # Código fuente principal.
 ┃ ┣ 📂 app           # Rutas y layouts principales de Next.js.
 ┃ ┣ 📂 components    # Componentes reutilizables UI (Dashboard, Layout, etc).
 ┃ ┗ 📂 lib           # Server actions, conexión a base de datos y utilidades.
 ┣ 📜 sections_schema.sql # Esquema de la base de datos PostgreSQL.
 ┣ 📜 globals.css     # Estilos globales y paleta de colores inline.
 ┗ 📜 package.json    # Configuración de dependencias y scripts.
```

---

## 🚀 Requisitos e Instalación

Para ejecutar este proyecto de forma local, necesitarás tener instalado:

- Node.js (v18 o superior).
- npm o pnpm.
- Una base de datos PostgreSQL (o las variables de entorno de Vercel Postgres).

1. Clona el repositorio:
   ```bash
   git clone https://github.com/melitacruces/setup.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno en un archivo `.env.local` basado en tu base de datos.
4. Ejecuta el esquema de la base de datos `sections_schema.sql` en tu entorno PostgreSQL.

---

## 📦 Scripts y Comandos

| Comando         | Descripción                                    |
| :-------------- | :--------------------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo en localhost. |
| `npm run build` | Construye la aplicación optimizada para prod.  |
| `npm run start` | Inicia el servidor en modo producción.         |
| `npm run lint`  | Ejecuta ESLint para analizar el código.        |

---

## 🌐 Despliegue

Dado que se trata de una aplicación web construida con Next.js, el despliegue es sumamente sencillo. Se puede alojar de manera rápida y sin complicaciones en múltiples plataformas modernas:

1. **Vercel (Recomendado):** Simplemente conecta el repositorio de GitHub y Vercel configurará automáticamente el entorno y tu base de datos Vercel Postgres de forma nativa.
2. **Netlify / Railway:** Conectando el repositorio de GitHub y configurando las variables de entorno.
3. **Servidor Propio (VPS):** Configurando un proceso y ejecutando `npm run build` seguido de `npm run start`.

---

## 📧 Contacto

Si tienes alguna pregunta o deseas colaborar en algún proyecto, no dudes en ponerte en contacto:

- **Nombre:** Luis Andrés Melita Cruces
- **Email:** melitacruces@gmail.com
- **LinkedIn:** [linkedin.com/in/melitacruces](https://linkedin.com/in/melitacruces)
- **GitHub:** [github.com/melitacruces](https://github.com/melitacruces)
- **Ubicación:** Concepción, Chile
