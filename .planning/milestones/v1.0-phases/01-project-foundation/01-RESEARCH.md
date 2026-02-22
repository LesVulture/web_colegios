# Phase 1: Project Foundation - Research

**Researched:** 2026-02-21
**Domain:** Next.js 16 scaffolding + Tailwind CSS v4 design tokens + Tipografia
**Confidence:** HIGH

## Summary

La fase 1 requiere crear un proyecto Next.js 16 con App Router, TypeScript estricto, Tailwind CSS v4 con tokens de color personalizados, y fuentes Google (Raleway + Montserrat) integradas via `next/font`. El ecosistema actual es estable: Next.js 16.1.6, Tailwind CSS 4.2.0, y ambas fuentes son variable fonts con soporte completo.

El punto critico es la configuracion de Tailwind v4 usando `@theme` en CSS (no `tailwind.config.ts`) para definir los 8 colores de categoria + paleta de marca Lafayette. Bun se usa SOLO como package manager (`bun install`, `bun run dev`), NO como runtime (`bun --bun next dev` tiene incompatibilidades NAPI con Next.js 16). Turbopack es el bundler por defecto en Next.js 16 — no se necesita flag `--turbopack`.

**Primary recommendation:** Scaffolding con `bun create next-app@latest --yes`, luego sustituir el CSS por defecto con `@theme` que define tokens de color de categoria y paleta de marca, e integrar Raleway/Montserrat via `next/font/google` con `@theme inline` para Tailwind.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Estilo **catalogo editorial**: se siente como hojear una revista de producto, con protagonismo de las imagenes
- Densidad **hibrida**: paginas de navegacion (home, categorias) respiradas y espaciadas; paginas de detalle/fichas mas densas con informacion tecnica
- **Producto protagonista**: el branding Lafayette esta presente pero discreto. El foco visual son las telas, imagenes y colores de categoria, no el logo o colores corporativos
- Sin referencia visual especifica — Claude interpreta el estilo editorial con densidad hibrida
- Fuentes elegidas por el usuario: **Raleway** y **Montserrat** (ambas sans-serif geometricas, Google Fonts)
- Claude decide la combinacion optima (cual para headings, cual para cuerpo) priorizando legibilidad de specs tecnicas
- Titulos **funcionales y claros**: legibles pero no exagerados, el foco queda en el contenido
- No hay fuente corporativa Lafayette — Raleway/Montserrat aplican a todo el sitio
- Fondo base **claro** (blanco/gris muy claro). Los colores de categoria y las imagenes resaltan sobre fondo limpio
- **Color-coding fuerte** por categoria: cada categoria tine visualmente su pagina (header con fondo de color, bordes, chips coloreados). Inmersion visual por categoria
- Rojo acento Lafayette usado como **branding sutil**: solo en logo y pequenos detalles de marca, NO como color funcional de UI (no en botones ni CTAs)
- Los 8 colores de categoria + azul/rojo de marca se **extraen del PDF** del catalogo durante implementacion
- Bordes **redondeados y suaves** (border-radius generoso 12-16px). Se siente moderno y amigable
- Superficies **flat con borde**: sin box-shadow, delimitacion por borde sutil. Limpio y minimal
- Chips de tecnologia **neutros** (gris/outline): no compiten visualmente con los colores de categoria ni las imagenes
- **Sin animaciones**: todo instantaneo. Velocidad pura para que el vendedor navegue rapido sin esperar transiciones

