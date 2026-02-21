# Project Research Summary

**Project:** Lafayette Uni For Me Colegios — Web Comercial
**Domain:** Sales enablement product catalog (catálogo textil para presentaciones B2B en reuniones con colegios)
**Researched:** 2026-02-21
**Confidence:** HIGH

## Executive Summary

Este proyecto es un catálogo digital de habilitación de ventas para uniformes escolares Lafayette. No es un e-commerce ni un sitio público — es una herramienta interna que los vendedores usan durante reuniones presenciales con colegios, en laptop o tablet. El objetivo es reemplazar un PDF de 37MB como medio de presentación. El enfoque correcto, avalado por benchmarks de Klopman y Milliken, es construir un sitio estático con navegación rápida por categorías, fichas técnicas de telas con imágenes, y una sección de tecnologías textiles como argumento de venta. Todo el contenido es estático y conocido en build time (~8 categorías, ~40 telas, 12 tecnologías).

El stack recomendado es Next.js 16 con App Router, Tailwind CSS v4, TypeScript y datos en archivos `.ts` tipados — sin CMS, sin base de datos, sin API routes. Toda la data vive en `lib/content/` como constantes TypeScript importadas directamente por Server Components. El deploy es en Vercel con image optimization automática via `next/image`, evitando `output: 'export'` que rompería la optimización de imágenes. Este enfoque produce páginas HTML pre-renderizadas en build time, servidas desde CDN con carga < 2 segundos — crítico para el contexto de reunión de ventas.

Los riesgos principales son tres y deben resolverse antes de escribir una línea de UI: (1) calidad de las imágenes extraídas del PDF — si son de baja resolución, el catálogo pierde su utilidad visual; (2) la estrategia de deploy debe elegirse en Fase 1 porque determina cómo funciona `next/image`; (3) el sistema de colores por categoría debe implementarse con lookup objects estáticos (nunca clases Tailwind dinámicas) para evitar que el CSS purger elimine los colores en producción. Si estos tres riesgos se resuelven correctamente en Fase 1, el resto del desarrollo es mecánico y predecible.

## Key Findings

### Recommended Stack

Next.js 16 con App Router es el framework correcto para este proyecto. Turbopack como bundler (incluido en Next.js 16) y React 19.2 dan el mejor rendimiento de build. Tailwind CSS v4.2.0 con configuración CSS-first (`@theme`) permite definir los 8 colores de categoría como tokens que se propagan automáticamente a utility classes. TypeScript 5.7.x con Zod 4 para validación en build time cierra el stack principal.

**Core technologies:**
- **Next.js 16 (App Router):** Framework base con SSG automático, `generateStaticParams` para rutas dinámicas, y Turbopack — deploy en Vercel sin `output: 'export'`
- **Tailwind CSS v4.2.0:** CSS-first config con `@theme`; builds 5x más rápidos que v3; colores de categoría como tokens (`--color-cat-sudaderas`, etc.)
- **TypeScript 5.7.x + Zod 4:** Type safety en toda la capa de datos; Zod valida en build time que el catálogo esté completo
- **Bun:** Solo como package manager (`bun install`, `bun run`); NO usar `bun --bun next dev` — incompatibilidades NAPI con Next.js 16
- **sharp + next/image:** `sharp` como dependencia explícita de producción; `next/image` con AVIF/WebP y optimización automática en Vercel
- **clsx + tailwind-merge:** Utility `cn()` para composición segura de clases Tailwind en componentes

**Lo que no usar:** `output: 'export'`, CMS headless, CSS-in-JS, Redux/Zustand, `tailwind.config.js` de v3, Pages Router, API routes para contenido estático.

### Expected Features

El catálogo tiene un MVP claro basado en el modelo mental del vendedor y benchmarks de competidores (Klopman Fabric Finder, Milliken).

**Debe tener (table stakes — sin esto el vendedor vuelve al PDF):**
- Navegación por las 8 categorías de uso con color-coding distinctivo
- Home con hero y grid de acceso a categorías
- Fichas técnicas de tela con composición, gramaje, tecnologías aplicadas e imagen
- Product cards en grid responsivo (desktop 3 cols, tablet 2 cols)
- Imágenes de producto extraídas del PDF y optimizadas
- Sección de 12 Tecnologías Textiles con iconos y descripciones
- Sección de 4 opciones de Personalización
- Sección de Cuellos (colores, tallas, info comercial)
- Header global con logo Lafayette y navegación
- Deploy en Vercel y carga < 2 segundos

**Agregar post-lanzamiento (v1.x, tras validar uso real):**
- Filtrado client-side por tecnología/propiedad
- Navegación cruzada tela-categoría (relación muchos-a-muchos)
- Búsqueda fuzzy por nombre de tela (Fuse.js, ~40 telas)
- Tooltips interactivos en iconos de tecnología
- Galería con zoom (condicionado a calidad de imágenes del PDF)

