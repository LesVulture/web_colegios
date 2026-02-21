# Stack Research

**Domain:** Sales enablement product catalog (herramienta interna de ventas, catálogo textil/uniformes)
**Researched:** 2026-02-21
**Confidence:** HIGH

## Decisión Arquitectónica Clave: Deploy Strategy

**Recomendación: Deploy en Vercel (sin `output: 'export'`)**

| Factor | `output: 'export'` (SSG puro) | Deploy Vercel (estándar) |
|--------|-------------------------------|--------------------------|
| Image Optimization | NO funciona con loader default; requiere custom loader o `next-image-export-optimizer` | Funciona automáticamente con `next/image` + CDN de Vercel |
| Dynamic Routes | Requiere `generateStaticParams()` obligatorio | Soporta todas las variantes |
| Offline capability | Archivos estáticos, servible desde cualquier servidor | Requiere conexión a Vercel CDN |
| Complejidad | Mayor: custom loaders, post-processing de imágenes | Menor: funciona out-of-the-box |
| Costo | Hosting gratis en cualquier servidor | Gratis en Hobby plan de Vercel (suficiente para herramienta interna) |

**Justificación:** El proyecto se despliega en Vercel (constraint del PROJECT.md). Usar el deploy estándar nos da image optimization automática via CDN, zero-config para `next/image`, y todas las features del App Router sin limitaciones. El contenido es estático por naturaleza (catálogo fijo extraído de PDF), así que todas las páginas se pre-renderizan en build time de forma natural sin necesidad de `output: 'export'`.

**Nota sobre offline:** Si en el futuro se necesita funcionalidad offline para vendedores sin internet en reuniones, se puede agregar un Service Worker con `next-pwa` sin cambiar la arquitectura base. No se recomienda `output: 'export'` solo para esto.

**Confianza:** HIGH — Verificado con documentación oficial de Next.js (v16.1.6) y Vercel Image Optimization docs.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Next.js | 16.x (actual: 16.1.6) | Framework fullstack, App Router, SSR/SSG | Framework de referencia para React en producción. App Router estable con React Server Components. Turbopack como bundler default = builds 2-5x más rápidos. Constraint del proyecto. | HIGH |
| React | 19.2.x (via Next.js 16) | UI library | Incluido con Next.js 16. Server Components reduce JS enviado al cliente. No instalar por separado. | HIGH |
| TypeScript | >=5.1 (usar 5.7.x) | Type safety | Next.js 16 requiere TS >=5.1. Usar 5.7.x por estabilidad comprobada. `next.config.ts` nativo sin flags experimentales. | HIGH |
| Tailwind CSS | 4.2.0 | Utility-first CSS framework | Reescritura ground-up: builds 5x más rápidos, incrementales 100x más rápidos. CSS-first config con `@theme` en vez de JS config. Cascade layers, `@property`, `color-mix()`. Constraint del proyecto. | HIGH |
| Bun | >=1.1 (última estable) | Package manager y runtime | 3-5x más rápido que npm para installs. Constraint del proyecto. NOTA: usar Bun solo como package manager (`bun install`, `bun run`). Para `next dev`/`next build`, dejar que use Node.js internamente — hay incompatibilidades conocidas con `bun --bun next dev` en Next.js 16. | MEDIUM |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| clsx | ^2.1 | Conditional CSS class names | Siempre. Combinar clases Tailwind condicionalmente en componentes. Ligero (~228B). | HIGH |
| tailwind-merge | ^3.0 | Merge conflicting Tailwind classes | Siempre. Resolver conflictos cuando se pasan clases por props. Crear utility `cn()` = `twMerge(clsx(...inputs))`. | HIGH |
| Zod | 4.x (actual: 4.3.6) | Schema validation + TypeScript inference | Para validar datos del catálogo en build time. 14x más rápido que Zod 3. `@zod/mini` (~1.9KB gzip) disponible si bundle size importa. | HIGH |
| lucide-react | ^0.575 | Iconos SVG | Para iconos UI (navegación, flechas, etc.). Tree-shakable, >1500 iconos, 24x24 grid consistente. NO usar para logos de tecnologías Lafayette (esos son assets PNG propios). | HIGH |
| sharp | ^0.33 | Image processing | Dependencia de producción para Next.js image optimization en Vercel. Instalar explícitamente para builds más eficientes. | HIGH |
| framer-motion | ^12.34 (ahora "Motion") | Animaciones | OPCIONAL. Solo si se necesitan transiciones entre páginas o animaciones de entrada para fichas de producto. No incluir en MVP — agregar después si el vendedor lo pide. | LOW |

