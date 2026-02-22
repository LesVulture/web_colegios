# Roadmap: Lafayette Uni For Me Colegios

## Overview

El catalogo web de Lafayette reemplaza un PDF de 37MB como herramienta de ventas para reuniones con colegios. v1.0 entrego la navegacion, home page y 8 paginas de categoria con product cards. v1.1 completa el catalogo: resuelve tech debt critico, construye fichas tecnicas de telas, llena las 3 secciones placeholder (tecnologias, personalizacion, cuellos), agrega filtrado/busqueda interactiva, y despliega en Vercel para uso real por los vendedores.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-02-22)
- **v1.1 Catalogo Completo** — Phases 5-9 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-4) — SHIPPED 2026-02-22</summary>

- [x] **Phase 1: Project Foundation** - Next.js + Tailwind v4 scaffold (1/1 plans)
- [x] **Phase 2: Data Layer & Assets** - TypeScript models, assets extraction (2/2 plans)
- [x] **Phase 3: Global Navigation & Home** - Header, nav, home page (3/3 plans)
- [x] **Phase 4: Category Pages** - 8 category pages with fabric cards (2/2 plans)

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### v1.1 Catalogo Completo

- [x] **Phase 5: Tech Debt & Data Foundation** - Resolver 404 de imagenes, bugs de nav, dependencias muertas; crear modelos de datos para personalizacion y cuellos
- [x] **Phase 6: Fabric Detail Pages** - Fichas tecnicas completas de cada tela con specs, imagen, tooltips, badges y navegacion cruzada
- [ ] **Phase 7: Content Section Pages** - Paginas de Tecnologias, Personalizacion y Cuellos con contenido real del PDF
- [ ] **Phase 8: Search, Filter & Sort** - Filtrado por tecnologia, ordenamiento por peso/ancho, busqueda fuzzy con fuse.js
- [ ] **Phase 9: Responsive Polish & Deploy** - Verificacion responsive lg/md, deploy Vercel, performance SSG < 2s

## Phase Details

