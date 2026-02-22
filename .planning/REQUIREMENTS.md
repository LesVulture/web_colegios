# Requirements: Lafayette Uni For Me Colegios

**Defined:** 2026-02-21
**Core Value:** El vendedor puede presentar toda la oferta de telas para uniformes escolares de forma visual, organizada y profesional, navegando fluidamente entre categorías de producto durante una reunión comercial.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Proyecto inicializado con Next.js App Router + TypeScript + Tailwind CSS v4 + Bun
- [ ] **FOUND-02**: Modelo de datos TypeScript para telas (nombre, base, composición, tejido, peso, ancho, tecnologías, rutas), categorías (nombre, slug, color, descripción), y tecnologías (nombre, icono, descripción)
- [ ] **FOUND-03**: Imágenes extraídas del PDF (37MB) y optimizadas para web (WebP/AVIF via next/image)
- [ ] **FOUND-04**: Design system con 8 tokens de color por categoría definidos en Tailwind v4 @theme

### Navigation

- [ ] **NAV-01**: Header global con logo Lafayette visible en todas las páginas (esquina superior izquierda, 12px offset del borde superior)
- [ ] **NAV-02**: Menú principal con 4 items: Usos, Tecnologías, Personalización, Cuellos
- [ ] **NAV-03**: Navegación responsive (desktop: full nav bar, tablet: hamburger menu o nav compacta)

### Home

- [ ] **HOME-01**: Hero section con branding "Lafayette Uni For Me Colegios" y visual impactante
- [ ] **HOME-02**: Grid visual de 4 items principales (Usos, Tecnologías, Personalización, Cuellos), cada uno con imagen/icono representativo y enlace a su sección
- [ ] **HOME-03**: Los 4 items del menú principal son la única navegación de contenido desde la home (no hay secciones "secundarias", todo es igual de prominente)

### Usos (Intermediate Page)

- [ ] **USOS-01**: Página intermedia `/usos` con grid de 8 cards de categoría de uso, cada una con su color distintivo e imagen representativa, enlace a `/uso/[slug]`

### Category Pages

- [ ] **CAT-01**: Página individual por cada categoría de uso accesible via `/uso/[slug]` (8 páginas totales)
- [ ] **CAT-02**: Product cards de tela en grid responsive (3 columnas desktop, 2 columnas tablet)
- [ ] **CAT-03**: Cada card de tela muestra: nombre, imagen del producto, chips de tecnologías aplicables
- [ ] **CAT-04**: Header de categoría con nombre, color de fondo distintivo e imagen hero

### Fabric Details

- [ ] **TEL-01**: Ficha técnica completa de cada tela con: nombre, código base, composición, tipo de tejido, peso (g/m2), ancho (cm), tecnologías aplicables, rutas de estampación disponibles
- [ ] **TEL-02**: Imagen de tela/producto extraída del PDF integrada con next/image
- [ ] **TEL-03**: Iconos de tecnología en ficha de tela con tooltip al hover que muestra explicación de la tecnología

### Filtering & Search

- [ ] **FILT-01**: Filtrar telas por tecnología dentro de cada categoría (multi-select chips, client-side)
- [ ] **FILT-02**: Ordenar telas por peso (g/m2) y por ancho (cm) ascendente/descendente
- [ ] **FILT-03**: Barra de búsqueda por nombre de tela (fuzzy search client-side, accesible desde header o páginas de categoría)

### Content Sections

- [ ] **TECH-01**: Página de Tecnologías Textiles con grid de 12 tecnologías, cada una con icono (de Assets/), nombre y descripción
- [ ] **PERS-01**: Página de Personalización de Uniformes con las 4 opciones: dibujos exclusivos, estampación digital, estampación tipo Davos, desarrollo de color
- [ ] **CUEL-01**: Página de Cuellos con 4 colores disponibles, tabla de tallas (niños y adolescentes/adultos), info comercial de pedido

### Design & Performance

- [ ] **DES-01**: Diseño web moderno 2025 usando la paleta de colores del PDF (azul oscuro primario, rojo acento, 8 colores de categoría)
- [ ] **DES-02**: Desktop-first, responsive hasta tablet (breakpoints lg y md). No se optimiza para mobile phone.
- [ ] **DES-03**: Carga inicial < 2 segundos via Static Site Generation (SSG) con Next.js
- [ ] **DES-04**: Deploy funcional en Vercel

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Navigation

- **ENAV-01**: Navegación cruzada tela-categoría (desde la tela ver en qué otras categorías aplica y navegar directo)

### Visual Enhancement

- **VIS-01**: Galería de imágenes con zoom (lightbox/modal para ver textura de tela en detalle)
- **VIS-02**: Transiciones de página y micro-animaciones (hover states, page transitions con Framer Motion)

### Advanced Features

- **ADV-01**: Modo offline / PWA (Service Worker + cache-first para presentaciones sin WiFi)
- **ADV-02**: Comparación lado a lado de telas (seleccionar 2-3 telas y comparar specs en tabla)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| E-commerce / Carrito / Pedidos | Lafayette no vende directo online a colegios. El vendedor toma pedidos por otro canal. |
| CRM / Formularios de contacto | El vendedor está presente en la reunión. No hay flujo online de leads. |
| Chat / WhatsApp widget | El vendedor ES el canal de comunicación. No necesita widget. |
| Optimización mobile phone | Se usa en laptop/tablet exclusivamente. Mobile consume esfuerzo sin beneficio. |
| SEO y meta tags públicos | Herramienta interna. No debe indexarse en Google. |
| Autenticación / Login | No hay datos sensibles. Añade fricción al vendedor en cada reunión. |
| CMS / Admin panel | El catálogo cambia 1-2 veces al año. Datos estáticos en TypeScript es suficiente. |
| Multi-idioma | Mercado es colegios colombianos. Solo español. |
| Integración ERP/PIM | No hay precios ni inventario relevante para la presentación. |
| Analytics avanzado | ~20 vendedores. Vercel Analytics básico es suficiente si se necesita. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| DES-01 | Phase 1 | Pending |
| FOUND-02 | Phase 2 | Pending |
| FOUND-03 | Phase 2 | Pending |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| HOME-01 | Phase 3 | Pending |
| HOME-02 | Phase 3 | Pending |
| HOME-03 | Phase 3 | Pending |
| USOS-01 | Phase 3 | Pending |
| CAT-01 | Phase 4 | Pending |
| CAT-02 | Phase 4 | Pending |
| CAT-03 | Phase 4 | Pending |
| CAT-04 | Phase 4 | Pending |
| TEL-01 | Phase 5 | Pending |
| TEL-02 | Phase 5 | Pending |
| TEL-03 | Phase 5 | Pending |
| TECH-01 | Phase 6 | Pending |
| PERS-01 | Phase 6 | Pending |
| CUEL-01 | Phase 6 | Pending |
| DES-02 | Phase 6 | Pending |
| DES-03 | Phase 6 | Pending |
| DES-04 | Phase 6 | Pending |
| FILT-01 | Phase 7 | Pending |
| FILT-02 | Phase 7 | Pending |
| FILT-03 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-02-21*
*Last updated: 2026-02-21 after roadmap revision (navigation hierarchy corrected)*