### Development Tools

| Tool | Purpose | Notes | Confidence |
|------|---------|-------|------------|
| ESLint 9.x + eslint-config-next | Linting | Next.js 16 incluye config ESLint preconfigurado. Usar flat config (ESLint 9). `bun run lint`. | HIGH |
| Prettier | Code formatting | Configurar con `prettier-plugin-tailwindcss` para auto-sort de clases Tailwind. | HIGH |
| prettier-plugin-tailwindcss | Tailwind class sorting | Plugin oficial de Tailwind Labs. Ordena clases automáticamente en JSX. | HIGH |
| @tailwindcss/postcss | PostCSS plugin para Tailwind v4 | En Tailwind v4, el plugin PostCSS cambió de `tailwindcss` a `@tailwindcss/postcss`. Necesario para Next.js. | HIGH |

---

## TypeScript Data Modeling para Catálogo de Productos

### Modelo de Datos Recomendado

El catálogo tiene una estructura clara y finita (8 categorías, ~40 telas, 12 tecnologías, 4 opciones de personalización). **Toda la data es estática y conocida en build time.**

**Patrón recomendado:** TypeScript types + objetos constantes con `as const` + validación Zod en build.

```typescript
// types/catalog.ts

/** Tecnología textil con su logo */
export interface Technology {
  id: string;
  name: string;
  description: string;
  iconPath: string; // ruta a asset en /public/assets/
}

/** Ficha técnica de una tela */
export interface Fabric {
  id: string;
  name: string;
  description: string;
  composition?: string;
  weight?: string;
  width?: string;
  technologies: string[]; // IDs de Technology
  imagePath: string; // foto extraída del PDF
}

/** Categoría de uso (las 8 principales) */
export interface Category {
  id: string;
  name: string;
  slug: string; // para URL: /categorias/[slug]
  color: string; // hex del PDF
  description: string;
  heroImagePath: string;
  fabrics: Fabric[];
}

/** Opción de personalización */
export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  imagePath: string;
}

/** Catálogo completo */
export interface Catalog {
  categories: Category[];
  technologies: Technology[];
  customization: CustomizationOption[];
}
```

**Por qué este patrón y no un CMS:**
- El contenido viene de un PDF fijo, no cambia dinámicamente
- Son ~40 productos, no miles — no necesita base de datos
- Los vendedores no editan contenido (solo lo presentan)
- TypeScript nos da autocomplete y type checking gratis
- Zod valida en build time que no falten campos

**Anti-patrón:** NO usar un CMS headless (Sanity, Contentful, etc.) para esto. Agregar un CMS para contenido estático de un PDF es over-engineering que añade dependencia externa, latencia, y complejidad sin beneficio. Si en el futuro Lafayette quiere que vendedores editen catálogos, se evalúa entonces.

### Estructura de Datos en Archivos

```
src/
  data/
    catalog.ts        # Export del catálogo completo (typed)
    categories.ts     # Definición de las 8 categorías
    fabrics.ts        # Todas las telas con sus fichas
    technologies.ts   # Las 12 tecnologías
    customization.ts  # Opciones de personalización
    collars.ts        # Info de cuellos
    schemas.ts        # Zod schemas para validación build-time
```

**Confianza:** HIGH — Patrón estándar para catálogos estáticos con TypeScript. Verificado contra documentación de commercetools y patrones de product catalog modeling.

---

## Image Strategy para Catálogo de Productos

### Fuente de Imágenes

Las imágenes se extraen del PDF (37MB, 24 páginas). NO hay originales en alta resolución.

**Pipeline recomendado:**
1. Extraer imágenes del PDF con herramienta externa (fuera de scope del stack web)
2. Guardar en `/public/images/` organizadas por categoría
3. Optimizar vía `next/image` + Vercel Image Optimization automático

