# Architecture Patterns: v1.1 Integration

**Domain:** Sales enablement web catalog -- extending existing Next.js App Router SSG site
**Researched:** 2026-02-22
**Confidence:** HIGH
**Scope:** How fabric detail pages, search/filter/sort, and 3 content sections integrate with existing v1.0 architecture

## Existing Architecture (v1.0 Baseline)

```
src/
├── app/
│   ├── layout.tsx              # RootLayout: Raleway + Montserrat fonts, Header, main
│   ├── page.tsx                # Home: hero + 4-section grid (Server Component)
│   ├── globals.css             # Tailwind v4 @theme: 8 cat colors, brand, surfaces
│   ├── usos/page.tsx           # Grid of 8 category cards
│   ├── uso/[slug]/
│   │   └── page.tsx            # Category page: breadcrumb + header + sidebar + fabric grid
│   ├── uso/[slug]/[fabricId]/
│   │   └── page.tsx            # PLACEHOLDER: "Ficha tecnica en construccion"
│   ├── tecnologias/page.tsx    # PLACEHOLDER: "en construccion"
│   ├── personalizacion/page.tsx # PLACEHOLDER: "en construccion"
│   └── cuellos/page.tsx        # PLACEHOLDER: "en construccion"
├── components/
│   ├── header.tsx              # Sticky header, logo, desktop nav, mobile menu
│   ├── nav-links.tsx           # 'use client' - 4 nav items with active state
│   ├── mobile-menu.tsx         # 'use client' - slide-in sidebar
│   ├── breadcrumb.tsx          # Server Component - configurable breadcrumb trail
│   ├── category-header.tsx     # Server Component - colored header bar
│   ├── category-sidebar.tsx    # 'use client' - sidebar nav + tablet scroll bar
│   ├── fabric-card.tsx         # Server Component - product card with tech chips
│   └── skeleton-card.tsx       # ORPHANED - never imported
├── lib/
│   ├── nav.ts                  # NAV_ITEMS constant (4 items)
│   ├── utils.ts                # cn() helper (clsx + tailwind-merge)
│   └── content/
│       ├── types.ts            # Fabric, Category, Technology, WeaveType, PrintRoute
│       ├── fabrics.ts          # 31 FABRICS (as const satisfies)
│       ├── categories.ts       # 8 CATEGORIES with fabricIds refs
│       ├── technologies.ts     # 14 TECHNOLOGIES with icons
│       ├── helpers.ts          # 6 getter functions
│       ├── styles.ts           # CATEGORY_STYLE_MAP (bg/fg class pairs)
│       └── index.ts            # Barrel re-exports
└── public/images/
    ├── products/               # 14 real images (unmapped) + placeholder.webp (missing)
    ├── tech/                   # 12 tech logos (PNG)
    ├── content/                # 22 content images (WebP)
    └── logo-lafayette.png
```

**Key patterns already established:**
- SSG with `generateStaticParams` + `dynamicParams = false` on all dynamic routes
- TypeScript `as const satisfies` data layer with barrel exports
- Server Components by default; `'use client'` only for interactive nav
- Tailwind v4 `@theme` tokens for category colors
- `CATEGORY_STYLE_MAP` for Tailwind class lookup by category ID
- Breadcrumb component reused across category and detail pages

## v1.1 Integration Map

### What Changes vs What Stays

| Area | Status | Details |
|------|--------|---------|
| `app/layout.tsx` | NO CHANGE | Root layout, fonts, Header wrapper stay identical |
| `app/page.tsx` | NO CHANGE | Home page stays as-is |
| `app/usos/page.tsx` | NO CHANGE | Category grid stays as-is |
| `app/uso/[slug]/page.tsx` | MODIFY | Add search/filter/sort UI (client component wrapper) |
| `app/uso/[slug]/[fabricId]/page.tsx` | REWRITE | Replace placeholder with full fabric detail page |
| `app/tecnologias/page.tsx` | REWRITE | Replace placeholder with 12 technology cards |
| `app/personalizacion/page.tsx` | REWRITE | Replace placeholder with 4 customization options |
| `app/cuellos/page.tsx` | REWRITE | Replace placeholder with collar info sections |
| `components/fabric-card.tsx` | MODIFY | Fix image paths, add "isNew" badge |
| `components/nav-links.tsx` | FIX | Change `/usos` to `/uso` for active state |
| `lib/content/types.ts` | EXTEND | Add Personalization, Collar types |
| `lib/content/fabrics.ts` | FIX | Map real product images to fabric records |
| `lib/content/helpers.ts` | EXTEND | Add filter/search helpers |
| `lib/content/index.ts` | EXTEND | Export new data modules |
| `globals.css` | NO CHANGE | Existing tokens sufficient |
| 7 NEW components | CREATE | See Component Inventory below |
| 2 NEW data files | CREATE | `personalization.ts`, `collars.ts` |

