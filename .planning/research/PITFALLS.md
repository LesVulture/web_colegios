# Pitfalls Research

**Domain:** Sales enablement product catalog (textile/uniforms) — Next.js static web app for in-person vendor presentations on laptop/tablet
**Researched:** 2026-02-21
**Confidence:** HIGH (verified via official Next.js docs, Context7-equivalent WebFetch, and multiple credible sources)

---

## Critical Pitfalls

### Pitfall 1: PDF Image Extraction Produces Unusable Low-Resolution Assets

**What goes wrong:**
Images extracted from the 37MB PDF catalog come out blurry, pixelated, or with JPEG compression artifacts. The product photos — the visual centerpiece of a sales catalog — look unprofessional on a laptop/tablet screen. Developers extract images using screenshot tools, copy-paste, or rendering-based methods that re-encode at lower quality.

**Why it happens:**
PDFs store images as embedded objects at a specific resolution and compression level. Most extraction methods (screenshot, "Save as Image," rendering to bitmap) re-encode the images, losing quality. The original images inside this PDF were likely compressed for a 37MB total file size across 24 pages, meaning embedded resolution may already be limited (estimated 150-200 DPI for a print-oriented catalog). Re-encoding on top of that creates compounding quality loss.

**How to avoid:**
1. Use `pdfimages` (from poppler-utils) with the `-all` flag to extract images losslessly in their original embedded format and resolution, avoiding re-encoding entirely.
2. After extraction, audit every image: check pixel dimensions against display size. For a product card displayed at ~400px wide on screen, the source image needs at minimum 400px width (800px for 2x retina). Images below this threshold need alternative sourcing or careful UI design (smaller display size, blur-up placeholders).
3. If extracted quality is insufficient, use `pdftoppm` to render full pages at 300 DPI and crop individual product photos — this produces higher resolution than embedded image extraction when the PDF uses vector+raster compositing.
4. Process extracted images through `sharp` to normalize format (WebP), strip metadata, and set consistent quality levels.

**Warning signs:**
- Extracted images are smaller than 300px in any dimension
- File sizes under 20KB for product photos (likely over-compressed)
- Visible JPEG artifacts when viewing extracted images at 100% zoom
- Color banding in gradient areas of fabric photos

**Phase to address:**
Phase 1 (Foundation/Setup) — Image extraction must happen before any UI work begins. The quality of extracted assets determines whether the visual design is even viable.

---

### Pitfall 2: `next/image` Optimization Breaks on Static Export

**What goes wrong:**
Developers use `next/image` throughout the catalog for product photos, build the app, and discover that `output: 'export'` (static export) does NOT support Next.js's default Image Optimization API. The build either fails or produces unoptimized images served at original file sizes, destroying load performance on a page with 5-9 product images per category.

**Why it happens:**
Next.js Image Optimization requires a Node.js server at runtime to resize, convert, and cache images on-the-fly. Static export generates pure HTML/CSS/JS with no server runtime. The official docs explicitly list "Image Optimization with the default loader" as an unsupported feature in static export mode. This is a critical architectural decision that must be made early — not discovered at deploy time.

**How to avoid:**
Two viable paths, choose ONE early:

**Option A — Vercel deploy (recommended if online use is primary):**
Deploy to Vercel with standard server-rendering. `next/image` works out-of-the-box with full optimization. Category pages use Server Components. No `output: 'export'` needed. Downside: requires internet connection during sales meetings.

**Option B — Static export with build-time optimization:**
Use `next-image-export-optimizer` or `next-export-optimize-images` package. These run `sharp` after `next build` to generate responsive image variants (WebP, multiple sizes) at build time. Configure in `next.config.js`:
```js
{
  output: 'export',
  images: { loader: 'custom', loaderFile: './image-loader.ts' }
}
```
Downside: longer build times, must pre-generate all size variants.

**Warning signs:**
- Build warnings about Image Optimization API and static export
- `images: { unoptimized: true }` in config (means NO optimization at all)
- Product pages loading 2MB+ of images per category view
- LCP > 3 seconds on category pages

**Phase to address:**
Phase 1 (Foundation) — This is an architectural decision. The deploy strategy (Vercel server vs static export) determines image handling, offline capability, and component architecture for the entire project.

---

### Pitfall 3: Dynamic Tailwind Class Names for Category Colors Get Purged in Production

