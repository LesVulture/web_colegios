# Technology Stack -- v1.1 Additions

**Project:** Lafayette Uni For Me Colegios -- v1.1 Catalogo Completo
**Researched:** 2026-02-22
**Scope:** Solo adiciones/cambios para v1.1. Stack base (Next.js 16.1.6, React 19.2.3, Tailwind v4.2.0, TypeScript, lucide-react, clsx/tailwind-merge) ya validado en v1.0.

---

## Recommended New Dependencies

### Fuzzy Search: fuse.js 7.1.0

| Attribute | Value |
|-----------|-------|
| Package | `fuse.js` |
| Version | `^7.1.0` |
| Bundle size | ~5kB gzipped (zero dependencies) |
| Purpose | Busqueda fuzzy por nombre de tela en paginas de categoria |
| Confidence | HIGH |

**Por que fuse.js y no otra cosa:**

1. **Dataset trivial (31 telas, max 9 por pagina de categoria).** No se necesita un motor de full-text search con indice invertido como MiniSearch o FlexSearch. Fuse.js hace fuzzy matching puro sobre strings, que es exactamente lo que necesitamos: el vendedor escribe "vendav" y encuentra "Vendaval Crushed R".

2. **API simple, sin pre-indexing.** Con MiniSearch hay que construir un indice con `addAll()`, definir campos searchable y stored por separado. Fuse.js acepta el array directamente: `new Fuse(fabrics, { keys: ['name'] })`. Para 31 items no hay diferencia de performance, pero si de complejidad de codigo.

3. **Alternativas descartadas:**
   - **MiniSearch** (~7kB gzip): Full-text search con indice invertido. Overkill para 31 items. Su ventaja (velocidad en datasets grandes: 10K+ documentos) no aplica aqui.
   - **uFuzzy** (~3kB gzip): Mas ligero pero API menos ergonomica y menor adopcion (5K stars vs 18K de Fuse.js). Riesgo innecesario.
   - **Sin libreria (String.includes / RegExp):** Suficiente para match exacto, pero no maneja typos del vendedor. "montesimne" no encontraria "montesimone". Fuse.js resuelve esto.
   - **Native browser API (Intl.Collator):** Solo compara strings, no hace fuzzy matching.

**Uso previsto:**

```typescript
// En un Client Component dentro de /uso/[slug]/page.tsx
'use client'
import Fuse from 'fuse.js'

const fuse = new Fuse(fabrics, {
  keys: ['name'],
  threshold: 0.4,  // tolerancia a typos (0 = exact, 1 = match anything)
  ignoreLocation: true,
})

// Cuando el vendedor escribe en el input:
const results = query ? fuse.search(query).map(r => r.item) : fabrics
```

**Nota:** fuse.js requiere un Client Component porque el estado de busqueda (el input del usuario) es interactivo. El componente padre (page.tsx) sigue siendo Server Component; solo el panel de busqueda/filtros se extrae a un Client Component.

---

### NO agregar: nuqs (URL state management)

**Evaluado y descartado.** `nuqs` (v2.8.8) sincroniza estado de React con URL search params (`?q=vendaval&tech=proteccion-solar`). Util cuando:
- Los usuarios comparten URLs con filtros aplicados
- Se necesita deep linking a estados filtrados
- Back/forward del browser debe preservar filtros

**Por que NO aplica aqui:**
- Es una herramienta interna de ventas usada en reuniones presenciales
- El vendedor no comparte URLs de busqueda con nadie
- No hay SEO (out of scope explicito)
- El vendedor interactua en una sola sesion, no necesita persistir filtros entre tabs
- Agrega ~8kB gzipped + adapter provider en layout.tsx por funcionalidad que nadie usara

**Usar en su lugar:** `useState` de React para query, filtros activos y sort. Simplicidad maxima. Si en el futuro se necesita compartir URLs con filtros (poco probable), migrar a nuqs es straightforward porque la API es similar a useState.

---

### NO agregar: Zod 4 (aun)

En la investigacion de v1.0 se recomendo Zod para validacion en build time. El proyecto actual usa `as const satisfies readonly Type[]` para el data layer, lo cual ya da type safety completo en compile time sin runtime validation.