## Recommended Architecture

### System Overview (v1.1)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                                    │
│                                                                              │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Pages        │  │ New Pages        │  │ Interactive Layer             │   │
│  │ (existing    │  │ (fabric detail,  │  │ ('use client' components     │   │
│  │  unchanged)  │  │  tech, personal, │  │  for search/filter only)     │   │
│  │              │  │  collars)        │  │                              │   │
│  └──────┬───────┘  └──────┬───────────┘  └──────────┬───────────────────┘   │
│         │                 │                          │                       │
│  ┌──────┴─────────────────┴──────────────────────────┴───────────────────┐   │
│  │                    Component Library                                   │   │
│  │  existing: header, nav-links, breadcrumb, category-header,            │   │
│  │           category-sidebar, fabric-card                               │   │
│  │  NEW:     fabric-detail, fabric-specs-table, technology-card,         │   │
│  │           technology-tooltip, personalization-card, collar-section,    │   │
│  │           fabric-filter-bar (client)                                   │   │
│  └──────┬────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
├─────────┴────────────────────────────────────────────────────────────────────┤
│                         Data Layer                                            │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ fabrics.ts     │  │ categories.ts│  │ techs.ts  │  │ NEW:             │  │
│  │ (31 records,   │  │ (8 cats,     │  │ (14 techs │  │ personalization.ts│ │
│  │  images FIXED) │  │  unchanged)  │  │  unchanged│  │ collars.ts       │  │
│  └────────────────┘  └──────────────┘  └───────────┘  └──────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ helpers.ts (EXTENDED: filterFabrics, sortFabrics, searchFabrics)       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | New/Modify | Communicates With |
|-----------|---------------|------------|-------------------|
| `FabricDetailPage` | Full fabric specs page at `/uso/[slug]/[fabricId]` | REWRITE route page | helpers.ts, FabricSpecsTable, TechnologyTooltip, Breadcrumb |
| `FabricSpecsTable` | Renders fabric specs (composition, weight, width, weave, routes) | NEW component | Receives `Fabric` via props |
| `TechnologyTooltip` | Icon + tooltip with tech name/description on fabric detail | NEW component | Receives `Technology` via props |
| `FabricFilterBar` | Search input + tech filter chips + sort dropdown | NEW component (`'use client'`) | Reads TECHNOLOGIES for filter options; emits filter state up |
| `FilterableFabricGrid` | Wrapper that holds filter state + renders filtered FabricCards | NEW component (`'use client'`) | Contains FabricFilterBar + FabricCard children |
| `TechnologyCard` | Full card for /tecnologias page (icon, name, description, fabric count) | NEW component | Receives `Technology` via props |
| `PersonalizationCard` | Card for /personalizacion (image, title, description) | NEW component | Receives `Personalization` via props |
| `CollarSection` | Section for /cuellos (colors grid, sizes table) | NEW component | Receives collar data via props |

## Data Flow Changes

### Current Flow (v1.0): Category Page

```
[Build Time]
CATEGORIES → generateStaticParams → 8 routes pre-rendered
FABRICS + CATEGORIES → getFabricsByCategory(slug) → Fabric[]
  └→ Each Fabric → FabricCard (Server Component, rendered to HTML)
       └→ FabricCard links to /uso/[slug]/[fabricId] (placeholder)
```

### New Flow (v1.1): Category Page with Client-Side Filtering

```
[Build Time]
CATEGORIES → generateStaticParams → 8 routes pre-rendered (unchanged)
FABRICS + CATEGORIES → getFabricsByCategory(slug) → Fabric[]
  └→ Full Fabric[] passed as props to FilterableFabricGrid

[Runtime — Client]
FilterableFabricGrid ('use client')
  ├→ FabricFilterBar
  │    ├→ Search input (controlled, debounced)
  │    ├→ Technology filter chips (multi-select toggle)
  │    └→ Sort dropdown (weight asc/desc, width asc/desc, name A-Z)
  │
  └→ Filtered + sorted Fabric[] → FabricCard[] (rendered client-side)
       └→ FabricCard links to /uso/[slug]/[fabricId] (real detail page)
```

**Critical design decision:** The category page (`/uso/[slug]/page.tsx`) remains a Server Component. It fetches all fabrics for the category at build time and passes them as serialized props to the `FilterableFabricGrid` client component. The full dataset is embedded in the static HTML. Filtering/sorting happens entirely in the browser -- no server round-trips, no `searchParams` (which would break SSG).

This works because the dataset is tiny (max 9 fabrics per category, 31 total). Embedding the full list in the page HTML adds negligible weight.

### New Flow (v1.1): Fabric Detail Page

```
[Build Time]
CATEGORIES x FABRICS → generateStaticParams → ~43 routes pre-rendered (unchanged)

FabricDetailPage (Server Component)
  ├→ getFabricBySlug(fabricId) → Fabric
  ├→ getCategoryBySlug(slug) → Category (for breadcrumb + color theming)
  ├→ getCategoriesByFabric(fabricId) → Category[] (cross-ref: "also in these categories")
  ├→ fabric.technologies.map(getTechnologyById) → Technology[] (for tooltips)
  │
  └→ Renders:
       ├→ Breadcrumb (Usos > Category > Fabric Name)
       ├→ Product image (next/image, real mapped image)
       ├→ FabricSpecsTable (composition, weight, width, weave, base code)
       ├→ Print routes chips
       ├→ Technology icons with TechnologyTooltip
       ├→ "isNew" badge (conditional)
       └→ Cross-category links (if fabric appears in multiple categories)
```

**Note:** `getCategoriesByFabric()` already exists in helpers.ts but has no consumer. v1.1 is its first real use case -- it powers the "also available in" cross-links on fabric detail pages.

### New Flow (v1.1): Content Section Pages

```
[Build Time — no generateStaticParams needed, these are single static pages]

/tecnologias → TecnologiasPage (Server Component)
  ├→ TECHNOLOGIES (14 items) → TechnologyCard grid
  └→ Each TechnologyCard shows: icon, name, description, fabric count
       └→ Count via: FABRICS.filter(f => f.technologies.includes(tech.id)).length

/personalizacion → PersonalizacionPage (Server Component)
  ├→ PERSONALIZATION_OPTIONS (4 items, NEW data) → PersonalizationCard grid
  └→ Each card: image, title, description

/cuellos → CuellosPage (Server Component)
  ├→ COLLAR_DATA (NEW data) → CollarSection
  └→ Sections: available colors, sizes table (ninos vs adolescentes/adultos)
```

## Patterns to Follow

### Pattern 1: Client Island for Filtering (Preserving SSG)

**What:** Keep the category page as a Server Component that renders a `'use client'` FilterableFabricGrid. The full fabric list for that category is serialized into the static HTML as props. All filtering, sorting, and searching happen in the browser.

**Why:** Using `searchParams` in a page component would force dynamic rendering and break SSG. With only 4-9 fabrics per category, the data is trivially small. Client-side filtering gives instant UX with zero server cost.

**When:** Any time you need interactive filtering on a statically generated page with a small dataset.

```typescript
// app/uso/[slug]/page.tsx — Server Component (unchanged export pattern)
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  const fabrics = getFabricsByCategory(slug)
  const technologies = TECHNOLOGIES // pass full list for filter chip labels

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb items={[{ label: 'Usos', href: '/usos' }, { label: category.name }]} />
      <div className="mt-4">
        <CategoryHeader category={category} fabricCount={fabrics.length} />
      </div>
      <div className="mt-8 lg:flex lg:gap-8">
        <CategorySidebar />
        <div className="flex-1">
          {/* Client island: receives static data, handles interaction */}
          <FilterableFabricGrid
            fabrics={fabrics}
            technologies={technologies}
            categorySlug={slug}
          />
        </div>
      </div>
    </div>
  )
}
```

```typescript
// components/filterable-fabric-grid.tsx
'use client'

import { useState, useMemo } from 'react'
import { FabricCard } from './fabric-card'
import { FabricFilterBar } from './fabric-filter-bar'
import type { Fabric, Technology } from '@/lib/content/types'

interface Props {
  fabrics: Fabric[]
  technologies: Technology[]
  categorySlug: string
}

export function FilterableFabricGrid({ fabrics, technologies, categorySlug }: Props) {
  const [search, setSearch] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('name')

  const filtered = useMemo(() => {
    let result = [...fabrics]

    // Search by name (case-insensitive substring match)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(f => f.name.toLowerCase().includes(q))
    }

    // Filter by technologies (AND logic: fabric must have ALL selected techs)
    if (selectedTechs.length > 0) {
      result = result.filter(f =>
        selectedTechs.every(t => f.technologies.includes(t))
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'weight-asc': return parseFloat(a.weight) - parseFloat(b.weight)
        case 'weight-desc': return parseFloat(b.weight) - parseFloat(a.weight)
        case 'width-asc': return parseFloat(a.width) - parseFloat(b.width)
        case 'width-desc': return parseFloat(b.width) - parseFloat(a.width)
        default: return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [fabrics, search, selectedTechs, sortBy])

  return (
    <div>
      <FabricFilterBar
        technologies={technologies}
        selectedTechs={selectedTechs}
        onTechToggle={(id) => /* toggle logic */}
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filtered.length}
        totalCount={fabrics.length}
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
        {filtered.map((fabric) => (
          <FabricCard key={fabric.id} fabric={fabric} categorySlug={categorySlug} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No se encontraron telas con esos filtros.
        </p>
      )}
    </div>
  )
}
```

### Pattern 2: Fabric Detail as Server Component with Cross-References

**What:** The fabric detail page is a pure Server Component. It resolves all data at build time: the fabric itself, its parent category (for color theming and breadcrumb), all categories that reference this fabric (for cross-links), and resolved technology objects (for tooltips).

**Why:** No interactivity needed on the detail page. Everything is informational. Pure Server Component = zero client JS, faster load.

```typescript
// app/uso/[slug]/[fabricId]/page.tsx
export default async function FabricDetailPage({
  params,
}: {
  params: Promise<{ slug: string; fabricId: string }>
}) {
  const { slug, fabricId } = await params
  const category = getCategoryBySlug(slug)
  const fabric = getFabricBySlug(fabricId)
  if (!category || !fabric) notFound()

  const allCategories = getCategoriesByFabric(fabricId)
  const otherCategories = allCategories.filter(c => c.id !== slug)
  const resolvedTechs = fabric.technologies
    .map(getTechnologyById)
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb items={[
        { label: 'Usos', href: '/usos' },
        { label: category.name, href: `/uso/${slug}` },
        { label: fabric.name },
      ]} />

      <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Left: product image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image src={fabric.image} alt={fabric.name} fill className="object-cover" />
          {fabric.isNew && <NewBadge />}
        </div>

        {/* Right: specs */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold">{fabric.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Base {fabric.base}</p>
          <FabricSpecsTable fabric={fabric} />
          <TechnologyRow technologies={resolvedTechs} />
          <PrintRoutesChips routes={fabric.printRoutes} />
          {otherCategories.length > 0 && (
            <CrossCategoryLinks categories={otherCategories} fabricId={fabricId} />
          )}
        </div>
      </div>

      <BackLink href={`/uso/${slug}`} label={category.name} />
    </div>
  )
}
```

### Pattern 3: No External Search Library

**What:** For search/filter, use plain JavaScript -- no Fuse.js, no MiniSearch.

**Why:** The dataset is 31 fabrics, max 9 per category page. A case-insensitive `String.includes()` is more than sufficient for "fuzzy-enough" search. Adding a library for 31 items adds bundle size for zero practical benefit. The `weight` and `width` fields need `parseFloat()` for numeric sorting, which is trivial.

**When to reconsider:** If the catalog grows beyond ~200 items OR if users need typo-tolerant search (unlikely for a salesperson who knows the product names).

```typescript
// Simple search -- no library needed
function matchesFabric(fabric: Fabric, query: string): boolean {
  const q = query.toLowerCase().trim()
  return (
    fabric.name.toLowerCase().includes(q) ||
    fabric.base.includes(q) ||
    fabric.composition.toLowerCase().includes(q)
  )
}
```

### Pattern 4: New Data Files Follow Existing Convention

**What:** New data files (`personalization.ts`, `collars.ts`) follow the exact same pattern as existing files: export a `const` array with `as const satisfies readonly Type[]`, define types in `types.ts`, add getters in `helpers.ts`, re-export from `index.ts`.

```typescript
// lib/content/types.ts — ADD these interfaces
export interface PersonalizationOption {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly image: string
}

export interface CollarColor {
  readonly name: string
  readonly hex: string
}

export interface CollarData {
  readonly colors: readonly CollarColor[]
  readonly sizesChildren: readonly string[]
  readonly sizesAdult: readonly string[]
  readonly description: string
}
```

```typescript
// lib/content/personalization.ts — NEW file
import type { PersonalizationOption } from './types'

export const PERSONALIZATION_OPTIONS = [
  {
    id: 'dibujos-exclusivos',
    name: 'Dibujos Exclusivos',
    description: 'Disenos unicos para la identidad de cada colegio',
    image: '/images/content/personalizacion-dibujos.webp',
  },
  // ... 3 more
] as const satisfies readonly PersonalizationOption[]
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using searchParams for Filtering

**What:** Reading `searchParams` in the category page component to drive filter state.
**Why bad:** Any page that accepts `searchParams` becomes dynamically rendered. This breaks SSG entirely -- the page would need a server function on every request. The build would no longer produce static HTML for category pages.
**Instead:** Use `useState` in a client component. Filter state lives in React state, not in the URL. For this internal tool, URL-shareable filters are unnecessary.

### Anti-Pattern 2: Separate Filter Route

**What:** Creating `/uso/[slug]/filter` or using route groups to separate filtered vs unfiltered views.
**Why bad:** Over-engineering for 31 total fabrics. Creates maintenance burden (two route files for the same page) and confuses navigation.
**Instead:** Single category page with a client component island that handles all filtering inline.

### Anti-Pattern 3: Global Search Page

**What:** Building a dedicated `/buscar` page with cross-category search.
**Why bad:** The sales tool is category-driven. The salesperson navigates to a category first, then explores fabrics. A global search page fights the navigation model and is out of scope.
**Instead:** Search is scoped per-category within the FilterableFabricGrid on each `/uso/[slug]` page.

### Anti-Pattern 4: TechnologyTooltip as Client Component

**What:** Making tooltips interactive with hover state managed by React state.
**Why bad:** Adds unnecessary `'use client'` boundary and JS to the fabric detail page. CSS-only tooltips work perfectly for desktop/tablet hover.
**Instead:** Use CSS `:hover` with `group` and hidden tooltip div. Pure CSS, zero JS, works on all target devices (laptop/tablet with hover support).

```tsx
// TechnologyTooltip — Server Component, CSS-only hover
export function TechnologyTooltip({ tech }: { tech: Technology }) {
  return (
    <div className="group relative inline-flex items-center">
      {tech.icon && (
        <Image src={tech.icon} alt={tech.name} width={32} height={32} />
      )}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                       hidden group-hover:block bg-foreground text-background
                       text-xs rounded px-2 py-1 whitespace-nowrap z-10">
        <p className="font-semibold">{tech.name}</p>
        <p className="opacity-80">{tech.description}</p>
      </div>
    </div>
  )
}
```

## New Component Inventory

### Components to CREATE (7)

| Component | File | Client? | Props | Purpose |
|-----------|------|---------|-------|---------|
| `FilterableFabricGrid` | `components/filterable-fabric-grid.tsx` | YES | `fabrics, technologies, categorySlug` | Wrapper: search + filter + sort state + renders FabricCard grid |
| `FabricFilterBar` | `components/fabric-filter-bar.tsx` | YES | `technologies, selectedTechs, search, sortBy, callbacks, counts` | UI: search input, tech filter chips, sort dropdown, result count |
| `FabricSpecsTable` | `components/fabric-specs-table.tsx` | No | `fabric: Fabric` | Table/grid showing composition, weight, width, weave, base |
| `TechnologyTooltip` | `components/technology-tooltip.tsx` | No | `tech: Technology` | Icon with CSS hover tooltip |
| `TechnologyCard` | `components/technology-card.tsx` | No | `tech: Technology, fabricCount: number` | Full card for /tecnologias grid |
| `PersonalizationCard` | `components/personalization-card.tsx` | No | `option: PersonalizationOption` | Card with image + text for /personalizacion grid |
| `CollarSection` | `components/collar-section.tsx` | No | `data: CollarData` | Colors grid + sizes table for /cuellos |

### Components to MODIFY (2)

| Component | Change | Reason |
|-----------|--------|--------|
| `fabric-card.tsx` | Add `isNew` badge rendering, accept possibly updated image paths | Support new badge feature, fix placeholder image issue |
| `nav-links.tsx` | Change `pathname.startsWith('/usos')` to `pathname.startsWith('/uso')` | Fix active state bug on category pages (known tech debt) |

### Data Files to CREATE (2)

| File | Contents | Pattern |
|------|----------|---------|
| `lib/content/personalization.ts` | `PERSONALIZATION_OPTIONS` array (4 items from PDF p.15) | Same `as const satisfies` pattern |
| `lib/content/collars.ts` | `COLLAR_DATA` object (colors, sizes from PDF p.16-17) | Same typed constant pattern |

### Data Files to MODIFY (3)

| File | Change |
|------|--------|
| `lib/content/types.ts` | Add `PersonalizationOption`, `CollarColor`, `CollarData` interfaces |
| `lib/content/fabrics.ts` | Map real product images to 31 fabric records (replace `placeholder.webp`) |
| `lib/content/index.ts` | Add exports for `PERSONALIZATION_OPTIONS`, `COLLAR_DATA`, new types |

## Route Inventory (v1.1)

| Route | SSG Params | Status | Client JS? |
|-------|------------|--------|------------|
| `/` | N/A (static) | No change | Minimal (nav only) |
| `/usos` | N/A (static) | No change | Minimal (nav only) |
| `/uso/[slug]` | 8 params from CATEGORIES | **Modified** (add FilterableFabricGrid) | YES (filter/search/sort) |
| `/uso/[slug]/[fabricId]` | ~43 params from CATEGORIES x fabricIds | **Rewritten** (full detail) | Minimal (nav only) |
| `/tecnologias` | N/A (static) | **Rewritten** (full content) | Minimal (nav only) |
| `/personalizacion` | N/A (static) | **Rewritten** (full content) | Minimal (nav only) |
| `/cuellos` | N/A (static) | **Rewritten** (full content) | Minimal (nav only) |

**Total routes:** 51 (unchanged -- same generateStaticParams output)
**Client JS impact:** Only `/uso/[slug]` pages gain meaningful client JS (FilterableFabricGrid + FabricFilterBar). All other pages remain Server Component-only with JS limited to existing nav components.

## Build Order (Dependency-Respecting)

The following order ensures each step only depends on completed work:

```
Phase 1: Tech Debt + Data Foundation
├── Fix nav-links.tsx active state ('/usos' → '/uso')
├── Map real product images to fabrics.ts (replace placeholder.webp)
├── Remove unused CVA dependency
├── Add PersonalizationOption, CollarColor, CollarData to types.ts
├── Create personalization.ts (4 items from PDF)
├── Create collars.ts (colors + sizes from PDF)
└── Update index.ts barrel exports
    Dependencies: none (pure data/fix work)

Phase 2: Fabric Detail Page
├── Create FabricSpecsTable component
├── Create TechnologyTooltip component (CSS-only)
├── Modify fabric-card.tsx (isNew badge)
├── Rewrite uso/[slug]/[fabricId]/page.tsx with full layout
└── Verify: all 43 fabric detail routes render correctly
    Dependencies: Phase 1 (needs real images, types)

Phase 3: Content Section Pages
├── Create TechnologyCard component
├── Create PersonalizationCard component
├── Create CollarSection component
├── Rewrite tecnologias/page.tsx
├── Rewrite personalizacion/page.tsx
├── Rewrite cuellos/page.tsx
└── Verify: 3 section pages render with real content
    Dependencies: Phase 1 (needs new data files)
    Note: Can run in PARALLEL with Phase 2

Phase 4: Search / Filter / Sort
├── Create FabricFilterBar component
├── Create FilterableFabricGrid component
├── Modify uso/[slug]/page.tsx to use FilterableFabricGrid
├── Verify: filtering, sorting, search work on all 8 category pages
└── Verify: SSG still works (no searchParams, no dynamic rendering)
    Dependencies: Phase 2 (FabricCard must be finalized first)

Phase 5: Responsive + Deploy
├── Verify all new components at lg and md breakpoints
├── Verify Vercel build succeeds with SSG < 2s
├── Deploy to Vercel
└── Final E2E walkthrough
    Dependencies: Phases 1-4 complete
```

**Phase ordering rationale:**
1. **Phase 1 first** because every subsequent phase depends on correct data (real images, new types, new data files). Tech debt fixes are quick wins that unblock everything.
2. **Phase 2 and 3 can parallelize** because they have no mutual dependencies -- both only depend on Phase 1's data foundation. However, sequential execution is safer for a single developer.
3. **Phase 4 after Phase 2** because FilterableFabricGrid renders FabricCard components. The FabricCard modifications (isNew badge, image fixes) must be stable before wrapping in filter logic.
4. **Phase 5 last** because responsive polish and deploy require all features complete.

## Scalability Considerations

| Concern | Current (31 fabrics) | At 100 fabrics | At 500 fabrics |
|---------|---------------------|----------------|----------------|
| Client-side filtering | Instant. Array operations on <10 items per category. | Still instant. Even 100 items filter in <1ms. | Consider server-side filtering or Fuse.js. |
| SSG build time | ~43 fabric detail routes, trivial. | ~150 routes, still <30s build. | May need ISR or on-demand revalidation. |
| FilterableFabricGrid bundle | ~2KB component. | Same. | Same -- the component doesn't scale with data. |
| Embedded data in HTML | ~5KB per category page. | ~15KB per page. | Consider fetching from API instead of embedding. |
| Image loading on grid | 4-9 images, fine. | Consider lazy loading + pagination. | Virtualized grid needed. |

**For v1.1 (31 fabrics):** Zero scaling concerns. The architecture is perfectly matched to the data size.

## Sources

- [Next.js Official: Static Site Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation) -- HIGH confidence
- [Next.js Official: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- HIGH confidence
- [Next.js searchParams breaks static generation (GitHub Discussion #58884)](https://github.com/vercel/next.js/discussions/58884) -- HIGH confidence (official repo)
- [Fix searchParams killing static generation](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix) -- MEDIUM confidence (community, verified pattern)
- [Next.js Official: Client-side Rendering](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering) -- HIGH confidence
- [Fuse.js vs MiniSearch comparison (npm-compare)](https://npm-compare.com/elasticlunr,flexsearch,fuse.js,minisearch) -- MEDIUM confidence (used to validate "no library needed" decision)
- Existing codebase analysis (all files in `src/`) -- HIGH confidence (direct code inspection)
- v1.0 Milestone Audit (`.planning/milestones/v1.0-MILESTONE-AUDIT.md`) -- HIGH confidence (internal document)

---
*Architecture research for: Lafayette Uni For Me Colegios v1.1 -- Catalogo Completo*
*Researched: 2026-02-22*
