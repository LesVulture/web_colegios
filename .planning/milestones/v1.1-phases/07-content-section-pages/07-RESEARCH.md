# Phase 7: Content Section Pages - Research

**Researched:** 2026-02-22
**Domain:** Next.js Server Component pages with static TypeScript data, Tailwind CSS v4 styling
**Confidence:** HIGH

## Summary

Esta fase reemplaza 3 paginas placeholder (`/tecnologias`, `/personalizacion`, `/cuellos`) con contenido real. La infraestructura esta completamente preparada: los datos TypeScript existen en `src/lib/content/` (technologies.ts, personalization.ts, collars.ts), los tipos estan definidos en types.ts, los helpers de lookup existen en helpers.ts, las imagenes estan en `/public/images/`, y los componentes reutilizables (TechIcon, Breadcrumb, CategoryHeader) estan probados en produccion.

No se requieren dependencias nuevas. Las 3 paginas son Server Components puros (sin estado de cliente), lo que las hace simples de implementar. El patron esta claramente establecido por las paginas de categoria (`/uso/[slug]/page.tsx`) y detalle de tela (`/uso/[slug]/[fabricId]/page.tsx`). El reto principal es de diseno: el usuario quiere paginas visualmente impresionantes con micro-animaciones y hover effects para presentaciones B2B, no paginas de datos planas.

**Primary recommendation:** Construir las 3 paginas como Server Components puros siguiendo los patrones existentes (Breadcrumb + header + contenido grid), anadiendo CSS animations y hover effects en Tailwind para el tono visual dinamico requerido. La helper `getFabricsByTechnology()` ya existe para la cross-navigation de tecnologias.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Cross-navigation: cada tecnologia debe listar las telas que la usan, con links navegables a las fichas de tela
- Las telas ya tienen `technologies` array en sus datos — se puede hacer lookup inverso
- Solo mostrar las 4 opciones directamente, sin texto introductorio ni contexto adicional
- Las imagenes reales existen (page15-93/94/95/96.webp en /images/content/)
- La personalizacion depende de la tela — algunas opciones solo aplican a ciertas telas. Las telas ya tienen `stampingRoutes` pero el mapeo a las 4 opciones de personalizacion no es directo — el researcher debe investigar como vincularlos
- No hay imagenes de cuellos — pagina puramente informativa con colores y tablas
- Las dos tablas de tallas (Ninos y Adolescentes/Adultos) deben mostrarse simultaneamente, ambas visibles sin tabs
- Datos disponibles: 4 colores con hex codes, medidas de cuello y puno por talla, material, garantia, tecnologias asociadas, notas comerciales
- Breadcrumbs en las 3 paginas (Inicio > Tecnologias, etc.)
- Tono visual dinamico: mas color, micro-animaciones, hover effects — debe impresionar al cliente en la reunion
- Es una herramienta de ventas B2B que se usa en laptop/tablet durante reuniones comerciales

### Claude's Discretion
- Layout de cards de tecnologias (tamano, manejo de texto expandido, prominencia del icono)
- Interactividad del grid de tecnologias (informativo vs expandible)
- Encabezado introductorio en tecnologias (directo al grid vs intro breve)
- Layout de personalizacion (cards 2x2 vs secciones apiladas — elegir segun contenido)
- Representacion visual de colores de cuellos (swatches vs cards)
- Prominencia de notas comerciales en cuellos
- Balance de consistencia entre paginas vs adaptacion al contenido
- Referencia visual — coherente con patrones existentes del catalogo (FabricCard, CategoryHeader)

