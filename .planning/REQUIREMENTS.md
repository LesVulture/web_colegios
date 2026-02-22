# Requirements: Lafayette Uni For Me Colegios

**Defined:** 2026-02-22
**Core Value:** El vendedor puede presentar toda la oferta de telas para uniformes escolares de forma visual, organizada y profesional, navegando fluidamente entre categorías de producto durante una reunión comercial.

## v1.1 Requirements

Requirements for milestone v1.1 — Catálogo Completo. Each maps to roadmap phases.

### Tech Debt

- [ ] **DEBT-01**: Mapear 14 imágenes reales de producto a registros de fabrics.ts, eliminando placeholder.webp 404
- [ ] **DEBT-02**: Corregir NavLinks active state para rutas /uso/* (cambiar startsWith('/usos') a startsWith('/uso'))
- [ ] **DEBT-03**: Remover class-variance-authority (dependencia instalada sin uso)
- [ ] **DEBT-04**: Consolidar colores hex duplicados entre globals.css tokens y categories.ts
- [ ] **DEBT-05**: Integrar SkeletonCard como Suspense fallback o remover si no se usa
- [ ] **DEBT-06**: Proveer iconos fallback (Lucide) para 3 tecnologías sin logo (algodón, antimanchas, solidez-a-la-luz)

### Data Foundation

- [ ] **DATA-01**: Crear modelo de datos y archivo para Personalización (4 opciones del PDF p.15)
- [ ] **DATA-02**: Crear modelo de datos y archivo para Cuellos (colores, tallas del PDF pp.16-17)
- [ ] **DATA-03**: Expandir descripciones de tecnologías con contenido detallado del PDF p.14

### Fichas Técnicas

- [ ] **DETAIL-01**: Ficha técnica completa de cada tela con specs (composición, gramaje, ancho, tejido, base)
- [ ] **DETAIL-02**: Imagen de tela integrada con next/image en ficha de detalle
- [ ] **DETAIL-03**: Tooltips de tecnología CSS-only (group-hover) en ficha de tela
- [ ] **DETAIL-04**: Badge "Nuevo" en telas marcadas como nuevas
- [ ] **DETAIL-05**: Navegación cruzada entre categorías para telas compartidas (usar getCategoriesByFabric)

### Secciones de Contenido

- [ ] **SECTION-01**: Página de Tecnologías Textiles con cards, logos y descripciones expandidas
- [ ] **SECTION-02**: Página de Personalización con 4 opciones, imágenes y texto del PDF
- [ ] **SECTION-03**: Página de Cuellos con grid de colores, tabla de tallas y medidas

### Filtrado y Búsqueda

- [ ] **FILTER-01**: Filtrar telas por tecnología con chips multi-select horizontales
- [ ] **FILTER-02**: Ordenar telas por gramaje y ancho (sort numérico)
- [ ] **FILTER-03**: Búsqueda fuzzy global por nombre de tela con fuse.js

### Deploy

- [ ] **DEPLOY-01**: Responsive desktop-first verificado en breakpoints lg y md
- [ ] **DEPLOY-02**: Deploy funcional en Vercel con todas las rutas SSG
- [ ] **DEPLOY-03**: Carga inicial < 2 segundos en todas las rutas

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Features

- **ADV-01**: Comparación lado a lado de telas (UI compleja, valor bajo con specs limitados)
- **ADV-02**: Galería multi-imagen con zoom por tela (solo existe 1 imagen por tela actualmente)
- **ADV-03**: PWA / modo offline para uso sin conexión
- **ADV-04**: Filtro por composición o tipo de tejido
- **ADV-05**: Páginas individuales por tecnología con catálogo de telas asociadas

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| SEO y meta tags | Herramienta interna, no requiere indexación |
| Formularios de contacto/leads | Solo catálogo informativo, vendedor presente |
| WhatsApp/chat | Vendedor está en la reunión |
| Certificaciones, Etiquetas, Tiendas, Sostenibilidad | Secciones no prioritarias del PDF |
| Autenticación/login | No necesario para herramienta interna |
| E-commerce/carrito | No es transaccional |
| Mobile phone optimization | Se usa en laptop/tablet exclusivamente |
| CMS/Admin panel | Datos cambian 1-2 veces/año, TypeScript estático suficiente |
| Multi-idioma | Solo mercado colombiano, español |
| Real-time chat | No aplica al caso de uso |
| Video content | No hay contenido de video disponible |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEBT-01 | — | Pending |
| DEBT-02 | — | Pending |
| DEBT-03 | — | Pending |
| DEBT-04 | — | Pending |
| DEBT-05 | — | Pending |
| DEBT-06 | — | Pending |
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DETAIL-01 | — | Pending |
| DETAIL-02 | — | Pending |
| DETAIL-03 | — | Pending |
| DETAIL-04 | — | Pending |
| DETAIL-05 | — | Pending |
| SECTION-01 | — | Pending |
| SECTION-02 | — | Pending |
| SECTION-03 | — | Pending |
| FILTER-01 | — | Pending |
| FILTER-02 | — | Pending |
| FILTER-03 | — | Pending |
| DEPLOY-01 | — | Pending |
| DEPLOY-02 | — | Pending |
| DEPLOY-03 | — | Pending |

**Coverage:**
- v1.1 requirements: 22 total
- Mapped to phases: 0
- Unmapped: 22 ⚠️

---
*Requirements defined: 2026-02-22*
*Last updated: 2026-02-22 after initial definition*
