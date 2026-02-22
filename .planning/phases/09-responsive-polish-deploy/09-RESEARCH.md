# Phase 9: Responsive Polish & Deploy - Research

**Researched:** 2026-02-22
**Domain:** Responsive CSS polish (Tailwind v4 breakpoints), Next.js 16 static deploy on Vercel, performance optimization
**Confidence:** HIGH

## Summary

Esta fase cierra el milestone v1.1 con tres ejes: responsive polish para breakpoints lg (desktop, >=1024px) y md (tablet, >=768px), deploy en Vercel con todas las rutas SSG funcionando, y performance target de <2s en carga inicial.

El codebase actual ya esta en buen estado para deploy. El build actual (`next build`) genera 59 paginas estaticas (todas marcadas con `○` Static o `●` SSG). No hay rutas dinamicas server-side ni Server Actions. Las imagenes ya estan en formato .webp y el total es ~7.4MB. Los fonts ya usan `next/font/google` con `display: 'swap'`.

El responsive actual usa un patron `mobile-first` con breakpoints `lg:` para desktop y `md:` en algunas paginas (tecnologias, personalizacion, cuellos). Sin embargo, varias paginas saltan directamente de mobile a lg sin pasar por md, lo cual deja el breakpoint tablet (768-1023px) sin atender en: home, usos, category pages, y fichas tecnicas. El polish principal consiste en auditar y ajustar estos gaps.

**Primary recommendation:** Deploy en Vercel SIN `output: 'export'` (deploy normal). Esto permite que Vercel optimice imagenes automaticamente con su CDN, manteniendo todas las paginas SSG. Solo se necesita vincular el repo de GitHub y Vercel lo detecta y configura automaticamente.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- URL de Vercel default (proyecto.vercel.app) — no se necesita dominio custom
- Sitio publico con link, sin password protection ni restricciones de acceso
- El usuario ya tiene cuenta de Vercel configurada — solo vincular repo
- Build mode: full static con `output: 'export'` — 100% SSG, sin server functions
- Verificar que todas las rutas se pre-renderizan correctamente en build
- Refinado activo, no solo "que no se rompa" — ajustar spacing, tamanios y touch targets para que se sienta nativo en tablet
- El objetivo es que un vendedor pueda presentar el catalogo en tablet durante una reunion de forma profesional

### Claude's Discretion
- **Grids de telas en tablet**: Claude evalua si 2 o 3 columnas segun el contenido y ancho disponible en md
- **Navegacion tablet**: Claude evalua si la nav cabe completa en md o necesita colapsar a hamburger menu segun cantidad de items
- **Fichas tecnicas tablet**: Claude decide si mantener layout horizontal o pasar a stack vertical segun el ancho disponible en breakpoint md
- Estrategia de optimizacion de imagenes y bundle splitting para cumplir target de 2 segundos
- Touch targets y spacing adaptados para interaccion tactil

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEPLOY-01 | Responsive desktop-first verificado en breakpoints lg y md | Auditoria completa de los 10 archivos de pagina/componente. Identificadas 6 areas que necesitan ajustes md: breakpoint. Tailwind v4 breakpoints confirmados (md: 768px, lg: 1024px). |
| DEPLOY-02 | Deploy funcional en Vercel con todas las rutas SSG | Build actual genera 59 paginas estaticas exitosamente. Dos opciones documentadas: `output: 'export'` (decision del usuario) vs deploy normal en Vercel (recomendacion tecnica). Pasos de deploy detallados. |
| DEPLOY-03 | Carga inicial < 2 segundos en todas las rutas | Imagenes ya en .webp (~7.4MB total). Fonts con display: swap. Build compila en ~2.8s. Performance budget analizado. Vercel CDN + image optimization automatixa es la mejor ruta. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework SSG + deploy | Ya instalado, todas las paginas son estaticas |
| Tailwind CSS | v4 | Responsive breakpoints md/lg | Ya configurado con @theme, breakpoints estandar |
| Vercel Platform | N/A | Hosting + CDN + image optimization | Plataforma nativa de Next.js, zero-config |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | Built-in | Optimizacion automatica de imagenes | Ya en uso en todo el proyecto |
| next/font/google | Built-in | Font optimization (Raleway, Montserrat) | Ya configurado con display: swap |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `output: 'export'` | Deploy normal en Vercel (sin output: export) | Con `output: 'export'` se requiere `images: { unoptimized: true }` — se pierde la optimizacion automatica de imagenes de Vercel. Sin `output: 'export'` en Vercel, TODAS las paginas siguen siendo SSG (marcadas como Static/SSG en build) pero se obtiene image optimization gratis del CDN. |

**CRITICAL FINDING — `output: 'export'` vs Deploy Normal en Vercel:**

El usuario decidio `output: 'export'` para garantizar 100% SSG. Sin embargo, hay una distincion importante:

