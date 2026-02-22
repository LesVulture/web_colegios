# Project Research Summary

**Project:** Lafayette Uni For Me Colegios — v1.1 Catalogo Completo
**Domain:** Sales enablement web catalog (catálogo textil, herramienta interna de ventas B2B)
**Researched:** 2026-02-22
**Confidence:** HIGH

## Executive Summary

Este proyecto es la segunda iteración de un catálogo digital de habilitación de ventas para uniformes escolares Lafayette. El milestone v1.1 parte de una base funcional (Next.js 16 + React 19 + Tailwind v4, 51 rutas SSG, 31 telas modeladas) y tiene como objetivo completar el catálogo: convertir 4 páginas placeholder en contenido real (fichas técnicas de telas, sección de tecnologías, personalización y cuellos), añadir interactividad de búsqueda/filtrado, y desplegar la herramienta en producción. El patrón arquitectónico es claro y sin controversia: Server Components por defecto, una isla Client Component exclusivamente para los filtros interactivos, y SSG preservado en todo momento. Toda la lógica de negocio vive en el data layer TypeScript existente.

El riesgo más alto del proyecto no es técnico sino de secuencia: existe tech debt concreto que bloquea o contamina las features nuevas si no se resuelve primero. Las 31 telas apuntan a `placeholder.webp` (que no existe), mientras que 14 imágenes reales están sin mapear en `/public/images/products/`. Ninguna ficha técnica de tela — la feature central de v1.1 — puede construirse con calidad antes de resolver este mapeo. Un segundo riesgo documentado es romper inadvertidamente el SSG al implementar filtros: usar `useSearchParams()` sin boundary Suspense deoptimiza páginas estáticas a renderizado cliente, degradando la velocidad de carga crítica para un contexto de reunión de ventas.

La única dependencia nueva justificada para v1.1 es `fuse.js` (~5kB) para búsqueda fuzzy tolerante a typos, compensada con creces por la eliminación de `class-variance-authority` (~6kB, instalada en v1.0 pero sin ningún consumidor). El stack base cubre todos los requisitos de las features nuevas sin adiciones. La confianza en el plan es alta porque el data layer ya existe y está tipado, las rutas SSG ya tienen `generateStaticParams` configurado, y todos los patrones de arquitectura están establecidos.

---

## Key Findings

### Recommended Stack

El stack base de v1.0 no requiere cambios estructurales para v1.1. Las decisiones de "qué no agregar" son tan importantes como las adiciones: `nuqs` rechazado (URL state innecesario para herramienta interna sin URL sharing), Zod rechazado (`as const satisfies` cubre validación suficientemente), framer-motion rechazado (micro-interacciones se resuelven con Tailwind `transition-*`), Radix UI rechazado (tooltips CSS-only son suficientes para el caso de uso).

**Core technologies:**
- `fuse.js 7.1.0`: búsqueda fuzzy por nombre de tela — única dependencia nueva; ~5kB gzip, zero dependencies; justificada para tolerancia a typos en presentaciones presenciales
- `sharp` (verificar): optimización de imágenes en Vercel — puede ya estar disponible via Next.js; añadir solo si el build genera warnings de image optimization
- `class-variance-authority` (REMOVER): instalada en v1.0, cero imports en `src/`; eliminar para reducir bundle ~6kB y evitar patrón conflictivo con `cn()`
- Stack existente sin cambios: Next.js 16.1.6, React 19.2.3, Tailwind v4.2.0, TypeScript, lucide-react, clsx/tailwind-merge

**Cambio crítico en `next.config.ts`:** Añadir `images.formats: ['image/avif', 'image/webp']` y tamaños de dispositivo para tablet/desktop. NO añadir `output: 'export'` — Vercel sirve SSG desde CDN edge automáticamente sin esa config.

### Expected Features

**Must have (table stakes — sin estas, v1.1 no tiene sentido):**
- TS-05: Resolver imágenes placeholder (404 en TODAS las FabricCards) — BLOCKER absoluto para el resto del milestone
- TS-01: Ficha técnica completa de tela (`/uso/[slug]/[fabricId]`) — la promesa incumplida más visible de v1.0; todos los datos ya existen en el data layer
- TS-02: Sección de Tecnologías Textiles (`/tecnologias`) — 1 de 4 items del menú principal sin contenido; 14 tecnologías y 12 iconos ya existen
- TS-03: Sección de Personalización (`/personalizacion`) — diferenciador comercial, 4 opciones del PDF p.15; requiere nuevo data model
- TS-04: Sección de Cuellos (`/cuellos`) — complemento para polos; colores y tallas del PDF pp.16-17; requiere nuevo data model
- TS-06: Deploy funcional en Vercel — sin deploy, la herramienta nunca llega al vendedor