**Estado actual:** Los datos son constantes TypeScript tipadas. TypeScript ya verifica que cada fabric tenga todos los campos obligatorios. Zod agregaria validacion runtime (ej: "el peso es un string que matchea el patron X"), pero esto no ha causado bugs.

**Recomendacion:** Diferir Zod a cuando se agreguen datos mas complejos (ej: si se introduce un admin panel o se parsea data de un CMS). Ahora no aporta valor suficiente vs. el costo de agregar una dependencia.

---

### NO agregar: framer-motion / motion

Las fichas tecnicas de tela, secciones de Tecnologias/Personalizacion/Cuellos, y filtros no requieren animaciones complejas. Las transiciones entre paginas ya las maneja Next.js con prefetching. Micro-interacciones (hover en cards, transitions de filtros) se resuelven con Tailwind CSS `transition-*` utilities.

---

## Cambios en Dependencias Existentes

### Remover: class-variance-authority (CVA)

```bash
bun remove class-variance-authority
```

**Justificacion:** Instalada en v1.0 pero nunca importada en ningun componente (confirmado via grep en `src/`). Es tech debt documentado en el audit de v1.0. Removerla elimina ~6kB del bundle sin impacto funcional.

Si en el futuro se necesitan component variants (ej: Button con variantes primary/secondary/ghost), re-evaluar. Pero el proyecto actual no tiene componentes UI genericos con variantes -- los estilos se aplican directamente con Tailwind.

### Agregar: sharp (si no esta ya)

```bash
bun add sharp
```

**Motivo:** Vercel usa sharp para image optimization en runtime. El proyecto ya lo tiene en `trustedDependencies` del package.json pero no como dependency explicita. Para el deploy en Vercel, asegurar que esta instalado como dependencia de produccion.

**Verificacion:** Si `bun install` ya lo resuelve via Next.js, no es necesario agregarlo explicitamente. Pero si el build en Vercel da warnings de image optimization, instalarlo resuelve el problema.

---

## Vercel Deployment

### Configuracion Necesaria

**Cero cambios en next.config.ts.** El deploy en Vercel con Next.js funciona out-of-the-box:

1. **NO usar `output: 'export'`** -- ya decidido en v1.0. El deploy estandar en Vercel detecta Next.js automaticamente, pre-renderiza las paginas SSG, y sirve via CDN.

2. **NO usar `output: 'standalone'`** -- esto es para Docker deployments. Vercel no lo necesita.

3. **generateStaticParams ya existe** en las rutas dinamicas (`/uso/[slug]` y `/uso/[slug]/[fabricId]`). Vercel las pre-renderizara en build time.

4. **`dynamicParams = false`** ya configurado -- cualquier ruta no generada devuelve 404.

### Build Command en Vercel

```
Framework Preset: Next.js (auto-detected)
Build Command: bun run build  (o dejar auto-detect)
Output Directory: (default, Vercel lo maneja)
Install Command: bun install
Node.js Version: 20.x
```

### next.config.ts Recomendado para v1.1

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [768, 1024, 1280, 1536, 1920],
    imageSizes: [128, 256, 384, 512],
  },
};

