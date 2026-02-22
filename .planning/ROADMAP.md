# Roadmap: Lafayette Uni For Me Colegios

## Overview

El catálogo web de Lafayette reemplaza un PDF de 37MB como herramienta de ventas para reuniones con colegios. La navegación principal tiene 4 items (Usos, Tecnologías, Personalización, Cuellos). "Usos" lleva a una página intermedia con 8 categorías; al elegir una categoría se muestran las telas de esa categoría. El roadmap avanza desde la infraestructura técnica hacia la UI visible, luego secciones de contenido con deploy, y finalmente herramientas de exploración avanzada.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Foundation** - Scaffolding Next.js 16, design system con tokens de 8 colores de categoría, configuración Tailwind v4
- [ ] **Phase 2: Data Layer & Assets** - Modelos TypeScript del catálogo completo, extracción y optimización de imágenes del PDF
- [ ] **Phase 3: Global Navigation & Home** - Header con logo Lafayette, menú de 4 items principales, home page con hero y grid de 4 secciones, página intermedia `/usos` con 8 categorías
- [ ] **Phase 4: Category Pages** - 8 páginas de categoría con routing dinámico `/uso/[slug]`, grid de product cards y theming por color
- [ ] **Phase 5: Fabric Details** - Fichas técnicas completas de cada tela con specs, imagen y badges de tecnología
- [ ] **Phase 6: Content Sections & Deploy** - Páginas de Tecnologías, Personalización y Cuellos; responsive tablet; SSG; deploy funcional en Vercel
- [ ] **Phase 7: Filtering & Search** - Filtrado por tecnología, ordenamiento por specs, búsqueda fuzzy por nombre de tela

## Phase Details

### Phase 1: Project Foundation
**Goal**: El proyecto tiene una base técnica funcional con design system listo para construir componentes
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-04, DES-01
**Success Criteria** (what must be TRUE):
  1. `bun run dev` inicia el servidor de desarrollo sin errores y muestra una página en localhost
  2. Los 8 colores de categoría están definidos como tokens Tailwind v4 y se pueden usar en clases utility (ej: `bg-cat-sudaderas` produce el color azul oscuro correcto)
  3. La paleta de marca Lafayette (azul oscuro primario, rojo acento) se aplica a elementos base (tipografía, backgrounds)
  4. El proyecto usa App Router de Next.js con TypeScript estricto y no tiene errores de tipo
**Plans**: 1 plan

Plans:
- [ ] 01-01-PLAN.md — Scaffold Next.js 16 + design system completo (tokens de color, tipografia, estilos base)

### Phase 2: Data Layer & Assets
**Goal**: Todo el contenido del catálogo está modelado como datos TypeScript tipados y las imágenes del PDF están extraídas y listas para uso con next/image
**Depends on**: Phase 1
**Requirements**: FOUND-02, FOUND-03
**Success Criteria** (what must be TRUE):
  1. Las ~40 telas están definidas como constantes TypeScript con todas sus propiedades (nombre, composición, tejido, peso, ancho, tecnologías, rutas) y se pueden importar desde `lib/content/`
  2. Las 8 categorías tienen sus telas asignadas correctamente y se puede consultar qué telas pertenecen a cada categoría
  3. Las imágenes de producto extraídas del PDF existen en `/public/images/`, tienen al menos 400px de ancho, y están en formato optimizado para web
  4. Los 13 assets de logos de tecnología están renombrados a kebab-case sin espacios y referenciados correctamente en los datos
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Global Navigation & Home
**Goal**: El vendedor puede abrir el sitio y navegar a las 4 secciones principales (Usos, Tecnologías, Personalización, Cuellos), y al entrar en Usos ve las 8 categorías disponibles
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, HOME-01, HOME-02, HOME-03, USOS-01
**Success Criteria** (what must be TRUE):
  1. El logo Lafayette es visible en la esquina superior izquierda de todas las páginas (12px offset del borde superior)
  2. El menú de navegación muestra exactamente 4 items: Usos, Tecnologías, Personalización, Cuellos
  3. En tablet, la navegación se adapta a un formato compacto (hamburger menu o nav colapsada) sin perder acceso a ninguna sección
  4. La home page muestra un hero con branding "Lafayette Uni For Me Colegios" y un grid visual de 4 items principales, cada uno igualmente prominente, enlazando a su sección correspondiente
  5. Al hacer clic en "Usos" (desde el menú o desde la home), el vendedor llega a `/usos` donde ve un grid de 8 cards de categoría, cada una con su color distintivo e imagen, enlazando a `/uso/[slug]`
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Category Pages
**Goal**: El vendedor puede navegar a cualquier categoría de uso y ver todas las telas disponibles en esa categoría presentadas en un grid visual con color-coding
**Depends on**: Phase 3
**Requirements**: CAT-01, CAT-02, CAT-03, CAT-04
**Success Criteria** (what must be TRUE):
  1. Las 8 categorías son accesibles via URL `/uso/[slug]` y cada una muestra solo las telas que le corresponden
  2. Las telas se muestran en un grid responsive: 3 columnas en desktop, 2 columnas en tablet
  3. Cada card de tela muestra el nombre, la imagen del producto y chips con las tecnologías aplicables
  4. El header de cada categoría tiene su color de fondo distintivo (según paleta del PDF) y una imagen hero representativa
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

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

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation | 0/? | Not started | - |
| 2. Data Layer & Assets | 0/? | Not started | - |
| 3. Global Navigation & Home | 0/? | Not started | - |
| 4. Category Pages | 0/? | Not started | - |
| 5. Fabric Details | 0/? | Not started | - |
| 6. Content Sections & Deploy | 0/? | Not started | - |
| 7. Filtering & Search | 0/? | Not started | - |
