# Milestones

## v1.0 MVP (Shipped: 2026-02-22)

**Phases:** 1-4 | **Plans:** 8 | **Files:** 126 | **LOC:** 1,481 (TypeScript/CSS)
**Timeline:** 2 days (2026-02-21 → 2026-02-22)
**Git range:** `docs: initialize project` → `docs(phase-04): complete phase execution`

**Delivered:** Catálogo web navegable con home page, 8 páginas de categoría SSG, navegación global responsive y data layer completo de 31 telas.

**Key accomplishments:**
1. Next.js 16 + Tailwind v4 design system con 8 color tokens de categoría y paleta de marca Lafayette
2. Pipeline de extracción de assets: 14 imágenes de producto + 22 de contenido del PDF 37MB como WebP, 12 logos de tecnología
3. Data layer TypeScript: 31 telas, 8 categorías, 14 tecnologías con as-const-satisfies y barrel export
4. Header sticky con backdrop blur, nav de 4 items, mobile menu sidebar con scroll lock
5. Home page con hero de marca y grid de 4 secciones, página /usos con 8 cards color-coded
6. 8 páginas de categoría dinámicas con FabricCard grid, CategoryHeader, sidebar, breadcrumb — 51 rutas SSG

### Known Gaps (Tech Debt)

Items documentados en la auditoría v1.0 (13 total):
- **placeholder.webp 404:** 31 fabrics apuntan a imagen que no existe; 14 imágenes reales sin mapear
- **NavLinks active state:** `pathname.startsWith('/usos')` no captura `/uso/*` routes
- **CVA sin uso:** class-variance-authority instalada pero no importada
- **SkeletonCard huérfano:** componente creado pero no importado en ninguna ruta
- **Colores hex duplicados:** globals.css tokens y categories.ts con acoplamiento implícito
- **3 tecnologías sin icono:** algodón, antimanchas, solidez-a-la-luz con icon vacío
- **ROADMAP staleness:** progress table no reflejaba completitud real de Phases 2 y 4

Ver: `.planning/milestones/v1.0-MILESTONE-AUDIT.md` para reporte completo.

---

