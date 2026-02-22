# Phase 6: Fabric Detail Pages - Research

**Researched:** 2026-02-22
**Domain:** Next.js SSG detail pages, CSS-only tooltips, cross-navigation, Tailwind v4
**Confidence:** HIGH

## Summary

La fase 6 transforma las páginas placeholder de detalle de tela (`/uso/[slug]/[fabricId]/page.tsx`) en fichas técnicas completas. La infraestructura ya existe: la ruta dinámica anidada con `generateStaticParams`, el modelo de datos `Fabric` con todos los campos requeridos (composición, gramaje, ancho, tipo de tejido, base, printRoutes, isNew, technologies), y los helpers `getCategoriesByFabric()` y `getTechnologyById()` ya están implementados.

El desafío principal es la implementación de tooltips CSS-only que funcionen tanto en laptop (hover) como en tablet (tap), dado que Tailwind v4 envuelve `hover:` en `@media (hover: hover)`, lo que impide que `group-hover` funcione en tablets. La solución es combinar `group-hover` con `group-focus-within` y usar `<button>` o `tabindex="0"` como trigger del tooltip, cubriendo ambos dispositivos sin JavaScript.

La navegación cruzada se basa en `getCategoriesByFabric()` que ya devuelve todas las categorías donde aparece una tela. Existen 9 telas que aparecen en múltiples categorías (hasta 3 categorías por tela), lo cual requiere filtrar la categoría actual de la lista de links cruzados.

**Primary recommendation:** Reemplazar el contenido placeholder del `page.tsx` existente con una ficha técnica completa usando Server Component puro (sin client JS), tooltips CSS-only con `group-hover` + `group-focus-within`, tabla de specs de 2 columnas, chips de rutas de estampación, badge "Nuevo" condicional, y links de navegación cruzada filtrando la categoría actual.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Sin imagen por tela individual** — Las imágenes actuales son genéricas (misma foto de estudiantes repetida para todas las telas de una categoría). NO incrustar imagen en la ficha de detalle de cada tela. La imagen de uso ya se ve a nivel de categoría.
- Diseño centrado en specs técnicas con buenas prácticas de UI/UX, sin repetir la misma foto para Vendaval Crush, Orion, Gorek, etc.
- Botón de "volver a categoría" prominente para navegación rápida durante la reunión
- Breadcrumb completo arriba (Usos > Sudaderas > Vendaval Crush) + botón de volver separado
- Formato **tabla de propiedades** de 2 columnas (propiedad | valor): composición, gramaje (g/m²), ancho (cm), tipo de tejido (Plano/Punto), base
- Rutas de estampación (Unicolor, Rotativa, Davos, Sublimación) mostradas como **tags/chips separados** debajo de la tabla de specs — no dentro de la tabla
- Tooltips CSS-only al hacer hover con nombre y descripción de la tecnología
- Debe funcionar en **laptop (hover) y tablet (tap)** — mix de dispositivos en reuniones de ventas
- Telas marcadas como nuevas (`isNew`) muestran badge "Nuevo" visible