### Phase 5: Tech Debt & Data Foundation
**Goal**: El data layer esta completo, correcto y funcional — las FabricCards muestran imagenes reales, la navegacion funciona sin bugs, y los modelos de datos cubren todo el contenido del catalogo
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: DEBT-01, DEBT-02, DEBT-03, DEBT-04, DEBT-05, DEBT-06, DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. Todas las FabricCard en las 8 paginas de categoria muestran la imagen real del producto (cero 404, cero placeholder.webp)
  2. El nav link "Usos" aparece como activo cuando el vendedor esta en cualquier ruta /uso/* o /usos
  3. El build (`bun run build`) completa sin warnings de dependencias no usadas y el bundle no incluye class-variance-authority
  4. Los 3 iconos de tecnologia que faltaban (algodon, antimanchas, solidez-a-la-luz) muestran un icono fallback de Lucide en lugar de un espacio vacio
  5. Los archivos de datos para Personalizacion (4 opciones), Cuellos (colores + tallas) y Tecnologias (descripciones expandidas) existen y son importables con tipado correcto
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Tech debt cleanup: image mapping, nav fix, CVA removal, color documentation, SkeletonCard retention
- [x] 05-02-PLAN.md — Data foundation: tech icon fallbacks, personalization model, collars model, technology enrichment

### Phase 6: Fabric Detail Pages
**Goal**: El vendedor puede mostrar al cliente la ficha tecnica completa de cualquier tela con todas sus especificaciones, tecnologias y relaciones con otras categorias
**Depends on**: Phase 5
**Requirements**: DETAIL-01, DETAIL-02, DETAIL-03, DETAIL-04, DETAIL-05
**Success Criteria** (what must be TRUE):
  1. Cada ruta /uso/[slug]/[fabricId] muestra una ficha tecnica con: nombre, composicion, gramaje (g/m2), ancho (cm), tipo de tejido y base
  2. La imagen real de la tela se muestra prominentemente en la ficha con next/image (optimizacion automatica, aspect ratio correcto)
  3. Los iconos de tecnologia en la ficha muestran un tooltip CSS-only al hacer hover con el nombre y descripcion de la tecnologia
  4. Las telas marcadas como nuevas muestran un badge "Nuevo" visible
  5. Si una tela pertenece a multiples categorias, la ficha muestra links de navegacion cruzada a las otras categorias donde aparece
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Ficha técnica completa: TechIcon compartido, specs table, tooltips CSS-only, badge Nuevo, navegación cruzada

### Phase 7: Content Section Pages
**Goal**: Los 3 items restantes del menu principal (Tecnologias, Personalizacion, Cuellos) muestran contenido real del PDF en lugar de paginas placeholder
**Depends on**: Phase 5
**Requirements**: SECTION-01, SECTION-02, SECTION-03
**Success Criteria** (what must be TRUE):
  1. La pagina /tecnologias muestra un grid de las 12+ tecnologias textiles, cada una con icono (o fallback Lucide), nombre y descripcion expandida del PDF
  2. La pagina /personalizacion presenta las 4 opciones de personalizacion (dibujos exclusivos, estampacion digital, tipo Davos, desarrollo de color) con imagenes y texto del PDF
  3. La pagina /cuellos muestra los 4 colores disponibles, tabla de tallas para ninos y adolescentes/adultos, y la informacion comercial de pedido
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md — CSS animation + Tecnologias page con 14 tech cards y cross-navigation a telas
- [ ] 07-02-PLAN.md — Personalizacion page con 4 opciones e imagenes + Cuellos page con colores, tablas de tallas y notas comerciales

### Phase 8: Search, Filter & Sort
**Goal**: El vendedor puede encontrar telas especificas en segundos usando filtros, ordenamiento y busqueda durante la reunion comercial
**Depends on**: Phase 6 (FabricCard estabilizada)
**Requirements**: FILTER-01, FILTER-02, FILTER-03
**Success Criteria** (what must be TRUE):
  1. En cada pagina de categoria, el vendedor puede seleccionar una o mas tecnologias como filtro (chips multi-select) y el grid muestra solo las telas que tienen esas tecnologias, actualizandose sin recarga
  2. El vendedor puede ordenar las telas por gramaje (g/m2) o ancho (cm) en orden ascendente o descendente
  3. Una barra de busqueda permite escribir el nombre de una tela (con tolerancia a typos via fuse.js) y ver resultados instantaneos
  4. El build confirma que todas las paginas de categoria mantienen SSG estatico (no se deoptimiza a CSR por el uso de useState en lugar de useSearchParams)
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Responsive Polish & Deploy
**Goal**: El catalogo completo esta desplegado en produccion, se ve correctamente en laptop y tablet, y carga rapido para uso en reuniones de ventas
**Depends on**: Phase 5, Phase 6, Phase 7, Phase 8
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Todas las paginas (home, categorias, fichas tecnicas, tecnologias, personalizacion, cuellos) se ven correctamente en breakpoints lg (desktop) y md (tablet) sin overflow horizontal ni elementos rotos
  2. El sitio esta accesible en una URL publica de Vercel con todas las rutas SSG funcionando
  3. La carga inicial de cualquier pagina es menor a 2 segundos (SSG verificado con icono estatico en build log, no lambda)
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7 -> 8 -> 9
Note: Phase 7 only depends on Phase 5 (not Phase 6), so could theoretically run after Phase 5. For a solo developer, sequential after Phase 6 for simplicity.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Foundation | v1.0 | 1/1 | Complete | 2026-02-22 |
| 2. Data Layer & Assets | v1.0 | 2/2 | Complete | 2026-02-22 |
| 3. Global Navigation & Home | v1.0 | 3/3 | Complete | 2026-02-22 |
| 4. Category Pages | v1.0 | 2/2 | Complete | 2026-02-22 |
| 5. Tech Debt & Data Foundation | v1.1 | 2/2 | Complete | 2026-02-22 |
| 6. Fabric Detail Pages | v1.1 | Complete    | 2026-02-22 | - |
| 7. Content Section Pages | v1.1 | 0/? | Not started | - |
| 8. Search, Filter & Sort | v1.1 | 0/? | Not started | - |
| 9. Responsive Polish & Deploy | v1.1 | 0/? | Not started | - |