1. **Con `output: 'export'`**: Genera carpeta `out/` con HTML estatico. Requiere `images: { unoptimized: true }` porque la Image Optimization API no funciona sin servidor. Las imagenes se sirven tal cual (sin resize, sin conversion de formato). Build verificado: funciona correctamente, 59 paginas generadas.

2. **Sin `output: 'export'` en Vercel**: Vercel detecta Next.js automaticamente. Las paginas marcadas como `○ Static` y `● SSG` se pre-renderizan en build y se sirven desde CDN como archivos estaticos. NO se crean server functions (lambdas) porque ninguna pagina usa features dinamicas. Se obtiene image optimization automatica (resize, WebP/AVIF, CDN cache). El resultado funcional es identico: 100% SSG, zero server functions.

**Recomendacion:** Deploy normal en Vercel (sin `output: 'export'`). El build log actual ya muestra que TODAS las 59 rutas son `○ Static` o `● SSG` — ninguna usa lambda. Esto cumple el espiritu de la decision (100% SSG) con el beneficio adicional de image optimization.

Si el usuario insiste en `output: 'export'`, el build funciona correctamente pero se necesita agregar `images: { unoptimized: true }` al config y las imagenes no seran optimizadas por Vercel.

## Architecture Patterns

### Responsive Audit — Estado Actual

Analisis de cada archivo de pagina/componente y su estado responsive:

```
Pagina/Componente          | lg (desktop) | md (tablet) | Gap?
---------------------------|-------------|-------------|------
Home page.tsx              | grid-cols-2/4, hero h | NO md: rules | YES
Usos page.tsx              | grid-cols-2/4 | NO md: rules | YES
Category [slug]/page.tsx   | lg:flex sidebar | NO md: layout | YES
Fabric detail page.tsx     | max-w-3xl centered | NO md: rules | MINOR
Tecnologias page.tsx       | lg:3 cols | md:2 cols OK | NO
Personalizacion page.tsx   | lg gap | md:2 cols OK | NO
Cuellos page.tsx           | lg:2 tables | md:4 color cols | MINOR
Header + NavLinks          | hidden lg:block | hamburger <lg | NEEDS EVAL
FilterableFabricGrid       | lg:3 cols | 2 cols default | NEEDS EVAL
FabricCard                 | lg sizes only | NO md sizes | MINOR
CategorySidebar            | lg:sidebar, <lg:pills | Works | NO
```

### Pattern 1: Responsive Breakpoint Strategy (desktop-first → md polish)

**What:** El proyecto ya usa un patron desktop-first con `lg:` prefixes. El polish de md requiere agregar clases intermedias sin romper lo existente.

**When to use:** En todas las paginas/componentes que saltan de base (mobile) a lg sin md intermedio.

**Example — Home grid:**
```typescript
// ANTES: salta de 2 cols a 4 cols en lg
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">

// DESPUES: 2 cols base, 2 cols en md con gap mejorado, 4 cols en lg
<div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
// grid-cols-2 funciona bien tanto en mobile como md para las 4 section cards
```

### Pattern 2: Tablet Navigation Evaluation

**What:** Hay 4 nav items (Usos, Tecnologias, Personalizacion, Cuellos). Con iconos, cada link ocupa ~120-150px. En md (768px), el header tiene logo (~140px) + nav items (~600px). Total ~740px cabe en 768px pero queda muy apretado.

**Recommendation:** Mantener hamburger menu para `<lg` (1024px). La nav actual ya usa `hidden lg:block` y el mobile menu `lg:hidden`. Esto es correcto para md (tablet) — el hamburger menu en tablet es una mejor UX para uso tactil profesional en reuniones. No cambiar este breakpoint.

### Pattern 3: Category Page Sidebar en md

**What:** El CategorySidebar tiene dos modos: sidebar vertical (lg) y pills horizontales (<lg). En md, las pills horizontales con scroll funcionan bien y dan mas espacio al grid de telas.

**Recommendation:** Mantener el patron actual. Las pills scrolleables son mejor UX en tablet que forzar una sidebar lateral que robaria espacio al grid.

### Pattern 4: Fabric Grid Columns en md

**What:** El FilterableFabricGrid usa `grid-cols-2 lg:grid-cols-3`. En md (768px), 2 columnas dan cards de ~370px — adecuado para mostrar imagen + texto.

**Recommendation:** Mantener 2 columnas en md. 3 columnas en md (768px) haria cards de ~240px, demasiado pequenas para mostrar los technology chips.

### Pattern 5: Ficha Tecnica en md

**What:** La ficha tecnica usa `max-w-3xl` (768px max-width) centrado. En md (768px de viewport), el contenido ocupa casi todo el ancho disponible menos padding. El layout es vertical (tabla + chips apilados), no hay layout horizontal que necesite ajustarse.