**What goes wrong:**
Each of the 8 product categories has a distinct brand color (e.g., `#1B3A5C` for Sudaderas, `#3FA9D5` for Camisetas). Developers store colors in a data file and construct Tailwind classes dynamically: `bg-[${category.color}]` or `` `text-${category.colorName}-600` ``. Classes render correctly in dev mode but vanish in production builds — all category colors disappear, leaving unstyled or default-colored elements.

**Why it happens:**
Tailwind CSS uses a content-aware engine that scans source files for class names at build time. It only includes classes it can find as complete strings. Dynamic string concatenation (`bg-[${variable}]`) produces class names that don't exist as complete strings in any source file, so Tailwind's tree-shaking removes them from the production CSS bundle.

**How to avoid:**
Use a **lookup object** with complete, static class strings that Tailwind can detect:
```typescript
// lib/category-styles.ts
export const CATEGORY_STYLES = {
  'sudaderas': {
    bg: 'bg-[#1B3A5C]',
    text: 'text-[#1B3A5C]',
    border: 'border-[#1B3A5C]',
  },
  'camisetas': {
    bg: 'bg-[#3FA9D5]',
    text: 'text-[#3FA9D5]',
    border: 'border-[#3FA9D5]',
  },
  // ... all 8 categories
} as const;
```
Then use: `className={CATEGORY_STYLES[category.slug].bg}`. The complete class strings exist in source code, so Tailwind keeps them.

**Alternative:** Use CSS custom properties for colors and apply via `style` attribute for truly dynamic values. This bypasses Tailwind's purge entirely.

**Warning signs:**
- Colors work in `bun run dev` but not in `bun run build && bun run start`
- Template literals or string concatenation constructing Tailwind class names
- A `safelist` in Tailwind config growing uncontrollably (band-aid, not solution)

**Phase to address:**
Phase 1 (Foundation) — Define the category color system and lookup pattern before building any category-specific UI components.

---

### Pitfall 4: "use client" Boundary Misplacement — Entire Page Trees Become Client Components

**What goes wrong:**
Developers add `"use client"` to a layout or a high-level component (like the category page layout) because one child needs `onClick` or `useState`. This forces every component in that subtree to be a Client Component — shipping all their JavaScript to the browser, losing Server Component benefits (zero JS, server-side data access), and potentially causing hydration errors.

**Why it happens:**
In Next.js App Router, all components are Server Components by default. The moment you add `"use client"`, that component AND everything it imports becomes a Client Component. Developers coming from Pages Router or React SPA backgrounds instinctively add `"use client"` to fix "useState is not defined" errors without understanding the cascade effect. For a product catalog (mostly static content display), this is especially wasteful.

**How to avoid:**
1. **Push `"use client"` to leaf components.** The category page itself (listing products with images, specs, colors) is pure display — perfect Server Component. Only the interactive header navigation, image gallery zoom, or mobile menu toggle need `"use client"`.
2. **Use the "wrapper" pattern:** Create small Client Component wrappers that handle ONLY the interactive part, and pass static content as `children` (which remain Server Components).
```tsx
// components/interactive-nav.tsx
"use client"
export function MobileMenuToggle({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{/* toggle button */}{open && children}</div>;
}

// app/layout.tsx (Server Component — NO "use client")
import { MobileMenuToggle } from './components/interactive-nav';
export default function Layout({ children }) {
  return <MobileMenuToggle><nav>...</nav></MobileMenuToggle>;
}
```
3. **Never put `"use client"` in `layout.tsx`.** Layouts with metadata must be Server Components. Double `"use client"` (layout + child) causes hydration errors.

**Warning signs:**
- `"use client"` at the top of `layout.tsx` or `page.tsx`
- Bundle analyzer shows large JS chunks for pages that are mostly static content
- Hydration mismatch errors in the console
- `typeof window !== 'undefined'` checks in render logic

**Phase to address:**
Phase 2 (Component Architecture) — When building the component tree, establish the server/client boundary pattern before implementing individual components.

---

## Moderate Pitfalls

### Pitfall 5: Tailwind CSS v4 Configuration Mismatch with Next.js