export default nextConfig;
```

**Cambios vs. actual:**
- Agrega `images.formats` -- prioriza AVIF (mejor compresion) con WebP fallback. Vercel sirve automaticamente el formato que el browser soporta.
- Agrega `deviceSizes` -- solo tablet y desktop (constraint del proyecto: no se optimiza para celular).
- Agrega `imageSizes` -- para thumbnails y iconos de tecnologias.
- NO agrega `localPatterns` -- las imagenes son locales por default en Next.js 16. Solo se necesita `remotePatterns` para imagenes externas, que no tenemos.

**Confianza:** HIGH -- verificado contra documentacion oficial de Next.js 16 y Vercel.

---

## Stack para Features Nuevas

### Fichas Tecnicas de Tela (Fabric Detail Pages)

**No requiere dependencias nuevas.** El data layer ya tiene toda la informacion necesaria:
- `composition`, `weight`, `width`, `weave` en cada Fabric
- `technologies[]` con referencia a TECHNOLOGIES
- `printRoutes[]` con las rutas de estampacion

La pagina `/uso/[slug]/[fabricId]/page.tsx` ya existe como placeholder. Solo requiere implementar el layout con los datos existentes usando Server Components + Tailwind.

**Componentes necesarios (todos con stack existente):**
- `FabricDetail` -- layout de ficha con imagen + specs
- `TechBadge` / `TechTooltip` -- chip de tecnologia con tooltip al hover (CSS `:hover` + Tailwind `group` / `peer`, o un `<details>` / `Popover` nativo HTML si se quiere click)

**Tooltip approach:** Usar el atributo HTML nativo `title` o CSS-only tooltips con `group-hover` de Tailwind. NO agregar Radix UI, Headless UI, ni Floating UI solo por tooltips. Si se necesita posicionamiento avanzado (tooltip que no se salga del viewport), evaluar `@floating-ui/react` (~3kB) en ese momento.

### Filtros Multi-Select por Tecnologia

**No requiere dependencias nuevas.** Implementacion con React useState en un Client Component:

```typescript
'use client'
import { useState } from 'react'

// Estado: array de technology IDs seleccionados
const [selectedTechs, setSelectedTechs] = useState<string[]>([])

// Toggle una tecnologia
function toggleTech(techId: string) {
  setSelectedTechs(prev =>
    prev.includes(techId)
      ? prev.filter(id => id !== techId)
      : [...prev, techId]
  )
}

