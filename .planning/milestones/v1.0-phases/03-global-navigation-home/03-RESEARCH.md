# Phase 3: Global Navigation & Home - Research

**Researched:** 2026-02-21
**Domain:** Next.js App Router layout, navigation, responsive UI, Tailwind v4 components
**Confidence:** HIGH

## Summary

Esta fase implementa la estructura de navegacion global (header + menu de 4 secciones), la pagina home con hero y grid de 4 items, y la pagina intermedia `/usos` con grid de 8 categorias. El stack ya esta establecido: Next.js 16.1.6 App Router, React 19, Tailwind CSS v4, con datos estaticos en TypeScript (Phase 2). El patron principal es usar el root `layout.tsx` para alojar el header global (Server Component con navegacion client-side para estado activo), y crear paginas estaticas en `app/page.tsx` (home) y `app/usos/page.tsx`.

Los datos necesarios ya existen en `src/lib/content/categories.ts` (8 categorias con colores e IDs), `src/lib/content/helpers.ts` (getCategoryBySlug), y los tokens de color estan definidos en `globals.css` (@theme). El logo Lafayette existe en `public/images/logo-lafayette.png` (138KB PNG). Las imagenes de contenido extraidas del PDF estan en `public/images/content/`. No se necesitan nuevas dependencias mas alla de `lucide-react` para iconos del menu.

**Primary recommendation:** Usar lucide-react para iconos de navegacion, el root layout.tsx para el header global (Server Component wrapper + Client Component para estado activo), y un patron de componentes simples sin CVA para las cards de home y usos dado que son componentes unicos no reutilizables.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Items del menu con texto + iconos representativos para cada seccion (Usos, Tecnologias, Personalizacion, Cuellos)
- Comportamiento del header en tablet: hamburger menu (patron de despliegue a criterio de Claude)
- Hero con foto grande de uniformes escolares como visual principal
- Branding "Lafayette Uni For Me Colegios" sobre el hero
- Sin call-to-action / boton en el hero -- solo branding visual
- Grid de 4 secciones: cards con imagen de fondo representativa de cada seccion
- Layout del grid: 4 columnas en fila (horizontal) en desktop
- Layout /usos: 4 columnas x 2 filas para las 8 categorias en desktop
- Cards /usos con fondo completo del color distintivo de cada categoria
- Pagina /usos va directo al grid, sin intro ni hero -- solo titulo y cards
- Estetica vibrante y colorida -- los 8 colores de categoria como protagonistas
- Balance imagen-texto en el layout (ni imagenes dominantes ni solo texto)
- Densidad de contenido: punto medio -- suficiente espacio sin desperdiciar pantalla
- Referencia visual: el PDF original de Lafayette como base, pero modernizado para web

