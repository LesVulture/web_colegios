# Pitfalls Research

**Domain:** Adding fabric detail pages, search/filter/sort, content sections, and Vercel deploy to an existing Next.js 16 SSG catalog app with TypeScript data layer
**Researched:** 2026-02-22
**Confidence:** HIGH (verified via official Next.js docs, Tailwind v4 docs, codebase audit, and v1.0 MILESTONE-AUDIT cross-reference)

---

## Critical Pitfalls

### Pitfall 1: Placeholder Image 404 Cascades Into Every New Feature

**What goes wrong:**
All 31 fabrics in `fabrics.ts` reference `/images/products/placeholder.webp` which does not exist. 14 real images exist in `/public/images/products/` but are unmapped. When building the fabric detail page, the developer uses `fabric.image` assuming it works -- the detail page renders with a broken image. Worse: if the developer builds the detail page first without fixing this, the broken image becomes "normal" and propagates into screenshots, QA, and demo. Every feature that renders a fabric image (detail pages, search results, filter previews) inherits this 404.

**Why it happens:**
The placeholder was a v1.0 intentional shortcut -- cards were built knowing images would be mapped later. But the mapping never happened. New features built on top of the existing data layer silently consume the broken `image` field without questioning it.

**How to avoid:**
1. Fix the image mapping BEFORE any new feature work. Map each of the 14 real product images to their corresponding fabric IDs in `fabrics.ts`. For the ~17 fabrics without a dedicated image, either create a real `placeholder.webp` fallback or use a category-colored placeholder generated at build time.
2. Add a build-time validation step: a script or type assertion that ensures every `fabric.image` path resolves to a file in `public/`.
3. The detail page must not be the place where this debt is discovered -- it should be resolved in the tech debt cleanup phase.

**Warning signs:**
- Any `<Image src={fabric.image}>` rendering a 404 in the Network tab
- Console warnings about missing image files during `bun run build`
- Detail pages built and "working" without anyone checking if the image actually loads

**Phase to address:**
Phase 1 (Tech Debt Cleanup) -- This is a blocker for ALL image-dependent features. Must be the first thing resolved.

---

### Pitfall 2: useSearchParams in Filter/Search Deoptimizes SSG Pages to Client-Side Rendering

**What goes wrong:**
The developer adds search/filter/sort to the category page `/uso/[slug]` using `useSearchParams()` to read filter state from the URL. Without a `<Suspense>` boundary wrapping the component that calls `useSearchParams`, Next.js deoptimizes the ENTIRE page tree to client-side rendering. The page that was previously statically generated at build time (SSG) now renders a blank shell until client JS loads and executes. SSG target of <2s initial load is blown.

**Why it happens:**
`useSearchParams()` reads runtime URL data that does not exist at build time. When Next.js encounters it without a Suspense boundary, it cannot statically render anything above that component in the tree -- so the entire page becomes CSR. The official Next.js docs explicitly warn: "calling useSearchParams will cause the Client Component tree up to the closest Suspense boundary to be client-side rendered." This is especially insidious because the category page CURRENTLY works as SSG (it has `generateStaticParams` and `dynamicParams = false`).

**How to avoid:**
1. **Do NOT put filter/search state in URL search params for SSG pages.** For a catalog with 31 fabrics used in-person (no shareable URLs needed), client-side React state (`useState`) is simpler and preserves SSG.
2. If URL-based filter state is desired anyway, isolate all `useSearchParams()` usage inside a dedicated client component wrapped in `<Suspense fallback={...}>`:
```tsx
// Category page (Server Component, stays SSG)
<Suspense fallback={<FilterSkeleton />}>
  <FilterBar /> {/* "use client" -- reads useSearchParams here */}
</Suspense>
<FabricGrid fabrics={allFabrics} /> {/* Server Component */}
```
3. The filter component passes state DOWN to a client-component grid, but the page shell itself stays SSG.
4. Test by running `bun run build` and checking the build output -- pages marked with a lambda icon are dynamic (bad), pages with a circle are static (good).