// Filtrar fabrics
const filtered = fabrics.filter(f =>
  selectedTechs.length === 0 ||
  selectedTechs.every(tech => f.technologies.includes(tech))
)
```

**UI:** Chips/toggle buttons con las 14 tecnologias. Estilo con Tailwind: chip activo con `bg-brand-primary text-white`, inactivo con `bg-muted text-muted-foreground border`. Ya hay precedente en el proyecto con los tech chips de `FabricCard`.

### Ordenar por Peso/Ancho

**No requiere dependencias nuevas.** Los datos de weight y width son strings con formato `"110 +-10 g/m2"` y `"151 +- 2 cm"`. Para ordenar numericamente:

```typescript
// Extraer valor numerico del string de peso/ancho
function parseNumericValue(str: string): number {
  const match = str.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Ordenar
const sorted = [...filtered].sort((a, b) => {
  const valA = parseNumericValue(a.weight);
  const valB = parseNumericValue(b.weight);
  return sortDirection === 'asc' ? valA - valB : valB - valA;
});
```

### Busqueda Fuzzy

**Requiere: fuse.js** (ver seccion principal arriba). Unico nuevo dependency del milestone.

### Secciones de Contenido (Tecnologias, Personalizacion, Cuellos)

**No requieren dependencias nuevas.** Son paginas de contenido estatico:

- `/tecnologias/page.tsx` -- ya existe como placeholder. Mostrar grid de 12 tecnologias con icono + nombre + descripcion. Datos ya en `TECHNOLOGIES`.
- `/personalizacion/page.tsx` -- ya existe como placeholder. 4 opciones. Requiere agregar datos al data layer (nuevo archivo `personalization.ts`).
- `/cuellos/page.tsx` -- ya existe como placeholder. Colores + tallas. Requiere agregar datos al data layer (nuevo archivo `collars.ts`).

Todas son Server Components puros sin interactividad. Solo HTML + Tailwind + next/image.

---

## Client vs Server Component Strategy

| Feature | Component Type | Why |
|---------|---------------|-----|
| Fabric detail page layout | Server Component | Datos estaticos, no interactividad |
| Technology/Personalizacion/Cuellos pages | Server Component | Contenido estatico puro |
| Search input + results | Client Component | useState para query |
| Multi-select filter chips | Client Component | useState para selection |
| Sort controls | Client Component | useState para sort direction |
| Category page wrapper | Server Component | Pasa datos a children Client Components |

**Patron recomendado:** La page.tsx permanece como Server Component. Extrae un `<FabricCatalog fabrics={fabrics} technologies={technologies} />` como Client Component que encapsula search + filter + sort + grid de resultados. Esto minimiza el JS enviado al cliente: solo el componente interactivo se hidrata.

```
/uso/[slug]/page.tsx (Server)
  +-- Breadcrumb (Server)
  +-- CategoryHeader (Server)
  +-- FabricCatalog (Client) <--- aqui vive toda la interactividad
       +-- SearchInput
       +-- TechFilterChips
       +-- SortControls
       +-- FabricGrid -> FabricCard[]
```

---

## Installation (v1.1 additions only)

```bash
# New dependency
bun add fuse.js

# Remove unused dependency (tech debt cleanup)
bun remove class-variance-authority

# Verify sharp is available for Vercel
bun add sharp
```

**Total bundle impact:** +~5kB gzipped (fuse.js) - ~6kB (CVA removal) = net reduction.

---

## Version Compatibility Matrix (new additions)

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| fuse.js | 7.1.0 | Any JS runtime, no dependencies | ESM + CJS. Works in Client Components. Tree-shakable. |
| sharp | 0.33.x | Node.js >=18.17 | Binary. Vercel installs it automatically, but explicit install ensures no warnings. |

---

## What NOT to Add for v1.1

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| nuqs | URL state innecesario para herramienta interna sin URL sharing | `useState` en Client Components |
| Zod | TypeScript `as const satisfies` ya valida el data layer suficientemente | Type system existente |
| framer-motion | No hay animaciones complejas en el scope de v1.1 | Tailwind `transition-*` utilities |
| Radix UI / Headless UI | Solo se necesitarian por tooltips; overkill agregar un design system completo | CSS tooltips o `title` attribute nativo |
| @floating-ui/react | Solo si tooltips de tecnologia se salen del viewport (evaluar en implementacion) | CSS `group-hover` + absolute positioning |
| class-variance-authority | Ya instalada pero no usada. REMOVER. | Tailwind classes directas con `cn()` |
| react-select / downshift | Multi-select de tecnologias es una lista fija de 14 items con chips toggle, no un dropdown complejo | Chips con `useState` + Tailwind |
| next-pwa | Offline no es requisito validado. Evaluar si vendedores reportan problemas de conectividad | Nada por ahora |
| Algolia / Typesense | Search-as-a-service es absurdo para 31 items estaticos | fuse.js client-side |

---

## Sources

- [fuse.js npm](https://www.npmjs.com/package/fuse.js) -- v7.1.0 latest stable, 5.5M weekly downloads (HIGH)
- [Fuse.js Official Docs](https://www.fusejs.io/) -- API reference, configuration options, examples (HIGH)
- [npm-compare: fuse.js vs minisearch vs flexsearch](https://npm-compare.com/elasticlunr,flexsearch,fuse.js,minisearch) -- Download stats and feature comparison (MEDIUM)
- [nuqs Official Site](https://nuqs.dev/) -- v2.8.8, evaluated and rejected for this use case (HIGH)
- [nuqs GitHub Releases](https://github.com/47ng/nuqs/releases) -- Latest release info (HIGH)
- [Next.js Static Exports Docs](https://nextjs.org/docs/app/guides/static-exports) -- Why NOT to use output: export (HIGH)
- [Next.js generateStaticParams Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- SSG for dynamic routes (HIGH)
- [Next.js on Vercel Docs](https://vercel.com/docs/frameworks/full-stack/nextjs) -- Zero-config deployment (HIGH)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization) -- AVIF/WebP automatic format negotiation (HIGH)
- [Bundlephobia: fuse.js](https://bundlephobia.com/package/fuse.js) -- Bundle size verification (MEDIUM)
- [GitHub: uFuzzy](https://github.com/leeoniya/uFuzzy) -- Alternative evaluated and rejected (MEDIUM)
- [GitHub: microfuzz](https://github.com/Nozbe/microfuzz) -- Alternative evaluated and rejected (LOW)

---
*Stack research for: Lafayette Uni For Me Colegios v1.1 -- Catalogo Completo*
*Researched: 2026-02-22*
*Previous: v1.0 stack research (2026-02-21) preserved in git history*