### Claude's Discretion
- Combinacion exacta de Raleway/Montserrat (headings vs body)
- Escala tipografica (sizes, weights, line-heights)
- Valor exacto del border-radius (dentro del rango 12-16px)
- Estilo del borde en superficies (color, grosor)
- Espaciado interno de componentes base

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Proyecto inicializado con Next.js App Router + TypeScript + Tailwind CSS v4 + Bun | `bun create next-app@latest --yes` scaffolds con todas estas tecnologias. TypeScript strict se habilita en tsconfig.json. Turbopack es default en Next.js 16. |
| FOUND-04 | Design system con 8 tokens de color por categoria definidos en Tailwind v4 @theme | Tailwind v4 `@theme { --color-cat-*: value }` genera utilities automaticamente. Colores del PDF como constantes hex. |
| DES-01 | Diseno web moderno 2025 usando la paleta de colores del PDF (azul oscuro primario, rojo acento, 8 colores de categoria) | Tokens `--color-brand-primary`, `--color-brand-accent` + 8 `--color-cat-*` en @theme. Raleway/Montserrat via next/font. Border-radius 12-16px como token. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework React con App Router, SSG, Turbopack | Framework de referencia para React en produccion. Turbopack default en v16. |
| React | 19.2 (canary via Next.js) | UI library | Incluido con Next.js 16. Incluye Activity, ViewTransitions, useEffectEvent. |
| Tailwind CSS | 4.2.0 | Utility-first CSS con @theme tokens | CSS-first config via @theme, sin tailwind.config.ts. Standard para design systems. |
| TypeScript | 5.1.0+ (bundled) | Type safety | Built-in con Next.js. strict: true se configura en tsconfig.json. |
| Bun | 1.3.9 (instalado) | Package manager | Solo como package manager (bun install, bun run). Node.js ejecuta el runtime. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | latest | Conditional CSS class names | Composicion condicional de clases en componentes |
| tailwind-merge | latest | Merge conflicting Tailwind classes | Merge de clases utility sin conflictos |
| class-variance-authority | 0.7.1 | Type-safe component variants | Componentes con variantes tipadas (botones, cards) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CVA | Tailwind Variants (tv) | CVA es mas ligero y standard con shadcn/ui ecosystem. TV tiene mas features pero mas peso. CVA es suficiente para este proyecto. |
| clsx + tailwind-merge | Solo clsx | Sin tailwind-merge hay conflictos de especificidad. El combo cn() es el patron standard. |

**Installation:**
```bash
bun create next-app@latest web-colegios --yes
cd web-colegios
bun add clsx tailwind-merge class-variance-authority
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout (fonts, global styles)
│   ├── page.tsx           # Home page placeholder
│   └── globals.css        # Tailwind v4 @theme tokens
├── lib/
│   └── utils.ts           # cn() utility function
└── (components/, data/, types/ — fases posteriores)
```

