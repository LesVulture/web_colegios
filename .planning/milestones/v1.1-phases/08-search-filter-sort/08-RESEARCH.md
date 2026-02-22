# Phase 8: Search, Filter & Sort - Research

**Researched:** 2026-02-22
**Domain:** Client-side filtering, sorting, and fuzzy search in Next.js App Router SSG pages
**Confidence:** HIGH

## Summary

Phase 8 adds interactive filtering (by technology), sorting (by weight/width), and fuzzy search (by fabric name) to the 8 existing category pages (`/uso/[slug]`). The critical architectural constraint is preserving SSG: the category pages currently use `generateStaticParams` + `dynamicParams = false` in a Server Component, and this must remain unchanged.

The solution follows the "client island" pattern already established in the project (see `CategorySidebar` which is already `'use client'`). A new `FilterableFabricGrid` Client Component will wrap the existing `FabricCard` components, receiving the full fabric list as props from the Server Component page. All filter/sort/search state lives in `useState` -- this is a locked project decision (NOT `useSearchParams`). Fuse.js 7.1.0 handles fuzzy search with zero dependencies and ships its own TypeScript types.

**Primary recommendation:** Create a single `FilterableFabricGrid` Client Component that receives `fabrics` and `categorySlug` as props from the Server Component page. Encapsulate all filter, sort, and search state inside it. Use `useMemo` to derive filtered results during render (never `useEffect` for derived state). Lazy-load Fuse.js via `useMemo` initialization to avoid bundle cost on pages where search is unused.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FILTER-01 | Filtrar telas por tecnologia con chips multi-select horizontales | Client island pattern with `useState<Set<string>>` for selected technologies. Derive filtered list with `useMemo`. Technology chips rendered from `TECHNOLOGIES` array (14 items). Multi-select toggle behavior. |
| FILTER-02 | Ordenar telas por gramaje y ancho (sort numerico) | Parse numeric value from weight/width strings (regex `parseInt()` on first number). Sort with `Array.prototype.toSorted()` for immutability. Dropdown or segmented control for sort field + direction. |
| FILTER-03 | Busqueda fuzzy global por nombre de tela con fuse.js | Fuse.js 7.1.0 with `keys: ['name']`, `threshold: 0.4`, `ignoreLocation: true`. Debounce input at 200-300ms. `useMemo` to create Fuse instance. Return all fabrics when query is empty. |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| fuse.js | 7.1.0 | Fuzzy text search | Zero dependencies, ~5KB gzipped, built-in TypeScript types, de facto standard for client-side fuzzy search. Already a locked project decision in STATE.md |
| React (useState, useMemo) | 19.2.3 | Client-side state management | Already in project. useState for filter/sort/search state, useMemo for derived filtered results |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.575.0 | Icons for sort arrows, search icon, clear button | Already in project. Use Search, ChevronDown, X, ArrowUpDown icons |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| fuse.js | microfuzz | Smaller (~1KB) but less configureable, no score control. Fuse.js is locked project decision |
| fuse.js | Native String.includes() | No typo tolerance. Requirement explicitly demands typo tolerance |
| useState | useSearchParams | URL-based state would break SSG (causes dynamic rendering). Project decision is useState |
| useMemo for filtering | useEffect + state | Anti-pattern: causes extra render, state drift. Derive during render per React docs |

**Installation:**
```bash
bun add fuse.js
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/uso/[slug]/page.tsx          # Server Component (unchanged generateStaticParams)
├── components/
│   ├── filterable-fabric-grid.tsx    # NEW: 'use client' island wrapping FabricCard
│   ├── fabric-card.tsx              # UNCHANGED: Server-compatible, no 'use client'
│   ├── tech-filter-chips.tsx        # NEW: Multi-select technology chips (inline or extracted)
│   └── fabric-search-bar.tsx        # NEW: Search input with debounce (inline or extracted)
├── lib/
│   ├── content/helpers.ts           # ADD: parseNumericWeight(), parseNumericWidth()
│   └── utils.ts                     # EXISTING: cn() helper
```

### Pattern 1: Client Island Inside Server Page (SSG-safe)