### Claude's Discretion
- Header sticky vs estatico (considerar contexto de presentacion en reunion)
- Fondo del header (solido, transparente, o adaptativo)
- Patron de despliegue del menu mobile/tablet (sidebar, dropdown, overlay)
- Informacion mostrada en cada card de categoria (nombre, imagen, conteo de telas -- lo que sea mas util para el vendedor)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Header global con logo Lafayette visible en todas las paginas (esquina superior izquierda, 12px offset del borde superior) | Root layout.tsx pattern: colocar `<Header />` en layout raiz, renderiza en todas las pages. Logo existe en `/images/logo-lafayette.png`. Usar `next/image` con width/height fijos. |
| NAV-02 | Menu principal con 4 items: Usos, Tecnologias, Personalizacion, Cuellos | Array estatico de nav items con href, label e icono (lucide-react). Links via `next/link`. |
| NAV-03 | Navegacion responsive (desktop: full nav bar, tablet: hamburger menu o nav compacta) | Client Component con useState para toggle del menu mobile. Tailwind breakpoints `lg:` para mostrar/ocultar. Patron overlay con transicion CSS. |
| HOME-01 | Hero section con branding "Lafayette Uni For Me Colegios" y visual impactante | `next/image` con fill + objectFit cover para hero background. Texto superpuesto con overlay semi-transparente. Imagenes de uniformes disponibles en `public/images/content/`. |
| HOME-02 | Grid visual de 4 items principales (Usos, Tecnologias, Personalizacion, Cuellos) | Grid de 4 columnas con `grid-cols-4` en desktop, `grid-cols-2` en tablet. Cada card es un `Link` con imagen de fondo y texto. |
| HOME-03 | Los 4 items del menu principal son la unica navegacion de contenido desde la home | Disenar la home con solo hero + grid de 4, sin sidebar ni secciones extra. El grid ES la navegacion principal. |
| USOS-01 | Pagina intermedia `/usos` con grid de 8 cards de categoria de uso | Ruta `app/usos/page.tsx`. Importar `CATEGORIES` de `src/lib/content`. Grid `grid-cols-4` (2 filas). Cada card muestra nombre + color de fondo usando tokens CSS existentes. Link a `/uso/[id]`. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router, layouts, routing, Image optimization | Ya instalado. Root layout pattern para header global. |
| React | 19.2.3 | UI components, hooks (useState, usePathname) | Ya instalado. No forwardRef necesario en React 19. |
| Tailwind CSS | v4 | Styling, responsive breakpoints, tokens | Ya configurado con @theme y tokens de categoria. |
| lucide-react | latest | Iconos SVG para menu de navegacion | Tree-shakeable, consistente, 1500+ iconos, excelente soporte React 19. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | (built-in) | Optimizacion de imagenes hero y logo | Todas las imagenes: logo, hero background, category cards |
| next/link | (built-in) | Navegacion client-side con prefetching | Todos los links internos: nav items, cards home, cards usos |
| clsx + tailwind-merge | (ya instalado) | Utilidad `cn()` para clases condicionales | Estilos condicionales en nav activo, responsive states |
| class-variance-authority | (ya instalado) | Component variants | Solo si se crean componentes reutilizables con variantes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react | Heroicons (@heroicons/react) | Lucide tiene mas iconos (1500+ vs 300+), similar bundle size, mejor naming |
| lucide-react | SVG inline | Mas control pero mas mantenimiento y sin tree-shaking automatico |
| useState para hamburger | CSS-only (:checked hack) | CSS-only es fragil, no accessible, no animable con control fino |
| Headless UI menu | Codigo custom | Headless UI seria overkill para un menu de 4 items |

**Installation:**
```bash
bun add lucide-react
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout - HEADER GOES HERE
│   ├── page.tsx            # Home page (hero + grid 4 items)
│   ├── usos/
│   │   └── page.tsx        # /usos - Grid de 8 categorias
│   └── uso/
│       └── [slug]/
│           └── page.tsx    # (Phase 4 - no implementar ahora)
├── components/
│   ├── header.tsx          # Server Component wrapper
│   ├── nav-links.tsx       # Client Component (usePathname para active state)
│   ├── mobile-menu.tsx     # Client Component (useState para toggle)
│   ├── hero-section.tsx    # Server Component - hero de home
│   ├── section-grid.tsx    # Server Component - grid 4 items home
│   └── category-card.tsx   # Server Component - card de categoria /usos
├── lib/
│   ├── content/            # (ya existe - datos Phase 2)
│   └── utils.ts            # (ya existe - cn utility)
```