### Configuración next/image

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [768, 1024, 1280, 1536, 1920],  // tablet + desktop only
    imageSizes: [128, 256, 384, 512],
    localPatterns: [
      { pathname: '/images/**', search: '' },
      { pathname: '/assets/**', search: '' },
    ],
  },
};
```

**Por qué esta config:**
- `formats: ['image/avif', 'image/webp']` — AVIF primero (mejor compresión), WebP como fallback. Next.js sirve el formato que el browser soporta.
- `deviceSizes` — Solo tablet (768) y desktop (1024-1920). No celular = no generamos tamaños pequeños innecesarios.
- `localPatterns` — Todas las imágenes son locales (del PDF). No hay remotePatterns.

### Uso en Componentes

```tsx
// Producto con imagen
<Image
  src="/images/categorias/sudaderas/vendaval-crushed.jpg"
  alt="Tela Vendaval Crushed R"
  width={600}
  height={400}
  sizes="(max-width: 1024px) 50vw, 33vw"
  className="rounded-lg object-cover"
/>

// Hero image con priority
<Image
  src="/images/categorias/sudaderas/hero.jpg"
  alt="Sudaderas, Chaquetas y Pantalones"
  fill
  priority
  sizes="100vw"
  className="object-cover"
/>
```

**Confianza:** HIGH — Documentación oficial Next.js 16.1.6 + Vercel Image Optimization docs verificados.

---

## Folder Structure

```
web_colegios/
├── public/
│   ├── images/           # Fotos extraídas del PDF
│   │   ├── categorias/   # Por categoría
│   │   ├── tecnologias/  # Fotos de sección tecnologías
│   │   └── personalizacion/
│   └── assets/           # Logos Lafayette, tecnologías (PNGs existentes)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout: header global, fonts
│   │   ├── page.tsx             # Home: hero + grid de 8 categorías
│   │   ├── categorias/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Página de categoría con fichas de telas
│   │   ├── tecnologias/
│   │   │   └── page.tsx         # 12 tecnologías textiles
│   │   ├── personalizacion/
│   │   │   └── page.tsx         # 4 opciones de personalización
│   │   └── cuellos/
│   │       └── page.tsx         # Colores, tallas, info comercial
│   ├── components/
│   │   ├── ui/                  # Componentes genéricos (Button, Card, etc.)
│   │   ├── layout/              # Header, Footer, Navigation
│   │   └── catalog/             # FabricCard, CategoryGrid, TechBadge, etc.
│   ├── data/                    # Catálogo typed (ver sección Data Modeling)
│   ├── lib/
│   │   └── utils.ts             # cn() utility, helpers
│   └── styles/
│       └── globals.css          # Tailwind v4 import + @theme customization
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts           # NOTA: Tailwind v4 usa CSS-first config, pero Next.js aún necesita este archivo para el plugin
├── tsconfig.json
└── package.json
```

**Confianza:** HIGH — Estructura alineada con recomendaciones oficiales Next.js 16 y patrones de la comunidad 2025.

---

## Installation

```bash
# Crear proyecto (si no existe)
bunx create-next-app@latest web_colegios --typescript --tailwind --eslint --app --src-dir --use-bun

# Core dependencies
bun add sharp

# UI utilities
bun add clsx tailwind-merge lucide-react

# Validation
bun add zod

# Dev dependencies
bun add -D prettier prettier-plugin-tailwindcss @types/node
```

### Tailwind CSS v4 Setup

En Tailwind v4, la configuración migra de `tailwind.config.js` a CSS-first:

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Colores del catálogo Lafayette */
  --color-lafayette-blue: #1B3A5C;
  --color-lafayette-red: #C42034;
  --color-cat-sudaderas: #1B3A5C;
  --color-cat-camisetas: #3FA9D5;
  --color-cat-deportivo: #6CB33F;
  --color-cat-diario: #E91E8C;
  --color-cat-buzos: #F7C948;
  --color-cat-prom: #C42034;
  --color-cat-blusas: #7B4B94;
  --color-cat-delantales: #F7941D;

  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Spacing overrides si necesario */
}
```