### Claude's Discretion
- Layout general (dos columnas vs imagen arriba): Claude elige lo más apropiado dado que no hay imagen por tela
- Tono visual (ficha técnica vs e-commerce): Claude decide lo que mejor encaje con el sitio existente
- Imagen con zoom o estática: decisión de Claude según practicidad
- Formato de tecnologías (chips con tooltip vs lista): Claude elige lo que mejor comunique
- Nivel de detalle del tooltip (descripción corta vs expandida): Claude decide
- Visibilidad de descripciones de tecnología (tooltip-only vs siempre visible): Claude decide
- Ubicación de navegación cruzada (final de ficha vs junto a info principal): Claude elige
- Destino de links cruzados (categoría vs misma tela en otra categoría): Claude decide
- Comportamiento cuando tela tiene solo 1 categoría (ocultar sección vs mostrar): Claude decide
- Posición y estilo del badge "Nuevo": Claude decide
- Loading skeleton, spacing, tipografía exacta

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DETAIL-01 | Ficha técnica completa de cada tela con specs (composición, gramaje, ancho, tejido, base) | El modelo `Fabric` ya contiene todos los campos. El page.tsx placeholder ya existe con `generateStaticParams` y `dynamicParams = false`. Solo requiere reemplazar el contenido del componente con tabla de specs y chips de printRoutes. |
| DETAIL-02 | Imagen de tela integrada con next/image en ficha de detalle | **DECISIÓN DEL USUARIO: NO incluir imagen.** Las imágenes son genéricas (misma foto por categoría). La ficha se centra en datos técnicos. Este requirement queda satisfecho por la decisión explícita del usuario de no incluir imagen repetida. |
| DETAIL-03 | Tooltips de tecnología CSS-only (group-hover) en ficha de tela | Implementable con `group-hover` + `group-focus-within` en Tailwind v4. Necesita `<button>` como trigger para compatibilidad tablet (tap = focus). Ver sección de Architecture Patterns. |
| DETAIL-04 | Badge "Nuevo" en telas marcadas como nuevas | Campo `isNew?: boolean` ya existe en el tipo `Fabric`. Solo 2 telas tienen `isNew: true` (Apolo, Celta). Badge condicional simple. |
| DETAIL-05 | Navegación cruzada entre categorías para telas compartidas (usar getCategoriesByFabric) | Helper `getCategoriesByFabric()` ya implementado. 9 telas aparecen en múltiples categorías. Requiere filtrar categoría actual y renderizar links a las demás. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js (App Router) | 16.1.6 | SSG pages con `generateStaticParams` | Ya instalado, rutas dinámicas anidadas ya funcionan |
| React | 19.2.3 | Server Components (sin client JS en esta fase) | Ya instalado |
| Tailwind CSS | v4.2.0 | Styling con @theme tokens, group variants | Ya instalado con design tokens de categoría |
| lucide-react | 0.575.0 | Iconos para Lucide fallbacks (3 tecnologías) | Ya instalado, ya usado en FabricCard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge (cn) | ^2.1.1 / ^3.5.0 | Merge condicional de clases | Ya disponible via `@/lib/utils` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS-only tooltips | @floating-ui/react, Radix Tooltip | Agrega JS client-side y dependencia. Overkill para tooltips estáticos de nombre+descripción. El proyecto prioriza SSG sin JS. |
| Tabla HTML nativa | Grid CSS | `<table>` es semánticamente correcto para datos tabulares de propiedad-valor y mejor para accesibilidad. |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/uso/[slug]/[fabricId]/
│   └── page.tsx              # REWRITE: ficha técnica completa (Server Component)
├── components/
│   ├── breadcrumb.tsx        # EXISTING: ya usado, no changes needed
│   ├── fabric-card.tsx       # EXISTING: TechIcon helper ya existe aquí
│   ├── tech-chip.tsx         # NEW: chip de tecnología con tooltip CSS-only
│   └── fabric-detail.tsx     # NEW (optional): componente de ficha reutilizable
└── lib/content/
    ├── helpers.ts            # EXISTING: getCategoriesByFabric, getTechnologyById
    ├── fabrics.ts            # EXISTING: 31 telas con todos los campos
    └── technologies.ts       # EXISTING: 14 tecnologías con icon + description