**Warning signs:**
- `bun run build` output changes `/uso/[slug]` from static (circle) to dynamic (lambda)
- Build warning: "Entire page deopted into client-side rendering"
- Category pages show a flash of empty content before filter UI appears
- The SkeletonCard component (currently orphaned) was never integrated as a Suspense fallback

**Phase to address:**
Phase 3 (Search/Filter/Sort) -- Architecture decision at the start of filter implementation. Must decide: URL state vs React state, and Suspense boundary placement.

---

### Pitfall 3: Fabric Detail Route Generates Duplicate Pages for Shared Fabrics

**What goes wrong:**
The current `generateStaticParams` in `/uso/[slug]/[fabricId]/page.tsx` iterates ALL categories and ALL their fabric IDs. Fabrics like `orion-clororresistente` appear in 3 categories (Sudaderas, Chaquetas Prom, Delantales). This generates 3 separate detail pages for the same fabric, each with a different category context: `/uso/sudaderas-chaquetas-pantalones/orion-clororresistente`, `/uso/chaquetas-prom/orion-clororresistente`, `/uso/delantales-batas-laboratorio/orion-clororresistente`. When the detail page shows "related fabrics" or "other categories", it must correctly handle this multi-category membership -- otherwise the user sees confusing navigation.

**Why it happens:**
The data model uses a many-to-many relationship: categories reference fabric IDs, and fabrics can belong to multiple categories. The `generateStaticParams` correctly generates all valid category-fabric combinations (43 routes total). But the detail page component currently ignores this -- it just shows the fabric name and a "back to category" link. When building a full detail page with "also found in" cross-references or "back" navigation, the developer must be aware that the same fabric has multiple valid parent categories.

**How to avoid:**
1. Use `getCategoriesByFabric(fabricId)` (already exists in `helpers.ts`, currently unused) to show "This fabric is also available in: [other categories]" on the detail page.
2. The `slug` param tells you which category the user came from -- use it for the "back" link but show all categories the fabric belongs to.
3. Do NOT deduplicate routes -- having `/uso/chaquetas-prom/orion-clororresistente` is correct because the user navigated from the Chaquetas Prom context. The detail page should maintain that context.
4. Verify that `getCategoriesByFabric` returns consistent results (it does -- it filters CATEGORIES by fabricId inclusion).

**Warning signs:**
- Detail page "back" button always goes to a hardcoded category instead of the one the user came from
- "Related fabrics" section shows fabrics from all categories instead of the current category
- Build generates 43 routes but developer only tested one

**Phase to address:**
Phase 2 (Fabric Detail Pages) -- Design the detail page layout with explicit awareness of multi-category fabric membership.

---

### Pitfall 4: NavLinks Active State Bug Breaks With New Content Section Routes

**What goes wrong:**
The existing bug in `nav-links.tsx` (line 35: `pathname.startsWith(item.href)`) already fails for `/uso/*` routes because the nav item points to `/usos` (with trailing 's'). When the 3 new content section routes (`/tecnologias`, `/personalizacion`, `/cuellos`) are built out as full pages replacing the current placeholders, the active state logic works for these pages individually. But the real problem is that the developer "fixes" the `/usos` issue by changing to `pathname.startsWith('/uso')` -- and this then ALSO matches `/usos` (since `/usos`.startsWith(`/uso`) is true), but does NOT match any future nested routes under these content sections if they get sub-pages.

**Why it happens:**
The routing convention is inconsistent: plural `/usos` is the index page, singular `/uso/[slug]` is the category page. The nav link points to `/usos`. `startsWith` is a blunt instrument for route matching that does not account for singular/plural or nested route hierarchies.

