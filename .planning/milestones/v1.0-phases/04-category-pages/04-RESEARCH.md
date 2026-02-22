# Phase 4: Category Pages - Research

**Researched:** 2026-02-22
**Domain:** Next.js 16 dynamic routes, product card grids, category navigation sidebar, responsive layouts
**Confidence:** HIGH

## Summary

La Fase 4 requiere crear 8 paginas de categoria accesibles via `/uso/[slug]` usando Next.js 16 App Router con rutas dinamicas y `generateStaticParams`. Cada pagina muestra un header con color de categoria, un sidebar de navegacion entre categorias, y un grid responsive de product cards con chips de tecnologia.

Todo el stack necesario ya existe en el proyecto: Next.js 16.1.6, Tailwind CSS v4 con tokens de categoria, el data layer completo en `src/lib/content/` con helpers como `getFabricsByCategory()` y `getCategoryBySlug()`, y la paleta de 8 colores con foregrounds WCAG ya definida en `globals.css` y `styles.ts`. No se necesitan dependencias adicionales. lucide-react ya esta instalada para iconos.

El patron critico es que en Next.js 16, `params` es una **Promise** que debe ser awaited. `generateStaticParams` retorna un array de `{ slug: string }` y `dynamicParams = false` garantiza 404 para slugs invalidos. Las imagenes de producto usan `placeholder.webp` actualmente (mapeo real diferido), asi que el skeleton/shimmer es relevante solo para la carga del placeholder, no para imagenes dinamicas.

**Primary recommendation:** Crear `src/app/uso/[slug]/page.tsx` como Server Component con `generateStaticParams` + `dynamicParams = false`, extraer `FabricCard` y `CategorySidebar` como componentes reutilizables, y usar los helpers existentes del data layer sin duplicar logica. El sidebar debe usar `usePathname()` para resaltar la categoria activa (unico componente client necesario).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Chips de tecnologia: badges con texto visible (no solo iconos). Cada chip muestra el nombre de la tecnologia aplicable
- Hover card: sombra/elevacion sutil — la card sube ligeramente. Feedback profesional sin ser intrusivo
- Clic en card: enlaza a `/uso/[cat]/[tela]` (ruta de ficha tecnica). En Fase 4 sera placeholder, en Fase 5 tendra la ficha completa
- Breadcrumb visible: SI, tipo "Usos > Sudaderas" arriba del header. Navegacion de retorno clara
- Sidebar con lista de las 8 categorias para cambio rapido sin volver a `/usos`
- Loading de imagenes: skeleton cards con shimmer animation (imitando la forma de la card final)

### Claude's Discretion
- Proporcion imagen/texto en cards
- Estilo del hero header (full-width vs contenido)
- Inclusion y contenido de descripcion de categoria
- Tipo de imagen hero
- Sidebar visible vs colapsable y su styling
- Adaptacion tablet del sidebar
- Manejo visual de categorias con pocas telas
- Conteo de telas en header
- Animaciones de entrada

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CAT-01 | Pagina individual por cada categoria de uso accesible via `/uso/[slug]` (8 paginas totales) | Next.js 16 dynamic routes con `[slug]`, `generateStaticParams` retornando los 8 category IDs, `dynamicParams = false` para 404 en rutas invalidas. Helpers existentes: `getCategoryBySlug()`, `getFabricsByCategory()` |
| CAT-02 | Product cards de tela en grid responsive (3 columnas desktop, 2 columnas tablet) | Tailwind grid: `grid-cols-2 lg:grid-cols-3` con gap responsive. Breakpoints del proyecto: lg (1024px) para desktop, md (768px) implicitamente tablet |
| CAT-03 | Cada card de tela muestra: nombre, imagen del producto, chips de tecnologias aplicables | Componente `FabricCard` que recibe Fabric + category slug. Usa `next/image` con fill para imagen, nombre en texto, y chips renderizados desde `fabric.technologies` mapeados a `getTechnologyById()` para obtener nombres legibles |
| CAT-04 | Header de categoria con nombre, color de fondo distintivo e imagen hero | Usa `CATEGORY_STYLE_MAP[category.id]` para clases bg/fg Tailwind. Hero con imagen de contenido disponible en `/images/content/`. Color ya definido en `globals.css` como tokens `--color-cat-*` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js (App Router) | 16.1.6 | Dynamic routes `[slug]`, SSG via `generateStaticParams`, `generateMetadata` | Ya instalado. Patron oficial para paginas de catalogo estaticas |
| React | 19.2.3 | Server Components (page), Client Component (sidebar con pathname) | Ya instalado. React 19 no necesita forwardRef |
| Tailwind CSS | v4 | Grid responsive, color tokens de categoria, spacing | Ya instalado. Tokens `cat-*` ya definidos en `@theme` |
| next/image | built-in | Imagenes de producto y hero optimizadas | Built-in. Usa `fill` + `sizes` para imagenes responsivas |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.575.0 | Iconos para breadcrumb (ChevronRight) y UI | Ya instalado. Usar para separadores de breadcrumb |
| clsx + tailwind-merge | instalados | `cn()` utility para clases condicionales | Ya disponible en `@/lib/utils` |
| class-variance-authority | 0.7.1 | Variantes de componente (card sizes, chip variants) | Ya instalado. Usar si se necesitan variantes formales |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS shimmer animation | plaiceholder (blur generation) | plaiceholder requiere dependencia extra + build step. CSS shimmer es mas ligero y suficiente dado que las imagenes son locales/placeholder |
| Client-side sidebar | Server Component sidebar | El sidebar necesita `usePathname()` para resaltar la categoria activa, lo que requiere `'use client'`. Alternativa: pasar slug como prop desde el server component padre. Se recomienda el enfoque client por simplicidad |