**Diferir a v2+:**
- Modo offline / PWA (validar primero si el WiFi en colegios es realmente un problema recurrente)
- Comparación lado a lado de telas (requiere datos cuantitativos suficientes)

**Nunca construir:** e-commerce, CRM, chat widgets, autenticación, multi-idioma, SEO público, CMS/admin panel.

### Architecture Approach

La arquitectura es un sitio estático en tres capas: Presentation (Next.js App Router con Server Components), Data Layer (archivos TypeScript en `lib/content/`), y Asset Layer (imágenes en `/public/images/` pre-procesadas con sharp desde el PDF). Todas las páginas son Server Components por defecto; solo el header necesita `'use client'` para el nav interactivo en tablet. Los datos fluyen unidireccionalmente: `lib/content/*.ts` → page Server Component → child components via props. El theming de categoría se implementa con CSS custom properties (`--category-color`) inyectadas en el layout de categoría, sin prop drilling.

**Componentes principales:**
1. **Data Layer (`lib/content/`):** Constantes TypeScript tipadas para categories, fabrics, technologies, customization, collars — fuente única de verdad para todo el contenido del catálogo
2. **Category Layout (`app/categoria/[slug]/layout.tsx`):** Inyecta `--category-color` como CSS variable; todos los componentes hijos heredan el color de la categoría sin props
3. **Product Card (`components/product-card.tsx`):** Server Component reutilizable; imagen optimizada, nombre, specs clave, technology badges
4. **Global Header (`components/header.tsx`):** Único Client Component con `'use client'`; navegación a las 8 categorías y secciones secundarias
5. **Design System (`app/globals.css`):** `@theme` con los 8 colores de categoría, brand tokens Lafayette, tipografía Inter

**Orden de build:** Tokens/tipos → Data layer → Componentes UI → Páginas/routing → Polish y deploy.

### Critical Pitfalls

1. **Calidad de imágenes del PDF** — Usar `pdfimages -all` (poppler) para extracción lossless de imágenes embebidas; auditar que cada imagen sea >= 400px de ancho antes de continuar; como fallback usar `pdftoppm -r 300` para renderizar páginas a alta resolución. Resolver en Fase 1 antes de cualquier UI.

2. **Deploy strategy determina image optimization** — Decidir en Fase 1: Vercel standard deploy (recomendado, `next/image` funciona out-of-the-box) vs `output: 'export'` (requiere `next-image-export-optimizer`, mayor complejidad). NO descubrir esto al momento del deploy.

3. **Colores de categoría purgados por Tailwind en producción** — NUNCA construir clases Tailwind dinámicamente (`bg-[${color}]` o template literals). Usar un lookup object con strings de clase completas y estáticas que el scanner de Tailwind pueda detectar; o usar CSS custom properties via `style` attribute para valores verdaderamente dinámicos.

4. **`'use client'` mal ubicado convierte páginas estáticas en Client Components** — Mantener `'use client'` solo en leaf components (header nav toggle, gallery zoom). Nunca en `layout.tsx` o `page.tsx`. Usar el patrón wrapper para pasar `children` como Server Components a través de Client Components.

5. **Filenames con espacios en assets** — Los assets existentes tienen nombres como `LOGO_TECNOLOGIA_SECADO RAPIDO.png`. Renombrar a kebab-case en Fase 1 antes de referenciarlos en código. Los espacios en rutas URL causan 404s silenciosos en producción.

## Implications for Roadmap

La investigación revela dependencias claras que determinan el orden de fases. Los datos, los assets y las decisiones arquitectónicas deben preceder a la UI; la UI debe preceder al polish.

### Phase 1: Foundation — Decisiones, Assets y Data Layer

**Rationale:** Tres decisiones críticas deben resolverse en Fase 1 porque bloquean todo lo demás: (a) estrategia de deploy (Vercel standard — ya resuelta por la investigación), (b) calidad real de imágenes del PDF (prueba de extracción con `pdfimages`), y (c) sistema de colores de categoría (lookup objects estáticos). Además, el Data Layer es la dependencia fundacional — sin tipos y datos definidos, ningún componente puede construirse correctamente.

**Delivers:** Proyecto scaffolded con Next.js 16 + Tailwind v4; `@theme` con 8 colores de categoría; TypeScript interfaces para Fabric, Category, Technology, CustomizationOption; archivos de datos en `lib/content/` para todas las entidades; imágenes extraídas del PDF auditadas y en `/public/images/`; assets renombrados a kebab-case.

**Addresses:** Navegación por categorías (prerequisito), fichas técnicas (prerequisito), imágenes de producto (prerequisito)