**What:** The page.tsx remains a Server Component with `generateStaticParams`. It passes data to a `'use client'` child component.
**When to use:** Always -- this is the ONLY way to combine SSG + interactive state.

**How it works:**
1. `page.tsx` (Server Component) calls `getFabricsByCategory(slug)` at build time
2. Passes `fabrics` array and `categorySlug` as serializable props to `FilterableFabricGrid`
3. `FilterableFabricGrid` (`'use client'`) manages all interactive state
4. SSG is preserved: `generateStaticParams` stays in the Server Component

**Evidence:** Verified via Next.js GitHub Discussion #65442 and official docs: "use client" child components inside pages with `generateStaticParams` remain SSG. The page HTML is pre-rendered at build time; the client component hydrates on the client.

```typescript
// app/uso/[slug]/page.tsx (Server Component - keeps SSG)
import { FilterableFabricGrid } from '@/components/filterable-fabric-grid'

export default async function CategoryPage({ params }) {
  const { slug } = await params
  const fabrics = getFabricsByCategory(slug)
  // ... breadcrumb, header, sidebar remain here ...

  return (
    <div className="flex-1">
      <FilterableFabricGrid fabrics={fabrics} categorySlug={slug} />
    </div>
  )
}
```

```typescript
// components/filterable-fabric-grid.tsx
'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Fabric } from '@/lib/content/types'
import { FabricCard } from './fabric-card'

// ... state management + rendering
```

### Pattern 2: Derive Filtered Results with useMemo (No useEffect)

**What:** All filtering, sorting, and searching computed as derived state during render.
**When to use:** Always -- per React docs "You Might Not Need an Effect" and project skill `rerender-derived-state-no-effect`.

```typescript
const filteredFabrics = useMemo(() => {
  let result = fabrics

  // 1. Fuzzy search
  if (searchQuery.trim()) {
    const fuse = new Fuse(result, { keys: ['name'], threshold: 0.4, ignoreLocation: true })
    result = fuse.search(searchQuery).map(r => r.item)
  }

  // 2. Technology filter (AND or OR -- recommendation: OR for multi-select)
  if (selectedTechs.size > 0) {
    result = result.filter(f =>
      f.technologies.some(t => selectedTechs.has(t))
    )
  }

  // 3. Sort
  if (sortField) {
    result = [...result].sort((a, b) => {
      const va = sortField === 'weight' ? parseNumericWeight(a.weight) : parseNumericWidth(a.width)
      const vb = sortField === 'weight' ? parseNumericWeight(b.weight) : parseNumericWidth(b.width)
      return sortDirection === 'asc' ? va - vb : vb - va
    })
  }

  return result
}, [fabrics, searchQuery, selectedTechs, sortField, sortDirection])
```

### Pattern 3: Parsing Numeric Values from Spec Strings

**What:** Extract the nominal numeric value from weight/width strings for sorting.
**Why needed:** Weight format is `"110 +-10 g/m2"` and width is `"151 +- 2 cm"`. The first number is the nominal value.

```typescript
// lib/content/helpers.ts
export function parseNumericWeight(weight: string): number {
  const match = weight.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function parseNumericWidth(width: string): number {
  const match = width.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}
```

**Data validation:** All 31 fabrics use consistent format where the first characters are digits. The regex `^(\d+)` will correctly extract: `"110 +-10 g/m2"` -> `110`, `"151 +- 2 cm"` -> `151`.

### Pattern 4: Fuse.js Instance Memoization

**What:** Create the Fuse instance once per fabric list, not on every render.

```typescript
const fuse = useMemo(
  () => new Fuse(fabrics, {
    keys: ['name'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }),
  [fabrics]
)
```

**Configuration rationale:**
- `threshold: 0.4` -- Moderately tolerant. Default 0.6 is too loose for short fabric names (4-15 chars). 0.4 catches "Vendval" -> "Vendaval" but rejects "xyz" -> "Apolo"
- `ignoreLocation: true` -- Fabric names are short; position in string doesn't matter
- `minMatchCharLength: 2` -- Avoid matching on single characters
- `keys: ['name']` -- Only search fabric names, not IDs or compositions

### Anti-Patterns to Avoid