**What goes wrong:**
Developers follow Tailwind v3 tutorials/patterns (creating `tailwind.config.js`, using `@tailwind base/components/utilities`, configuring `content` array) but the project uses Tailwind v4, which has an entirely different CSS-first configuration system. Styles don't apply, builds fail with cryptic PostCSS errors, or custom theme values are ignored.

**Why it happens:**
Tailwind v4 (released 2025) eliminated `tailwind.config.js` entirely. Configuration now happens via CSS `@theme` directive. The old three-layer import pattern (`@tailwind base; @tailwind components; @tailwind utilities;`) is replaced with `@import "tailwindcss"`. Most online tutorials, Stack Overflow answers, and AI training data still reference v3 patterns.

**How to avoid:**
1. Verify which Tailwind version the project uses: `bun pm ls tailwindcss`.
2. For v4: configure colors and theme in CSS, not JS:
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-lafayette-azul-oscuro: #1B3A5C;
  --color-lafayette-rojo: #C42034;
  /* ... category colors */
}
```
3. For v3 (if deliberately chosen): use `tailwind.config.ts` with `content` array pointing to `./app/**/*.{ts,tsx}`.
4. In either case: do NOT mix v3 and v4 patterns. Pick one and be consistent.

**Warning signs:**
- `tailwind.config.js` exists alongside `@import "tailwindcss"` in CSS
- Custom colors defined in config file but not appearing in rendered output
- PostCSS plugin errors during build
- `globals.css` filename vs `global.css` (v4 + App Router can be strict about naming)

**Phase to address:**
Phase 1 (Foundation/Scaffolding) — Tailwind configuration is part of initial project setup.

---

### Pitfall 6: Product Data Tightly Coupled to UI Components

**What goes wrong:**
Product specifications, category metadata, fabric properties, and technology descriptions are scattered across component files as inline strings. Adding a new fabric, correcting a specification, or updating a category color requires hunting through multiple `.tsx` files. Data and presentation become inseparable, making the catalog unmaintainable.

**Why it happens:**
For a "simple" catalog with 8 categories and ~50 products, developers hardcode data directly into JSX: `<h2>Vendaval Crushed R</h2><p>Composicion: 100% Poliester</p>`. It's faster initially. But product catalogs always have data updates — new fabrics, updated specs, corrected descriptions — and hardcoded data means every update is a code change.

**How to avoid:**
1. Create a single source of truth: `lib/data/products.ts` (or JSON files) with typed product models:
```typescript
interface Fabric {
  id: string;
  name: string;
  category: CategorySlug;
  composition: string;
  weight: string;
  width: string;
  technologies: TechnologyId[];
  image: string; // path to extracted image
}
```
2. Category pages consume data from imports, not inline content.
3. Technology descriptions, personalization options, and collar data each get their own typed data file.
4. All content comes from the PDF — enforce this by keeping `lib/data/` as the single extraction target.

**Warning signs:**
- Product names or specs appearing as string literals in `.tsx` files
- Duplicate product information across multiple components
- A "fix typo" commit that touches 5+ component files

**Phase to address:**
Phase 1 (Data Extraction) — Data modeling should happen during or immediately after PDF content extraction, before any UI components are built.

---

### Pitfall 7: Tablet Landscape vs. Portrait Layout Breaks

**What goes wrong:**
The catalog looks great on a laptop screen (landscape, ~1366px wide) but breaks when the salesperson rotates an iPad to portrait mode (768px wide) or uses a smaller tablet. Product cards overflow, images get clipped, the navigation becomes unusable, or the layout snaps to a mobile-phone design that's inappropriate (the project explicitly excludes mobile optimization).

**Why it happens:**
"Desktop-first, responsive to tablet" is interpreted as only testing on full-width desktop. Tablet viewports are a middle ground (768-1024px) that doesn't fit neatly into either the desktop or mobile breakpoint. iPad landscape (1024px) may trigger desktop styles, while iPad portrait (768px) falls into a gray zone. CSS Grid/Flexbox layouts that work at 1440px may not have been tested at 1024px or 768px.

**How to avoid:**
1. Define explicit breakpoints for the actual use case:
   - **Desktop**: >= 1024px (laptop screens, iPad landscape)
   - **Tablet portrait**: 768px - 1023px (iPad portrait, smaller tablets)
   - No mobile breakpoint (explicitly out of scope)
2. Test layouts at these exact viewports during development, not just "resize the browser."
3. For product grids: use CSS Grid with `auto-fill` and `minmax()` instead of fixed column counts:
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
```
4. Ensure the navigation works in both orientations — a horizontal nav that fits at 1440px may overflow at 768px.