**Should have (elevan la herramienta por encima de un PDF):**
- DF-01: Filtrado multi-select por tecnología en páginas de categoría — reduce búsqueda de minutos a segundos
- DF-02: Ordenamiento por gramaje/ancho — casi gratuito cuando se implementa con DF-01
- DF-03: Búsqueda fuzzy global por nombre de tela (fuse.js) — acceso directo para vendedores que saben qué buscan
- DF-04: Tooltips de tecnología en ficha de tela (CSS-only con `group-hover`) — polish de bajo costo, alto impacto
- DF-05: Navegación cruzada tela-categoría — `getCategoriesByFabric()` ya existe en `helpers.ts` sin consumidor

**Defer (v2+):**
- Comparación lado a lado de telas (UI compleja, valor bajo con specs limitados)
- Galería multi-imagen con zoom (solo existe 1 imagen por tela)
- PWA / modo offline (añadir sobre catálogo incompleto no tiene sentido)
- Filtro por composición o tipo de tejido (datasets demasiado pequeños para justificarlo)
- Páginas individuales por tecnología (no hay contenido único suficiente por tecnología)

### Architecture Approach

La arquitectura de v1.1 extiende el modelo de v1.0 con un único cambio de patrón: introducir una "isla" Client Component (`FilterableFabricGrid`) dentro de las páginas de categoría, que permanecen como Server Components. Todos los datos se serializan como props estáticas en build time (máximo 9 telas por categoría); el filtrado/sort/búsqueda ocurren enteramente en el browser sin round-trips al servidor ni `searchParams` (que romperían el SSG). Las páginas de ficha técnica y las tres secciones de contenido son Server Components puros. El data layer nuevo (`personalization.ts`, `collars.ts`) sigue el patrón `as const satisfies readonly Type[]` establecido en v1.0.

**Componentes a crear (7 nuevos, 2 modificaciones):**
1. `FilterableFabricGrid` (Client) — gestiona todo el estado de búsqueda/filtro/sort; envuelve `FabricFilterBar` y el grid de `FabricCard`
2. `FabricFilterBar` (Client) — UI del panel de filtros: input de búsqueda, chips de tecnología multi-select, dropdown de ordenamiento, contador de resultados
3. `FabricSpecsTable` (Server) — tabla/grid de specs técnicas (composición, gramaje, ancho, tejido, base)
4. `TechnologyTooltip` (Server) — icono con tooltip CSS-only via Tailwind `group-hover`, sin JS de React
5. `TechnologyCard` (Server) — card completa para `/tecnologias` con icono, nombre, descripción y contador de telas
6. `PersonalizationCard` (Server) — card con imagen + texto para `/personalizacion`
7. `CollarSection` (Server) — grid de colores + tabla de tallas para `/cuellos`

### Critical Pitfalls

1. **Imágenes placeholder 404 contaminan todo el milestone** — Las 31 telas apuntan a `placeholder.webp` inexistente; 14 imágenes reales sin mapear en `/public/images/products/`. Construir fichas técnicas sin resolver esto produce demos inutilizables. Resolver PRIMERO en Phase 1, antes de cualquier feature work.

2. **`useSearchParams()` sin Suspense deoptimiza SSG completo** — Cualquier llamada a `useSearchParams()` sin `<Suspense>` convierte la página entera a CSR. Las páginas de categoría actualmente son SSG estático; perderlo degrada la experiencia crítica de velocidad. Solución: usar `useState` en React (no URL params). Verificar con `bun run build` que todas las páginas muestren icono estático (círculo), no dinámico (lambda).

3. **Fuse.js sin `useMemo` produce lag visible en iPad** — `new Fuse(data, options)` en el body del componente se ejecuta en cada keystroke. Para 31 items es inapreciable en MacBook pero perceptible en iPad. Wrap obligatorio: `useMemo(() => new Fuse(fabrics, opts), [fabrics])` + debounce de 200-300ms en el input.

4. **Bug NavLinks activo estado (`/usos` vs `/uso`)** — El nav item apunta a `/usos` (plural), las rutas son `/uso/[slug]` (singular). Arreglar en Phase 1 con: `pathname === item.href || pathname.startsWith(item.href + '/') || (item.href === '/usos' && pathname.startsWith('/uso/'))`.