- **useEffect for filtering:** Causes extra render cycle, state drift, and stale results. Always derive with `useMemo`.
- **useSearchParams for state:** Deoptimizes SSG to dynamic rendering. Project decision is `useState`.
- **Creating Fuse instance inside filter function:** Expensive. Memoize the instance, only search changes.
- **`'use client'` on page.tsx:** Breaks `generateStaticParams`. Only child components should be client.
- **Mutating arrays:** Use `toSorted()` or spread+sort, never `Array.prototype.sort()` on the original array.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fuzzy text search | Custom Levenshtein/n-gram matching | fuse.js 7.1.0 | Edge cases in Unicode, scoring algorithms, configurable thresholds. Project decision |
| Debounce function | Custom setTimeout/clearTimeout | Inline closure or extracted utility | Simple enough: ~5 lines. No external debounce library needed for one input |
| Multi-select chip UI | Custom checkbox group | Tailwind-styled buttons with `Set<string>` toggle | Project already has chip patterns in FabricCard tech chips |

**Key insight:** The filtering/sorting logic itself is simple (array methods). The complexity is in UX: search debouncing, visual feedback (chip selected states, sort direction indicators, empty state messaging, result count). Don't overthink the data flow; invest time in the interaction polish.

## Common Pitfalls

### Pitfall 1: useSearchParams Deoptimizing SSG

**What goes wrong:** Using `useSearchParams()` in a Client Component within a `generateStaticParams` page causes Next.js to fall back to dynamic rendering because the search params are unknown at build time.
**Why it happens:** Next.js treats pages using `useSearchParams` as needing runtime server rendering.
**How to avoid:** Use `useState` for all filter/sort/search state. This is already the project decision.
**Warning signs:** Build output shows "lambda" instead of "static" for `/uso/[slug]` routes.

### Pitfall 2: FabricCard Client Component Boundary Creep

**What goes wrong:** Adding `'use client'` to `FabricCard` or pulling it into the `FilterableFabricGrid` import tree causes the card (with `next/image`) to lose Server Component benefits.
**Why it happens:** `'use client'` cascades: everything imported by a client component becomes client code.
**How to avoid:** `FabricCard` stays as-is (no `'use client'` directive). It works inside a Client Component because React renders it as a client component tree leaf. The `next/image` component works in both server and client contexts.
**Warning signs:** Increased JavaScript bundle size; `FabricCard` appears in client bundle analysis.

### Pitfall 3: Filtering Returns Stale Results

**What goes wrong:** Using `useEffect` to set a `filteredFabrics` state causes results to lag by one render behind the current filter selections.
**Why it happens:** `useEffect` runs after render, so the UI shows previous filter results for one frame.
**How to avoid:** Use `useMemo` to compute filtered results synchronously during render.
**Warning signs:** UI flickers when changing filters; brief flash of unfiltered content.

### Pitfall 4: Empty State Not Handled

**What goes wrong:** When filters are too restrictive and no fabrics match, the grid shows a blank area with no explanation.
**Why it happens:** Developer forgets to add an empty state message.
**How to avoid:** Always render an empty state: "No se encontraron telas con estos filtros." with a "Limpiar filtros" button.
**Warning signs:** Visual testing with extreme filter combinations produces blank page.

### Pitfall 5: Debounce Not Applied to Search

**What goes wrong:** Fuse.js search runs on every keystroke, causing jank on slower devices.
**Why it happens:** Input onChange directly triggers state update.
**How to avoid:** Debounce the search query state update by 200-300ms. Keep a separate `inputValue` for the controlled input and debounce updates to `searchQuery`.
**Warning signs:** Perceptible lag when typing quickly in search bar.

### Pitfall 6: Sort Mutates Original Array

**What goes wrong:** Using `Array.prototype.sort()` directly on the filtered results mutates the underlying data, causing unpredictable behavior on re-renders.
**Why it happens:** JavaScript `sort()` mutates in-place.
**How to avoid:** Use `[...result].sort()` or `result.toSorted()` (ES2023, supported in all modern browsers and current Node.js).
**Warning signs:** Filter results change unexpectedly; different results on consecutive renders with same inputs.

## Code Examples

### Complete FilterableFabricGrid Skeleton