**How to avoid:**
1. Fix with a more precise active state check:
```tsx
const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  || (item.href === '/usos' && pathname.startsWith('/uso/'));
```
2. Or better: normalize the route structure. Change the nav href to `/uso` and make `/usos` redirect to `/uso`. This way `pathname.startsWith('/uso')` correctly captures `/uso`, `/uso/[slug]`, and `/uso/[slug]/[fabricId]`.
3. Apply the fix BEFORE building new content sections to avoid the same pattern propagating.

**Warning signs:**
- "Usos" nav item never highlights when on a category or fabric detail page
- After "fixing" the bug, test ALL nav items against ALL possible route paths
- New content sections have the same active state issue if they gain sub-routes later

**Phase to address:**
Phase 1 (Tech Debt Cleanup) -- Fix the NavLinks bug as part of tech debt before building new features that rely on correct navigation state.

---

### Pitfall 5: Vercel Deploy Fails Because next.config.ts Has No Image or Output Configuration

**What goes wrong:**
The current `next.config.ts` is essentially empty -- no `output`, no `images` configuration. When deploying to Vercel, this actually works fine because Vercel auto-detects Next.js and provides image optimization automatically. BUT: the developer may add `output: 'export'` thinking it's needed for "static" performance, which then breaks `next/image` (requires custom loader), breaks API routes (none needed, but kills the option), and changes the deployment model entirely. Alternatively, the developer may not configure `images.remotePatterns` if any external images are added later.

**Why it happens:**
Confusion between "SSG" (static generation of pages at build time, which works fine on Vercel WITH a Node.js runtime) and "static export" (generating pure HTML files with NO server runtime). The project wants SSG for speed, not static export. On Vercel, SSG pages are served from CDN edge automatically -- no `output: 'export'` needed.

**How to avoid:**
1. Do NOT add `output: 'export'` to next.config.ts. Vercel's standard Next.js deployment already serves SSG pages from CDN edge with full image optimization.
2. Keep `next.config.ts` minimal. The only additions needed for v1.1 are:
   - Optionally `images: { formats: ['image/webp'] }` if you want to ensure WebP priority (though Vercel defaults to this already).
3. Verify after deploy: check that the build log says "Generating static pages" for all `/uso/[slug]` and `/uso/[slug]/[fabricId]` routes.
4. Test: `bun run build` should show circle icons (static) for all pages, not lambda (dynamic).

**Warning signs:**
- Someone adds `output: 'export'` to next.config.ts
- Build errors about "Image Optimization API not compatible with static export"
- Build output shows "Generating static pages (0/N)" followed by errors
- Vercel build log shows "Dynamic pages" when all pages should be static

**Phase to address:**
Phase 4 (Vercel Deploy) -- Explicit documentation that SSG != static export. No config changes needed for basic Vercel deploy.

---

## Moderate Pitfalls

### Pitfall 6: Hex Color Duplication Between globals.css and categories.ts Creates Silent Drift

**What goes wrong:**
Category colors are defined in two places: `globals.css` (as `@theme` tokens like `--color-cat-sudaderas: #1B3A5C`) and `categories.ts` (as `color: '#1B3A5C'` on each category object). When building the detail page with category-colored elements, the developer uses the TypeScript `category.color` value via inline `style` attributes, while existing components use Tailwind classes from `globals.css`. If someone updates a color in one place but not the other, the same category renders in two different colors depending on which code path renders it.

**Why it happens:**
The v1.0 design system used Tailwind @theme tokens mapped through `CATEGORY_STYLE_MAP` (in `styles.ts`) for backgrounds/text. But the `Category` type also carries raw hex colors. Both exist for valid reasons -- Tailwind classes for static styling, hex values for dynamic use cases (inline styles, canvas, SVG). The duplication is the problem.