**Recommendation:** La ficha tecnica ya funciona bien en md. Solo necesita ajustes menores: padding, font sizes, y asegurar que los tooltips no se corten.

### Anti-Patterns to Avoid

- **Agregar `md:` a todo por completitud:** Solo agregar md: donde mejore la experiencia concreta en tablet. Muchos componentes ya funcionan bien con base + lg.
- **Convertir hamburger a nav horizontal en md:** El breakpoint lg para la nav desktop es correcto. Forzar nav horizontal en md (768px) con 4 items + iconos seria apretado.
- **Usar `output: 'export'` sin `images: { unoptimized: true }`:** El build falla si se usa `output: 'export'` sin deshabilitar image optimization.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Script de resize custom | Vercel Image Optimization (automatico) o `unoptimized: true` | Vercel maneja resize, format conversion (WebP/AVIF), y CDN cache automaticamente |
| Font loading strategy | Custom font-face con preload manual | `next/font/google` (ya configurado) | Ya maneja subset, display:swap, self-hosting, y zero layout shift |
| Static page verification | Script custom para verificar rutas | `next build` output log — verificar que todas las rutas muestran `○` o `●`, ninguna `ƒ` (lambda) | El build log ya muestra el tipo de rendering por ruta |
| Bundle analysis | Herramienta custom | `@next/bundle-analyzer` (si necesario) | Analisis visual de que modulos pesan mas |
| Responsive testing | Script de capturas | Browser DevTools Device Mode + manual resize | Mas rapido y preciso para 2 breakpoints (md, lg) |

**Key insight:** Esta fase es 90% polish CSS y 10% config. No se necesitan nuevas dependencias ni herramientas.

## Common Pitfalls

### Pitfall 1: Horizontal Overflow en md
**What goes wrong:** Elementos con width fijo o flex-nowrap causan scroll horizontal en viewports entre 768-1023px. Comun en: tablas, grids con min-width, y elementos con padding excesivo.
**Why it happens:** Se testa en mobile (< 768) y desktop (>1024) pero no en el rango medio.
**How to avoid:** Probar TODAS las paginas con viewport de exactamente 768px. Buscar `overflow-x: auto` en tablas y asegurar que el contenedor no crece mas alla del viewport.
**Warning signs:** `min-w-*` classes, fixed-width elements, tables without responsive wrapper.

### Pitfall 2: `output: 'export'` sin `images: { unoptimized: true }`
**What goes wrong:** Build falla con error "Image Optimization is not compatible with static export".
**Why it happens:** `next/image` por defecto usa la Image Optimization API que requiere un servidor.
**How to avoid:** Si se usa `output: 'export'`, SIEMPRE agregar `images: { unoptimized: true }` en next.config.ts.
**Warning signs:** Build error durante `next build`.

### Pitfall 3: Touch Targets demasiado pequenos en tablet
**What goes wrong:** Botones, chips y links son dificiles de tocar en tablet durante una reunion de ventas.
**Why it happens:** Se disenan para mouse (desktop) sin considerar interaccion tactil.
**How to avoid:** Minimo 44x44px (Apple HIG) para todos los interactive elements. En Tailwind: `min-h-[44px] min-w-[44px]` o equivalente con padding. Verificar: nav links, tech filter chips, sort buttons, category sidebar pills, breadcrumb links.
**Warning signs:** Chips/badges con padding < `py-2 px-3`, botones sin min-height, links sin area tactil suficiente.

### Pitfall 4: Dynamic routes con `generateStaticParams` y `output: 'export'`
**What goes wrong:** Rutas dinamicas sin `generateStaticParams` o con `dynamicParams: true` fallan en static export.
**Why it happens:** Static export no puede generar paginas dinamicamente sin conocer todos los params de antemano.
**How to avoid:** Verificar que todos los `[slug]` y `[fabricId]` routes tienen `generateStaticParams()` y `dynamicParams = false`. **Estado actual: Ya correcto** — ambas rutas dinamicas tienen esto configurado.
**Warning signs:** Build error mencionando dynamic routes.

### Pitfall 5: Tooltips cortados en md viewport
**What goes wrong:** Los CSS-only tooltips de tecnologia en fichas tecnicas se cortan por el borde del viewport en pantallas mas estrechas.
**Why it happens:** Tooltip posicionado con `left-1/2 -translate-x-1/2` puede exceder los bordes del viewport.
**How to avoid:** Verificar tooltips en 768px viewport. Si se cortan, considerar posicionamiento alternativo (debajo en vez de arriba) o max-width adaptativo.
**Warning signs:** Tooltip parcialmente oculto en los extremos de la pantalla.