```typescript
// components/filterable-fabric-grid.tsx
'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Search, X, ArrowUpDown } from 'lucide-react'
import type { Fabric } from '@/lib/content/types'
import { TECHNOLOGIES } from '@/lib/content'
import { FabricCard } from './fabric-card'
import { parseNumericWeight, parseNumericWidth } from '@/lib/content/helpers'
import { cn } from '@/lib/utils'

type SortField = 'weight' | 'width' | null
type SortDirection = 'asc' | 'desc'

export function FilterableFabricGrid({
  fabrics,
  categorySlug,
}: {
  fabrics: readonly Fabric[]
  categorySlug: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Memoize Fuse instance
  const fuse = useMemo(
    () => new Fuse([...fabrics], {
      keys: ['name'],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }),
    [fabrics]
  )

  // Only show technologies that exist in this category's fabrics
  const availableTechs = useMemo(() => {
    const techIds = new Set(fabrics.flatMap(f => [...f.technologies]))
    return TECHNOLOGIES.filter(t => techIds.has(t.id))
  }, [fabrics])

  // Derive filtered + sorted results
  const filteredFabrics = useMemo(() => {
    let result: Fabric[] = [...fabrics]

    // 1. Fuzzy search
    if (searchQuery.trim().length >= 2) {
      result = fuse.search(searchQuery).map(r => r.item)
    }

    // 2. Technology filter (OR logic: fabric must have at least one selected tech)
    if (selectedTechs.size > 0) {
      result = result.filter(f =>
        f.technologies.some(t => selectedTechs.has(t))
      )
    }

    // 3. Sort
    if (sortField) {
      const parseFn = sortField === 'weight' ? parseNumericWeight : parseNumericWidth
      result = result.toSorted((a, b) => {
        const va = parseFn(a[sortField])
        const vb = parseFn(b[sortField])
        return sortDirection === 'asc' ? va - vb : vb - va
      })
    }

    return result
  }, [fabrics, searchQuery, selectedTechs, sortField, sortDirection, fuse])

  const toggleTech = (techId: string) => {
    setSelectedTechs(prev => {
      const next = new Set(prev)
      if (next.has(techId)) next.delete(techId)
      else next.add(techId)
      return next
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTechs(new Set())
    setSortField(null)
  }

  const hasActiveFilters = searchQuery || selectedTechs.size > 0 || sortField

  return (
    <div>
      {/* Search bar */}
      {/* Technology filter chips */}
      {/* Sort controls */}
      {/* Result count + clear filters */}

      {/* Fabric grid */}
      {filteredFabrics.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredFabrics.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} categorySlug={categorySlug} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron telas con estos filtros.</p>
          <button onClick={clearFilters} className="mt-3 text-sm text-brand-primary underline">
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
```

### Debounced Search Input Pattern

```typescript
// Inside FilterableFabricGrid or extracted component
const [inputValue, setInputValue] = useState('')
const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setInputValue(value)
  if (debounceRef.current) clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(() => setSearchQuery(value), 250)
}

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }
}, [])
```

### Technology Filter Chips UI

```typescript
// Horizontal scrollable chip bar
<div className="flex flex-wrap gap-2">
  {availableTechs.map((tech) => (
    <button
      key={tech.id}
      onClick={() => toggleTech(tech.id)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        selectedTechs.has(tech.id)
          ? 'bg-brand-primary text-brand-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-border'
      )}
    >
      <TechIcon icon={tech.icon} size={14} />
      {tech.name}
    </button>
  ))}
</div>
```

### Sort Controls UI

