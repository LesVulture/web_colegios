# Architecture Research

**Domain:** Sales enablement web catalog (Next.js App Router static site)
**Researched:** 2026-02-21
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Presentation Layer                            │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Layouts   │  │ Pages     │  │ UI Components│  │ Design System│  │
│  │ (shared   │  │ (route    │  │ (cards,grids │  │ (tokens,     │  │
│  │  nav/hdr) │  │  segments)│  │  detail view)│  │  primitives) │  │
│  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
│        │              │               │                 │          │
├────────┴──────────────┴───────────────┴─────────────────┴──────────┤
│                        Data Layer                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Content Module   │  │ Category Config  │  │ Technology Data  │  │
│  │ (TS data files)  │  │ (colors, slugs,  │  │ (tech specs,     │  │
│  │                  │  │  metadata)       │  │  icons mapping)  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                       Asset Layer                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Product Images   │  │ Technology Logos  │  │ Brand Assets     │  │
│  │ (extracted from  │  │ (from Assets/)   │  │ (Lafayette logo) │  │
│  │  PDF → /public)  │  │                  │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Root Layout | `<html>`, `<body>`, global font, metadata, wraps all pages | `app/layout.tsx` — Server Component, imports global CSS |
| Global Header | Logo Lafayette top-left, navigation links to 8 categories + secciones | `components/header.tsx` — Client Component (interactive nav) |
| Category Layout | Category-specific color theming via CSS variable override, optional sub-nav | `app/categoria/[slug]/layout.tsx` — Server Component |
| Home Page | Hero de marca, grid de 8 categorias con cards visuales | `app/page.tsx` — Server Component |
| Category Page | Grid de fichas tecnicas de telas de esa categoria | `app/categoria/[slug]/page.tsx` — Server Component |
| Product Card | Imagen de tela, nombre, specs clave, tags de tecnologias | `components/product-card.tsx` — Server Component |
| Technology Section | Grid de 12 tecnologias con iconos y descripciones | `app/tecnologias/page.tsx` — Server Component |
| Personalization Section | 4 opciones de personalizacion con fotos | `app/personalizacion/page.tsx` — Server Component |
| Collars Section | Colores, tallas, info comercial de cuellos | `app/cuellos/page.tsx` — Server Component |
| Content Module | Centraliza todos los datos del catalogo en TypeScript tipado | `lib/content/` — Pure TypeScript data + getter functions |
| Design System | Tokens Tailwind v4, colores por categoria, tipografia, spacing | `app/globals.css` con `@theme` + component primitives |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── layout.tsx                # Root layout (html/body, header, fonts)
│   ├── page.tsx                  # Home — hero + category grid
│   ├── globals.css               # Tailwind imports + @theme tokens
│   ├── categoria/
│   │   └── [slug]/
│   │       ├── layout.tsx        # Category layout (color theme override)
│   │       └── page.tsx          # Category detail — fabric grid
│   ├── tecnologias/
│   │   └── page.tsx              # Textile technologies page
│   ├── personalizacion/
│   │   └── page.tsx              # Customization options page
│   └── cuellos/
│       └── page.tsx              # Collars page
├── components/                   # Shared UI components
│   ├── header.tsx                # Global header with nav
│   ├── category-card.tsx         # Card for home grid (links to category)
│   ├── product-card.tsx          # Fabric product card
│   ├── product-grid.tsx          # Responsive grid container for product cards
│   ├── technology-badge.tsx      # Small icon+label for technology tags
│   ├── technology-card.tsx       # Full technology card for /tecnologias
│   ├── section-header.tsx        # Reusable section title + description
│   └── footer.tsx                # Optional footer
├── lib/                          # Data layer and utilities
│   ├── content/
│   │   ├── categories.ts         # Category definitions (slug, name, color, desc)
│   │   ├── fabrics.ts            # All fabric data (per-category, specs, techs)
│   │   ├── technologies.ts       # 12+ technology definitions
│   │   ├── customization.ts      # 4 personalization options
│   │   ├── collars.ts            # Collar data (colors, sizes)
│   │   └── types.ts              # Shared TypeScript interfaces
│   └── utils.ts                  # Helper functions (slug generation, etc.)
└── public/                       # Static assets served at /
    ├── images/
    │   ├── categories/           # Hero/banner images per category
    │   ├── fabrics/              # Individual fabric product photos
    │   ├── technologies/         # Technology icons (from Assets/)
    │   ├── customization/        # Personalization photos
    │   └── collars/              # Collar product photos
    └── logo-lafayette.png        # Brand logo