### Pattern 1: Header Global en Root Layout (Server Component)
**What:** Colocar el header como hijo directo del `<body>` en el root layout. El header se renderiza una vez y persiste entre navegaciones (partial rendering de Next.js).
**When to use:** Siempre que un elemento UI debe aparecer en todas las paginas.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
// app/layout.tsx
import { Header } from '@/components/header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${raleway.variable} ${montserrat.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### Pattern 2: Active Link con usePathname (Client Component)
**What:** Componente NavLinks que usa `usePathname()` de `next/navigation` para resaltar el link activo. Requiere `'use client'` directive.
**When to use:** Navegacion con indicador visual de pagina actual.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-pathname
// components/nav-links.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/usos', label: 'Usos', icon: 'LayoutGrid' },
  { href: '/tecnologias', label: 'Tecnologias', icon: 'Cpu' },
  { href: '/personalizacion', label: 'Personalizacion', icon: 'Palette' },
  { href: '/cuellos', label: 'Cuellos', icon: 'Shirt' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors',
            pathname.startsWith(item.href)
              ? 'text-brand-accent'
              : 'text-foreground hover:text-brand-primary'
          )}
        >
          {/* Icon + Label */}
        </Link>
      ))}
    </nav>
  )
}
```

### Pattern 3: Hamburger Menu Toggle (Client Component)
**What:** Componente mobile menu con useState para controlar visibilidad. Overlay con transicion CSS.
**When to use:** Tablet breakpoint (< lg) donde el nav horizontal no cabe.
**Example:**
```typescript
// components/mobile-menu.tsx
'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2"
        aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-72 bg-background p-6 shadow-xl">
            {/* Nav items */}
          </nav>
        </div>
      )}
    </>
  )
}
```

### Pattern 4: Hero con next/image fill
**What:** Imagen de fondo full-width usando Image con fill prop, contenedor relativo, y texto superpuesto.
**When to use:** Hero sections con imagen de fondo.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image#fill
// components/hero-section.tsx
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      <Image
        src="/images/content/page13-36.webp"  // Imagen de uniformes
        alt="Uniformes escolares Lafayette"
        fill
        sizes="100vw"
        className="object-cover"
        preload  // Hero = LCP element
      />
      <div className="absolute inset-0 bg-brand-primary/60" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white text-center">
          Lafayette Uni For Me<br />Colegios
        </h1>
      </div>
    </section>
  )
}
```

### Pattern 5: Category Card con Color Token
**What:** Card que usa el color de categoria definido en @theme como fondo, con enlace a `/uso/[id]`.
**When to use:** Grid de 8 categorias en `/usos`.
**Example:**
```typescript
// components/category-card.tsx
import Link from 'next/link'
import type { Category } from '@/lib/content/types'

// Mapeo slug → clase Tailwind (necesario porque Tailwind no puede generar clases dinamicas)
const categoryColorMap: Record<string, { bg: string; fg: string }> = {
  'sudaderas-chaquetas-pantalones': { bg: 'bg-cat-sudaderas', fg: 'text-cat-sudaderas-fg' },
  'camisetas-polos': { bg: 'bg-cat-camisetas', fg: 'text-cat-camisetas-fg' },
  // ... (ya existe en page.tsx actual, mover a constante compartida)
}

export function CategoryCard({ category }: { category: Category }) {
  const colors = categoryColorMap[category.id]
  return (
    <Link
      href={`/uso/${category.id}`}
      className={`${colors.bg} ${colors.fg} block rounded-lg p-6 transition-transform hover:scale-[1.02] cursor-pointer`}
    >
      <h3 className="text-lg font-semibold">{category.name}</h3>
      {/* Conteo de telas u otra info */}
    </Link>
  )
}
```

### Anti-Patterns to Avoid
- **Dynamic Tailwind classes:** NO hacer `bg-[${color}]` — Tailwind no genera clases con interpolacion. Usar el mapa estatico de clases como `categoryColorMap`.
- **Server Component con hooks:** El header puede ser Server Component, pero `usePathname` y `useState` requieren `'use client'`. Separar en Server wrapper + Client children.
- **Logo como background-image:** Usar `next/image` para el logo, no CSS background — permite optimizacion automatica.
- **Rutas hardcodeadas dispersas:** Centralizar rutas de navegacion en un array constante (NAV_ITEMS) para mantener coherencia header ↔ home grid.
- **Imagenes sin sizes prop:** Con `fill`, SIEMPRE pasar `sizes` para que Next.js genere srcset optimizado.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Iconos SVG | Crear SVGs manuales para cada seccion | lucide-react (Shirt, Palette, LayoutGrid, Cpu) | Consistencia visual, tree-shaking, mantenimiento |
| Menu responsive | CSS-only hamburger con :checked | React useState + Tailwind transitions | Accesibilidad (aria-expanded), animaciones, cierre al navegar |
| Image optimization | `<img>` tags con srcset manual | next/image con fill/sizes | Sharp optimization, lazy loading, layout shift prevention |
| Active link state | Comparacion manual de URLs | usePathname() + startsWith() | Maneja rutas anidadas correctamente |
| Utility classes merge | Concatenacion manual de strings | cn() (clsx + twMerge, ya instalado) | Resuelve conflictos de Tailwind correctamente |