**Avoids:** PDF image quality pitfall (P1), deploy strategy conflict (P2), Tailwind dynamic class purge (P3), asset filename issues (P11), product data coupling to UI (P6)

**Research flag:** NECESITA verificación manual — la calidad de las imágenes del PDF no es predecible hasta ejecutar la extracción. Puede requerir solución alternativa (pedir assets de alta resolución a Marketing de Lafayette).

### Phase 2: Core UI — Home, Categorías y Fichas de Tela

**Rationale:** Con el Data Layer completo y los assets disponibles, todos los componentes principales pueden construirse sin bloqueos. La arquitectura Server Components + CSS variable theming está definida — es ejecución directa.

**Delivers:** Home page con hero y grid de 8 categorías; 8 páginas de categoría con `generateStaticParams`; `ProductCard` y `ProductGrid` responsivos; `CategoryLayout` con CSS variable theming; header global con navegación.

**Uses:** Next.js `generateStaticParams` + `dynamicParams = false`; `next/image` con AVIF/WebP; CSS custom properties `--category-color`; `clsx` + `tailwind-merge` en componentes

**Implements:** Presentation Layer completa (layouts, pages, UI components); Navigation Flow (prefetch, client-side navigation)

**Avoids:** `'use client'` boundary misplacement (P4), tablet layout breaks (P7), hydration errors on iPad (P9), missing generateStaticParams (P10)

**Research flag:** Patrón estándar — no necesita investigación adicional. Next.js App Router patterns están bien documentados.

### Phase 3: Secciones Secundarias y Deploy

**Rationale:** Las secciones de Tecnologías, Personalización y Cuellos son más simples que las páginas de categoría (menos datos, layouts más directos). Se construyen sobre los mismos patrones establecidos en Fase 2. El deploy a Vercel cierra el MVP.

**Delivers:** Página `/tecnologias` con grid de 12 tecnologías + iconos; página `/personalizacion` con 4 opciones; página `/cuellos` con tabla de tallas/colores; deploy funcional en Vercel; `noindex` configurado (herramienta interna).

**Uses:** Technology badge components reutilizables; `section-header.tsx`; Vercel CLI / Git integration

**Implements:** Completion del Presentation Layer; Image Pipeline completa (CDN caching via Vercel)

**Research flag:** Patrón estándar — deploy Vercel bien documentado. Sin investigación adicional necesaria.

### Phase 4: Enhancements — Filtros y Navegación Mejorada

**Rationale:** Solo después de validar que los vendedores usan el catálogo (Fases 1-3 en producción), agregar las features que elevan la experiencia. El filtrado client-side y la búsqueda son independientes y no rompen nada existente.

**Delivers:** Filtrado client-side por tecnología (multi-select chips); navegación cruzada tela-categoría (tags clickeables en fichas); búsqueda fuzzy por nombre de tela (Fuse.js); tooltips interactivos en iconos de tecnología.

**Uses:** Client-side state con React hooks (mínimo); Fuse.js para fuzzy search; datos ya presentes en `lib/content/`

**Research flag:** PUEDE necesitar investigación de UX para el patrón de filtros — cómo presentar los filtros en tablet sin ocupar demasiado espacio. Baymard Institute tiene guías específicas de filtering UX para productos.

### Phase Ordering Rationale

- **Foundation primero:** La calidad de las imágenes del PDF es la variable más incierta del proyecto. Detectarla en Fase 1 da tiempo para buscar alternativas (pedir assets a Marketing) antes de comprometerse con el diseño visual.
- **Data Layer antes de UI:** Los interfaces TypeScript de `Fabric`, `Category`, etc. determinan los props de cada componente. Definirlos primero evita refactoring costoso.
- **Core antes de Secundarias:** Las páginas de categoría son más complejas (routing dinámico, grid responsivo, theming) que las páginas estáticas de Tecnologías/Personalización. Establecer los patrones difíciles primero hace las páginas simples triviales.
- **Deploy en Fase 3, no al final:** Deploy temprano valida la integración Vercel + next/image en condiciones reales antes de que haya demasiado código acumulado.
- **Enhancements después de validación:** Los filtros y búsqueda agregan valor pero no son bloqueantes. Esperar feedback real de vendedores antes de implementarlos.

### Research Flags

Fases que probablemente necesitan `/gsd:research-phase` durante planning:
- **Phase 1 (Image extraction):** La calidad real de las imágenes del PDF es desconocida. Si `pdfimages -all` produce resultados inaceptables (< 300px, artifacts visibles), hay que investigar alternativas: `pdftoppm` a 300 DPI, solicitar assets originales a Lafayette, o diseñar el UI para minimizar dependencia de fotos.
- **Phase 4 (Filter UX):** Los patrones de filtrado para catálogos en tablet (768-1024px) tienen tradeoffs no triviales de UX. Vale investigar antes de implementar.