```

### Structure Rationale

- **`app/`:** Minimal route files. Cada archivo page/layout es delgado — importa componentes y datos, no implementa logica de negocio. Las rutas reflejan la navegacion del vendedor: home, categoria, tecnologias, personalizacion, cuellos.
- **`components/`:** Flat folder (no subdirs innecesarios para ~10 componentes). Componentes reutilizables que se comparten entre rutas. Todos Server Components por defecto excepto header (necesita interactividad para nav mobile/tablet).
- **`lib/content/`:** Capa de datos completamente separada de la UI. TypeScript puro con tipado fuerte. Sin database, sin API — los datos son constantes importables. Un archivo por dominio para mantener archivos manejables.
- **`public/images/`:** Organizado por dominio de contenido. Las imagenes se extraen del PDF una vez (script de build) y se colocan aqui. `next/image` las sirve optimizadas automaticamente.

## Architectural Patterns

### Pattern 1: TypeScript Content Files as Data Layer

**What:** Definir todo el contenido del catalogo como objetos TypeScript tipados en `lib/content/`, exportando constantes y funciones getter. No usar JSON, no usar MDX, no usar CMS.
**When to use:** Contenido estatico conocido al 100% en build time, sin editors no-tecnicos, sin contenido dinamico.
**Trade-offs:**
- PRO: Type safety completo, autocompletion en IDE, refactoring seguro, zero runtime overhead, import directo sin parsing
- PRO: No necesita librerias adicionales (MDX, Contentlayer, etc.)
- PRO: Validacion en compile time — si un campo falta, TypeScript lo detecta
- CON: Editar contenido requiere tocar TypeScript (aceptable porque el equipo es tecnico)
- CON: No tiene preview de markdown (no relevante — este contenido son specs tecnicas, no prosa)

**Por que NO usar JSON:** JSON no tiene type safety sin schema adicional, no permite constantes computadas, no permite comments.
**Por que NO usar MDX:** El contenido son fichas tecnicas estructuradas (nombre, composicion, peso, ancho, tecnologias), no texto largo con formato. MDX agrega complejidad innecesaria.

**Example:**

```typescript
// lib/content/types.ts
export interface Category {
  slug: string;
  name: string;
  color: string;       // hex color token
  description: string;
  heroImage: string;   // path in /public/images/categories/
}

export interface Fabric {
  slug: string;
  name: string;
  categorySlug: string;
  image: string;
  composition: string;
  weight: string;
  width: string;
  technologies: string[];  // slugs referencing Technology
  features: string[];
}

export interface Technology {
  slug: string;
  name: string;
  icon: string;       // path to logo in /public/images/technologies/
  description: string;
}
```

```typescript
// lib/content/categories.ts
import type { Category } from './types';

export const categories: Category[] = [
  {
    slug: 'sudaderas-chaquetas-pantalones',
    name: 'Sudaderas - Chaquetas - Pantalones',
    color: '#1B3A5C',
    description: 'Telas para prendas exteriores...',
    heroImage: '/images/categories/sudaderas-chaquetas.webp',
  },
  // ... 7 mas
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map(c => c.slug);
}
```

```typescript
// lib/content/fabrics.ts
import type { Fabric } from './types';