**Warning signs:**
- Product grid columns hardcoded: `grid-cols-4` with no responsive variant
- Horizontal navigation items wrapping to two lines at tablet width
- Images with fixed `width` instead of responsive `max-width`
- No `md:` or `lg:` breakpoint variants in Tailwind classes

**Phase to address:**
Phase 2 (Layout & Components) — Build responsive grid system with tablet testing from day one, not as an afterthought.

---

### Pitfall 8: Static Export Prevents Offline Use Without PWA Configuration

**What goes wrong:**
The sales team expects to use the catalog during meetings at schools where WiFi is unreliable or nonexistent. A static export deployed to Vercel requires internet to load initially. Even a static HTML folder on a laptop requires a local server to serve it (opening `index.html` directly breaks client-side routing and relative paths).

**Why it happens:**
"Static export" sounds like it should work offline, but it produces files that still need to be served over HTTP. Next.js client-side navigation relies on fetch requests for route data. Without a Service Worker caching strategy, the app has no offline capability. And without a local HTTP server, many browser features (module loading, fetch, routing) don't work from `file://` protocol.

**How to avoid:**
**If offline is a requirement:**
1. Add PWA support with `@ducanh2912/next-pwa` or Serwist to register a Service Worker that caches all static assets and route data.
2. Configure the Service Worker to use a cache-first strategy (all content is static/known at build time).
3. The salesperson loads the site once with internet, then it works offline.
4. Alternatively: distribute the `out/` folder with a simple local server script (e.g., `npx serve out/`) bundled for the sales laptops.

**If online-only is acceptable:**
Deploy to Vercel normally. Use `output: 'standalone'` or default server mode. Simpler architecture, full `next/image` optimization, no PWA complexity.

**Warning signs:**
- No discussion of connectivity requirements with the sales team
- Static export with no Service Worker registration
- Sales team reports "blank page" when opening the catalog offline
- Route navigation fails when served from a non-root URL path

**Phase to address:**
Phase 1 (Architecture Decision) — The online/offline question determines the entire deployment and optimization strategy. Must be resolved before coding begins.

---

## Minor Pitfalls

### Pitfall 9: Hydration Errors from Browser Extensions and iOS Auto-Detection

**What goes wrong:**
The catalog renders correctly in development but shows React hydration mismatch warnings in production. On iPads specifically, phone numbers in product specs get auto-linked by iOS Safari, creating DOM mismatches between server-rendered HTML and client hydration.

**How to avoid:**
Add this meta tag in the root layout `<head>`:
```html
<meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
```
Also: avoid `typeof window !== 'undefined'` in render logic; use `useEffect` for browser-only code.

**Phase to address:** Phase 2 (Layout setup).

---

### Pitfall 10: Missing `generateStaticParams` for Dynamic Category Routes

**What goes wrong:**
Category pages use dynamic routes (`/categoria/[slug]`) but forget to export `generateStaticParams()`. With `output: 'export'`, the build fails because Next.js cannot statically generate pages without knowing all possible route params at build time.

**How to avoid:**
For every `[slug]` route in a static export project, export `generateStaticParams`:
```typescript
export function generateStaticParams() {
  return CATEGORIES.map(cat => ({ slug: cat.slug }));
}
```
This is mandatory, not optional, when using `output: 'export'`.

**Phase to address:** Phase 2 (Routing setup).

---

### Pitfall 11: Asset Filenames with Spaces and Special Characters

**What goes wrong:**
The existing assets directory contains files like `LOGO_TECNOLOGIA_SECADO RAPIDO.png` and `LOGO COBRANDING LAFTECH TERMICOS...png` with spaces and special characters. These cause broken image paths in URLs, build errors, or 404s in production.

**How to avoid:**
Rename all assets to use kebab-case with no spaces or special characters during the setup phase. Create a mapping file if original names need to be preserved for reference.

