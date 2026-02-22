# Lafayette Uni For Me Colegios — Web Comercial

## What This Is

Sitio web catálogo completo para la fuerza de ventas de Lafayette, enfocado en soluciones textiles para uniformes escolares ("Uni For Me Colegios"). Herramienta interna que los vendedores usan en reuniones presenciales con colegios en laptop/tablet. Incluye home page con hero de marca, 8 páginas de categoría con filtros/búsqueda, 43 fichas técnicas de telas, secciones de Tecnologías, Personalización y Cuellos, y navegación global responsive.

## Core Value

El vendedor puede presentar toda la oferta de telas para uniformes escolares de forma visual, organizada y profesional, navegando fluidamente entre categorías de producto durante una reunión comercial.

## Requirements

### Validated

- ✓ Proyecto inicializado con Next.js App Router + TypeScript + Tailwind CSS v4 + Bun — v1.0
- ✓ Modelo de datos TypeScript para telas, categorías y tecnologías — v1.0
- ✓ Imágenes extraídas del PDF y optimizadas para web (WebP via next/image) — v1.0
- ✓ Design system con 8 tokens de color por categoría en Tailwind v4 @theme — v1.0
- ✓ Header global con logo Lafayette visible en todas las páginas — v1.0
- ✓ Menú principal con 4 items: Usos, Tecnologías, Personalización, Cuellos — v1.0
- ✓ Navegación responsive (desktop: full nav bar, tablet: hamburger menu) — v1.0
- ✓ Hero section con branding "Lafayette Uni For Me Colegios" — v1.0
- ✓ Grid visual de 4 items principales enlazando a secciones — v1.0
- ✓ Los 4 items del menú igualmente prominentes como navegación principal — v1.0
- ✓ Página intermedia /usos con grid de 8 cards de categoría con colores e imágenes — v1.0
- ✓ 8 páginas de categoría de uso accesibles via /uso/[slug] — v1.0
- ✓ Product cards en grid responsive (3 cols desktop, 2 cols tablet) — v1.0
- ✓ Cada card muestra nombre, imagen y chips de tecnologías — v1.0
- ✓ Header de categoría con color de fondo distintivo — v1.0
- ✓ Diseño web moderno 2025 con paleta del PDF — v1.0
- ✓ Ficha técnica completa de cada tela (specs, composición, peso, ancho) — v1.1
- ✓ Tooltips de tecnología CSS-only en ficha de tela — v1.1
- ✓ Sección de Tecnologías Textiles con 14 tech cards e iconos — v1.1
- ✓ Sección de Personalización de Uniformes (4 opciones con imágenes) — v1.1
- ✓ Sección de Cuellos (colores, tallas, info comercial) — v1.1
- ✓ Desktop-first responsive verificado en breakpoints lg y md — v1.1
- ✓ Filtrar telas por tecnología (multi-select chips) — v1.1
- ✓ Ordenar telas por peso y ancho — v1.1
- ✓ Búsqueda fuzzy por nombre de tela con fuse.js — v1.1
- ✓ Tech debt v1.0 resuelto (imágenes, nav, CVA, iconos) — v1.1

### Active

- [ ] Deploy funcional en Vercel con todas las rutas SSG
- [ ] SSG con carga inicial < 2s

### Out of Scope

- SEO y meta tags públicos — herramienta interna, no requiere indexación
- Formularios de contacto o leads — es solo catálogo informativo
- WhatsApp o chat — vendedor está presente en la reunión
- Secciones de Certificaciones, Etiquetas/Marquillas, Tiendas, Sostenibilidad — no prioritarias
- Autenticación/login — no necesario
- E-commerce o carrito — no es transaccional
- Mobile phone optimization — se usa en laptop/tablet exclusivamente
- CMS / Admin panel — catálogo cambia 1-2 veces al año, datos estáticos en TypeScript es suficiente
- Multi-idioma — mercado es colegios colombianos, solo español
- Comparación lado a lado de telas — UI compleja, valor bajo con specs limitados
- Galería multi-imagen por tela — solo existe 1 imagen por tela
- PWA / modo offline — no prioritario para v1

## Context

### Current State (v1.1 shipped)

- **LOC:** 2,582 TypeScript/CSS en `src/`
- **Stack:** Next.js 16.1.6, React 19.2.3, Tailwind v4.2.0, lucide-react, clsx/tailwind-merge, fuse.js 7.1.0
- **Routes:** 59 SSG pages (home + /usos + 8 categorías + 43 fichas técnicas + /tecnologias + /personalizacion + /cuellos)
- **Data:** 31 telas, 8 categorías, 14 tecnologías, 4 opciones personalización, datos de cuellos
- **Assets:** 14 product images (WebP), 22 content images (WebP), 12 tech logos (PNG), 1 Lafayette logo, 1 portada

### Known Tech Debt

- SkeletonCard + .skeleton-shimmer CSS dead code
- getFabricByBase helper dead code
- expandedDescription === description (limitación del PDF fuente)
- CATEGORY_STYLE_MAP no re-exportado por barrel @/lib/content

### Contenido Base

- PDF "Uniformes_Colegios.pdf" (24 páginas, 37MB) — fuente única de verdad
- 13 assets de logos de tecnologías en /Assets/

## Constraints

- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS v4
- **Deploy**: Vercel-compatible
- **Contenido**: Solo del PDF — no inventar texto ni especificaciones
- **Fotos**: Extraer del PDF (no hay originales en alta resolución)
- **Diseño**: Moderno web 2025, no réplica del PDF, pero mismos colores
- **Dispositivo**: Desktop-first, responsive a tablet (no se optimiza para celular)
- **Package manager**: Bun (no npm)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-page con rutas por categoría | El vendedor navega directo a la categoría sin scroll largo | ✓ Good — 8 rutas /uso/[slug] funcionan bien |
| Diseño moderno 2025 (no réplica PDF) | La web debe sentirse como producto digital profesional | ✓ Good — Tailwind v4 + design tokens dan apariencia moderna |
| Solo informativo (sin CTA/formularios) | El vendedor está presente, no necesita leads | ✓ Good — simplifica desarrollo |
| Extraer imágenes del PDF | No hay originales disponibles | ✓ Good — mapeo completado en v1.1, calidad aceptable |
| Raleway headings + Montserrat body | Legibilidad de specs técnicas y estética moderna | ✓ Good |
| as-const satisfies para data layer | Type safety máxima con inferencia de literales | ✓ Good — 0 errores TypeScript |
| Sticky header con backdrop blur | Acceso rápido al menú durante presentaciones | ✓ Good |
| SSG con generateStaticParams | 59 rutas pre-renderizadas para velocidad | ✓ Good — build sin errores |
| TechIcon dual-format (path + Lucide) | Soportar logos PNG y fallbacks Lucide sin condicionales | ✓ Good — usado en 5 consumers |
| CSS-only tooltips (group-hover) | Zero JS, funciona desktop + tablet | ✓ Good — no requiere state management |
| FilterableFabricGrid como Client Island | Preservar SSG en páginas de categoría | ✓ Good — 59 páginas estáticas en build |
| fuse.js para búsqueda fuzzy | Lightweight, no requiere backend | ✓ Good — tolerante a typos |
| OR logic para filter chips | Más intuitivo para vendedores | ✓ Good — resultados inclusivos |
| No imagen individual por tela en ficha | User decision — PDF no tiene fotos individuales útiles | ✓ Good — layout centrado funciona bien |
| Tablas de tallas sin tabs | Vendedor necesita ver ambas tablas simultáneamente en reunión | ✓ Good |

---
*Last updated: 2026-02-22 after v1.1 milestone completed*
