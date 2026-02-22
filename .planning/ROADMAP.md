# Roadmap: Lafayette Uni For Me Colegios

## Overview

El catálogo web de Lafayette reemplaza un PDF de 37MB como herramienta de ventas para reuniones con colegios. La navegación principal tiene 4 items (Usos, Tecnologías, Personalización, Cuellos). "Usos" lleva a una página intermedia con 8 categorías; al elegir una categoría se muestran las telas de esa categoría.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-02-22)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-02-22</summary>

- [x] Phase 1: Project Foundation (1/1 plans) — completed 2026-02-22
- [x] Phase 2: Data Layer & Assets (2/2 plans) — completed 2026-02-22
- [x] Phase 3: Global Navigation & Home (3/3 plans) — completed 2026-02-22
- [x] Phase 4: Category Pages (2/2 plans) — completed 2026-02-22

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### Unassigned Phases (Next Milestone)

- [ ] **Phase 5: Fabric Details** - Fichas técnicas completas de cada tela con specs, imagen y badges de tecnología
- [ ] **Phase 6: Content Sections & Deploy** - Páginas de Tecnologías, Personalización y Cuellos; responsive tablet; SSG; deploy funcional en Vercel
- [ ] **Phase 7: Filtering & Search** - Filtrado por tecnología, ordenamiento por specs, búsqueda fuzzy por nombre de tela

## Phase Details

### Phase 5: Fabric Details
**Goal**: El vendedor puede mostrar al cliente la ficha técnica completa de cualquier tela con todas sus especificaciones y tecnologías
**Depends on**: Phase 4
**Requirements**: TEL-01, TEL-02, TEL-03
**Success Criteria** (what must be TRUE):
  1. Cada tela tiene una ficha técnica visible que muestra: nombre, código base, composición, tipo de tejido, peso (g/m2), ancho (cm), tecnologías aplicables y rutas de estampación disponibles
  2. La imagen de la tela/producto extraída del PDF se muestra integrada con next/image (optimización automática, lazy loading)
  3. Los iconos de tecnología en la ficha muestran un tooltip al hover con la explicación de cada tecnología
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Content Sections & Deploy
**Goal**: El vendedor tiene acceso a las secciones complementarias (tecnologías, personalización, cuellos) y el sitio completo está desplegado en producción con rendimiento óptimo
**Depends on**: Phase 5
**Requirements**: TECH-01, PERS-01, CUEL-01, DES-02, DES-03, DES-04
**Success Criteria** (what must be TRUE):
  1. La página de Tecnologías (`/tecnologias`) muestra un grid de 12 tecnologías textiles, cada una con su icono (de Assets/), nombre y descripción
  2. La página de Personalización (`/personalizacion`) presenta las 4 opciones disponibles (dibujos exclusivos, estampación digital, estampación tipo Davos, desarrollo de color)
  3. La página de Cuellos (`/cuellos`) muestra los 4 colores disponibles, las tablas de tallas (niños y adolescentes/adultos) y la información comercial de pedido
  4. El sitio se ve correctamente en desktop y tablet (breakpoints lg y md), sin elementos rotos ni overflow horizontal
  5. El sitio está desplegado en Vercel, la carga inicial es menor a 2 segundos (SSG), y todas las páginas son accesibles desde la URL de producción
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Filtering & Search
**Goal**: El vendedor puede encontrar telas específicas rápidamente usando filtros, ordenamiento y búsqueda durante la reunión
**Depends on**: Phase 6
**Requirements**: FILT-01, FILT-02, FILT-03
**Success Criteria** (what must be TRUE):
  1. Dentro de cada categoría, el vendedor puede filtrar telas por tecnología usando chips multi-select (client-side), y la lista se actualiza instantáneamente
  2. El vendedor puede ordenar las telas por peso (g/m2) y por ancho (cm) en orden ascendente o descendente
  3. Una barra de búsqueda accesible desde el header o las páginas de categoría permite buscar telas por nombre con coincidencia fuzzy, y muestra resultados en tiempo real
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Foundation | v1.0 | 1/1 | Complete | 2026-02-22 |
| 2. Data Layer & Assets | v1.0 | 2/2 | Complete | 2026-02-22 |
| 3. Global Navigation & Home | v1.0 | 3/3 | Complete | 2026-02-22 |
| 4. Category Pages | v1.0 | 2/2 | Complete | 2026-02-22 |
| 5. Fabric Details | — | 0/? | Not started | - |
| 6. Content Sections & Deploy | — | 0/? | Not started | - |
| 7. Filtering & Search | — | 0/? | Not started | - |