**Phase to address:** Phase 1 (Asset preparation).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `images: { unoptimized: true }` in next.config | Quick fix for static export build errors | Every product image served at full size; pages load 5-10x slower | Never for a product catalog — images ARE the content |
| Hardcoding all product data in JSX | Faster initial development | Every content update requires code changes; no single source of truth | Only acceptable as Phase 1 prototype if data files follow in same phase |
| `"use client"` on page-level components | Eliminates all server/client boundary thinking | Ships unnecessary JS, loses SSR benefits, potential hydration errors | Never for a mostly-static catalog |
| Using `safelist` to include all Tailwind color classes | Fixes dynamic class purging quickly | Bloats CSS bundle with thousands of unused classes | Never — use lookup objects or CSS custom properties instead |
| Skipping TypeScript types for product data | Faster data entry | Typos in product specs, missing fields discovered at runtime not build time | Never — types catch data entry errors from PDF transcription |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| PDF to images (poppler) | Using `pdftoppm` (renders pages to bitmaps) instead of `pdfimages` (extracts embedded images losslessly) | Use `pdfimages -all` first for lossless extraction; only use `pdftoppm -r 300` as fallback if embedded images are too low-res |
| next/image + static export | Leaving default loader config and getting build errors | Choose: Vercel deploy (default loader works) OR static export with `next-image-export-optimizer` package |
| Tailwind v4 + Next.js App Router | Using `tailwind.config.js` patterns from v3 tutorials | Check installed version; v4 uses `@theme` in CSS, v3 uses `tailwind.config.js` |
| Asset filenames in `/public` | Spaces in filenames cause URL encoding issues | Rename all assets to kebab-case before importing into the project |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized product images on category pages | LCP > 4s, 5-10MB page weight per category | Build-time optimization with sharp/WebP, responsive `srcSet`, lazy loading below fold | Immediately — 5-9 high-res images per category page |
| All category data loaded on every page | Slow initial load, unnecessary memory usage | Code-split data per category; only import the category data needed for the current route | At 50+ products or slow tablet hardware |
| No `priority` prop on above-the-fold hero image | Poor LCP score, hero image loads last | Add `priority` to the first visible image on each category page (hero/first product card) | Immediately on every page |
| Large layout shifts from images without dimensions | CLS > 0.1, content jumps as images load | Always specify `width` and `height` on `<Image>` components, or use `fill` with a sized container | Immediately — every image without dimensions causes layout shift |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| PDF-replica layout on web | Salesperson scrolls horizontally, text too small, not clickable | Modern web design with card-based layout, proper typography scale, touch-friendly navigation |
| No visual indicator for current category | Salesperson loses context during meeting, doesn't know which section they're in | Active state on navigation, category color applied to header/accent, breadcrumb |
| Product cards with inconsistent photo aspect ratios | Grid looks broken, uneven card heights, unprofessional appearance | Normalize all product images to consistent aspect ratio (e.g., 4:3 or 16:9) using `object-fit: cover` in a fixed container |
| Navigation requires multiple clicks to switch categories | Slows down meeting flow when client asks about different product | Persistent category navigation visible on all pages, one-click access to any of 8 categories |
| Fabric specs in tiny font for "clean design" | Salesperson can't read specs while presenting on tablet at arm's length | Minimum 16px body text, specs in readable cards not dense tables |

## "Looks Done But Isn't" Checklist