**How to avoid:**
1. Choose ONE source of truth. Recommended: keep `categories.ts` hex values as the canonical source, and derive Tailwind tokens from them.
2. For the detail page, use `CATEGORY_STYLE_MAP` for Tailwind class lookups (backgrounds, text) and `category.color` only for truly dynamic contexts (inline SVG fills, dynamic borders).
3. If consolidating, use CSS custom properties set via inline `style` on a wrapper element, then reference with `var()` in Tailwind utilities:
```tsx
<div style={{ '--cat-color': category.color } as React.CSSProperties}>
  <h1 className="text-[var(--cat-color)]">{category.name}</h1>
</div>
```
4. Document which source is canonical so future contributors don't re-introduce duplication.

**Warning signs:**
- Same element styled with both `className={CATEGORY_STYLE_MAP[id].bg}` and `style={{ backgroundColor: category.color }}`
- A color update in globals.css that isn't reflected in the category header of the detail page
- Visual diff in screenshots between category list page and detail page header

**Phase to address:**
Phase 1 (Tech Debt Cleanup) -- Consolidate before building new features that consume category colors (detail pages, filter chips).

---

### Pitfall 7: Fuse.js Fuzzy Search Re-instantiation on Every Render Kills Performance on Tablet

**What goes wrong:**
The developer adds Fuse.js for fuzzy search over the 31 fabrics, but creates the `Fuse` instance inside the component render function without memoization. Every keystroke re-creates the Fuse index (parsing all 31 records, building the search tree), causing visible input lag on iPad hardware where CPU is slower than a laptop.

**Why it happens:**
Fuse.js constructor is not free -- it builds an internal search index. For 31 records this is fast on modern laptops but noticeable on older iPads. The common tutorial pattern `const fuse = new Fuse(data, options)` inside a component body looks harmless but executes on every re-render (every keystroke triggers a state update, which triggers a re-render).

**How to avoid:**
1. Memoize the Fuse instance:
```tsx
const fuse = useMemo(() => new Fuse(fabrics, {
  keys: ['name', 'base', 'composition'],
  threshold: 0.4,
}), [fabrics]);
```
2. Debounce the search input (200-300ms) to avoid searching on every keystroke.
3. For 31 records, consider whether Fuse.js is even necessary. A simple `filter + includes` with `toLowerCase()` may be sufficient and avoids the dependency entirely. Fuzzy search adds value for typo tolerance (e.g., "vendval" matches "vendaval") but adds complexity.
4. Test search performance on an iPad, not just a MacBook.

**Warning signs:**
- Typing in the search box feels "laggy" or "delayed" on tablet
- React DevTools Profiler shows the filter component re-rendering on every keystroke with >10ms render time
- The `fuse` instance appears in the component profile as a new object on each render

**Phase to address:**
Phase 3 (Search/Filter) -- Implementation detail during search feature build.

---

### Pitfall 8: Filter State Resets When Navigating to Detail Page and Back

**What goes wrong:**
User filters fabrics on the category page (e.g., "show only fabrics with proteccion-solar"), then clicks a fabric to see its detail page, then hits "back" -- the filter is gone. All fabrics show again. The vendedor has to re-apply the filter, losing flow during the meeting presentation.

**Why it happens:**
With Next.js App Router, navigating from `/uso/[slug]` to `/uso/[slug]/[fabricId]` replaces the page component. If filter state lives in `useState` (recommended for SSG preservation, see Pitfall 2), that state is destroyed when the page unmounts. When navigating back, the page remounts with default state.

**How to avoid:**
Three options, in order of simplicity:
1. **Browser back navigation:** Use `router.back()` for the "Volver" link on the detail page instead of a `<Link>`. Browser back restores the previous page from the cache including its React state (if using client-side navigation). Test this -- Next.js App Router preserves the previous page's state on back navigation.
2. **URL search params (with Suspense):** Store filter state in URL params (`?tech=proteccion-solar`). Survives navigation. But requires Suspense boundary (see Pitfall 2).
3. **Layout-level state:** Use a shared layout at `/uso/[slug]/layout.tsx` with React context to persist filter state across child page navigations. The layout does NOT remount when navigating between `/uso/[slug]` and `/uso/[slug]/[fabricId]`.