**Key insight:** Esta fase es mayormente UI/layout. No hay logica de negocio compleja. El riesgo principal es la correcta integracion de next/image con el layout responsive y que las clases de Tailwind se generen correctamente para los colores dinamicos de categoria.

## Common Pitfalls

### Pitfall 1: Tailwind No Genera Clases Dinamicas
**What goes wrong:** Escribir `className={`bg-cat-${slug}`}` y la clase no aparece en el CSS final.
**Why it happens:** Tailwind v4 escanea archivos en build-time buscando clases completas como strings literales. Las clases construidas con interpolacion no se detectan.
**How to avoid:** Usar un mapa estatico objeto → clase (`categoryColorMap`). Las clases completas como `'bg-cat-sudaderas'` aparecen como strings literales en el codigo y Tailwind las detecta.
**Warning signs:** Cards sin color de fondo, o con el color por defecto.

### Pitfall 2: Logo con Offset Incorrecto
**What goes wrong:** El requisito NAV-01 pide "12px offset del borde superior". Si se interpreta como margin-top, puede no coincidir con el padding del header.
**Why it happens:** Ambiguedad entre padding del header container y posicion del logo.
**How to avoid:** Usar `pt-3` (12px) en el header container, verificar visualmente que el logo tiene exactamente 12px de espacio respecto al borde superior del viewport.
**Warning signs:** Logo pegado al borde o con demasiado espacio.

### Pitfall 3: next/image fill Sin Contenedor Relativo
**What goes wrong:** La imagen con `fill` se expande fuera de su contenedor o se posiciona incorrectamente.
**Why it happens:** `fill` usa `position: absolute` internamente. El padre DEBE tener `position: relative`.
**How to avoid:** Siempre agregar `relative` al contenedor padre de un Image con fill. Documentacion oficial lo exige.
**Warning signs:** Imagen desbordada, cubieriendo otros elementos, o invisible.

### Pitfall 4: Hamburger Menu No Cierra al Navegar
**What goes wrong:** El usuario hace click en un item del menu mobile y navega a la pagina, pero el menu sigue abierto.
**Why it happens:** La navegacion client-side de Next.js no recarga la pagina, asi que el estado `isOpen` persiste.
**How to avoid:** Escuchar cambios de `pathname` con useEffect y cerrar el menu automaticamente, o cerrar en el onClick del Link.
**Warning signs:** Overlay del menu permanece despues de navegar.

### Pitfall 5: Hero Image No es LCP Optimizada
**What goes wrong:** La imagen del hero carga tarde, causando layout shift o slow LCP.
**Why it happens:** next/image usa lazy loading por defecto. El hero es above-the-fold y debe cargar inmediatamente.
**How to avoid:** Agregar `preload` (Next.js 16) o `loading="eager"` al Image del hero. Solo el hero, no todas las imagenes.
**Warning signs:** LCP > 2.5s en Lighthouse, imagen del hero aparece con delay visible.

### Pitfall 6: Rutas Inconsistentes entre Nav y Paginas
**What goes wrong:** El nav apunta a `/tecnologias` pero la pagina esta en `/tecnologia`, generando 404.
**Why it happens:** No hay una fuente unica de verdad para las rutas.
**How to avoid:** Definir NAV_ITEMS como constante en un archivo centralizado. Las paginas Phase 6 usaran estas mismas rutas.
**Warning signs:** Links rotos al hacer click en nav items.

## Code Examples

Verified patterns from official sources:

### Root Layout con Header Global
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
// app/layout.tsx
import type { Metadata } from 'next'
import { Raleway, Montserrat } from 'next/font/google'
import { Header } from '@/components/header'
import './globals.css'

