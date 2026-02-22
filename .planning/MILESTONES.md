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


## v1.1 Catálogo Completo (Shipped: 2026-02-22)

**Phases:** 5-8 | **Plans:** 6 | **Files:** 35 changed | **LOC:** 2,582 (TypeScript/CSS)
**Timeline:** 1 day (2026-02-22)
**Git range:** `feat(05-01)` → `feat: replace hero with full-width portada`

**Delivered:** Catálogo completo con fichas técnicas de 43 telas, 3 secciones de contenido (Tecnologías, Personalización, Cuellos), búsqueda fuzzy con filtros interactivos, y responsive polish para tablet.

**Key accomplishments:**
1. Tech debt v1.0 resuelto: 31 fabrics con imágenes reales (zero 404), nav fix, CVA eliminada, Lucide fallbacks
2. Data foundation: modelos TypeScript para Personalización (4 opciones), Cuellos (colores + tallas), tecnologías expandidas
3. TechIcon compartido + 43 fichas técnicas con specs table, tooltips CSS-only, badge "Nuevo", cross-navigation
4. Página /tecnologias con 14 tech cards y navegación cruzada a telas por tecnología
5. Páginas /personalizacion (4 opciones con imágenes reales) y /cuellos (swatches, tablas de tallas, notas comerciales)
6. FilterableFabricGrid: fuse.js fuzzy search, tech filter chips multi-select, sort por gramaje/ancho, client island preservando SSG

### Known Gaps

- **DEPLOY-02**: Deploy Vercel pendiente (rate limit del plan free bloqueó upload)
- **DEPLOY-03**: Verificación de carga < 2s pendiente (requiere deploy)
- **Tech debt** (9 items non-blocking): SkeletonCard dead code, getFabricByBase dead code, expandedDescription unused, preload→priority en hero, CATEGORY_STYLE_MAP no re-exportado por barrel

Ver: `.planning/milestones/v1.1-MILESTONE-AUDIT.md` para reporte completo.

---