### Pitfall 6: Hero image `preload` prop
**What goes wrong:** El hero image en Home usa `preload` prop en next/image. Con `output: 'export'` y `unoptimized: true`, la imagen no pasa por el optimization pipeline, asi que el preload sigue funcionando pero la imagen no se optimiza.
**Why it happens:** Es el comportamiento esperado de `unoptimized`.
**How to avoid:** Sin `output: 'export'` en Vercel, el preload funciona correctamente con optimizacion.

## Code Examples

### next.config.ts — Opcion A: Deploy Normal en Vercel (RECOMENDADO)

```typescript
// Source: https://nextjs.org/docs/app/getting-started/deploying
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No output: 'export' needed — Vercel handles SSG automatically
  // Images are optimized by Vercel CDN (zero config)
};

export default nextConfig;
```

### next.config.ts — Opcion B: Static Export (decision del usuario)

```typescript
// Source: https://nextjs.org/docs/app/guides/static-exports
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true }, // REQUIRED with output: 'export'
};

export default nextConfig;
```

### Responsive Polish — Ejemplo de ajuste md para Home page

```typescript
// ANTES
<section className="relative h-[400px] overflow-hidden rounded-lg lg:h-[500px]">

// DESPUES — height intermedio en md para tablet
<section className="relative h-[320px] overflow-hidden rounded-lg md:h-[400px] lg:h-[500px]">
```

### Touch Target — Ejemplo de ajuste para filter chips

```typescript
// ANTES: chips con py-1.5 (6px top/bottom padding, total ~30px height)
<button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm">

// DESPUES: touch-friendly height >= 44px
<button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm min-h-[44px]">
```

### Verificacion de Build SSG — Que buscar en el log

```
Route (app)
┌ ○ /                     ← ○ = Static (good)
├ ○ /cuellos              ← ○ = Static (good)
├ ● /uso/[slug]           ← ● = SSG with generateStaticParams (good)
└ ○ /usos                 ← ○ = Static (good)

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)

// ALERTA si aparece:
// ƒ  (Dynamic)  server-rendered on demand ← ESTO no deberia aparecer
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` command | `output: 'export'` in config | Next.js 14.0.0 | Ya aplicado en la recomendacion |
| `priority` prop en next/image | `preload` prop | Next.js 15+ | El proyecto ya usa `preload` |
| Tailwind v3 `tailwind.config.ts` | Tailwind v4 CSS `@theme` | 2024 | Ya aplicado en el proyecto |
| forwardRef | React 19 ref as prop | React 19 | Ya aplicado en el proyecto |
| `images: { loader: 'custom' }` | `images: { unoptimized: true }` | Simplificacion actual | Para static export sin CDN |

## Open Questions

1. **`output: 'export'` vs deploy normal en Vercel**
   - What we know: Build funciona con ambos. Deploy normal da image optimization gratis.
   - What's unclear: El usuario decidio `output: 'export'` explicitamente. Puede que haya una razon no documentada.
   - Recommendation: Plantear la alternativa al usuario durante planning. Si insiste en `output: 'export'`, implementar con `images: { unoptimized: true }`. Si acepta deploy normal, es mejor opcion tecnica.

2. **Performance target de <2 segundos**
   - What we know: Build es rapido (~2.8s), imagenes ya en .webp, fonts con swap. Total imagenes ~7.4MB pero solo se cargan las de la pagina actual.
   - What's unclear: El performance real depende de la conexion y el dispositivo del vendedor. Sin Vercel image optimization, la imagen hero (1MB .webp) cargaria sin optimizar.
   - Recommendation: Con Vercel (sin output: export), la image optimization automatica + CDN deberian cumplir el target facilmente. Con output: export, considerar comprimir manualmente la hero image si excede el target.

## Sources

### Primary (HIGH confidence)
- [Next.js 16.1.6 Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) — Configuration, supported/unsupported features, image limitations
- [Next.js 16.1.6 Deploying Guide](https://nextjs.org/docs/app/getting-started/deploying) — Deployment options, static export vs Node.js
- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/full-stack/nextjs) — Image optimization, font optimization, SSG on Vercel
- Build output analysis — `next build` ejecutado localmente, 59 paginas estaticas confirmadas

### Secondary (MEDIUM confidence)
- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) — Breakpoints confirmados: sm 640px, md 768px, lg 1024px
- [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 24px minimo AA, 44px recomendado AAA
- [Apple HIG Touch Targets](https://developer.apple.com) — 44x44pt minimo para iPad

### Tertiary (LOW confidence)
- N/A — All findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Proyecto ya configurado, build verificado localmente
- Architecture (responsive patterns): HIGH — Auditoria directa del codigo fuente, breakpoints documentados
- Deploy: HIGH — Documentacion oficial Next.js + Vercel verificada
- Performance: MEDIUM — Target teorico, depende de condiciones de red reales
- Pitfalls: HIGH — Verificados empiricamente (build con output: export probado)

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (estable — no hay cambios esperados en Next.js 16.x o Tailwind v4)