### Pattern 1: Tailwind v4 @theme Color Tokens
**What:** Definir colores de categoria y marca como theme variables en CSS
**When to use:** Para todos los colores del design system
**Example:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Paleta de marca Lafayette */
  --color-brand-primary: #1B3A5C;
  --color-brand-accent: #C42034;
  --color-brand-primary-foreground: #FFFFFF;

  /* 8 colores de categoria (extraidos del PDF) */
  --color-cat-sudaderas: #1B3A5C;
  --color-cat-camisetas: #3FA9D5;
  --color-cat-deportivo: #6CB33F;
  --color-cat-diario: #E91E8C;
  --color-cat-buzos: #F7C948;
  --color-cat-chaquetas-prom: #C42034;
  --color-cat-blusas: #7B4B94;
  --color-cat-delantales: #F7941D;

  /* Fondos y superficies */
  --color-background: #FFFFFF;
  --color-foreground: #1a1a1a;
  --color-surface: #FAFAFA;
  --color-border: #E5E5E5;
  --color-muted: #F5F5F5;
  --color-muted-foreground: #737373;

  /* Border radius token */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  /* Spacing (base 4px) */
  /* Tailwind v4 incluye spacing scale por defecto, no hace falta redefinir */
}
```
**Source:** https://tailwindcss.com/docs/theme — Tailwind CSS v4.2 official docs

### Pattern 2: Google Fonts con next/font + @theme inline
**What:** Integrar Raleway y Montserrat via next/font/google y exponerlas como tokens Tailwind
**When to use:** Configuracion unica en root layout
**Example:**
```typescript
// src/app/layout.tsx
import { Raleway, Montserrat } from 'next/font/google'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${raleway.variable} ${montserrat.variable}`}>
      <body className="font-body bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

```css
/* En globals.css, despues del @theme principal */
@theme inline {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}
```
**Source:** https://nextjs.org/docs/app/getting-started/fonts — Next.js 16.1.6 official docs

### Pattern 3: cn() Utility Function
**What:** Funcion para merge seguro de clases Tailwind
**When to use:** En todo componente que acepte className como prop
**Example:**
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
**Source:** Patron standard de shadcn/ui adoptado ampliamente en el ecosistema.

### Anti-Patterns to Avoid
- **NO usar `tailwind.config.ts`:** Tailwind v4 usa CSS-first config con `@theme`. No crear archivo de config JS/TS.
- **NO usar `@tailwind base/components/utilities`:** Reemplazado por `@import "tailwindcss"` en v4.
- **NO usar `bun --bun next dev`:** El runtime Bun tiene incompatibilidades NAPI con Next.js 16. Usar `bun run dev` (que ejecuta Node.js internamente).
- **NO usar `forwardRef`:** React 19 pasa ref como prop regular. No es necesario.
- **NO hardcodear colores:** Usar tokens semanticos (`bg-cat-sudaderas`, `text-brand-primary`), nunca hex directos en componentes.
- **NO definir animaciones/transiciones:** Decision del usuario: "Sin animaciones, todo instantaneo".

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name merging | Custom className concatenation | `cn()` con clsx + tailwind-merge | Maneja conflictos de especificidad correctamente |
| Font loading/hosting | Self-hosted fonts manuales o Google Fonts CDN | `next/font/google` | Self-hosting automatico, zero layout shift, sin requests a Google |
| CSS config system | tailwind.config.ts o custom CSS variables | Tailwind v4 `@theme` | Genera utility classes automaticamente del token |
| Component variants | Condicionales manuales de className | CVA (class-variance-authority) | Type-safe, declarativo, composable |
| Project scaffolding | Setup manual de Next.js + deps | `bun create next-app@latest --yes` | Configuracion optima por defecto (TS, Tailwind, App Router, Turbopack) |

**Key insight:** Next.js 16 + Tailwind v4 + next/font cubren el 90% de lo que esta fase necesita out-of-the-box. El trabajo real es configurar los tokens de color y tipografia, no el tooling.

## Common Pitfalls

### Pitfall 1: Usar bun --bun como runtime con Next.js 16
**What goes wrong:** Segfaults NAPI, modulos nativos no cargan, TypeScript errors en build
**Why it happens:** Bun no implementa todas las APIs Node.js que Next.js 16 requiere (especialmente NAPI para native modules usados por Turbopack)
**How to avoid:** Usar Bun SOLO como package manager. `bun run dev` ejecuta Node.js internamente. NUNCA poner `bun --bun next dev` en package.json.
**Warning signs:** Crashes al iniciar dev server, errores `napi_release_threadsafe_function`, modulos no encontrados
**Source:** https://github.com/oven-sh/bun/issues/26165, https://github.com/oven-sh/bun/issues/24829

### Pitfall 2: Intentar usar tailwind.config.ts con Tailwind v4
**What goes wrong:** La configuracion se ignora silenciosamente o causa conflictos
**Why it happens:** Tailwind v4 reemplazo el sistema de config JS por CSS-first con `@theme`. El archivo .ts ya no se lee.
**How to avoid:** Toda la configuracion de tema va en globals.css con `@theme {}`. No crear tailwind.config.ts.
**Warning signs:** Colores custom no generan utility classes, `bg-cat-sudaderas` no existe

### Pitfall 3: Confundir @theme con @theme inline para fonts
**What goes wrong:** Las clases `font-heading`/`font-body` no aplican la fuente correcta
**Why it happens:** CSS variables de next/font se inyectan en runtime. `@theme` normal resuelve en build time. Necesitas `@theme inline` para que Tailwind use el `var()` en lugar del valor resuelto.
**How to avoid:** Usar `@theme inline { --font-heading: var(--font-heading) }` para fonts, y `@theme {}` normal para colores (valores estaticos hex).
**Warning signs:** Font fallback (sans-serif) se muestra en vez de Raleway/Montserrat
**Source:** https://tailwindcss.com/docs/theme — seccion @theme inline

### Pitfall 4: TypeScript strict mode no habilitado por defecto
**What goes wrong:** Proyecto compila con errores de tipo que strict mode capturaria (any implicitos, null checks faltantes)
**Why it happens:** `create-next-app` genera tsconfig.json con `strict: false` por defecto
**How to avoid:** Cambiar `"strict": true` en tsconfig.json inmediatamente despues del scaffolding. El requirement es "TypeScript estricto".
**Warning signs:** No hay errores de tipo donde deberia haberlos, `any` se acepta sin error

### Pitfall 5: middleware.ts ya no existe en Next.js 16
**What goes wrong:** Si se crea un archivo middleware.ts, no funcionara como esperado
**Why it happens:** Next.js 16 renombro middleware a proxy (archivo proxy.ts, funcion proxy())
**How to avoid:** No aplica directamente a esta fase (no necesitamos middleware/proxy), pero es importante saberlo para fases futuras.
**Source:** https://nextjs.org/docs/app/guides/upgrading/version-16

### Pitfall 6: Colores de categoria como hex directos sin verificar contraste
**What goes wrong:** Texto blanco sobre algunos colores de categoria (amarillo #F7C948, naranja #F7941D) puede ser ilegible
**Why it happens:** Los colores del PDF fueron disenados para impresion, no para UI web con texto encima
**How to avoid:** Definir tokens `--color-cat-*-foreground` para texto sobre cada color. Verificar contraste WCAG AA (4.5:1 para texto normal). Para colores claros (amarillo, naranja) usar texto oscuro.
**Warning signs:** Texto ilegible sobre fondos coloreados de categoria

## Code Examples

Verified patterns from official sources:

### Setup Completo de globals.css (Tailwind v4)
```css
/* src/app/globals.css */
@import "tailwindcss";