export const fabrics: Fabric[] = [
  {
    slug: 'vendaval-crushed-r',
    name: 'Vendaval Crushed R',
    categorySlug: 'sudaderas-chaquetas-pantalones',
    image: '/images/fabrics/vendaval-crushed-r.webp',
    composition: '100% Poliéster',
    weight: '220 g/m²',
    width: '150 cm',
    technologies: ['resistencia', 'desempeno'],
    features: ['Textura crushed', 'Alta durabilidad'],
  },
  // ... todas las telas
];

export function getFabricsByCategory(categorySlug: string): Fabric[] {
  return fabrics.filter(f => f.categorySlug === categorySlug);
}
```

### Pattern 2: Static Generation with `generateStaticParams` + `dynamicParams = false`

**What:** Pre-renderizar TODAS las paginas de categoria en build time. Bloquear rutas no definidas con 404 automatico.
**When to use:** Cuando el catalogo es finito y conocido (8 categorias, ~40 telas). Cero contenido dinamico.
**Trade-offs:**
- PRO: Paginas instantaneas — HTML servido desde CDN sin server processing
- PRO: Deploy en Vercel como static export sin server functions
- PRO: Seguridad — no hay endpoints dinamicos que atacar
- CON: Rebuild necesario para cambiar contenido (aceptable — contenido cambia rara vez)

**Example:**

```typescript
// app/categoria/[slug]/page.tsx
import { getAllCategorySlugs, getCategoryBySlug } from '@/lib/content/categories';
import { getFabricsByCategory } from '@/lib/content/fabrics';
import { ProductGrid } from '@/components/product-grid';
import { notFound } from 'next/navigation';

// Pre-render all 8 categories at build time
export async function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }));
}

// 404 for any slug not in the list
export const dynamicParams = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const fabrics = getFabricsByCategory(slug);

  return (
    <div>
      <h1>{category.name}</h1>
      <ProductGrid fabrics={fabrics} />
    </div>
  );
}
```

### Pattern 3: Nested Layouts with Category Color Theming

**What:** Usar el sistema de layouts de Next.js App Router para inyectar CSS custom properties por categoria, permitiendo que todos los componentes hijos hereden el color de esa categoria sin props drilling.
**When to use:** Cuando multiples paginas comparten UI y theming contextual (header global + color de categoria).
**Trade-offs:**
- PRO: El color de la categoria se propaga automaticamente a todos los componentes dentro del layout
- PRO: Zero JavaScript — CSS variables funcionan sin hydration
- PRO: El header global persiste entre navegaciones (no se re-renderiza)
- CON: Un nivel adicional de nesting en la ruta

**Example:**

```typescript
// app/categoria/[slug]/layout.tsx
import { getCategoryBySlug } from '@/lib/content/categories';
import { notFound } from 'next/navigation';

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div
      style={{ '--category-color': category.color } as React.CSSProperties}
      className="min-h-screen"
    >
      {/* Optional: category sub-header or breadcrumb */}
      {children}
    </div>
  );
}
```

```css
/* In globals.css — utilities that respond to category color */
@layer utilities {
  .category-accent {
    color: var(--category-color);
  }
  .category-bg {
    background-color: var(--category-color);
  }
  .category-border {
    border-color: var(--category-color);
  }
}
```

### Pattern 4: Tailwind v4 @theme Design System with Category Color Tokens

**What:** Definir todos los colores de las 8 categorias como tokens en `@theme`, mas tokens semanticos para la marca Lafayette. Usar CSS-first config de Tailwind v4 (no `tailwind.config.js`).
**When to use:** Tailwind v4 en proyecto nuevo. Color palette conocida desde el PDF.
**Trade-offs:**
- PRO: Un solo archivo CSS define todo el design system
- PRO: Tokens disponibles como CSS variables Y como utility classes automaticamente
- PRO: Builds 5x mas rapidos que Tailwind v3
- CON: Tailwind v4 es relativamente nuevo (enero 2025), menor cantidad de tutoriales legacy

**Example:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand */
  --color-lafayette-dark: #1B3A5C;
  --color-lafayette-red: #C42034;
  --color-lafayette-white: #FFFFFF;

  /* Category colors — named by usage, not by color name */
  --color-cat-sudaderas: #1B3A5C;
  --color-cat-camisetas: #3FA9D5;
  --color-cat-deportivo: #6CB33F;
  --color-cat-diario: #E91E8C;
  --color-cat-buzos: #F7C948;
  --color-cat-prom: #C42034;
  --color-cat-blusas: #7B4B94;
  --color-cat-delantales: #F7941D;

  /* Semantic */
  --color-surface: #FFFFFF;
  --color-surface-alt: #F8FAFC;
  --color-text-primary: #1E293B;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;

  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Spacing overrides (if needed) */
  --radius-card: 12px;
  --radius-badge: 6px;
}
```