5. **`output: 'export'` en next.config.ts rompe image optimization** — Vercel sirve SSG pages desde CDN edge sin esta config. Añadirla "por rendimiento" rompe `next/image` y requiere un custom loader. NO añadir. Verificar en Vercel build log que todas las rutas sean estáticas.

---

## Implications for Roadmap

Tres archivos de investigación independientes (FEATURES.md, ARCHITECTURE.md, PITFALLS.md) convergen en la misma estructura de 5 fases con las mismas dependencias, lo que aumenta significativamente la confianza en el orden propuesto.

### Phase 1: Tech Debt + Data Foundation

**Rationale:** Todo lo que viene después depende de datos correctos. Los 404 de imágenes son el único blocker real del proyecto — sin imágenes reales, ninguna demo funciona y ninguna ficha técnica tiene sentido. Los bugs y la deuda técnica existente deben resolverse antes de añadir código nuevo encima.
**Delivers:** Data layer completo y funcional; FabricCards muestran imágenes reales; NavLinks activo en `/uso/*`; base de tipos extendida para personalización y cuellos; dependencias saneadas.
**Addresses:** TS-05 (imágenes — blocker), prerequisito para TS-01/02/03/04
**Avoids:** P1 (404 que contamina todo), P4 (NavLinks bug), P10 (CVA bundle bloat), P6 (color drift), P13 (ROADMAP stale)
**Tasks concretas:**
- Mapear 14 imágenes reales a los 31 registros en `fabrics.ts` (verificar visualmente contra PDF)
- Fix NavLinks active state (`/usos` → `/uso`)
- `bun remove class-variance-authority`
- Añadir `PersonalizationOption`, `CollarColor`, `CollarData` a `types.ts`
- Crear `personalization.ts` (4 items del PDF p.15)
- Crear `collars.ts` (colores + tallas del PDF pp.16-17)
- Expandir descripciones de tecnologías (del PDF p.14)
- Actualizar barrel exports en `index.ts`

### Phase 2: Fabric Detail Pages

**Rationale:** La feature principal del milestone. Requiere Phase 1 (imágenes reales, tipos extendidos). La ruta SSG ya existe como placeholder; solo hay que reemplazar el contenido. Con datos ya modelados en el data layer y la ruta pre-configurada, esta fase es de ejecución directa.
**Delivers:** Las ~43 rutas `/uso/[slug]/[fabricId]` con contenido real: imagen, specs técnicas en tabla, tecnologías con tooltips CSS, rutas de estampación, badge "Nuevo", navegación cruzada entre categorías.
**Uses:** Server Components (sin interactividad), next/image, `getCategoriesByFabric()` existente
**Implements:** `FabricSpecsTable`, `TechnologyTooltip` (CSS-only), `FabricCard` modificada (badge isNew), rewrite completo de `/uso/[slug]/[fabricId]/page.tsx`
**Avoids:** P3 (duplicados por telas compartidas — usar `getCategoriesByFabric()`), P9 (iconos vacíos — guard `{tech.icon && ...}` con fallback Lucide), P12 (back link context)

### Phase 3: Content Section Pages

**Rationale:** Convierte los 3 placeholders restantes del menú principal en páginas reales. Independiente de Phase 2 (ambas solo dependen de Phase 1), por lo que pueden ejecutarse en paralelo con un segundo desarrollador. Para un solo desarrollador, secuencial después de Phase 2.
**Delivers:** Cero páginas "en construcción". Menú completo con 4/4 secciones funcionales. Argumento de venta completo (tecnologías + personalización + cuellos).
**Uses:** Server Components puros, datos de Phase 1 (`personalization.ts`, `collars.ts`), `TECHNOLOGIES` existente
**Implements:** `TechnologyCard`, `PersonalizationCard`, `CollarSection`; rewrites de `/tecnologias`, `/personalizacion`, `/cuellos`
**Avoids:** P9 (3 tecnologías sin icono — fallback con `FlaskConical` de Lucide)

### Phase 4: Search, Filter & Sort