Recommended: Option 1 (browser back) is simplest and correct for this use case. The vendedor navigates linearly (list -> detail -> back to list), not via direct URL entry.

**Warning signs:**
- Filter chips showing "active" state but resetting after detail page round-trip
- `<Link href={`/uso/${slug}`}>` used for "back" instead of `router.back()`
- Vendedor complaining about having to re-filter during demo

**Phase to address:**
Phase 3 (Search/Filter) -- Must be considered during filter architecture design, not as an afterthought.

---

### Pitfall 9: Technologies Section Renders Broken Icons for 3 Entries

**What goes wrong:**
Building the `/tecnologias` content section, the developer iterates `TECHNOLOGIES` and renders `<Image src={tech.icon}>` for each. Three technologies (`algodon`, `antimanchas`, `solidez-a-la-luz`) have `icon: ''` -- empty string. `next/image` with an empty `src` throws a runtime error or renders a broken image indicator.

**Why it happens:**
Known tech debt from v1.0: these 3 technologies have no logo available in the PDF source. The empty string was intentional as a "to be filled later" marker. But any code that renders `tech.icon` without checking for empty will break.

**How to avoid:**
1. Guard all icon rendering: `{tech.icon && <Image src={tech.icon} ... />}`
2. Better: provide a generic fallback icon for technologies without a specific logo. Use a Lucide icon (already in the project) as the default:
```tsx
{tech.icon ? (
  <Image src={tech.icon} alt={tech.name} width={48} height={48} />
) : (
  <FlaskConical className="w-12 h-12 text-muted-foreground" />
)}
```
3. Update the `Technology` type to make `icon` optional (`icon?: string`) instead of allowing empty strings, so TypeScript forces the null check.

**Warning signs:**
- `<Image src="">` in JSX
- Runtime error: "Image is missing required 'src' property"
- Technologies section shows 11 icons and 3 broken/missing slots

**Phase to address:**
Phase 2 (Content Sections) when building the Technologies page, OR Phase 1 (Tech Debt) if cleaning up data types.

---

### Pitfall 10: CVA Dependency Bloats Bundle Without Providing Value

**What goes wrong:**
`class-variance-authority` (CVA) is installed as a production dependency but unused in any component. It adds ~4KB gzipped to the client bundle. For a catalog app targeting fast SSG loads on tablets, every unnecessary KB matters. Worse: a future developer may see it in `package.json` and start using it inconsistently alongside the existing `cn(clsx(...), tailwind-merge(...))` pattern, creating two competing styling approaches.

**Why it happens:**
Installed during v1.0 scaffolding as a "might need it" dependency. Never used because the `cn` utility with Tailwind classes proved sufficient for the component complexity level.

**How to avoid:**
1. Remove it: `bun remove class-variance-authority`
2. If component variants are needed later (e.g., Button with primary/secondary/ghost), use the existing `cn()` pattern with conditional classes -- sufficient for a <20 component catalog app.
3. Only re-add CVA if the project grows to 30+ components with multiple variant axes.

**Warning signs:**
- `class-variance-authority` in `package.json` but zero imports in `src/`
- Two different variant patterns in the same codebase (CVA `cva()` and raw conditional `cn()`)

**Phase to address:**
Phase 1 (Tech Debt Cleanup) -- Remove before building new components to keep a single styling pattern.

---

## Minor Pitfalls

### Pitfall 11: SkeletonCard Never Integrated as Suspense Fallback

**What goes wrong:**
`SkeletonCard` exists as a component with shimmer animation CSS but is never imported. When adding `<Suspense>` boundaries for filter/search (see Pitfall 2), the developer writes a new skeleton inline or forgets a fallback entirely, resulting in a flash of nothing during client-side rendering.

**How to avoid:**
Use `SkeletonCard` as the Suspense fallback in the fabric grid:
```tsx
<Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
</div>}>
  <FilteredFabricGrid />
</Suspense>
```