Genera automaticamente: `bg-cat-sudaderas`, `text-cat-camisetas`, `border-cat-deportivo`, etc.

## Data Flow

### Content Rendering Flow (Build Time)

```
TypeScript Content Files (lib/content/*.ts)
    │
    ├─→ generateStaticParams()    → Defines all valid routes
    │
    ├─→ Page Server Component     → Imports data, passes to UI components
    │       │
    │       ├─→ getCategoryBySlug()  → Returns typed Category object
    │       └─→ getFabricsByCategory() → Returns typed Fabric[] array
    │
    ├─→ Layout Server Component   → Sets --category-color CSS variable
    │
    └─→ UI Components (Server)    → Render HTML with Tailwind classes
            │
            └─→ next/image        → Optimizes images from /public at serve time
                    │
                    └─→ CDN (Vercel) → Serves optimized WebP/AVIF to client
```

### Image Pipeline Flow (One-time Pre-build)

```
PDF (Uniformes_Colegios.pdf, 37MB)
    │
    ├─→ pdfimages (poppler)        → Extracts embedded images losslessly
    │       │
    │       └─→ Raw images (JPEG/PNG) in temp directory
    │
    ├─→ sharp (Node.js script)     → Converts to WebP, resizes for web
    │       │
    │       ├─→ /public/images/categories/*.webp   (hero images)
    │       ├─→ /public/images/fabrics/*.webp       (product photos)
    │       └─→ /public/images/customization/*.webp (personalization photos)
    │
    └─→ Technology logos (Assets/) → Copied/optimized to /public/images/technologies/
```

### Navigation Flow (Runtime — Client)

```
User clicks category in Header
    │
    └─→ next/link prefetch    → Prefetches the static HTML/RSC payload
            │
            └─→ Client-side navigation (no full page reload)
                    │
                    ├─→ Root Layout persists (header stays, no re-render)
                    └─→ Category Layout + Page swap
                            │
                            └─→ --category-color CSS var updates
                                    │
                                    └─→ All category-themed elements
                                        update color instantly via CSS
```

### Key Data Flows

1. **Content → Page render:** TypeScript files are imported at build time by Server Components. No runtime fetching, no API calls, no database. Data flows unidirectionally from `lib/content/` → page component → child UI components via props.
2. **Category color theming:** The category layout reads the slug from route params, looks up the color from content data, injects it as a CSS custom property on a wrapper div. All descendants use `var(--category-color)` — no prop drilling needed.
3. **Image serving:** Static images in `/public` are referenced by path in content data. `next/image` adds optimization layer at serve time (resize, format conversion, CDN caching). No build-time image processing by Next.js — images are pre-processed by our extraction script.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (1-50 vendedores) | Full static site on Vercel free/pro tier. Zero server costs. All content in TypeScript files. Rebuild + deploy on content changes. |
| 50-500 users | Identical architecture. Static sites scale horizontally via CDN without changes. |
| Content growth (50+ telas) | Split `fabrics.ts` into per-category files (`fabrics-sudaderas.ts`, etc.) to keep files manageable. No architectural change. |
| CMS requirement (eventual) | Add headless CMS (Sanity/Contentful) as data source. Replace `lib/content/` imports with API calls in Server Components. `generateStaticParams` pulls slugs from CMS. Structure stays identical. |