**Confianza:** HIGH — Verificado con documentación oficial Tailwind CSS v4.0 y guía de migración v4.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative | Why Not Here |
|-------------|-------------|-------------------------|--------------|
| Next.js 16 (App Router) | Astro 5.x | Sitios 100% estáticos sin interactividad JS | Lafayette necesita navegación fluida tipo SPA entre categorías. Next.js da client-side navigation con prefetching automático. Astro requeriría islands manuales para interactividad. |
| Next.js 16 (App Router) | Next.js Pages Router | Proyectos legacy que ya usan Pages Router | Proyecto greenfield. App Router es el futuro: Server Components, layouts anidados, streaming. Pages Router está en mantenimiento. |
| Tailwind CSS v4 | CSS Modules | Proyectos con CSS custom complejo o equipos que prefieren CSS tradicional | Tailwind es más rápido para prototipar y mantener. CSS-first config de v4 elimina el overhead de JS config. Proyecto necesita diseño "moderno 2025" — Tailwind lo facilita con utilidades. |
| TypeScript estático | CMS Headless (Sanity, Contentful) | Catálogos con edición frecuente por no-developers | Contenido fijo del PDF. Un CMS agrega complejidad, costo, y dependencia externa sin beneficio. Los vendedores no editan. |
| Vercel deploy | `output: 'export'` (static) | Hosting en servidor propio sin Node.js | Vercel es el target (constraint). Deploy estándar da image optimization, edge caching, y zero-config. Static export pierde image optimization nativa. |
| Bun (package manager) | pnpm | Máxima compatibilidad y disk efficiency | Bun es constraint del proyecto. pnpm es excelente alternativa si Bun da problemas de compatibilidad. |
| Zod 4 | TypeScript types solos (sin runtime validation) | Tipos simples sin datos externos | Zod valida en build time que el catálogo esté completo. Previene errores de datos faltantes. Costo: ~2KB (con @zod/mini). |
| lucide-react | Heroicons, Phosphor | Preferencia estética o iconos específicos no disponibles en Lucide | Lucide tiene >1500 iconos, tree-shakable, mantenido activamente. Estándar de facto con Tailwind/Next.js. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `output: 'export'` en next.config | Pierde image optimization nativa de Vercel. Requiere custom loaders o post-processing con `next-image-export-optimizer`. Mayor complejidad sin beneficio (ya desplegamos en Vercel). | Deploy estándar en Vercel. Las páginas se pre-renderizan automáticamente si no usan APIs dinámicas. |
| Tailwind CSS v3 | Deprecated para proyectos nuevos. Requiere JS config, purge manual, PostCSS plugin viejo. v4 es 5x más rápido en builds. | Tailwind CSS v4.2.0 con CSS-first `@theme` config. |
| CSS-in-JS (styled-components, Emotion) | Incompatible con React Server Components (requiere client runtime). Performance overhead en SSR. Tailwind v4 resuelve los mismos problemas sin JS runtime. | Tailwind CSS v4 utilities. |
| `tailwindcss` PostCSS plugin | Cambiado en Tailwind v4. El plugin ahora es `@tailwindcss/postcss`. El viejo nombre no funciona. | `@tailwindcss/postcss` en postcss.config.mjs. |
| `@tailwind base/components/utilities` directivas | Eliminadas en Tailwind v4. Replaced by `@import "tailwindcss"`. | `@import "tailwindcss"` en globals.css. |
| React Context para estado global | Overkill para un catálogo read-only sin estado dinámico del usuario. | Props drilling o Server Components que pasan datos directamente. Para catálogo estático, no se necesita state management. |
| Redux, Zustand, Jotai | State management libraries innecesarias. El catálogo no tiene estado mutable del lado del cliente. | Datos estáticos en `src/data/` importados directamente. |
| next-pwa (por ahora) | Agrega complejidad de Service Worker. Solo necesario si vendedores trabajan sin internet. No validado como requisito. | Agregar después si se valida la necesidad de offline. |
| Headless CMS (Sanity, Contentful, Strapi) | Over-engineering para contenido estático extraído de un PDF. Agrega: costo mensual, dependencia de terceros, latencia de API, complejidad de deployment, CMS que nadie editará. | Archivos TypeScript en `src/data/`. |
| Sass/SCSS | Innecesario con Tailwind v4. Agrega paso de compilación extra. Tailwind v4 usa CSS moderno nativo (`@property`, `color-mix()`, cascade layers). | Tailwind CSS v4 con CSS puro. |
| Pages Router | Legacy. En mantenimiento, no recibe features nuevas. Proyecto greenfield debe usar App Router. | App Router con `src/app/`. |
| `getStaticProps` / `getServerSideProps` | APIs del Pages Router. No existen en App Router. | Server Components + `generateStaticParams()` para rutas dinámicas. `fetch()` en Server Components. |

---