- [ ] **Product images:** Verify they render sharp on 2x retina displays (iPad) — test at actual device pixel ratio, not just browser zoom
- [ ] **Category navigation:** Test on iPad Safari in BOTH portrait and landscape — navigation may overflow in one orientation
- [ ] **Static export routing:** Click every internal link after `bun run build` — client-side navigation may work in dev but fail in static export if `generateStaticParams` is missing
- [ ] **Image loading performance:** Open DevTools Network tab with throttling — check that lazy loading is working (below-fold images should NOT load until scrolled)
- [ ] **Category colors in production:** Build the project and verify ALL 8 category colors render — Tailwind purge may have removed dynamically-constructed classes
- [ ] **Offline capability:** Disconnect WiFi and reload — does the app still work? If offline use is required, verify Service Worker is caching correctly
- [ ] **Typography readability:** View the catalog at arm's length from a tablet screen — can you read product specs without squinting?
- [ ] **Asset paths:** Check for 404s in the Network tab — files with spaces or special characters in names may fail silently

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Low-quality extracted images | MEDIUM | Re-extract with `pdfimages -all` or `pdftoppm -r 300`; request original high-res photos from Lafayette marketing team as ultimate fallback |
| `next/image` broken in static export | MEDIUM | Install `next-image-export-optimizer`, update image imports to use its component, reconfigure `next.config.js` loader — 2-4 hours of refactoring |
| Tailwind dynamic classes purged | LOW | Create lookup object with complete class strings, replace all dynamic class construction — 1-2 hours |
| `"use client"` on too many components | HIGH | Requires restructuring component tree, extracting interactive parts into leaf components, testing for hydration errors — 4-8 hours depending on depth |
| Hardcoded product data in JSX | HIGH | Extract all data to typed data files, refactor components to consume data from imports — 1-2 days for 50+ products |
| Tablet layout broken | MEDIUM | Add responsive breakpoints, test at 768px and 1024px, adjust grid and navigation — 4-8 hours |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| PDF image extraction quality | Phase 1: Asset Extraction | All extracted images >= 400px wide, no visible compression artifacts at 100% zoom |
| next/image + static export conflict | Phase 1: Architecture Decision | `bun run build` succeeds with optimized images; page weight < 2MB per category |
| Tailwind dynamic class purging | Phase 1: Design System Setup | `bun run build` output includes all 8 category colors; visual test of production build |
| "use client" boundary misplacement | Phase 2: Component Architecture | Bundle analyzer shows < 50KB JS per category page; no hydration errors in console |
| Tailwind v4 config mismatch | Phase 1: Project Scaffolding | Custom theme colors render correctly in both dev and production builds |
| Product data coupling to UI | Phase 1: Data Modeling | All product data lives in `lib/data/`; components import data, never define it inline |
| Tablet layout breaks | Phase 2: Responsive Layout | Visual test at 768px, 1024px, and 1440px viewports; navigation usable in both orientations |
| Offline use without PWA | Phase 1: Architecture Decision | Connectivity requirements documented; if offline required, Service Worker registered and tested |
| Hydration errors on iPad | Phase 2: Layout Setup | `format-detection` meta tag present; zero hydration warnings in Safari console |
| Missing generateStaticParams | Phase 2: Routing | All dynamic routes export `generateStaticParams`; `bun run build` completes without errors |
| Asset filename issues | Phase 1: Asset Preparation | All files in `/public` use kebab-case; zero 404s in Network tab |

## Sources

- [Next.js Static Exports — Official Documentation](https://nextjs.org/docs/app/guides/static-exports) — Unsupported features list, image optimization limitations (HIGH confidence)
- [Next.js Hydration Error Documentation](https://nextjs.org/docs/messages/react-hydration-error) — Common causes and iOS auto-detection issue (HIGH confidence)
- [App Router Pitfalls — imidef.com (Feb 2026)](https://imidef.com/en/2026-02-11-app-router-pitfalls) — Server/client boundary, fetch caching, layout design issues (MEDIUM confidence)
- [Next.js Server and Client Components — Official Docs](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Default rendering behavior (HIGH confidence)
- [next-image-export-optimizer — GitHub](https://github.com/Niels-IO/next-image-export-optimizer) — Build-time image optimization for static export (MEDIUM confidence)
- [pdfimages — Poppler Utils](https://www.glukhov.org/post/2025/04/extract-images-from-pdf/) — Lossless image extraction from PDF (HIGH confidence)
- [Tailwind CSS v4 Migration — Medium (Dec 2025)](https://medium.com/better-dev-nextjs-react/tailwind-v4-migration-from-javascript-config-to-css-first-in-2025-ff3f59b215ca) — Config file elimination, CSS-first approach (MEDIUM confidence)
- [Tailwind CSS Safelist and Dynamic Classes — Accreditly](https://accreditly.io/articles/how-to-use-tailwinds-safelist-to-handle-dynamic-classes) — Purge issues with dynamic class names (MEDIUM confidence)
- [Next.js PWA Guide — Official Docs](https://nextjs.org/docs/app/guides/progressive-web-apps) — Service Worker, offline capability (HIGH confidence)
- [Next.js Image Optimization — DebugBear](https://www.debugbear.com/blog/nextjs-image-optimization) — Performance benchmarks, quality settings (MEDIUM confidence)

---
*Pitfalls research for: Lafayette Uni For Me Colegios — Sales Enablement Product Catalog*
*Researched: 2026-02-21*