/* ============================
   DESIGN TOKENS - Lafayette
   ============================ */

@theme {
  /* --- Marca Lafayette --- */
  --color-brand-primary: #1B3A5C;
  --color-brand-accent: #C42034;
  --color-brand-primary-foreground: #FFFFFF;
  --color-brand-accent-foreground: #FFFFFF;

  /* --- 8 Colores de Categoria --- */
  --color-cat-sudaderas: #1B3A5C;
  --color-cat-camisetas: #3FA9D5;
  --color-cat-deportivo: #6CB33F;
  --color-cat-diario: #E91E8C;
  --color-cat-buzos: #F7C948;
  --color-cat-chaquetas-prom: #C42034;
  --color-cat-blusas: #7B4B94;
  --color-cat-delantales: #F7941D;

  /* --- Foreground para texto sobre colores de categoria --- */
  --color-cat-sudaderas-fg: #FFFFFF;
  --color-cat-camisetas-fg: #FFFFFF;
  --color-cat-deportivo-fg: #FFFFFF;
  --color-cat-diario-fg: #FFFFFF;
  --color-cat-buzos-fg: #1a1a1a;
  --color-cat-chaquetas-prom-fg: #FFFFFF;
  --color-cat-blusas-fg: #FFFFFF;
  --color-cat-delantales-fg: #1a1a1a;

  /* --- Superficies y UI --- */
  --color-background: #FFFFFF;
  --color-foreground: #1a1a1a;
  --color-surface: #FAFAFA;
  --color-border: #E5E5E5;
  --color-muted: #F5F5F5;
  --color-muted-foreground: #737373;

  /* --- Border Radius (decision: 12-16px) --- */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}

/* --- Fonts (variables inyectadas por next/font en runtime) --- */
@theme inline {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}

/* --- Base styles --- */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```
**Source:** Compuesto de https://tailwindcss.com/docs/theme y https://nextjs.org/docs/app/getting-started/fonts

### Root Layout con Fonts y Metadata
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Raleway, Montserrat } from 'next/font/google'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lafayette Uni For Me - Colegios',
  description: 'Catalogo de soluciones textiles para uniformes escolares',
  robots: { index: false, follow: false }, // herramienta interna, no indexar
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${raleway.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```
**Source:** https://nextjs.org/docs/app/getting-started/fonts, https://nextjs.org/docs/app/getting-started/installation