## Version Compatibility Matrix

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| next | 16.x | React 19.2.x, TypeScript >=5.1 | React viene bundled con Next.js. No instalar react/react-dom por separado. |
| tailwindcss | 4.2.0 | @tailwindcss/postcss 4.2.0, Next.js 16.x | Versiones de tailwindcss y @tailwindcss/postcss deben coincidir. |
| @tailwindcss/postcss | 4.2.0 | postcss 8.x | Reemplaza al plugin `tailwindcss` de v3. |
| zod | 4.3.x | TypeScript >=5.0 | Breaking changes vs Zod 3. No mezclar. Si usas @zod/mini, importar de ahí exclusivamente. |
| sharp | 0.33.x | Node.js >=18.17 | Necesario para Vercel image optimization. Binary nativo — puede tomar más en install. |
| lucide-react | 0.575.x | React >=18 | Tree-shakable. Solo pesa lo que importas. |
| framer-motion | 12.x | React >=18 | OPCIONAL. Ahora se llama "Motion" pero el package npm sigue siendo `framer-motion`. |
| clsx | 2.x | Sin dependencias | ~228 bytes. |
| tailwind-merge | 3.x | Tailwind CSS v4 compatible | Verificar que la versión soporta clases de Tailwind v4. |
| prettier-plugin-tailwindcss | >=0.6 | Tailwind CSS v4, Prettier >=3 | Plugin oficial de Tailwind Labs. |
| bun | >=1.1 | Next.js 16 (como package manager) | Usar `bun install`, `bun run dev`. NO usar `bun --bun next dev` — incompatibilidades conocidas con Next.js 16 NAPI. |

---

## Stack Patterns by Variant

**Si se necesita funcionalidad offline para vendedores sin internet:**
- Agregar `next-pwa` o `@ducanh2912/next-pwa` para Service Worker
- Configurar precaching de todas las rutas y assets
- NO cambiar a `output: 'export'` — el Service Worker captura los archivos servidos por Vercel
- Confidence: MEDIUM — no es requisito actual, investigar cuando sea necesario

**Si las imágenes extraídas del PDF son de baja calidad:**
- Considerar upscaling con sharp en un script de build previo
- Usar `quality` prop en `next/image` para balancear tamaño vs claridad
- AVIF format comprime mejor que WebP manteniendo calidad visual
- Confidence: HIGH — sharp y next/image bien documentados

**Si Lafayette quiere que vendedores editen el catálogo en el futuro:**
- Migrar `src/data/` a un CMS headless (Sanity recomendado por DX)
- Zod schemas se mantienen, solo cambia la fuente de datos
- La arquitectura de componentes no cambia
- Confidence: HIGH — patrón bien establecido

---

## Sources

- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16) — Features de Next.js 16, Turbopack stable, React 19.2 (HIGH)
- [Next.js Static Exports Docs (v16.1.6)](https://nextjs.org/docs/app/guides/static-exports) — Limitaciones de output: export, features soportadas y no soportadas (HIGH)
- [Next.js Image Component Docs](https://nextjs.org/docs/app/api-reference/components/image) — API de next/image, props, configuración (HIGH)
- [Vercel Image Optimization Docs](https://vercel.com/docs/image-optimization) — Cómo funciona image optimization en Vercel, caching, pricing (HIGH)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) — Breaking changes, CSS-first config, performance improvements (HIGH)
- [Tailwind CSS v4.1 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4-1) — Features adicionales de v4.1 (HIGH)
- [Tailwind CSS GitHub Releases](https://github.com/tailwindlabs/tailwindcss/releases) — v4.2.0 released 2026-02-18 (HIGH)
- [Zod v4 Release Notes](https://zod.dev/v4) — Breaking changes vs v3, performance improvements, @zod/mini (HIGH)
- [Bun + Next.js Guide](https://bun.com/docs/guides/ecosystem/nextjs) — Compatibilidad, limitaciones, `--bun` flag (MEDIUM)
- [Next.js + Bun Issues (GitHub)](https://github.com/oven-sh/bun/issues/24829) — Next.js 16 build crash con Bun NAPI (MEDIUM)
- [next-image-export-optimizer npm](https://www.npmjs.com/package/next-image-export-optimizer) — v1.20.1, para static exports (no lo usamos pero documentado como alternativa) (MEDIUM)
- [Next.js generateStaticParams Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — SSG para rutas dinámicas en App Router (HIGH)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) — Design tokens, patterns (MEDIUM)

---
*Stack research for: Lafayette Uni For Me Colegios — Web Comercial*
*Researched: 2026-02-21*