```

### Pattern 1: CSS-Only Tooltip con Tailwind v4 (hover + tap)
**What:** Tooltip que aparece con hover en desktop y tap en tablet, sin JavaScript
**When to use:** Para mostrar nombre y descripción de tecnologías en la ficha
**Critical issue:** Tailwind v4 wraps `hover:` in `@media (hover: hover)`, so `group-hover` alone won't fire on tablets.

**Solution: Combine `group-hover` + `group-focus-within`**

```tsx
// Source: Tailwind docs + verified Tailwind v4 behavior
function TechChip({ tech }: { tech: Technology }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 focus:outline-none"
        aria-describedby={`tooltip-${tech.id}`}
      >
        <TechIcon icon={tech.icon} />
        {tech.name}
      </button>
      {/* Tooltip: visible on hover (desktop) AND focus-within (tablet tap) */}
      <span
        id={`tooltip-${tech.id}`}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          rounded-md bg-foreground px-3 py-1.5 text-xs text-background
          opacity-0 transition-opacity duration-150
          group-hover:opacity-100 group-focus-within:opacity-100
          whitespace-nowrap"
      >
        {tech.description}
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </span>
    </span>
  )
}
```

**Why `<button>` instead of `tabindex="0"`:**
- `<button>` es nativamente focusable
- En tablets, tapping un `<button>` dispara `:focus` → activa `group-focus-within`
- `<button type="button">` sin handler es correcto semánticamente para toggle de tooltip
- No tiene el problema de "activar" algo como un `<a>` al hacer tap

**Why this works on both devices:**
- Desktop: mouse hover → `@media (hover: hover)` matches → `group-hover:opacity-100`
- Tablet: tap → focus event → `group-focus-within:opacity-100`
- Tap elsewhere → blur → tooltip disappears (natural browser behavior)

### Pattern 2: Tabla de Specs de 2 Columnas
**What:** Tabla HTML semántica para propiedad | valor
**When to use:** Para las especificaciones técnicas de la tela

```tsx
// Source: standard HTML table pattern
function SpecsTable({ fabric }: { fabric: Fabric }) {
  const specs = [
    { label: 'Composición', value: fabric.composition },
    { label: 'Gramaje', value: fabric.weight },
    { label: 'Ancho', value: fabric.width },
    { label: 'Tipo de Tejido', value: fabric.weave },
    { label: 'Base', value: fabric.base },
  ]

  return (
    <table className="w-full text-sm">
      <tbody>
        {specs.map((spec) => (
          <tr key={spec.label} className="border-b border-border">
            <td className="py-3 pr-4 font-medium text-muted-foreground w-40">
              {spec.label}
            </td>
            <td className="py-3 text-foreground">
              {spec.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Pattern 3: Navegación Cruzada con Filtrado de Categoría Actual
**What:** Links a otras categorías donde la misma tela aparece
**When to use:** Cuando `getCategoriesByFabric(fabricId).length > 1`

```tsx
// Source: existing helper getCategoriesByFabric in helpers.ts
function CrossNavigation({
  fabricId,
  currentCategorySlug,
}: {
  fabricId: string
  currentCategorySlug: string
}) {
  const allCategories = getCategoriesByFabric(fabricId)
  const otherCategories = allCategories.filter(c => c.id !== currentCategorySlug)

  if (otherCategories.length === 0) return null

  return (
    <div className="mt-8 rounded-lg border border-border p-4">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        También disponible en
      </h2>
      <div className="flex flex-wrap gap-2">
        {otherCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/uso/${cat.id}`}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm border border-border hover:bg-muted transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### Pattern 4: Badge "Nuevo" Condicional
**What:** Badge visible solo cuando `fabric.isNew === true`
**When to use:** Junto al nombre de la tela

```tsx
{fabric.isNew && (
  <span className="inline-flex items-center rounded-full bg-brand-accent text-brand-accent-foreground px-2.5 py-0.5 text-xs font-semibold">
    Nuevo
  </span>
)}
```

### Pattern 5: Chips de Rutas de Estampación
**What:** Tags separados para printRoutes debajo de la tabla de specs
**When to use:** Para Unicolor, Rotativa, Davos, Sublimación

```tsx
<div className="flex flex-wrap gap-2">
  {fabric.printRoutes.map((route) => (
    <span
      key={route}
      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
    >
      {route}
    </span>
  ))}
</div>
```

### Anti-Patterns to Avoid
- **Imagen por tela individual:** El usuario explícitamente decidió NO incluir imagen. Las imágenes actuales son genéricas por categoría.
- **JavaScript tooltip library:** El requirement es CSS-only. No usar Radix, Floating UI, ni Tippy.js.
- **`use client` directive:** Esta página debe ser Server Component puro. No hay interactividad que requiera client JS (los tooltips son CSS-only).
- **`group-hover` solamente (sin `group-focus-within`):** En Tailwind v4, `hover:` usa `@media (hover: hover)` que no funciona en tablets.
- **`@custom-variant hover (&:hover)` override global:** Resolvería tablets pero re-introduciría "stuck hover" en móviles. Mejor usar la combinación dual.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-category lookup | Bucle manual por CATEGORIES | `getCategoriesByFabric(fabricId)` | Ya existe en helpers.ts, tested |
| Technology data lookup | Búsqueda manual en TECHNOLOGIES | `getTechnologyById(techId)` | Ya existe en helpers.ts |
| CSS class merging | String concatenation manual | `cn()` de `@/lib/utils` | Ya existe, usa clsx + twMerge |
| Static route generation | Lista manual de rutas | `generateStaticParams()` | Ya implementado en page.tsx actual |
| Tooltip positioning | Custom positioning logic | CSS `absolute` + `bottom-full` + `translate` | Patrón estándar Tailwind, sin JS |
| Icon rendering dual (image/Lucide) | Nuevo componente de iconos | `TechIcon` de `fabric-card.tsx` | Ya existe, soporta path y Lucide name |

**Key insight:** El 80% de la infraestructura ya existe. Los helpers, los datos, la ruta, el componente de breadcrumb, el TechIcon — todo está listo. La fase es principalmente de UI/presentación sobre datos existentes.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Hover No Funciona en Tablets
**What goes wrong:** Los tooltips con `group-hover` no aparecen al hacer tap en iPad/tablets
**Why it happens:** Tailwind v4 genera `group-hover:` dentro de `@media (hover: hover)`, que excluye touch devices
**How to avoid:** Siempre usar `group-hover:opacity-100 group-focus-within:opacity-100` juntos. El trigger debe ser `<button>` para recibir focus en tap.
**Warning signs:** Tooltips funcionan en desktop pero no en tablet durante testing

### Pitfall 2: Tooltip Cortado por Overflow
**What goes wrong:** El tooltip se corta por el borde del contenedor padre
**Why it happens:** El contenedor tiene `overflow-hidden` (ej: cards, rounded containers)
**How to avoid:** Asegurar que los ancestros del tooltip no tengan `overflow-hidden`. Si es necesario, mover el tooltip a una posición que no se corte. Usar `whitespace-nowrap` para tooltips de una línea.
**Warning signs:** Tooltip aparece parcialmente visible, cortado por un borde

### Pitfall 3: Badge "Nuevo" Invisible por Contraste
**What goes wrong:** El badge se pierde visualmente contra el fondo
**Why it happens:** Color de badge similar al background
**How to avoid:** Usar `bg-brand-accent` (#C42034 rojo Lafayette) con `text-brand-accent-foreground` (blanco) — contraste WCAG AA garantizado por el design system
**Warning signs:** Badge presente en DOM pero visualmente imperceptible

### Pitfall 4: Links Cruzados Incluyen la Categoría Actual
**What goes wrong:** "También disponible en: Sudaderas" cuando ya estás en Sudaderas
**Why it happens:** `getCategoriesByFabric()` devuelve TODAS las categorías, incluida la actual
**How to avoid:** Siempre filtrar: `allCategories.filter(c => c.id !== currentCategorySlug)`
**Warning signs:** Links cruzados incluyen un link a la misma página donde estás

### Pitfall 5: Tooltip Accesibility
**What goes wrong:** Screen readers no leen el contenido del tooltip
**Why it happens:** Tooltip no tiene `role="tooltip"` ni está vinculado con `aria-describedby`
**How to avoid:** Usar `role="tooltip"` en el span del tooltip, `aria-describedby` en el trigger, e `id` único por tooltip
**Warning signs:** Lighthouse accessibility warnings en la ficha

### Pitfall 6: Async Params en Next.js 16
**What goes wrong:** Error de tipo al destructurar params directamente
**Why it happens:** En Next.js 16 con App Router, `params` es una Promise que debe ser awaited
**How to avoid:** Siempre `const { slug, fabricId } = await params` — el placeholder actual ya lo hace correctamente
**Warning signs:** TypeScript error `Property 'slug' does not exist on type 'Promise<...>'`

## Code Examples

### Ejemplo Completo: Ficha Técnica (estructura recomendada)

```tsx
// Source: pattern synthesis from existing codebase + research
// File: src/app/uso/[slug]/[fabricId]/page.tsx

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  CATEGORIES,
  getCategoryBySlug,
  getFabricBySlug,
  getCategoriesByFabric,
  getTechnologyById,
} from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'

export const dynamicParams = false

// generateStaticParams ya existe — no cambiar

export default async function FabricDetailPage({
  params,
}: {
  params: Promise<{ slug: string; fabricId: string }>
}) {
  const { slug, fabricId } = await params
  const category = getCategoryBySlug(slug)
  const fabric = getFabricBySlug(fabricId)
  if (!category || !fabric) notFound()

  const otherCategories = getCategoriesByFabric(fabricId)
    .filter(c => c.id !== slug)

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Usos', href: '/usos' },
        { label: category.name, href: `/uso/${slug}` },
        { label: fabric.name },
      ]} />

      {/* Header: nombre + badge */}
      <div className="mt-6 flex items-center gap-3">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          {fabric.name}
        </h1>
        {fabric.isNew && (
          <span className="rounded-full bg-brand-accent text-brand-accent-foreground px-2.5 py-0.5 text-xs font-semibold">
            Nuevo
          </span>
        )}
      </div>

      {/* Specs table */}
      {/* ... tabla de 2 columnas ... */}

      {/* Print routes chips */}
      {/* ... chips debajo de tabla ... */}

      {/* Technology chips with tooltips */}
      {/* ... TechChip components ... */}

      {/* Cross navigation */}
      {otherCategories.length > 0 && (
        <div>
          {/* ... links a otras categorías ... */}
        </div>
      )}

      {/* Back button */}
      <Link
        href={`/uso/${slug}`}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground hover:bg-border transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a {category.name}
      </Link>
    </div>
  )
}
```

### Ejemplo: TechIcon Reutilizado
```tsx
// Source: existing FabricCard component (src/components/fabric-card.tsx)
// El componente TechIcon ya existe y soporta ambos formatos:
// - Path de imagen: icon.startsWith('/') → <img>
// - Nombre Lucide: icons[icon] → <LucideIcon>
// Se debe extraer a un archivo compartido o importar desde fabric-card
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `hover:` applies on all devices | `hover:` wrapped in `@media (hover: hover)` | Tailwind v4 (2024) | Tooltips hover-only no funcionan en tablet; necesitan focus-within |
| `params` síncrono en page | `params` es Promise, debe ser awaited | Next.js 15+ | Ya manejado correctamente en el placeholder actual |
| `getStaticPaths` + `getStaticProps` | `generateStaticParams` + Server Components | Next.js 13+ App Router | Ya implementado correctamente |

**Deprecated/outdated:**
- `@custom-variant hover (&:hover)`: Workaround global para restorecer hover en touch devices. No recomendado — causa "stuck hover" y viola la intención de Tailwind v4. Mejor usar la solución dual `group-hover` + `group-focus-within`.

## Data Analysis: Multi-Category Fabrics

Telas que aparecen en más de una categoría (requieren navegación cruzada):

| Tela | Categorías | Count |
|------|-----------|-------|
| orion-clororresistente | sudaderas, chaquetas-prom, delantales | 3 |
| universal-clororresistente | sudaderas, chaquetas-prom, delantales | 3 |
| alviero-stretch | diario, chaquetas-prom, delantales | 3 |
| microtec-clororresistente | sudaderas, chaquetas-prom | 2 |
| fastrack | sudaderas, buzos | 2 |
| celta | buzos, chaquetas-prom | 2 |
| gorek | sudaderas, delantales | 2 |
| t180 | sudaderas, delantales | 2 |
| microdrill | diario, delantales | 2 |

**22 telas con solo 1 categoría** → no muestran sección de navegación cruzada.

## Open Questions

1. **Extracción de TechIcon a componente compartido**
   - What we know: `TechIcon` existe dentro de `fabric-card.tsx` como función interna
   - What's unclear: Si extraerlo a un archivo propio ahora o dejarlo duplicado
   - Recommendation: Extraer a `src/components/tech-icon.tsx` en esta fase para reutilizar en la ficha de detalle y evitar duplicación. Es un cambio mínimo y limpio.

2. **Destino de los links cruzados**
   - What we know: Se puede linkar a `/uso/{otherCategorySlug}` (página de categoría) o a `/uso/{otherCategorySlug}/{fabricId}` (misma tela en otra categoría)
   - What's unclear: Cuál es más útil para el vendedor
   - Recommendation: Linkar a `/uso/{otherCategorySlug}/{fabricId}` (misma tela en otra categoría) — el vendedor quiere mostrar que la misma tela sirve para otro uso, y aterrizar en la ficha de esa tela en el otro contexto es más directo.

3. **Layout sin imagen: una columna centrada**
   - What we know: El usuario decidió no incluir imagen individual. No hay segundo bloque visual para justificar 2 columnas.
   - What's unclear: Si una columna centrada se sentirá demasiado "vacía"
   - Recommendation: Layout de una columna con `max-w-2xl` o `max-w-3xl` centrado. Las fichas técnicas industriales funcionan bien en formato vertical estrecho — similar a una ficha de producto impresa.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** — `src/app/uso/[slug]/[fabricId]/page.tsx`, `src/lib/content/types.ts`, `src/lib/content/helpers.ts`, `src/lib/content/fabrics.ts`, `src/lib/content/technologies.ts`, `src/lib/content/categories.ts`, `src/components/fabric-card.tsx`, `src/components/breadcrumb.tsx`, `src/app/globals.css`
- **Tailwind CSS v4 official docs** — [Hover, focus, and other states](https://tailwindcss.com/docs/hover-focus-and-other-states) — confirma `group-focus-within` disponible, confirma `@media (hover: hover)` behavior
- **Next.js official docs** — [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — confirma nested dynamic routes SSG pattern

### Secondary (MEDIUM confidence)
- **Tailwind v4 hover on touch devices** — [Border Media article](https://bordermedia.org/blog/tailwind-css-4-hover-on-touch-device) — verified explanation of `@media (hover: hover)` change and workarounds
- **Harrison Broadbent** — [Native Tailwind Tooltip](https://harrisonbroadbent.com/blog/native-tailwind-tooltip/) — verified CSS-only tooltip pattern with peer/group selectors
- **Tailwind GitHub** — [Discussion #11019](https://github.com/tailwindlabs/tailwindcss/discussions/11019) — group-hover and group-focus-within coexistence

### Tertiary (LOW confidence)
- None — all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 100% existing stack, zero new dependencies
- Architecture: HIGH — existing route, helpers, and data models cover all requirements
- Tooltip pattern: HIGH — verified against Tailwind v4 docs, dual hover+focus-within pattern well-documented
- Cross-navigation: HIGH — `getCategoriesByFabric` already exists and returns correct data
- Pitfalls: HIGH — Tailwind v4 hover issue verified, async params pattern already handled in codebase

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (stable — no fast-moving dependencies)