### tsconfig.json con Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```
**Note:** `create-next-app` genera este archivo automaticamente. El cambio critico es asegurar `"strict": true`.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` (JS config) | `@theme {}` en CSS | Tailwind v4.0 (Jan 2025) | Config en CSS, no JS. Genera utilities del token automaticamente. |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4.0 (Jan 2025) | Un solo import en vez de tres directivas. |
| `React.forwardRef()` | `ref` como prop regular | React 19 (Dec 2024) | Menos boilerplate en componentes. |
| `--turbopack` flag en scripts | Turbopack default | Next.js 16 (2025) | No se necesita flag. Webpack disponible con --webpack. |
| `middleware.ts` | `proxy.ts` | Next.js 16 (2025) | Renombrado para clarificar proposito. |
| `next lint` command | ESLint/Biome CLI directo | Next.js 16 (2025) | `next build` ya no ejecuta linting. Lint separado en scripts. |
| Sync request APIs (cookies, headers, params) | Async obligatorio | Next.js 16 (2025) | `await params`, `await cookies()`, etc. Sin compatibility layer. |

**Deprecated/outdated:**
- `tailwind.config.ts` / `tailwind.config.js`: Reemplazado por CSS `@theme` en v4
- `@tailwind` directives: Reemplazados por `@import "tailwindcss"`
- `React.forwardRef`: ref es prop regular en React 19
- `middleware.ts`: Renombrado a `proxy.ts` en Next.js 16
- `next lint`: Removido en Next.js 16, usar ESLint CLI directo
- Sync request APIs: Removidas en Next.js 16, solo async

## Recomendacion: Combinacion de Fuentes

Basado en el analisis de las fuentes y el contexto del proyecto:

**Raleway para headings, Montserrat para body.** Justificacion:

1. **Raleway** tiene rasgos mas elegantes y weight extremos (Thin 100 a Black 900) que la hacen ideal para titulos de catalogo editorial. Su geometria es mas sofisticada y "de revista".
2. **Montserrat** es ligeramente mas legible en tamaños pequenos y texto largo (specs tecnicas, descripciones de tela). Su x-height es un poco mayor y los caracteres son mas abiertos.
3. Ambas son sans-serif geometricas, asi que la combinacion es armonicas pero con suficiente contraste.

**Escala tipografica recomendada:**
- h1: Raleway SemiBold (600), 2.5rem / 1.2
- h2: Raleway SemiBold (600), 2rem / 1.25
- h3: Raleway Medium (500), 1.5rem / 1.3
- h4: Raleway Medium (500), 1.25rem / 1.4
- body: Montserrat Regular (400), 1rem / 1.6
- body-sm: Montserrat Regular (400), 0.875rem / 1.5
- caption: Montserrat Medium (500), 0.75rem / 1.4

**Border-radius:** `--radius-lg: 1rem` (16px) como valor default. Es el extremo superior del rango 12-16px, se siente moderno y suave sin ser excesivo.

## Open Questions

1. **Colores exactos del PDF**
   - What we know: Los 8 colores de categoria estan documentados en PROJECT.md con valores hex especificos
   - What's unclear: Si los hex del PDF son exactos o necesitan ajuste para pantalla (PDF usa CMYK, web usa sRGB)
   - Recommendation: Usar los hex documentados como punto de partida. Verificar visualmente durante implementacion. Ajustar si es necesario.

2. **TypeScript strict mode default en create-next-app**
   - What we know: Historicamente Next.js generaba `strict: false`. Documentacion actual no especifica el valor default de v16.
   - What's unclear: Si Next.js 16 cambio el default a `strict: true`
   - Recommendation: Verificar el tsconfig.json generado y cambiar a `strict: true` si no lo esta. Es un paso trivial pero critico.

3. **Paleta de colores foreground para categorias**
   - What we know: Colores claros (amarillo #F7C948, naranja #F7941D) necesitan texto oscuro sobre ellos
   - What's unclear: Si los colores del PDF producen contraste suficiente WCAG AA con texto blanco/negro
   - Recommendation: Definir tokens `-fg` (foreground) para cada categoria. Usar blanco sobre colores oscuros, negro/dark sobre colores claros. Validar contraste durante implementacion.

## Sources

### Primary (HIGH confidence)
- Next.js 16.1.6 Installation docs — https://nextjs.org/docs/app/getting-started/installation — scaffolding, bun support, defaults
- Next.js 16.1.6 Font Optimization docs — https://nextjs.org/docs/app/getting-started/fonts — next/font/google integration
- Next.js 16.1.6 TypeScript docs — https://nextjs.org/docs/app/api-reference/config/typescript — tsconfig, strict mode, type safety
- Next.js 16 Upgrade Guide — https://nextjs.org/docs/app/guides/upgrading/version-16 — breaking changes, Turbopack default, middleware→proxy, React 19.2
- Tailwind CSS v4.2 Theme docs — https://tailwindcss.com/docs/theme — @theme directive, namespaces, @theme inline, @theme static
- Tailwind CSS v4.2 Colors docs — https://tailwindcss.com/docs/customizing-colors — custom color definitions
- Google Fonts Raleway — https://fonts.google.com/specimen/Raleway — variable font, weights 100-900
- Google Fonts Montserrat — https://fonts.google.com/specimen/Montserrat — variable font, weights 100-900

### Secondary (MEDIUM confidence)
- Bun + Next.js official guide — https://bun.com/docs/guides/ecosystem/nextjs — bun create next-app, --bun flag
- owolf.com font integration guide — https://www.owolf.com/blog/how-to-use-custom-fonts-in-a-nextjs-15-tailwind-4-app — @theme inline font pattern verified against official docs
- Tailwind Design System skill — proyecto .agents/skills/tailwind-design-system/SKILL.md — patrones CVA, cn(), @theme

### Tertiary (LOW confidence)
- Bun NAPI issues — https://github.com/oven-sh/bun/issues/26165, https://github.com/oven-sh/bun/issues/24829 — known issues pero sin resolucion confirmada. El workaround (no usar --bun) esta corroborado por STATE.md del proyecto.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Todas las versiones verificadas con docs oficiales (Next.js 16.1.6, Tailwind 4.2.0, Bun 1.3.9)
- Architecture: HIGH - Patrones @theme y next/font verificados con docs oficiales de Tailwind v4 y Next.js 16
- Pitfalls: HIGH - Pitfall Bun/NAPI corroborado por GitHub issues + STATE.md del proyecto. Pitfall @theme inline documentado oficialmente.
- Font recommendation: MEDIUM - Basado en tipografia general y skill del proyecto, no en un A/B test. Puede ajustarse.

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (stack estable, 30 dias)