**Installation:**
No se necesitan dependencias adicionales. Todo el stack ya esta instalado.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── uso/
│       └── [slug]/
│           ├── page.tsx          # Category page (Server Component)
│           └── not-found.tsx     # 404 para categorias invalidas (opcional, dynamicParams=false maneja esto)
├── components/
│   ├── fabric-card.tsx           # Product card reutilizable
│   ├── category-sidebar.tsx      # Sidebar de navegacion entre categorias ('use client')
│   ├── category-header.tsx       # Header con color y hero
│   ├── breadcrumb.tsx            # Breadcrumb reutilizable
│   ├── tech-chip.tsx             # Chip de tecnologia reutilizable
│   └── skeleton-card.tsx         # Skeleton para loading state
├── lib/
│   └── content/                  # YA EXISTE - no modificar
│       ├── helpers.ts            # getFabricsByCategory(), getCategoryBySlug(), getTechnologyById()
│       ├── categories.ts         # CATEGORIES con 8 entradas
│       ├── fabrics.ts            # FABRICS con 30 telas
│       ├── technologies.ts       # TECHNOLOGIES con 14 entradas
│       └── styles.ts             # CATEGORY_STYLE_MAP bg/fg classes
```

### Pattern 1: Dynamic Route with generateStaticParams (Next.js 16)
**What:** Generar estaticamente las 8 paginas de categoria en build time
**When to use:** Paginas cuyo contenido se conoce en build time (datos estaticos en .ts)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
// app/uso/[slug]/page.tsx

import { CATEGORIES } from '@/lib/content'
import { getCategoryBySlug, getFabricsByCategory } from '@/lib/content'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Generar las 8 rutas en build time
export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.id }))
}

// NO permitir slugs que no estan en CATEGORIES
export const dynamicParams = false

// Metadata dinamica por categoria
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} - Lafayette Uni For Me`,
    description: `Telas para ${category.name.toLowerCase()} en uniformes escolares`,
  }
}

// CRITICO: params es Promise en Next.js 16
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  const fabrics = getFabricsByCategory(slug)
  // render...
}
```

### Pattern 2: Server Component Page with Client Sidebar
**What:** La pagina es un Server Component (no necesita estado ni efectos), pero el sidebar necesita `usePathname()` para la categoria activa
**When to use:** Cuando solo una parte del UI necesita interactividad client
**Example:**
```typescript
// category-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/content'
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'
import { cn } from '@/lib/utils'