const raleway = Raleway({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'Lafayette Uni For Me - Colegios',
  description: 'Catalogo de soluciones textiles para uniformes escolares',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${raleway.variable} ${montserrat.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### next/image con fill para Hero Background
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image#fill
<section className="relative h-[400px] lg:h-[500px] overflow-hidden">
  <Image
    src="/images/content/page13-36.webp"
    alt="Uniformes escolares Lafayette"
    fill
    sizes="100vw"
    className="object-cover"
    preload
  />
  {/* Overlay + text */}
</section>
```

### Grid Responsive 4 Columnas (Home) / 4x2 (Usos)
```typescript
// Home: 4 secciones
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {sections.map(section => (
    <Link key={section.href} href={section.href} className="...">
      {/* Card content */}
    </Link>
  ))}
</div>

// Usos: 8 categorias (4 columnas x 2 filas)
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {CATEGORIES.map(cat => (
    <CategoryCard key={cat.id} category={cat} />
  ))}
</div>
```

### Lucide React Icons Import
```typescript
// Source: https://lucide.dev/guide/packages/lucide-react
import { LayoutGrid, Cpu, Palette, Shirt, Menu, X } from 'lucide-react'

// Uso en nav
<LayoutGrid size={20} />  // Usos
<Cpu size={20} />          // Tecnologias
<Palette size={20} />      // Personalizacion
<Shirt size={20} />        // Cuellos
<Menu size={24} />         // Hamburger open
<X size={24} />            // Hamburger close
```

### Category Color Map (Mover de page.tsx a Constante Compartida)
```typescript
// Ya existe en src/app/page.tsx pero necesita moverse a lib/
export const CATEGORY_STYLE_MAP: Record<string, { bg: string; fg: string }> = {
  'sudaderas-chaquetas-pantalones': { bg: 'bg-cat-sudaderas', fg: 'text-cat-sudaderas-fg' },
  'camisetas-polos': { bg: 'bg-cat-camisetas', fg: 'text-cat-camisetas-fg' },
  'uniforme-deportivo': { bg: 'bg-cat-deportivo', fg: 'text-cat-deportivo-fg' },
  'uniforme-diario-faldas-blazers': { bg: 'bg-cat-diario', fg: 'text-cat-diario-fg' },
  'buzos-hoodies-perchados': { bg: 'bg-cat-buzos', fg: 'text-cat-buzos-fg' },
  'chaquetas-prom': { bg: 'bg-cat-chaquetas-prom', fg: 'text-cat-chaquetas-prom-fg' },
  'blusas-camisas': { bg: 'bg-cat-blusas', fg: 'text-cat-blusas-fg' },
  'delantales-batas-laboratorio': { bg: 'bg-cat-delantales', fg: 'text-cat-delantales-fg' },
} as const
```

## Discretion Recommendations

Estas son las areas marcadas como "Claude's Discretion" en CONTEXT.md, con recomendacion basada en la investigacion:

### Header Sticky vs Estatico
**Recommendation: Sticky.** En contexto de presentacion en reunion, el vendedor navega frecuentemente entre secciones. Un header sticky permite acceso inmediato al menu sin scroll up. Usar `sticky top-0 z-40` con backdrop blur para que el contenido sea parcialmente visible detras.

### Fondo del Header
**Recommendation: Semi-transparente con blur.** `bg-background/95 backdrop-blur-sm` da un efecto moderno, permite ver que hay contenido debajo (pista visual de scroll), y mantiene legibilidad del texto. Alternativa aceptable: solido blanco `bg-background` si el blur causa problemas de rendimiento en tablets viejas.

### Patron de Despliegue Menu Tablet
**Recommendation: Sidebar derecha (slide-in).** Un panel que se desliza desde la derecha es el patron mas familiar para usuarios de aplicaciones modernas. Incluir overlay semi-transparente para cerrar al tocar fuera. Animacion con `transition-transform duration-300`.

### Informacion en Cards de Categoria /usos
**Recommendation: Nombre + conteo de telas.** El nombre de la categoria es obligatorio. Agregar el conteo de telas (ej: "9 telas") da informacion util al vendedor sobre la profundidad del catalogo. La imagen representativa puede ser el primer producto de la categoria o una imagen generica del tipo de prenda. El conteo se calcula de `category.fabricIds.length`.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `priority` prop en next/image | `preload` prop | Next.js 16 | `priority` esta deprecated. Usar `preload` para LCP images. |
| `forwardRef` en componentes | `ref` como prop directo | React 19 | No envolver componentes en forwardRef. ref es prop nativo. |
| `tailwind.config.ts` | `@theme` en CSS | Tailwind v4 | Ya migrado en Phase 1. No crear tailwind.config. |
| `useRouter().pathname` | `usePathname()` | Next.js 13 App Router | useRouter de next/navigation ya no tiene pathname. |
| `params` sincrono | `params` como Promise | Next.js 15+ | En `page.tsx`, `params` es Promise. Usar `await params`. |

**Deprecated/outdated:**
- `next/image` `priority` prop: Usar `preload` en su lugar (Next.js 16)
- `onLoadingComplete`: Deprecated, usar `onLoad` en su lugar
- `domains` config en next.config: Usar `remotePatterns` (solo para imagenes externas, no aplica aqui)

## Open Questions

1. **Imagenes representativas para las 4 secciones del home**
   - What we know: Tenemos imagenes de contenido en `public/images/content/` (pages 13-19) y de productos en `public/images/products/`. Las imagenes de contenido incluyen fotos de uniformes.
   - What's unclear: Que imagen especifica usar para representar cada seccion (Usos, Tecnologias, Personalizacion, Cuellos). Requiere inspeccion visual.
   - Recommendation: El implementador debe revisar las imagenes disponibles y asignar la mas representativa. Si no hay imagenes adecuadas para todas las secciones, usar colores solidos como fallback (similar a las cards de categoria).

2. **Rutas para secciones aun no implementadas**
   - What we know: `/usos` se implementa en esta fase. `/tecnologias`, `/personalizacion`, y `/cuellos` son Phase 6.
   - What's unclear: Si crear paginas placeholder para evitar 404 al hacer click en nav items.
   - Recommendation: Crear paginas minimas placeholder (`app/tecnologias/page.tsx`, etc.) con mensaje "Proximamente" para que la navegacion funcione sin 404. Seran reemplazadas en Phase 6.

3. **Mapa de colores de categoria como constante compartida**
   - What we know: El mapa `categoryColorMap` ya existe en `src/app/page.tsx` (pagina temporal de design system preview).
   - What's unclear: Donde ubicar esta constante para que sea accesible desde multiples componentes.
   - Recommendation: Mover a `src/lib/content/categories.ts` junto a CATEGORIES, o crear `src/lib/content/styles.ts`. La primera opcion mantiene la colocacion con los datos.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 Official Docs - Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) - Root layout pattern, nested layouts, Link component
- [Next.js 16 Official Docs - Image Component](https://nextjs.org/docs/app/api-reference/components/image) - fill, sizes, preload (reemplaza priority), responsive patterns
- [Next.js Official Docs - usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) - Active link pattern en App Router
- [Lucide React Guide](https://lucide.dev/guide/packages/lucide-react) - Installation, usage, tree-shaking
- [Lucide Icons - Shirt](https://lucide.dev/icons/shirt) - Verificado que existe el icono Shirt
- [Lucide Icons - Palette](https://lucide.dev/icons/palette) - Verificado que existe el icono Palette
- Codebase existente: `src/app/globals.css`, `src/lib/content/categories.ts`, `src/app/page.tsx` - Tokens, datos, mapeo de colores

### Secondary (MEDIUM confidence)
- [Next.js Learn - Navigating Between Pages](https://nextjs.org/learn/dashboard-app/navigating-between-pages) - Active link pattern tutorial
- Project skills: `tailwind-design-system/SKILL.md` - CVA patterns, responsive grid, Tailwind v4 conventions
- Project skills: `vercel-react-best-practices/SKILL.md` - Bundle optimization, async patterns
- Project skills: `ui-ux-pro-max/SKILL.md` - Accessibility checklist, interaction patterns

### Tertiary (LOW confidence)
- WebSearch results for hamburger menu patterns - Consensus: React useState es el approach estandar, CSS-only es fragil
- Lucide icon names for Cpu, LayoutGrid - Inferidos de la estructura de la libreria, no verificados con fetch individual

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Todo ya instalado excepto lucide-react. Documentacion oficial verificada para Next.js 16.
- Architecture: HIGH - Patrones de layout/navigation bien documentados en Next.js docs. Estructura de carpetas clara.
- Pitfalls: HIGH - Pitfalls de Tailwind clases dinamicas y next/image fill son bien conocidos y documentados.
- Icons: MEDIUM - Iconos Shirt y Palette verificados. LayoutGrid y Cpu probables pero no verificados individualmente.
- Imagenes hero/home: LOW - Requiere inspeccion visual de las imagenes extraidas del PDF para asignar a cada seccion.

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (30 dias - stack estable)