Fases con patrones estándar bien documentados (no necesitan investigación adicional):
- **Phase 2 (Core UI):** Next.js App Router + Server Components + Tailwind v4 tienen documentación oficial exhaustiva. Los patrones están verificados.
- **Phase 3 (Secondary sections + Deploy):** Vercel deploy es trivial. Las secciones secundarias replican patrones de Fase 2.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verificado con documentación oficial de Next.js 16.1.6, Tailwind v4.2.0, Zod 4. Versiones concretas confirmadas. Única área MEDIUM: compatibilidad Bun + Next.js 16 NAPI (known issue documentado en GitHub). |
| Features | MEDIUM-HIGH | Dominio B2B de nicho con pocas referencias directas. Las features de table stakes son sólidas (basadas en análisis de Klopman y Milliken como benchmarks primarios). Las features de v2+ son inferidas de buenas prácticas de catálogos B2B — no hay evidencia directa de su valor para Lafayette. |
| Architecture | HIGH | Patrones de Next.js App Router con Server Components y TypeScript data files son bien establecidos. Los ejemplos de código están verificados contra la documentación oficial v16.1.6. |
| Pitfalls | HIGH | Los pitfalls críticos (PDF image quality, next/image + static export, Tailwind dynamic class purge, use client boundaries) están verificados con fuentes oficiales y múltiples fuentes secundarias. Los pitfalls menores (iOS auto-detection, asset filenames) son conocidos y documentados. |

**Overall confidence:** HIGH

### Gaps to Address

- **Calidad real de imágenes del PDF:** No es posible saber hasta ejecutar `pdfimages` si las imágenes embebidas son utilizables. Plan B: contactar a equipo de Marketing de Lafayette para obtener assets originales en alta resolución.
- **Especificaciones completas del catálogo:** La investigación asume ~40 telas y 8 categorías basándose en PROJECT.md. La extracción del PDF puede revelar más o menos productos. El modelo de datos TypeScript está diseñado para ser flexible, pero el scope exacto afecta el esfuerzo de entrada de datos.
- **Necesidad de offline:** No se ha validado con los vendedores si el WiFi en colegios es un problema real y recurrente. Si lo es, la PWA debe elevarse de v2+ a v1.x. Esta validación debería ocurrir antes de cerrar el roadmap.
- **Tablets específicas usadas:** "Tablet" es amplio (iPad vs Android vs Surface). La orientación landscape/portrait y el pixel ratio varían. Si los vendedores usan iPads específicamente, el diseño debe testearse en esas dimensiones exactas.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 Official Docs](https://nextjs.org/docs) — App Router, generateStaticParams, Image Optimization, Server/Client Components, Static Exports
- [Tailwind CSS v4.0/v4.1/v4.2 Blog Posts + Official Docs](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @theme directive, breaking changes
- [Zod v4 Release Notes](https://zod.dev/v4) — API changes vs v3, @zod/mini
- [Vercel Image Optimization Docs](https://vercel.com/docs/image-optimization) — CDN caching, format support
- [Next.js PWA Guide (oficial)](https://nextjs.org/docs/app/guides/progressive-web-apps) — Service Worker patterns
- [Next.js Hydration Error Docs](https://nextjs.org/docs/messages/react-hydration-error) — iOS auto-detection issues

### Secondary (MEDIUM confidence)
- [Klopman Fabric Finder](https://www.klopman.com/products) — Benchmark de catálogo textil B2B (observación directa)
- [Milliken Textile Products](https://www.milliken.com/en-us/textiles/products) — Benchmark de catálogo textil B2B (observación directa)
- [Baymard Institute — Product List UX 2025](https://baymard.com/blog/current-state-product-list-and-filtering) — Filtering patterns, comparison features
- [Bun + Next.js Guide](https://bun.com/docs/guides/ecosystem/nextjs) — Compatibilidad y limitaciones conocidas
- [pdfimages / Poppler Utils](https://formulae.brew.sh/formula/poppler) — Extracción lossless de imágenes de PDF
- [next-image-export-optimizer GitHub](https://github.com/Niels-IO/next-image-export-optimizer) — Alternativa para static export (documentado pero no recomendado)

### Tertiary (LOW confidence)
- [Paperflite Sales Enablement Trends 2025](https://www.paperflite.com/blogs/sales-enablement-trends) — Contexto de sales enablement (validar si aplica al caso específico de Lafayette)
- [App Router Pitfalls — imidef.com](https://imidef.com/en/2026-02-11-app-router-pitfalls) — Pitfalls de community, cross-verificados con docs oficiales

---
*Research completed: 2026-02-21*
*Ready for roadmap: yes*