### Deferred Ideas (OUT OF SCOPE)
- Mapeo explicito de stampingRoutes a opciones de personalizacion por tela — si el researcher identifica que es viable, incluir en esta fase; si requiere cambios de modelo de datos significativos, diferir a fase futura
- Paginas individuales por tecnologia con catalogo de telas asociadas (ya listado como ADV-05 en v2)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SECTION-01 | Pagina de Tecnologias Textiles con cards, logos y descripciones expandidas | Datos en TECHNOLOGIES (14 items), iconos en /images/tech/ + 3 Lucide fallbacks, TechIcon ya resuelve ambos formatos. Helper getFabricsByTechnology() ya existe para cross-navigation. Las descriptions y expandedDescriptions son identicas (fase 05-02 confirmo que el PDF no tiene texto expandido distinto) — usar description como unico texto. |
| SECTION-02 | Pagina de Personalizacion con 4 opciones, imagenes y texto del PDF | Datos en PERSONALIZATION_OPTIONS (4 items), imagenes en /images/content/page15-{93,94,95,96}.webp. La opcion `estampacion-digital` tiene description vacia ("") — necesita fallback o texto manual. Investigacion de mapping printRoutes->personalizacion completada (ver seccion dedicada). |
| SECTION-03 | Pagina de Cuellos con grid de colores, tabla de tallas y medidas | Datos completos en COLLAR_DATA: 4 colores con hex, 2 tablas de tallas (children: 4 rows, adolescentsAdults: 6 rows), material, garantia, 3 tecnologias asociadas, 3 notas comerciales. Estructura de datos perfectamente mapeable a UI. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router, Server Components, SSG | Ya en uso, las paginas son Server Components puros |
| React | 19.2.3 | UI rendering | Ya en uso, ref como prop nativo |
| Tailwind CSS | v4 | Styling CSS-first con @theme | Ya configurado con tokens en globals.css |
| lucide-react | 0.575.0 | Iconos (fallback para 3 tecnologias) | Ya en uso via TechIcon |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | (incluido en Next.js) | Optimizacion de imagenes | Para imagenes de personalizacion |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class merging | Utility cn() ya existe |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS animations nativas | framer-motion / Motion | Overkill para hover effects y micro-animaciones, anade bundle size innecesario. CSS transitions/animations de Tailwind son suficientes para este caso. |
| Server Components puros | Client Components con estado | No se necesita interactividad de estado. Expandir/colapsar se puede hacer con CSS :target o details/summary si se quiere, pero el contenido es corto. |

**Installation:**
```bash
# No se requieren instalaciones nuevas
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── tecnologias/
│   │   └── page.tsx          # REWRITE — Server Component
│   ├── personalizacion/
│   │   └── page.tsx          # REWRITE — Server Component
│   └── cuellos/
│       └── page.tsx          # REWRITE — Server Component
├── components/
│   ├── tech-icon.tsx          # EXISTING — reutilizar tal cual
│   ├── breadcrumb.tsx         # EXISTING — reutilizar tal cual
│   └── (nuevos componentes si se necesitan)
└── lib/content/
    ├── technologies.ts        # EXISTING — 14 tecnologias
    ├── personalization.ts     # EXISTING — 4 opciones
    ├── collars.ts             # EXISTING — datos completos
    ├── helpers.ts             # EXISTING — getFabricsByTechnology() ya existe
    └── types.ts               # EXISTING — todos los tipos definidos
```

### Pattern 1: Page Layout (establecido en proyecto)
**What:** Container mx-auto max-w-7xl con Breadcrumb + header + contenido
**When to use:** Todas las paginas de seccion
**Example:**
```typescript
// Patron establecido en /uso/[slug]/page.tsx y /usos/page.tsx
export default function SectionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Seccion' }]} />
      <div className="mt-6">
        {/* Header section */}
      </div>
      <div className="mt-8">
        {/* Content grid */}
      </div>
    </div>
  )
}
```

### Pattern 2: Cross-Navigation (tecnologias -> telas)
**What:** Listar telas asociadas a cada tecnologia con links a fichas de detalle
**When to use:** Pagina de tecnologias — decision bloqueada del usuario
**Example:**
```typescript
// La helper ya existe:
import { getFabricsByTechnology, getCategoriesByFabric } from '@/lib/content'

// Para cada tecnologia:
const fabrics = getFabricsByTechnology(tech.id)
// Para cada tela, necesitamos su categoria para el link:
const categories = getCategoriesByFabric(fabric.id)
// Link: /uso/{categorySlug}/{fabricId}
```