**Phase to address:**
Phase 3 (Search/Filter) -- When adding Suspense boundaries for client-side filter components.

---

### Pitfall 12: Detail Page Missing Back-to-Category Context for Deep-Linked Fabrics

**What goes wrong:**
The detail page currently uses the URL `slug` param to show "Volver a {category.name}". But if the detail page is reached from search results (which may not have a category context), or via browser bookmark, the back link may point to an unexpected category.

**How to avoid:**
Always show the "back to category" based on the URL slug (current behavior is correct). Additionally, show all categories this fabric belongs to using `getCategoriesByFabric()`. The URL slug determines the primary context; additional categories are secondary navigation.

**Phase to address:**
Phase 2 (Detail Pages) -- When building the full detail page layout.

---

### Pitfall 13: ROADMAP.md Staleness Causes Planning Confusion

**What goes wrong:**
The v1.0 ROADMAP.md shows phases as incomplete when they are actually finished. If v1.1 planning references the ROADMAP for current state, it gets incorrect information about what exists.

**How to avoid:**
Either update the v1.0 ROADMAP.md to reflect actual completion, or (better) create a fresh v1.1 ROADMAP.md that starts from the known-good v1.0 audit state. Reference `v1.0-MILESTONE-AUDIT.md` as the ground truth, not the stale ROADMAP.

**Phase to address:**
Phase 1 (Planning/Setup) -- Before creating the v1.1 roadmap.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Building detail pages without fixing image mapping first | Start "feature work" faster | Every detail page has broken images; demo is unprofessional | Never -- images ARE the product in a visual catalog |
| Using `useState` for filter state without considering navigation | Simpler code, preserves SSG | Filter resets on back navigation; vendedor frustration | Only if `router.back()` is explicitly tested and confirmed to preserve state |
| Adding Fuse.js for 31 records | Typo-tolerant search | Extra dependency (10KB), needs memoization, overkill for tiny dataset | Acceptable if typo tolerance is a real need for sales team |
| Keeping CVA installed "just in case" | Zero effort now | Bundle bloat, confusing for contributors, two competing patterns | Never in v1.1 -- remove and re-add if genuinely needed |
| Leaving hex colors duplicated in globals.css and categories.ts | No refactoring effort | Silent color drift when one source is updated | Acceptable only if documented with a "single source of truth" comment |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `useSearchParams()` in category page | Calling it without Suspense boundary, deoptimizing SSG | Wrap in dedicated client component inside `<Suspense>`, or use `useState` instead |
| `next/image` with empty `src` (3 technologies) | Rendering `<Image src="">` causes runtime error | Guard with `{tech.icon && ...}` or provide fallback icon |
| Vercel deploy with `output: 'export'` | Adding it "for performance" but breaking image optimization | Do NOT add -- Vercel serves SSG pages from CDN edge already |
| `generateStaticParams` for nested routes | Not testing all 43 fabric-category combinations | Run `bun run build` and verify route count matches expected (43 fabric detail + 8 category + index pages) |
| `CATEGORY_STYLE_MAP` vs `category.color` | Using both in the same component, creating visual inconsistencies | Pick one per component: Tailwind classes for static styling, hex for dynamic/inline only |
| `router.back()` vs `<Link>` for detail page return | Using `<Link href="/uso/[slug]">` which resets page state | Use `router.back()` for "Volver" to preserve filter state on the category page |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fuse.js instance re-created every render | Input lag on search, high CPU on iPad | `useMemo` for Fuse instance, debounce input 200ms | Immediately on iPad; imperceptible on MacBook |
| All 31 fabric images loaded eagerly on category page | LCP > 3s, 5MB+ page weight | `loading="lazy"` for below-fold cards; `priority` only on first row | With real images (currently 404, so hidden) |
| Filter/sort re-rendering entire grid on every change | Visible jank when toggling technology filter chips | Memoize `FabricCard` with `React.memo`, memoize filtered list with `useMemo` | On pages with 9 fabrics (Sudaderas category) |
| Search index built on page load instead of on first interaction | 200-400ms delay on initial page render | Build Fuse index lazily (on first keystroke or search focus) | On slow tablet hardware |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Filter resets on detail page round-trip | Vendedor loses filter context, has to re-filter mid-presentation | Use `router.back()` to preserve state, or persist filter in URL/layout |
| Detail page has no visual connection to parent category | Vendedor loses context of which category they navigated from | Show category-colored header on detail page using `CATEGORY_STYLE_MAP` |
| Search box on every page including detail page | Visual clutter, no clear action on detail page | Only show search on category listing pages, not on detail or content sections |
| Technology filter chips don't indicate count | Vendedor doesn't know if a filter will show 0 or 5 results before clicking | Show count badges: "Proteccion Solar (28)" or disable empty filters |
| "En construccion" text remains on newly built content sections | Vendedor sees placeholder text mixed with real content if section is partially built | Replace ALL placeholder text in a single deployment -- never ship half-built sections |