export function CategorySidebar() {
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2] // /uso/[slug]

  return (
    <nav className="...">
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === currentSlug
        const colors = CATEGORY_STYLE_MAP[cat.id]
        return (
          <Link key={cat.id} href={`/uso/${cat.id}`}
            className={cn(
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive ? `${colors.bg} ${colors.fg}` : 'text-foreground/70 hover:bg-muted'
            )}
          >
            {cat.name}
          </Link>
        )
      })}
    </nav>
  )
}
```

### Pattern 3: Fabric Card con Technology Chips
**What:** Card de producto que muestra imagen, nombre y tecnologias como badges de texto
**When to use:** En el grid de cada pagina de categoria
**Example:**
```typescript
// fabric-card.tsx (Server Component - no necesita interactividad)
import Image from 'next/image'
import Link from 'next/link'
import { getTechnologyById } from '@/lib/content'
import type { Fabric } from '@/lib/content'

export function FabricCard({
  fabric,
  categorySlug,
}: {
  fabric: Fabric
  categorySlug: string
}) {
  return (
    <Link
      href={`/uso/${categorySlug}/${fabric.id}`}
      className="group block rounded-lg border border-border bg-background overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={fabric.image}
          alt={fabric.name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground">
          {fabric.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {fabric.technologies.map((techId) => {
            const tech = getTechnologyById(techId)
            return tech ? (
              <span
                key={techId}
                className="inline-block rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tech.name}
              </span>
            ) : null
          })}
        </div>
      </div>
    </Link>
  )
}
```

### Pattern 4: Placeholder Route para Ficha Tecnica (Fase 5)
**What:** Crear ruta `/uso/[slug]/[fabricId]/page.tsx` como placeholder para que los links de cards funcionen
**When to use:** Fase 4 necesita que el link exista aunque el contenido sea Fase 5
**Example:**
```typescript
// app/uso/[slug]/[fabricId]/page.tsx
import { CATEGORIES, FABRICS } from '@/lib/content'
import { getCategoryBySlug, getFabricBySlug } from '@/lib/content'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const params: { slug: string; fabricId: string }[] = []
  for (const cat of CATEGORIES) {
    for (const fabricId of cat.fabricIds) {
      params.push({ slug: cat.id, fabricId })
    }
  }
  return params
}

export const dynamicParams = false

export default async function FabricPage({
  params,
}: {
  params: Promise<{ slug: string; fabricId: string }>
}) {
  const { slug, fabricId } = await params
  const category = getCategoryBySlug(slug)
  const fabric = getFabricBySlug(fabricId)
  if (!category || !fabric) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl font-heading font-semibold">{fabric.name}</h1>
      <p className="text-muted-foreground mt-4">
        Ficha tecnica en construccion. Disponible proximamente.
      </p>
    </div>
  )
}
```

### Anti-Patterns to Avoid
- **Duplicar datos de categoria en la pagina:** NO copiar colores/nombres. Usar SIEMPRE `getCategoryBySlug()` y `CATEGORY_STYLE_MAP`
- **Hacer el page.tsx un Client Component:** La pagina no necesita hooks. Solo el sidebar necesita `usePathname()`. Mantener la pagina como Server Component
- **Usar dynamic imports para el grid:** Las cards son ligeras (texto + imagen). No hay beneficio en lazy loading componentes tan simples
- **Hardcodear slugs en links:** Usar siempre `category.id` y `fabric.id` de los datos

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Routing dinamico | Router custom o switch/case de categorias | Next.js `[slug]` + `generateStaticParams` | SSG automatico, 404 handling, metadata por pagina |
| Image optimization | Lazy loading manual, srcset manual | `next/image` con `fill` + `sizes` | Optimizacion automatica WebP/AVIF, lazy loading, responsive srcset |
| Active route detection | Parsing manual de URL, prop drilling | `usePathname()` de `next/navigation` | Reactivo, SSR-safe, actualiza en navegacion client |
| CSS shimmer animation | Libreria de skeleton (react-loading-skeleton) | CSS puro `@keyframes` shimmer | Zero dependencies, mejor performance, simple para este caso |
| Color mapping categoria | Objetos manuales de color por slug | `CATEGORY_STYLE_MAP` existente | Ya esta definido y testeado, Tailwind classes pre-generadas |

**Key insight:** El data layer (Fase 2) y el design system (Fase 1) ya resolvieron los problemas de datos y estilos. La Fase 4 es puramente composicion de componentes sobre infraestructura existente.

## Common Pitfalls

### Pitfall 1: params es Promise en Next.js 16
**What goes wrong:** Error de TypeScript o runtime al acceder `params.slug` directamente sin await
**Why it happens:** Next.js 16 cambio params a Promise para soportar streaming. Es un breaking change respecto a Next.js 14/15 early
**How to avoid:** SIEMPRE `const { slug } = await params` en el page component Y en `generateMetadata`
**Warning signs:** Error "params.slug is not a property of Promise" o TypeScript error en build

### Pitfall 2: Tailwind no genera clases dinamicas
**What goes wrong:** Usar template literals como `` `bg-cat-${slug}` `` no funciona porque Tailwind necesita ver las clases completas en el source
**Why it happens:** Tailwind v4 escanea el source code para generar CSS. Clases parciales no son detectadas
**How to avoid:** Usar `CATEGORY_STYLE_MAP` que ya contiene las clases completas como strings (`'bg-cat-sudaderas'`). NUNCA construir clases de color dinamicamente
**Warning signs:** Colores de categoria no aparecen, fondo blanco donde deberia haber color

### Pitfall 3: Layout shift por imagenes sin dimensiones
**What goes wrong:** Las imagenes de producto causan layout shift al cargar porque no tienen aspect ratio definido
**Why it happens:** `next/image` con `fill` requiere un contenedor con dimensiones fijas o aspect ratio
**How to avoid:** Envolver la imagen en un div con `aspect-[4/3]` o similar. El contenedor fija las dimensiones, la imagen llena el contenedor
**Warning signs:** Cards que "saltan" cuando las imagenes cargan, CLS alto

### Pitfall 4: Sidebar scroll en mobile
**What goes wrong:** El sidebar de categorias ocupa demasiado espacio vertical en tablet, empujando el contenido
**Why it happens:** 8 categorias con nombres largos ("Sudaderas - Chaquetas - Pantalones") ocupan mucho espacio
**How to avoid:** En tablet, convertir el sidebar en scroll horizontal o colapsarlo. En desktop, sidebar lateral fijo con scroll propio si es necesario
**Warning signs:** En pantallas de 768px, el grid de telas queda debajo del fold

### Pitfall 5: Telas compartidas entre categorias
**What goes wrong:** Una tela como "Fastrack" aparece en "Sudaderas" Y en "Buzos". El link de la card debe apuntar a la categoria correcta
**Why it happens:** El modelo de datos permite telas en multiples categorias (fabricIds compartidos)
**How to avoid:** El `categorySlug` siempre se pasa como prop al `FabricCard` desde la pagina de categoria. El link es `/uso/${categorySlug}/${fabric.id}`, no `/tela/${fabric.id}`
**Warning signs:** Clic en una tela en "Buzos" lleva a la pagina de esa tela bajo "Sudaderas"

### Pitfall 6: `preload` vs `priority` en next/image
**What goes wrong:** Usar `priority` prop que esta deprecated en Next.js 16
**Why it happens:** Documentacion antigua y LLMs entrenan con versiones anteriores
**How to avoid:** Usar `preload={true}` en vez de `priority` para la imagen hero del header. `priority` fue deprecated en Next.js 16.0.0
**Warning signs:** Console warning sobre deprecated prop

## Code Examples

Verified patterns from official sources:

### CSS Shimmer Skeleton
```css
/* En globals.css */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, var(--color-muted) 25%, var(--color-border) 50%, var(--color-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

```typescript
// skeleton-card.tsx
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
```

### Grid Responsive (CAT-02)
```typescript
// Grid pattern para 3 columnas desktop, 2 columnas tablet
<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {fabrics.map((fabric) => (
    <FabricCard key={fabric.id} fabric={fabric} categorySlug={slug} />
  ))}
</div>
```

### Breadcrumb
```typescript
// Source: proyecto existente + patron estandar
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
```

### Category Header con Color
```typescript
// Combina CATEGORY_STYLE_MAP + datos de categoria
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'

export function CategoryHeader({
  category,
  fabricCount,
}: {
  category: Category
  fabricCount: number
}) {
  const colors = CATEGORY_STYLE_MAP[category.id]

  return (
    <div className={`${colors.bg} ${colors.fg} rounded-lg p-6 lg:p-8`}>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold">
        {category.name}
      </h1>
      {'description' in category && (
        <p className="mt-1 opacity-80 text-sm">{category.description as string}</p>
      )}
      <p className="mt-2 text-sm opacity-70">{fabricCount} telas disponibles</p>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params: { slug: string }` (sync) | `params: Promise<{ slug: string }>` (async) | Next.js 15+ | MUST await params en page y generateMetadata |
| `priority` prop en next/image | `preload` prop | Next.js 16.0.0 | `priority` deprecated, usar `preload` |
| `tailwind.config.ts` con dynamic classes | `@theme` en CSS + class map objects | Tailwind v4 | Clases deben ser strings completos, no interpolados |
| `forwardRef` en React | `ref` como prop regular | React 19 | Simplifica componentes, no necesita wrapper |
| `onLoadingComplete` en next/image | `onLoad` callback | Next.js 14+ | `onLoadingComplete` deprecated |

**Deprecated/outdated:**
- `priority` prop en `<Image>`: Usar `preload` en su lugar (Next.js 16)
- `getStaticPaths` + `getStaticProps`: Usar `generateStaticParams` + Server Components (App Router)
- `tailwind.config.ts`: Usar `@theme` en CSS (Tailwind v4)

## Open Questions

1. **Imagenes hero por categoria**
   - What we know: Hay 22 imagenes de contenido en `/images/content/`. Algunas se usan en la home (page14-45, page13-43, page13-38, page16-103, page17-105)
   - What's unclear: Cual imagen corresponde visualmente a cada categoria. Requiere inspeccion visual
   - Recommendation: El planner puede asignar imagenes basandose en las disponibles no usadas, o reutilizar las de la home con un crop diferente. Esto queda a discrecion de Claude durante la implementacion

2. **Layout del sidebar en tablet (768-1023px)**
   - What we know: En desktop (lg+) el sidebar es lateral. En mobile no aplica (el sitio no se optimiza para phone)
   - What's unclear: Si a 768px hay espacio para sidebar + grid de 2 columnas simultaneamente
   - Recommendation: En tablet, convertir el sidebar en una barra horizontal scrollable arriba del grid, o colapsarlo en un dropdown. El planner debe considerar ambos breakpoints

3. **Telas con imagenes placeholder**
   - What we know: Todas las telas tienen `image: '/images/products/placeholder.webp'`. El mapeo real fue diferido en Fase 2
   - What's unclear: Si el placeholder visual es suficiente para la demo/presentacion de Fase 4
   - Recommendation: Proceder con placeholder. El skeleton shimmer se aplica al contenedor de imagen independientemente de la fuente. El mapeo real de imagenes puede hacerse en cualquier momento sin cambiar la estructura

## Sources

### Primary (HIGH confidence)
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Verificado 2026-02-22. Version 16.1.6. Confirma params como Promise, dynamicParams config, return type
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Verificado 2026-02-22. Version 16.1.6. Confirma async params, metadata merging, streaming support
- [Next.js Image Component docs](https://nextjs.org/docs/app/api-reference/components/image) - Verificado 2026-02-22. Version 16.1.6. Confirma `preload` reemplaza `priority`, `fill` + `sizes` pattern, `placeholder` prop
- Codebase existente: `src/lib/content/` (data layer), `src/app/usos/page.tsx` (patron de referencia), `globals.css` (tokens)

### Secondary (MEDIUM confidence)
- [Next.js Dynamic Routes guide](https://thelinuxcode.com/nextjs-dynamic-route-segments-in-the-app-router-2026-guide/) - Confirma patrones de dynamic routes en 2026
- Skill `tailwind-design-system` - Patterns CVA, compound components, responsive grid
- Skill `vercel-react-best-practices` - server-parallel-fetching, bundle-barrel-imports, rendering-conditional-render

### Tertiary (LOW confidence)
- Ninguno. Todos los hallazgos fueron verificados con docs oficiales o codebase existente

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Todo ya esta instalado y probado en fases anteriores. No se necesitan dependencias nuevas
- Architecture: HIGH - Los patrones de Next.js 16 dynamic routes estan bien documentados. El data layer existente provee todos los helpers necesarios
- Pitfalls: HIGH - Los pitfalls estan verificados contra docs oficiales (params Promise, Tailwind class scanning, next/image deprecated props)

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (stack estable, sin cambios esperados)