**Rationale:** La interactividad que transforma el catálogo de "PDF bonito en web" a "herramienta de ventas". Requiere Phase 2 estabilizada porque `FilterableFabricGrid` envuelve `FabricCard` — que se modifica en Phase 2. Este es el riesgo técnico más alto del proyecto (SSG deoptimization) y debe ejecutarse cuando todo lo demás está estable.
**Delivers:** Filtrado multi-select por tecnología (AND logic), ordenamiento por gramaje/ancho (sort numérico), búsqueda fuzzy global (fuse.js). Interactividad completa.
**Uses:** `fuse.js 7.1.0` (única dependencia nueva), React `useState` + `useMemo`, `SkeletonCard` existente como Suspense fallback
**Implements:** `FilterableFabricGrid` (Client), `FabricFilterBar` (Client); modificación de `/uso/[slug]/page.tsx`
**Avoids:** P2 (useSearchParams → SSG deoptimization — usar `useState`), P7 (Fuse.js sin memoización), P8 (filter state reset — `router.back()` en lugar de `<Link>`), P11 (SkeletonCard integrada como Suspense fallback)

### Phase 5: Responsive Polish & Deploy

**Rationale:** Verificación final y primera entrega real a los vendedores. Sin deploy, nada de esto tiene valor. Esta fase garantiza calidad en todos los breakpoints target (lg/md) y que Vercel genere todas las rutas estáticas correctamente.
**Delivers:** Herramienta accesible en producción para los vendedores. Build verificado (<2s SSG). 0 páginas placeholder. Responsive verificado en tablet y desktop.
**Uses:** Vercel (zero-config Next.js deploy), `bun run build` para verificación SSG
**Avoids:** P5 (`output: 'export'` — verificar que NO esté en `next.config.ts`), P2 (verificar que todas las páginas sean estáticas en el build log)

### Phase Ordering Rationale

- **Phase 1 primero** porque es el único bloqueante real: sin imágenes mapeadas y datos correctos, ninguna demo funciona. Resolverlo al inicio evita que el tech debt contamine cada nueva feature.
- **Phase 2 antes que Phase 4** porque `FabricCard` se modifica en Phase 2 (badge isNew, paths de imagen corregidos) y `FilterableFabricGrid` en Phase 4 depende de la versión final de `FabricCard`.
- **Phase 3 paralela a Phase 2** si hay dos desarrolladores, o secuencial después para uno solo. No existe dependencia mutua entre fichas técnicas y secciones de contenido — ambas solo dependen de Phase 1.
- **Phase 4 después de Phase 2** por la dependencia de FabricCard estabilizada, y porque la arquitectura de filtros es el riesgo técnico más alto; conviene ejecutarla cuando el resto del sistema está verificado.
- **Phase 5 última** por definición: requiere features completas para verificar responsive y realizar el deploy final.

### Research Flags

Fases que pueden necesitar investigación adicional durante planning:

- **Phase 1 (Image Mapping):** El mapeo exacto de las 14 imágenes reales (`page04-0.webp` a `page12-34.webp`) a los 31 fabric IDs requiere inspección visual del PDF y de las imágenes. No hay un mapeo obvio por nombre de archivo. Puede requerir que algunas telas compartan imagen.
- **Phase 4 (Filter State Persistence):** La solución documentada para P8 (filter state reset) es `router.back()` en lugar de `<Link>`. Esto debe verificarse en el contexto del App Router con `FilterableFabricGrid` antes de commitear a la arquitectura. Si `router.back()` no preserva el estado React del componente cliente en este patrón específico, la alternativa es layout-level context en `/uso/[slug]/layout.tsx`.

Fases con patrones estándar bien documentados (no necesitan investigación adicional):

- **Phase 2 (Fabric Detail Pages):** Patrón de product detail page con dos columnas es estándar B2B. Los datos ya existen. La ruta SSG ya tiene `generateStaticParams`. Implementación directa sin incertidumbres.
- **Phase 3 (Content Sections):** Server Components puros con datos estáticos. Sin interactividad, sin complejidad arquitectónica. Replica patrones del proyecto existente.
- **Phase 5 (Deploy):** Next.js + Vercel es el "camino feliz" documentado. Zero-config deployment. No requiere investigación.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verificado contra documentación oficial de Next.js 16 y Vercel. fuse.js evaluado frente a 4 alternativas con criterios explícitos y datos concretos (bundle size, API complexity, download stats). Las decisiones de "qué no agregar" están tan documentadas como las adiciones. |
| Features | HIGH | El data layer ya construido confirma viabilidad técnica de todas las features must-have. Las features differentiator son patrones estándar de catálogos B2B con baja complejidad. El árbol de dependencias entre features está explicitamente modelado en FEATURES.md. |
| Architecture | HIGH | Basada en análisis del codebase real, no specs abstractas. Patrones validados contra documentación oficial de Next.js (SSG, generateStaticParams, searchParams limitations). El "client island" pattern para filtros es el enfoque canónico de Next.js para este caso de uso. |
| Pitfalls | HIGH | 13 pitfalls identificados. Los más críticos tienen evidencia directa del codebase (404 de placeholder confirmado, bug NavLinks confirmado, CVA sin imports confirmado). Los pitfalls de arquitectura (useSearchParams, output:export) están respaldados por documentación oficial de Next.js y Vercel. |

