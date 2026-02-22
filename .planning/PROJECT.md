# Lafayette Uni For Me Colegios — Web Comercial

## What This Is

Sitio web catálogo para la fuerza de ventas de Lafayette, enfocado en presentar la oferta de soluciones textiles para uniformes escolares ("Uni For Me Colegios"). Es una herramienta interna que los vendedores usan en reuniones presenciales con colegios, mostrándola en laptop/tablet. Actualmente tiene home page con hero de marca, navegación global responsive, 8 páginas de categoría de uso con product cards, y un data layer de 31 telas tipadas.

## Core Value

El vendedor puede presentar toda la oferta de telas para uniformes escolares de forma visual, organizada y profesional, navegando fluidamente entre categorías de producto durante una reunión comercial.

## Current Milestone: v1.1 Catálogo Completo

**Goal:** Completar el catálogo web con fichas técnicas de tela, secciones faltantes (Tecnologías, Personalización, Cuellos), filtros/búsqueda, deploy a Vercel, y resolver todo el tech debt de v1.0.

**Target features:**
- Fichas técnicas completas de cada tela (specs, composición, peso, ancho, imagen)
- Sección de Tecnologías Textiles (12 tecnologías con iconos)
- Sección de Personalización de Uniformes (4 opciones)
- Sección de Cuellos (colores, tallas, info comercial)
- Filtrar telas por tecnología, ordenar por peso/ancho, búsqueda fuzzy
- Desktop-first responsive completo (lg/md verificados)
- Deploy funcional en Vercel con SSG < 2s
- Resolver 13 items de tech debt de v1.0

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

### Active

- [ ] Ficha técnica completa de cada tela (specs, composición, peso, ancho, rutas)
- [ ] Imagen de tela integrada con next/image en ficha de detalle
- [ ] Tooltips de tecnología en ficha de tela
- [ ] Sección de Tecnologías Textiles (12 tecnologías con iconos)
- [ ] Sección de Personalización de Uniformes (4 opciones)
- [ ] Sección de Cuellos (colores, tallas, info comercial)
- [ ] Desktop-first responsive completo a tablet (breakpoints lg y md verificados)
- [ ] SSG con carga inicial < 2s
- [ ] Deploy funcional en Vercel
- [ ] Filtrar telas por tecnología (multi-select chips)
- [ ] Ordenar telas por peso y ancho
- [ ] Búsqueda fuzzy por nombre de tela

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

## Context

### Current State (v1.0 shipped)

- **LOC:** 1,481 TypeScript/CSS en `src/`
- **Stack:** Next.js 16.1.6, React 19.2.3, Tailwind v4.2.0, lucide-react, clsx/tailwind-merge
- **Routes:** 51 SSG routes (home + /usos + 8 categorías + 43 fabric detail placeholders + 3 placeholder pages)
- **Data:** 31 telas, 8 categorías, 14 tecnologías como constantes TypeScript tipadas
- **Assets:** 14 product images (WebP), 22 content images (WebP), 12 tech logos (PNG), 1 Lafayette logo

### Known Tech Debt (from v1.0 audit)

- placeholder.webp 404: imágenes de producto no mapeadas a fabrics
- NavLinks active state: `/usos` no captura `/uso/*`
- CVA instalada sin uso, SkeletonCard huérfano
- Ver `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

### Contenido Base

- PDF "Uniformes_Colegios.pdf" (24 páginas, 37MB) — fuente única de verdad
- 13 assets de logos de tecnologías en /Assets/

### Estructura del Catálogo (del PDF)

8 categorías de uso, cada una con color distintivo:

| # | Categoría | Color | Telas |
|---|-----------|-------|-------|
| 1 | Sudaderas - Chaquetas - Pantalones | #1B3A5C | 9 telas |
| 2 | Camisetas - Polos | #3FA9D5 | 5 telas |
| 3 | Uniforme Deportivo | #6CB33F | 4 telas |
| 4 | Uniforme Diario - Faldas - Blazers | #E91E8C | 6 telas |
| 5 | Buzos - Hoodies - Perchados | #F7C948 | 4 telas |
| 6 | Chaquetas Prom | #C42034 | 5 telas |
| 7 | Blusas - Camisas | #7B4B94 | 4 telas |
| 8 | Delantales - Batas de Laboratorio | #F7941D | 6 telas |

### Secciones Adicionales

- **Tecnologías Textiles** (pág 14): 12 tecnologías + 5 beneficios
- **Personalización** (pág 15): 4 opciones (dibujos exclusivos, estampación digital, tipo Davos, desarrollo de color)
- **Cuellos** (pág 16-17): 4 colores, tallas niños y adolescentes/adultos

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
| Extraer imágenes del PDF | No hay originales disponibles | ⚠️ Revisit — calidad OK pero mapeo placeholder pendiente |
| Raleway headings + Montserrat body | Legibilidad de specs técnicas y estética moderna | ✓ Good |
| as-const satisfies para data layer | Type safety máxima con inferencia de literales | ✓ Good — 0 errores TypeScript |
| Sticky header con backdrop blur | Acceso rápido al menú durante presentaciones | ✓ Good |
| Sidebar slide-in para mobile menu | Patrón familiar y moderno | ✓ Good |
| SSG con generateStaticParams | 51 rutas pre-renderizadas para velocidad | ✓ Good — build sin errores |

---
*Last updated: 2026-02-22 after v1.1 milestone started*