## "Looks Done But Isn't" Checklist

- [ ] **Image mapping:** All 31 fabrics render actual product images (not placeholder 404s) -- verify in Network tab for ALL category pages
- [ ] **Fabric detail page:** Test at least one fabric that appears in multiple categories (e.g., `orion-clororresistente` in 3 categories) -- verify "back" link goes to correct parent
- [ ] **NavLinks active state:** Navigate to `/uso/sudaderas-chaquetas-pantalones/orion-clororresistente` -- verify "Usos" is highlighted in nav
- [ ] **Filter state persistence:** Apply a technology filter on category page, click a fabric detail, click back -- verify filter is still active
- [ ] **SSG preservation:** Run `bun run build` and check that ALL pages show circle (static) icon, not lambda (dynamic) -- useSearchParams can silently deoptimize
- [ ] **Technology icons:** Navigate to `/tecnologias` -- verify all 14 technologies render (11 with icons, 3 with fallback) without broken images
- [ ] **Content section pages:** All 3 placeholder pages (`/tecnologias`, `/personalizacion`, `/cuellos`) replaced with real content -- no "en construccion" text remains
- [ ] **Vercel build:** Build succeeds without `output: 'export'`; image optimization works; all routes are static
- [ ] **Sort by weight/width:** Verify numeric sort (not string sort) -- "109 +-5" should sort before "110 +-10", not after "1000" alphabetically
- [ ] **Empty filter results:** Apply a technology filter that matches 0 fabrics in a category -- verify graceful empty state, not a blank grid

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| useSearchParams deoptimizes SSG | MEDIUM | Extract filter logic into Suspense-wrapped client component; restructure page to keep shell as Server Component -- 2-4 hours |
| Image mapping not done before features | LOW | Map 14 images to fabric IDs, create fallback for remaining 17 -- 1-2 hours, but blocks demo |
| Filter state resets on navigation | LOW | Replace `<Link>` with `router.back()` on detail page -- 15 minutes. Or add layout-level context -- 2-3 hours |
| Hex color drift between sources | LOW | Audit both files, reconcile values, add inline comment marking canonical source -- 30 minutes |
| CVA and SkeletonCard unused | LOW | `bun remove class-variance-authority`, integrate SkeletonCard into Suspense fallbacks -- 30 minutes |
| Vercel deploy with output:export | MEDIUM | Remove `output: 'export'`, remove custom image loader, revert to default Next.js config -- 1-2 hours of config and testing |
| Fuse.js performance on iPad | LOW | Wrap in `useMemo`, add debounce -- 30 minutes |
| String sort instead of numeric for weight/width | LOW | Parse numeric value from string (regex `(\d+)`) before sorting -- 30 minutes |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| P1: Placeholder image 404s | Phase 1: Tech Debt | All fabric images resolve (0 404s in Network tab across all categories) |
| P2: useSearchParams deoptimizes SSG | Phase 3: Search/Filter | `bun run build` shows all pages as static (circle icon) |
| P3: Duplicate pages for shared fabrics | Phase 2: Detail Pages | Multi-category fabric detail pages show correct "back" and "also in" links |
| P4: NavLinks active state bug | Phase 1: Tech Debt | "Usos" highlights on all `/uso/*` and `/uso/*/[fabricId]` routes |
| P5: Vercel deploy config confusion | Phase 4: Deploy | `next.config.ts` has NO `output: 'export'`; Vercel build log shows static generation |
| P6: Hex color duplication | Phase 1: Tech Debt | Single canonical color source documented; visual test shows consistent colors |
| P7: Fuse.js re-instantiation | Phase 3: Search | `useMemo` wraps Fuse constructor; no input lag on iPad |
| P8: Filter state reset on navigation | Phase 3: Search/Filter | Round-trip test: filter -> detail -> back preserves filter state |
| P9: Empty technology icons | Phase 2: Content Sections | All 14 technologies render without broken images |
| P10: CVA unused dependency | Phase 1: Tech Debt | `class-variance-authority` removed from `package.json` |
| P11: SkeletonCard orphaned | Phase 3: Search/Filter | SkeletonCard used as Suspense fallback in filtered grid |
| P12: Detail page deep-link context | Phase 2: Detail Pages | Fabric detail shows all parent categories; back link matches URL slug |
| P13: ROADMAP staleness | Phase 1: Planning | v1.1 roadmap created fresh; references audit, not stale v1.0 ROADMAP |