```typescript
// Simple sort buttons
<div className="flex items-center gap-2">
  <span className="text-sm text-muted-foreground">Ordenar:</span>
  {(['weight', 'width'] as const).map((field) => (
    <button
      key={field}
      onClick={() => {
        if (sortField === field) {
          setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        } else {
          setSortField(field)
          setSortDirection('asc')
        }
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm transition-colors',
        sortField === field
          ? 'bg-brand-primary text-brand-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-border'
      )}
    >
      {field === 'weight' ? 'Gramaje' : 'Ancho'}
      {sortField === field && (
        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  ))}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useEffect for derived state | useMemo / inline computation | React 18+ docs update (2022) | Eliminates extra renders, state drift |
| Array.prototype.sort() mutation | toSorted() immutable sort | ES2023 (baseline 2024) | Safer, no side effects |
| forwardRef in React | ref as regular prop | React 19 (2024) | Simpler component signatures |
| useSearchParams for filters | useState (in SSG context) | Next.js App Router maturity (2024) | Preserves SSG, avoids dynamic rendering penalty |

**Deprecated/outdated:**
- `Array.prototype.sort()` for React state: Mutates in-place, causes subtle bugs. Use `toSorted()` instead (supported in all target browsers since this is desktop/tablet only).

## Open Questions

1. **Filter logic: OR vs AND for multi-select technologies**
   - What we know: OR logic ("show fabrics with ANY selected technology") is more common in e-commerce filtering and produces more results. AND logic ("show fabrics with ALL selected technologies") is more restrictive.
   - What's unclear: Which behavior the salesperson prefers.
   - Recommendation: **Use OR logic** (default in e-commerce). With categories having 4-9 fabrics, AND would quickly filter to zero results with 2+ selections. If user wants AND later, it's a 1-line change (`some` -> `every`).

2. **Debounce delay for search**
   - What we know: 200-300ms is standard. This is a desktop/tablet app used by a salesperson.
   - What's unclear: Exact typing speed in demo context.
   - Recommendation: **250ms**. Fast enough to feel responsive, slow enough to avoid unnecessary Fuse runs.

3. **Should search and filters interact?**
   - What we know: Most filter UIs apply all criteria simultaneously (search AND tech filter AND sort).
   - Recommendation: **Yes, apply all simultaneously.** This is the standard pattern. The useMemo chain handles it naturally.

4. **router.back() behavior with FilterableFabricGrid state**
   - What we know: STATE.md flags this as a concern. Since filters use `useState` (not URL), pressing browser back from a fabric detail page returns to the category page with filters reset.
   - Recommendation: **Accept the reset.** With 4-9 fabrics per category, re-applying filters takes 1-2 clicks. Persisting state across navigation would require URL params (breaks SSG) or a global store (over-engineering). Verify empirically during implementation.

## Sources

### Primary (HIGH confidence)
- [Fuse.js official docs](https://www.fusejs.io/) - API, options, installation (v7.1.0)
- [Fuse.js configuration options](https://www.fusejs.io/api/options.html) - All options with defaults verified
- [Next.js GitHub Discussion #65442](https://github.com/vercel/next.js/discussions/65442) - `"use client"` components ARE still SSG
- [Next.js GitHub Discussion #50603](https://github.com/vercel/next.js/discussions/50603) - `generateStaticParams` only in Server Components, child Client Components OK
- [Next.js official docs: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - Island pattern

### Secondary (MEDIUM confidence)
- [Implementing Fuzzy Search in React with Fuse.js](https://blogs.perficient.com/2025/03/17/implementing-a-fuzzy-search-in-react-js-using-fuse-js/) - useMemo memoization pattern, debounce best practice
- Project skill `vercel-react-best-practices` rules: `rerender-derived-state-no-effect`, `bundle-dynamic-imports`

### Project Sources (HIGH confidence)
- `.planning/STATE.md` - Locked decisions: useState (NOT useSearchParams), fuse.js 7.1.0, FilterableFabricGrid architecture
- `.planning/REQUIREMENTS.md` - FILTER-01, FILTER-02, FILTER-03 specifications
- `src/app/uso/[slug]/page.tsx` - Current Server Component page structure (to be modified)
- `src/lib/content/fabrics.ts` - Weight/width string format verified for all 31 fabrics
- `src/components/category-sidebar.tsx` - Existing `'use client'` island pattern precedent

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - fuse.js 7.1.0 is a locked project decision, verified via official docs
- Architecture: HIGH - Client island pattern verified via Next.js official docs and GitHub discussions. Precedent exists in project (CategorySidebar)
- Pitfalls: HIGH - All pitfalls derived from official React/Next.js docs or verified project patterns
- Data parsing: HIGH - All 31 fabric weight/width formats manually verified via grep

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (stable domain, no expected breaking changes)
