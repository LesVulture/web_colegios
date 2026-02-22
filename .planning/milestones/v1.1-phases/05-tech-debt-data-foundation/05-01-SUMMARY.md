---
phase: 05-tech-debt-data-foundation
plan: 01
subsystem: ui, data
tags: [next.js, nav, images, tech-debt, cva]

# Dependency graph
requires:
  - phase: 04-category-pages
    provides: "FabricCard component referencing fabric.image, category pages with nav"
provides:
  - "31 fabrics with real category hero images (zero placeholder.webp)"
  - "NavItem.activePrefix pattern for flexible route matching"
  - "Clean bundle without unused CVA dependency"
  - "Color source-of-truth documentation in categories.ts"
affects: [06-technical-sheets, 07-content-sections, 08-filterable-grid]

# Tech tracking
tech-stack:
  added: []
  patterns: ["activePrefix pattern for nav active state matching across route variants"]

key-files:
  created: []
  modified:
    - src/lib/content/fabrics.ts
    - src/lib/content/categories.ts
    - src/lib/nav.ts
    - src/components/nav-links.tsx
    - package.json
    - bun.lock

key-decisions:
  - "Multi-category fabrics use first-appearing category image (PDF order via CATEGORIES array)"
  - "activePrefix pattern chosen over regex or multi-path approach for nav active state"
  - "color/foregroundColor retained in categories.ts for Phase 6 inline styles"

patterns-established:
  - "activePrefix on NavItem: optional field for route matching when href differs from active URL pattern"

requirements-completed: [DEBT-01, DEBT-02, DEBT-03, DEBT-04, DEBT-05]

# Metrics
duration: 2min
completed: 2026-02-22
---

# Phase 5 Plan 1: Tech Debt Cleanup Summary

**31 fabrics mapped to real category hero images, nav active state fixed for /uso/* routes, CVA removed from bundle, color source-of-truth documented**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-22T18:02:22Z
- **Completed:** 2026-02-22T18:04:42Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- All 31 fabrics in fabrics.ts now reference real category hero images (page*.webp) instead of placeholder.webp
- Nav link "Usos" correctly activates on both /usos and /uso/[slug] routes via activePrefix pattern
- class-variance-authority removed from dependencies (zero imports existed in codebase)
- Color duplication documented with source-of-truth comment in categories.ts
- SkeletonCard confirmed preserved for Phase 8 FilterableFabricGrid loading state

## Task Commits

Each task was committed atomically:

1. **Task 1: Map product images to fabrics + consolidate color documentation** - `dd03e8d` (fix)
2. **Task 2: Fix nav active state + remove CVA + verify build** - `98bc0e2` (fix)

## Files Created/Modified
- `src/lib/content/fabrics.ts` - 31 fabrics with real category hero images replacing placeholder.webp
- `src/lib/content/categories.ts` - Added source-of-truth comment for color/foregroundColor fields
- `src/lib/nav.ts` - Added activePrefix field to NavItem type, set '/uso' on Usos item
- `src/components/nav-links.tsx` - isActive uses activePrefix ?? href for route matching
- `package.json` - Removed class-variance-authority dependency
- `bun.lock` - Updated lockfile after CVA removal

## Decisions Made
- Multi-category fabrics (e.g., orion-clororresistente appearing in 3 categories) assigned the image of their first category per CATEGORIES array order (which follows PDF page order)
- activePrefix pattern chosen as the cleanest approach for nav active state -- only the Usos item needs it since /usos vs /uso/[slug] is the only divergent case
- color/foregroundColor fields kept in categories.ts (not removed) because Phase 6 may use them for inline styles on technical sheets

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Data layer is now clean: all fabrics have real images, nav works correctly, no dead dependencies
- Ready for Plan 2 (PDF content extraction for tech descriptions, personalization, collars)
- Phase 6 (Technical Sheets) can safely reference fabrics.ts images
- Phase 8 (FilterableFabricGrid) has SkeletonCard available as loading state

## Self-Check: PASSED

All files verified present. All commit hashes verified in git log.

---
*Phase: 05-tech-debt-data-foundation*
*Completed: 2026-02-22*