### Pattern 3: Tabla estilizada (cuellos)
**What:** Tablas HTML nativas con Tailwind styling
**When to use:** Pagina de cuellos — 2 tablas side by side
**Example:**
```typescript
// Patron de tabla ya usado en fabric detail (specs table)
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-border">
      <th className="py-3 text-left font-medium text-muted-foreground">Talla</th>
      <th className="py-3 text-left font-medium text-muted-foreground">Cuello</th>
      <th className="py-3 text-left font-medium text-muted-foreground">Puno</th>
    </tr>
  </thead>
  <tbody>
    {sizes.map(row => (
      <tr key={row.size} className="border-b border-border">
        <td className="py-3 font-medium text-foreground">{row.size}</td>
        <td className="py-3 text-muted-foreground">{row.collarMeasure}</td>
        <td className="py-3 text-muted-foreground">{row.cuffMeasure}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Pattern 4: Micro-animaciones CSS con Tailwind v4
**What:** Hover effects, scale, shadow transitions, staggered card reveals
**When to use:** Todas las paginas — requisito del usuario para tono visual dinamico
**Example:**
```css
/* En globals.css @theme block */
@theme {
  --animate-fade-in-up: fade-in-up 0.5s ease-out both;

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```
```typescript
// En componentes — hover effects con Tailwind
<div className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
  {/* Card content */}
</div>

// Staggered animation con CSS animation-delay
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${i * 75}ms` }}
  >
    {/* Card */}
  </div>
))}
```

### Anti-Patterns to Avoid
- **Client Component innecesario:** No usar 'use client' para estas paginas. Son contenido estatico. Las animaciones CSS no requieren JavaScript.
- **Fetch de datos:** Los datos son imports estaticos TypeScript, no hay fetch() ni async data loading. Los imports directos funcionan en Server Components.
- **Componentes genericos prematuros:** No crear un componente `<SectionPage>` generico. Las 3 paginas tienen layouts distintos — la abstraccion seria forzada.

## Investigacion: Mapping printRoutes -> Personalizacion

### Analisis de la relacion

Los `printRoutes` de cada tela son: `Unicolor`, `Rotativa`, `Davos`, `Sublimacion`.
Las opciones de personalizacion son:

| Personalizacion ID | Nombre | Posible printRoute relacionado |
|---|---|---|
| `dibujos-exclusivos` | Dibujos Nuevos y Exclusivos | `Rotativa` (impresion rotativa permite disenos custom) |
| `estampacion-digital` | Estampacion Digital | `Sublimacion` (estampacion digital por sublimacion) |
| `estampacion-davos` | Estampacion Tipo Davos | `Davos` (coincidencia directa) |
| `desarrollo-color` | Desarrollo de un Nuevo Color | `Unicolor` (telas unicolor aceptan nuevos colores) |

### Viabilidad del mapping

El mapping es **conceptualmente razonable** pero **no directo**:

1. **`Davos` -> `estampacion-davos`**: Mapping directo y seguro. Confianza HIGH.
2. **`Sublimacion` -> `estampacion-digital`**: Razonable — la sublimacion ES estampacion digital. Pero `Rotativa` tambien puede hacer disenos digitales. Confianza MEDIUM.
3. **`Rotativa` -> `dibujos-exclusivos`**: Parcial — la rotativa permite disenos exclusivos, pero tambien `Sublimacion` y `Davos` pueden tener disenos exclusivos. Confianza LOW.
4. **`Unicolor` -> `desarrollo-color`**: Parcial — desarrollo de color aplica a unicolor, pero tambien cualquier tela puede tener desarrollo de color como base. Confianza LOW.

### Recomendacion

**Diferir el mapping a fase futura** (alineado con CONTEXT.md deferred). Razones:
- El mapping 1:1 no es semanticamente preciso — una tela con printRoutes `['Unicolor', 'Davos', 'Sublimacion']` podria aplicar a 3 de las 4 opciones de personalizacion
- Implementar un mapping incorrecto es peor que no tenerlo (confundiria al vendedor)
- El modelo de datos actual no tiene un campo `personalizationOptions` en Fabric — anadirlo seria un cambio de modelo
- Las 4 opciones de personalizacion se presentan como capacidades generales de Lafayette, no vinculadas a telas especificas

**Para esta fase:** Mostrar las 4 opciones de personalizacion como informacion general (sin filtrar por tela). La pagina es informativa — el vendedor explica las opciones en la reunion.

## Inventario de Datos y Vacios

### Tecnologias (TECHNOLOGIES)
- **14 items** completos con id, name, icon, description, expandedDescription
- **Nota critica:** `expandedDescription === description` para TODAS las tecnologias (Phase 05-02 confirmo que el PDF p.14 no tiene texto expandido separado)
- **3 iconos Lucide fallback:** algodon (Flower2), antimanchas (ShieldCheck), solidez-a-la-luz (Sun)
- **11 iconos PNG** en /images/tech/
- **Vacio:** No hay "categorias" de tecnologias (proteccion, confort, durabilidad, etc.) — son una lista plana

### Personalizacion (PERSONALIZATION_OPTIONS)
- **4 items** con id, name, description, image
- **Vacio critico:** `estampacion-digital` tiene `description: ''` (string vacio)
  - Necesita texto manual o se omite la descripcion para esa opcion
  - Recomendacion: Agregar descripcion basada en el contexto del nombre ("Impresion de alta definicion sobre tela mediante tecnologia de estampacion digital, ideal para disenos detallados y multicolor")
- **4 imagenes** confirmadas en /images/content/: page15-93.webp, page15-94.webp, page15-95.webp, page15-96.webp

### Cuellos (COLLAR_DATA)
- **Datos completos**, sin vacios:
  - material: string
  - guarantee: string
  - technologies: 3 IDs (desempeno, proteccion-solar, control-humedad)
  - colors: 4 items con id, name, hex, productCode
  - sizes.children: 4 rows
  - sizes.adolescentsAdults: 6 rows
  - commercialNotes: 3 strings

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon rendering dual (PNG/Lucide) | Logica condicional manual | TechIcon (existente) | Ya resuelve ambos formatos, testeado en produccion |
| Class merging condicional | String concatenation manual | cn() utility (existente) | Maneja conflictos de Tailwind correctamente |
| Image optimization | `<img>` tags manuales | next/image `<Image>` | Ya en uso, optimiza automaticamente |
| CSS animations | JS animation libraries | Tailwind transitions + @theme keyframes | Sin dependencias extra, funciona en Server Components |
| Cross-nav links | Logica ad-hoc de URL | getCategoriesByFabric() + getFabricsByTechnology() helpers (existentes) | DRY, consistente con fichas de tela |

**Key insight:** La mayor parte de la infraestructura ya esta construida. Esta fase es primordialmente de **composicion de UI** con datos existentes, no de ingenieria.

## Common Pitfalls

### Pitfall 1: Color swatch con borde blanco invisible
**What goes wrong:** El color blanco (#FFFFFF) en cuellos se ve invisible contra el fondo blanco de la pagina
**Why it happens:** El fondo de la app es #FFFFFF (--color-background)
**How to avoid:** Agregar borde `border border-border` a todos los swatches de color, incluyendo blanco
**Warning signs:** El swatch blanco "desaparece" visualmente

### Pitfall 2: Imagenes de personalizacion con aspect ratio inconsistente
**What goes wrong:** Las 4 imagenes del PDF pueden tener dimensiones distintas, causando cards de altura irregular
**Why it happens:** Las imagenes fueron extraidas del PDF sin normalizacion
**How to avoid:** Usar `aspect-[4/3]` o `aspect-square` fijo con `object-cover` en el container de imagen, igual que FabricCard
**Warning signs:** Grid de cards con alturas desiguales

### Pitfall 3: Texto description vacio en estampacion-digital
**What goes wrong:** Card sin texto descriptivo, se ve incompleta
**Why it happens:** El dato `description: ''` en personalization.ts
**How to avoid:** Agregar texto descriptivo directamente en el archivo de datos (es un fix de datos, no de UI). O manejar con fallback condicional en la UI.
**Warning signs:** Card con solo titulo e imagen, sin descripcion

### Pitfall 4: Links rotos en cross-navigation de tecnologias
**What goes wrong:** Una tela puede pertenecer a multiples categorias — el link debe ir a una categoria valida
**Why it happens:** getCategoriesByFabric() retorna multiples categorias, hay que elegir una para el href
**How to avoid:** Usar la primera categoria retornada por getCategoriesByFabric(fabricId)[0] como destino del link (consistente con la logica de image mapping del Phase 05)
**Warning signs:** Links a /uso/undefined/fabricId

### Pitfall 5: Animaciones CSS que interfieren con SSG
**What goes wrong:** `animation-delay` con style inline puede causar flash de contenido
**Why it happens:** Server-rendered HTML muestra todo, luego la animacion "reinicia" en hydration
**How to avoid:** Usar solo CSS transitions en hover (no animaciones de entrada que dependen de JS). O si se desea animacion de entrada, usar `@starting-style` (CSS nativo, sin JS). Pero dado que estas son Server Components puros sin hydration de cliente, las animaciones CSS de entrada funcionan correctamente en el primer render.
**Warning signs:** Contenido que "salta" despues de cargar

## Code Examples

### Ejemplo 1: Card de Tecnologia con cross-navigation
```typescript
// Patron recomendado para cada card de tecnologia
import Link from 'next/link'
import { TechIcon } from '@/components/tech-icon'
import { getFabricsByTechnology, getCategoriesByFabric } from '@/lib/content'
import type { Technology } from '@/lib/content/types'

function TechCard({ tech }: { tech: Technology }) {
  const fabrics = getFabricsByTechnology(tech.id)

  return (
    <div className="group rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Icon prominente */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-brand-primary/10">
          <TechIcon icon={tech.icon} size={28} />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {tech.name}
        </h3>
      </div>

      {/* Descripcion */}
      <p className="text-sm text-muted-foreground">{tech.description}</p>

      {/* Telas asociadas (cross-navigation) */}
      {fabrics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Telas con esta tecnologia
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fabrics.map(fabric => {
              const cat = getCategoriesByFabric(fabric.id)[0]
              return cat ? (
                <Link
                  key={fabric.id}
                  href={`/uso/${cat.id}/${fabric.id}`}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-brand-primary hover:text-white transition-colors"
                >
                  {fabric.name}
                </Link>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

### Ejemplo 2: Color Swatch para cuellos
```typescript
// Patron para mostrar colores de cuellos
import type { CollarColor } from '@/lib/content/types'

function ColorSwatch({ color }: { color: CollarColor }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-md">
      <div
        className="size-12 rounded-full border border-border shadow-sm"
        style={{ backgroundColor: color.hex }}
      />
      <div>
        <p className="font-medium text-foreground">{color.name}</p>
        <p className="text-xs text-muted-foreground">Ref. {color.productCode}</p>
      </div>
    </div>
  )
}
```

### Ejemplo 3: Animacion de entrada CSS-only (Tailwind v4)
```css
/* globals.css — dentro de @theme */
@theme {
  --animate-fade-in-up: fade-in-up 0.5s ease-out both;

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(0.75rem); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```
```typescript
// Uso con stagger delay en Server Component
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${i * 60}ms` }}
  >
    {/* Card content */}
  </div>
))}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config JS | @theme en CSS | Tailwind v4 (2024) | Ya implementado en globals.css del proyecto |
| forwardRef para componentes | ref como prop directo | React 19 | Ya en uso en el proyecto |
| framer-motion para animaciones | CSS animations nativas + @starting-style | 2024-2025 | No necesita dependencia extra para micro-animaciones |
| Client Components para todo | Server Components por defecto | Next.js 13+ App Router | Las 3 paginas son Server Components puros |

**Deprecated/outdated:**
- tailwind.config.ts: No se usa en este proyecto (Tailwind v4 CSS-first)
- class-variance-authority: Fue removida en Phase 5 (DEBT-03)

## Open Questions

1. **Texto descriptivo para estampacion-digital**
   - What we know: El campo `description` esta vacio en personalization.ts
   - What's unclear: Si el usuario tiene texto especifico que quiere usar
   - Recommendation: Agregar texto descriptivo directo en personalization.ts basado en el nombre del producto. Texto sugerido: "Impresion de alta definicion sobre tela mediante tecnologia de sublimacion digital, ideal para disenos detallados y policromias complejas."

2. **Tamano del icono en cards de tecnologia**
   - What we know: TechIcon acepta `size` prop, actualmente usado a 14px en chips de FabricCard
   - What's unclear: Tamano optimo para cards grandes de la pagina de tecnologias
   - Recommendation: 28-32px para prominencia visual en cards de tecnologia (vs 14px en chips compactos)

3. **Cantidad de telas por tecnologia puede ser grande**
   - What we know: `proteccion-solar` aparece en casi todas las telas (verificado: 30+ telas la tienen)
   - What's unclear: Si listar TODAS las telas asociadas a una tecnologia satura la card
   - Recommendation: Limitar a las primeras 6-8 telas visibles con "+ N mas" si excede. O agrupar como chips compactos sin limite — al ser nombres cortos, el wrapping natural lo maneja.

## Sources

### Primary (HIGH confidence)
- Codebase directo — lectura de todos los archivos de datos, componentes, paginas y estilos
- `src/lib/content/technologies.ts` — 14 tecnologias con estructura verificada
- `src/lib/content/personalization.ts` — 4 opciones, description vacia en estampacion-digital
- `src/lib/content/collars.ts` — datos completos sin vacios
- `src/lib/content/types.ts` — tipos TypeScript verificados
- `src/lib/content/helpers.ts` — getFabricsByTechnology() confirmado existente
- `src/app/uso/[slug]/[fabricId]/page.tsx` — patron de referencia para cross-navigation y tooltips
- `src/app/globals.css` — tokens de diseno y patron @theme Tailwind v4

### Secondary (MEDIUM confidence)
- Skill `tailwind-design-system` — patrones de animaciones CSS en @theme para Tailwind v4
- Skill `frontend-design` — directrices de diseno para tono visual impresionante

### Tertiary (LOW confidence)
- Mapping printRoutes -> personalizacion: analisis conceptual propio, no validado con documentacion de Lafayette

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no requiere nada nuevo, todo existe en el proyecto
- Architecture: HIGH — patrones claros establecidos por paginas existentes
- Datos: HIGH — verificados directamente en el codebase, vacios identificados
- Pitfalls: HIGH — basados en patrones reales del proyecto
- Mapping printRoutes: LOW — analisis conceptual, recomendacion es diferir

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (stack estable, datos estaticos)