### Scaling Priorities

1. **First bottleneck: Content maintenance.** Si Lafayette agrega muchas telas frecuentemente, editar TypeScript files se vuelve tedioso. Mitigacion: crear un script CLI que genere los objetos TypeScript desde un CSV/spreadsheet. Esto mantiene la arquitectura pero mejora el workflow.
2. **Second bottleneck: Image management.** Si hay muchas imagenes nuevas, el proceso manual de extraccion de PDF se vuelve lento. Mitigacion: script automatizado que recibe un PDF y extrae/optimiza/nombra imagenes automaticamente.

## Anti-Patterns

### Anti-Pattern 1: Usar API Routes para Contenido Estatico

**What people do:** Crear `app/api/categories/route.ts` y `app/api/fabrics/route.ts`, luego hacer `fetch()` desde los componentes.
**Why it's wrong:** Agrega latencia innecesaria (request HTTP a si mismo), complejidad (serialization/deserialization JSON), y impide que Next.js pre-renderice las paginas como estaticas. Las paginas se vuelven dinamicas sin razon.
**Do this instead:** Importar directamente los datos desde `lib/content/` en los Server Components. Es un import de modulo — zero overhead, full type safety.

### Anti-Pattern 2: Client Components para Todo

**What people do:** Poner `'use client'` en todos los componentes porque "es mas facil" o porque estan acostumbrados a React SPA.
**Why it's wrong:** Envia JavaScript innecesario al cliente, aumenta bundle size, pierde la ventaja de Server Components (zero JS, render en server). Para un catalogo informativo que no tiene interactividad compleja, casi todo puede ser Server Component.
**Do this instead:** Solo marcar como `'use client'` los componentes que realmente necesitan interactividad: el header (navigation toggle para tablet), y cualquier componente con hover animations complejas o estado local. Todo lo demas es Server Component por defecto.

### Anti-Pattern 3: Un Solo Archivo Monolitico de Contenido

**What people do:** Poner todas las categorias, telas, tecnologias y personalizacion en un solo archivo `data.ts` gigante.
**Why it's wrong:** El archivo se vuelve inmanejable rapido (el catalogo tiene ~40 telas x ~5 campos cada una + 8 categorias + 12 tecnologias). Merge conflicts, scroll infinito, dificil encontrar lo que buscas.
**Do this instead:** Un archivo por dominio de datos: `categories.ts`, `fabrics.ts`, `technologies.ts`, `customization.ts`, `collars.ts`. Importar selectivamente donde se necesite.

### Anti-Pattern 4: Replicar el Diseno del PDF en la Web

**What people do:** Intentar que la web sea pixel-perfect identica al PDF de 24 paginas.
**Why it's wrong:** El PDF fue disenado para impresion (CMYK, layout fijo, paginas). La web tiene interactividad, responsive, animaciones, y un paradigma de navegacion completamente diferente. Replicar el PDF produce un sitio rigido y poco usable.
**Do this instead:** Extraer los DATOS y la PALETA del PDF, pero disenar la web como producto digital moderno. Cards, grids, navegacion, hover states, transiciones suaves — nada de esto existe en el PDF.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel | Deploy target — `next build` + Vercel CLI or Git integration | Static output mode. Zero server functions needed. Free tier sufficient para uso interno. |
| Poppler (pdfimages) | Pre-build CLI tool — extrae imagenes del PDF | Solo en dev machine, no en CI. Se ejecuta una vez. `brew install poppler` en macOS. |
| Sharp | Pre-build Node.js script — optimiza imagenes extraidas | Convierte a WebP, resize. Tambien disponible como dependencia de Next.js para image optimization en serve time. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Content Layer ↔ Pages | Direct import (`import { categories } from '@/lib/content/categories'`) | No API, no fetch. Compile-time resolution. |
| Pages ↔ Components | Props (typed) | Unidirectional. Page pasa datos tipados a componentes via props. |
| Layout ↔ Children | CSS custom properties + React `children` prop | Layout inyecta `--category-color`; children lo consumen via CSS. No prop drilling. |
| Image Pipeline ↔ Content Data | Convention-based paths (`/images/fabrics/{slug}.webp`) | El content data referencia paths. El pipeline de imagenes produce archivos en esas paths. La convencion de naming es el contrato. |
| Header ↔ Content | Import de `categories` para generar nav links | Header importa la lista de categorias para construir el menu dinamicamente. |