## Sources

- [Next.js useSearchParams -- Official Docs](https://nextjs.org/docs/app/api-reference/functions/use-search-params) -- Suspense boundary requirement, SSG deoptimization warning (HIGH confidence)
- [Next.js Missing Suspense Boundary -- Official Error Docs](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) -- CSR fallback behavior (HIGH confidence)
- [Next.js generateStaticParams -- Official Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- Nested dynamic route param passing (HIGH confidence)
- [Next.js Static Exports -- Official Docs](https://nextjs.org/docs/pages/guides/static-exports) -- output:export limitations, image optimization incompatibility (HIGH confidence)
- [Next.js Deopted Into Client Rendering -- Official Error Docs](https://nextjs.org/docs/messages/deopted-into-client-rendering) -- Entire page CSR when useSearchParams used without Suspense (HIGH confidence)
- [Vercel Image Optimization -- Official Docs](https://vercel.com/docs/image-optimization) -- Automatic optimization on Vercel deploy without output:export (HIGH confidence)
- [Next.js Layouts and Pages -- Official Docs](https://nextjs.org/docs/app/getting-started/layouts-and-pages) -- Layout state preservation on navigation, partial rendering (HIGH confidence)
- [Tailwind CSS v4 Theme Variables -- Official Docs](https://tailwindcss.com/docs/theme) -- @theme directive, CSS-first configuration (HIGH confidence)
- [Fuse.js Official Site](https://www.fusejs.io/) -- Client-side fuzzy search library, index construction cost (HIGH confidence)
- [Tailwind CSS Dynamic Classes Safelist](https://blogs.perficient.com/2025/08/19/understanding-tailwind-css-safelist-keep-your-dynamic-classes-safe/) -- Content scanning purge behavior with dynamic class names (MEDIUM confidence)
- [Next.js searchParams Killing Static Generation](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix) -- Separating dynamic and static route segments (MEDIUM confidence)
- v1.0-MILESTONE-AUDIT.md -- Known tech debt items, integration issues, orphaned exports (HIGH confidence, codebase-specific)

---
*Pitfalls research for: Lafayette Uni For Me Colegios v1.1 -- Adding features to existing catalog app*
*Researched: 2026-02-22*
