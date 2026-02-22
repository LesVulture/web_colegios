---
phase: 01-project-foundation
plan: 01
subsystem: ui
tags: [next.js, tailwind-v4, design-tokens, typescript, raleway, montserrat, cva]

# Dependency graph
requires: []
provides:
  - Next.js 16 project scaffold with App Router and TypeScript strict
  - 8 category color tokens as Tailwind v4 utility classes (bg-cat-*, text-cat-*-fg)
  - Brand palette tokens (brand-primary, brand-accent) with foreground
  - Surface/border/muted UI tokens
  - Border-radius tokens (sm, md, lg)
  - Raleway (headings) + Montserrat (body) via next/font/google
  - cn() utility function for safe Tailwind class merging
  - CVA (class-variance-authority) installed for component variants
affects: [02-data-layer, 03-navigation-home, 04-category-pages, 05-fabric-details, 06-content-deploy]

# Tech tracking
tech-stack:
  added: [next@16.1.6, react@19.2.3, tailwindcss@4.2.0, clsx@2.1.1, tailwind-merge@3.5.0, class-variance-authority@0.7.1]
  patterns: [tailwind-v4-css-theme, next-font-google-inline, cn-utility, category-color-coding]

key-files:
  created:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/lib/utils.ts
    - package.json
    - tsconfig.json
    - next.config.ts
  modified: []

key-decisions:
  - "Raleway for headings, Montserrat for body text (legibility of technical specs)"
  - "Border-radius lg = 1rem (16px), top of 12-16px range for modern feel"
  - "Category foreground tokens: white on dark colors, #1a1a1a on yellow/orange for WCAG AA contrast"
  - "@theme inline for font variables (runtime injection by next/font), @theme for static hex colors"
  - "Moved scaffold from root app/ to src/app/ for cleaner project structure with @/* path alias"

patterns-established:
  - "Tailwind v4 @theme: all design tokens defined in globals.css, no tailwind.config.ts"
  - "cn() function: all components use cn() for class merging via clsx + tailwind-merge"
  - "Semantic color tokens: bg-cat-*, text-cat-*-fg, bg-brand-*, never raw hex in components"
  - "next/font/google + @theme inline: fonts loaded as CSS variables, consumed as font-heading/font-body"

requirements-completed: [FOUND-01, FOUND-04, DES-01]

# Metrics
duration: 3min
completed: 2026-02-22
---

# Phase 1 Plan 1: Project Foundation Summary

**Next.js 16 scaffold with Tailwind v4 design system: 8 category color tokens, Raleway/Montserrat typography, brand palette, and border-radius tokens configured as CSS-first @theme**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-22T00:36:20Z
- **Completed:** 2026-02-22T00:39:35Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Next.js 16.1.6 project with App Router, Turbopack, TypeScript strict, and Tailwind CSS v4 running cleanly
- Complete design system with 8 category colors (from PDF), brand palette, surface/UI tokens, and 3 border-radius sizes
- Raleway headings + Montserrat body text integrated via next/font/google with @theme inline
- Design system preview page visually demonstrating all tokens (categories, brand, radius, typography)
- cn() utility and CVA installed for future component development

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 16 project con dependencias y TypeScript estricto** - `bc06153` (feat)
2. **Task 2: Configurar design system completo con tokens de color, tipografia y estilos base** - `1412502` (feat)

## Files Created/Modified
- `package.json` - Next.js 16 + React 19 + Tailwind v4 + clsx + tailwind-merge + CVA
- `tsconfig.json` - TypeScript strict mode, path alias @/* -> ./src/*
- `next.config.ts` - Minimal Next.js config (Turbopack default)
- `src/app/globals.css` - Complete design tokens: 8 category colors, brand palette, surfaces, border-radius, fonts via @theme
- `src/app/layout.tsx` - Root layout with Raleway + Montserrat, metadata, lang="es"
- `src/app/page.tsx` - Design system preview page showing all tokens visually
- `src/lib/utils.ts` - cn() utility function for Tailwind class merging

## Decisions Made
- **Raleway for headings, Montserrat for body:** Raleway has more elegant/editorial feel for catalog headings; Montserrat is more legible at small sizes for technical specs. Both are sans-serif geometric, harmonious combination.
- **Border-radius lg = 1rem (16px):** Top of the 12-16px range. Modern and friendly without being excessive.
- **WCAG AA foreground tokens:** White (#FFFFFF) on dark category colors, dark (#1a1a1a) on yellow (buzos) and orange (delantales) for readable contrast.
- **@theme inline for fonts:** Runtime CSS variables from next/font require @theme inline (not static @theme) so Tailwind uses var() instead of resolved values.
- **src/ directory structure:** Moved scaffold from root app/ to src/app/ for cleaner separation with @/* path alias pointing to ./src/*.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Moved app/ to src/app/ after scaffold**
- **Found during:** Task 1 (Scaffold)
- **Issue:** `bun create next-app@latest . --yes` scaffolded with app/ at root level instead of src/app/ as required by the plan
- **Fix:** Created src/ directory, moved app/ into src/app/, updated tsconfig.json paths from `@/* -> ./*` to `@/* -> ./src/*`
- **Files modified:** tsconfig.json, src/app/ (moved from app/)
- **Verification:** bun run build passes, path alias works correctly
- **Committed in:** bc06153 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary structural fix. create-next-app defaults to root-level app/ but plan requires src/ structure. No scope creep.

## Issues Encountered
- Directory was not empty for scaffold (had .planning, .agents, .git, etc.) - resolved by moving files to /tmp backup, scaffolding, then restoring. This is standard procedure for scaffolding in existing project directories.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Design system is fully functional and ready for Phase 2+ component development
- All 8 category colors available as Tailwind utility classes (bg-cat-sudaderas, etc.)
- Typography system ready (font-heading, font-body)
- cn() utility ready for component composition
- **Blocker for Phase 2:** Image extraction from PDF still pending (noted in STATE.md)

## Self-Check: PASSED

All 7 created files verified on disk. Both task commits (bc06153, 1412502) found in git log.

---
*Phase: 01-project-foundation*
*Completed: 2026-02-22*