## Build Order (Dependencies Between Components)

El siguiente orden respeta dependencias — cada fase solo requiere lo que la anterior ya construyo:

```
Phase 1: Foundation (no dependencies)
├── Tailwind v4 @theme tokens (globals.css)
├── TypeScript type definitions (lib/content/types.ts)
├── Root layout + global header skeleton
└── Image extraction script (PDF → /public/images/)

Phase 2: Data Layer (depends on Phase 1: types)
├── categories.ts (needs types.ts)
├── technologies.ts (needs types.ts)
├── fabrics.ts (needs types.ts + categories for slugs)
├── customization.ts (needs types.ts)
└── collars.ts (needs types.ts)

Phase 3: Core Components (depends on Phase 1: tokens + Phase 2: types)
├── product-card.tsx (needs Fabric type + Tailwind tokens)
├── product-grid.tsx (needs product-card)
├── category-card.tsx (needs Category type + Tailwind tokens)
├── technology-badge.tsx (needs Technology type)
├── technology-card.tsx (needs Technology type)
└── section-header.tsx (pure UI, needs tokens only)

Phase 4: Pages + Routing (depends on Phase 2 + 3)
├── Home page (needs category-card + categories data)
├── Category pages with [slug] + generateStaticParams (needs product-grid + fabrics data)
├── Category layout with color theming (needs categories data)
├── Technologies page (needs technology-card + technologies data)
├── Personalization page (needs customization data)
└── Collars page (needs collars data)

Phase 5: Polish (depends on Phase 4)
├── Header navigation (needs all routes defined)
├── Loading/error states
├── Responsive tablet adjustments
├── Image optimization fine-tuning
└── Vercel deploy configuration
```

**Rationale:** Tokens y types primero porque todo depende de ellos. Data layer antes de componentes porque los componentes necesitan saber la forma de los datos para renderizar. Componentes antes de paginas porque las paginas componen componentes. Polish al final porque requiere el sitio funcional completo.

## Sources

- [Next.js Official Docs: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — HIGH confidence (official, v16.1.6, verified 2026-02-20)
- [Next.js Official Docs: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — HIGH confidence (official, v16.1.6, verified 2026-02-20)
- [Next.js Official Docs: Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) — HIGH confidence (official, v16.1.6, verified 2026-02-20)
- [Tailwind CSS v4: @theme directive](https://tailwindcss.com/docs/theme) — HIGH confidence (official Tailwind docs)
- [Poppler pdfimages](https://formulae.brew.sh/formula/poppler) — HIGH confidence (Homebrew formula, well-established tool)
- [Sharp image processing](https://sharp.pixelplumbing.com/) — HIGH confidence (official docs, industry standard)
- [Next.js App Router Architecture Patterns 2026](https://feature-sliced.design/blog/nextjs-app-router-guide) — MEDIUM confidence (community, well-regarded source)
- [Tailwind CSS v4 Design Tokens Guide](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06) — MEDIUM confidence (community tutorial, cross-verified with official docs)

---
*Architecture research for: Lafayette Uni For Me Colegios — Web Comercial*
*Researched: 2026-02-21*