**Overall confidence:** HIGH

### Gaps to Address

- **Contenido textual del PDF:** Las descripciones expandidas de tecnologías, el contenido de personalización y los datos de cuellos dependen de extraer información de `Uniformes_Colegios.pdf`. Este es un gap de contenido, no técnico. Requiere herramienta de extracción (pdftotext o similar) antes de crear los archivos de datos de Phase 1. El PDF existe en el repositorio.
- **Mapeo imagen-tela:** Los nombres de archivo de las 14 imágenes reales no revelan a qué tela corresponden. La asignación requiere inspección visual manual correlacionando imágenes con registros de `fabrics.ts`. Algunas telas pueden quedar sin imagen dedicada si el PDF no tenía foto individual para ellas.
- **Tecnologías sin icono (3 de 14):** `algodon`, `antimanchas`, `solidez-a-la-luz` tienen `icon: ''`. La solución documentada (fallback Lucide `FlaskConical`) es pragmática. Si existe una fuente de iconos para estas tecnologías en el PDF u otro medio, sería preferible. Verificar durante Phase 1.
- **Comportamiento de `router.back()` con FilterableFabricGrid:** La solución a la persistencia de filtros (Pitfall 8) depende de que `router.back()` restaure el estado React del componente cliente en el App Router. Esto debe verificarse empíricamente en Phase 4 antes de decidir si se necesita la alternativa de layout-level context.

---

## Sources

### Primary (HIGH confidence)
- Codebase de Lafayette (`src/`) — análisis directo de componentes, data layer, rutas, tipos, tech debt documentado
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md` — inventario verificado de tech debt y estado real post-v1.0
- [Next.js Official: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — SSG para rutas dinámicas anidadas
- [Next.js Official: useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) — requerimiento de Suspense, deoptimización SSG documentada
- [Next.js: Missing Suspense Boundary Error](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) — comportamiento CSR fallback
- [Next.js: Deopted into Client Rendering](https://nextjs.org/docs/messages/deopted-into-client-rendering) — página completa en CSR
- [Next.js: Static Exports](https://nextjs.org/docs/pages/guides/static-exports) — limitaciones de `output: 'export'`, incompatibilidad con image optimization
- [Vercel Image Optimization Docs](https://vercel.com/docs/image-optimization) — optimización automática AVIF/WebP en deploy estándar
- [Fuse.js Official Docs](https://www.fusejs.io/) — API reference, construcción de índice, configuración de threshold

### Secondary (MEDIUM confidence)
- [npm-compare: fuse.js vs minisearch vs flexsearch](https://npm-compare.com/elasticlunr,flexsearch,fuse.js,minisearch) — comparación de download stats y features
- [Baymard Institute — Product Page UX Best Practices 2025](https://baymard.com/blog/current-state-ecommerce-product-page-ux) — layout de dos columnas para product detail pages B2B
- [Baymard Institute — Product List UX Best Practices 2025](https://baymard.com/blog/current-state-product-list-and-filtering) — chips horizontales para filtrado en datasets pequeños
- [buildwithmatija.com — searchParams + static generation fix](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix) — patrón de separación SSG/CSR
- [Klopman Fabric Finder](https://www.klopman.com/products) — referencia de catálogo textil B2B con filtrado por propiedades
- [Uniformelafayette.com](https://uniformelafayette.com/colegios/) — confirmación directa de que el sitio público NO tiene catálogo técnico

### Tertiary (LOW confidence)
- [nuqs Official Site](https://nuqs.dev/) — evaluado y descartado; documentación consultada para entender el caso de uso que NO aplica aquí
- SparkLayer B2B Product Pages UI Guide — principios generales, no específico al caso textil
- GitHub: uFuzzy — alternativa a fuse.js evaluada y descartada

---
*Research completed: 2026-02-22*
*Ready for roadmap: yes*
