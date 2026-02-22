# Phase 5: Tech Debt & Data Foundation - Research

**Researched:** 2026-02-22
**Domain:** Deuda tecnica de Next.js 16 + modelos de datos estaticos TypeScript + extraccion de contenido PDF
**Confidence:** HIGH

## Summary

Esta fase combina dos ejes: (1) resolver 6 items de deuda tecnica heredados de v1.0 (imagenes 404, nav bug, dependencia muerta CVA, colores duplicados, SkeletonCard huerfano, iconos faltantes), y (2) crear 3 nuevos modelos de datos para contenido del PDF (personalizacion, cuellos, tecnologias expandidas). No hay componentes de UI nuevos — solo correccion de datos, limpieza de dependencias, y creacion de archivos TypeScript importables.

El dominio tecnico es directo: todo el trabajo ocurre en archivos estaticos de TypeScript (`src/lib/content/`), en el `package.json`, en `nav-links.tsx` (1 linea), y en `globals.css`/`categories.ts` (consolidacion de colores). La complejidad real esta en la extraccion de contenido del PDF (texto literal, colores hex aproximados, mapeo imagen-tela) y en la extraccion de iconos de tecnologia de la pagina 14 del PDF.

**Primary recommendation:** Ejecutar primero la deuda tecnica pura (DEBT-01 a DEBT-06) como un bloque atomico, y luego los 3 modelos de datos (DATA-01 a DATA-03) como segundo bloque, porque Phase 6 y 7 dependen de ambos pero los DATA-* son independientes entre si.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Datos de Personalizacion (DATA-01):** Modelo basico: nombre + descripcion + imagen por cada opcion. 4 opciones: dibujos exclusivos, estampacion digital, tipo Davos, desarrollo de color. Todas las opciones tienen imagen asociada en el PDF (p.15) — deben ser extraidas del PDF. Descripciones: texto literal del PDF, sin resumir ni adaptar.
- **Datos de Cuellos (DATA-02):** Colores mostrados como swatches visuales (circulos de color + nombre), no lista de texto. Valores hex deben aproximarse visualmente del PDF (no hay codigos hex explicitos). Tabla de tallas: dos grupos confirmados — ninos y adolescentes/adultos. Info comercial: Claude decide que incluir segun lo que aparezca relevante en pp.16-17.
- **Contenido de Tecnologias (DATA-03):** Descripciones expandidas: texto literal del PDF (p.14), sin resumir. Incluir relacion inversa: cada tecnologia lista que telas la usan (facilita navegacion cruzada). No distinguir tecnologias propias vs estandar — tratarlas todas igual. Claude verifica cuales tecnologias tienen icono en el PDF y cuales no.
- **Iconos de Tecnologia (DEBT-06):** Los iconos SI existen en el PDF (p.14) — la tarea es extraerlos, no inventar fallbacks. Extraer iconos reales del PDF para las tecnologias faltantes (algodon, antimanchas, solidez a la luz). Si la extraccion produce calidad ilegible: usar icono Lucide representativo como fallback. Formato de extraccion: Claude decide (SVG si posible, PNG/WebP si no).

### Claude's Discretion
- Formato de iconos extraidos (SVG vs PNG/WebP segun calidad)
- Que informacion comercial incluir en el modelo de cuellos
- Verificar cuales tecnologias tienen icono propio en el PDF
- Estructura exacta de la relacion inversa tecnologia->telas

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEBT-01 | Mapear 14 imagenes reales de producto a registros de fabrics.ts, eliminando placeholder.webp 404 | Investigacion de mapeo pagina-a-categoria completada (ver seccion Image Mapping); 14 imagenes son hero shots de categoria, no per-fabric |
| DEBT-02 | Corregir NavLinks active state para rutas /uso/* | Bug confirmado en nav-links.tsx linea 35: `pathname.startsWith(item.href)` donde `item.href = '/usos'` no captura `/uso/*`. Fix: cambiar href de NAV_ITEMS de `/usos` a `/uso` o ajustar logica |
| DEBT-03 | Remover class-variance-authority (dependencia instalada sin uso) | CVA confirmada en package.json, 0 imports en src/. Remover con `bun remove class-variance-authority` |
| DEBT-04 | Consolidar colores hex duplicados entre globals.css tokens y categories.ts | 8 colores hex duplicados exactos entre globals.css @theme y categories.ts `color`/`foregroundColor`. Patron: categories.ts debe referenciar CSS variables, no hardcodear hex |
| DEBT-05 | Integrar SkeletonCard como Suspense fallback o remover si no se usa | SkeletonCard existe, no esta importado en ninguna parte. Decision: mantener para Phase 8 (FilterableFabricGrid necesitara loading state) o remover ahora |
| DEBT-06 | Proveer iconos para 3 tecnologias sin logo (algodon, antimanchas, solidez-a-la-luz) | Verificado en PDF p.14: los 3 iconos SI existen. Extraer del PDF; si calidad insuficiente, usar Lucide fallback |
| DATA-01 | Crear modelo de datos y archivo para Personalizacion (4 opciones del PDF p.15) | Contenido verificado en PDF p.15: 4 opciones con nombre, descripcion literal y imagen. Imagenes ya extraidas en public/images/content/ |
| DATA-02 | Crear modelo de datos y archivo para Cuellos (colores, tallas del PDF pp.16-17) | Contenido verificado en PDF pp.16-17: 4 colores (negro 194006, blanco 110601, rojo 181663, azul 194024), 2 tablas de tallas, info comercial |
| DATA-03 | Expandir descripciones de tecnologias con contenido detallado del PDF p.14 | PDF p.14 muestra 14 tecnologias (12 principales + 5 beneficios). Descripcion expandida: texto intro + nombre de cada tecnologia visible. Relacion inversa calculable desde FABRICS existente |
</phase_requirements>

## Standard Stack

### Core (ya instalado)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Framework React SSG | Ya instalado, todas las rutas son SSG |
| React | 19.2.3 | UI runtime | Ya instalado |
| TypeScript | ^5 | Tipado estatico | Ya instalado, patron `as const satisfies` establecido |
| Tailwind CSS | v4 | Estilos | Ya instalado con @theme tokens en globals.css |
| lucide-react | 0.575.0 | Iconos | Ya instalado, usado en nav-links, breadcrumb, page.tsx |
| clsx + tailwind-merge | ^2.1.1 / ^3.5.0 | Utility classes | Ya instalado, funcion `cn()` en utils.ts |

### Tools para Extraccion de Contenido PDF
| Tool | Purpose | When to Use |
|------|---------|-------------|
| pdfimages (poppler) | Extraer iconos de tecnologia del PDF | DEBT-06: extraer los 3 iconos faltantes de p.14 |
| Pillow (Python) | Composicion alpha de imagenes extraidas | Si los iconos necesitan procesamiento post-extraccion |
| cwebp (libwebp) | Conversion a WebP | Si se extraen como PNG y se necesita WebP |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Extraer iconos del PDF | Usar solo Lucide fallbacks | Mas rapido pero no fiel al branding Lafayette |
| CSS variables para colores de categoria | Mantener hex hardcoded | Mantener es mas simple pero duplicacion persistiria |

**Installation:** No se necesita instalar nada nuevo. Se REMUEVE `class-variance-authority`.
```bash
bun remove class-variance-authority
```

## Architecture Patterns

### Estructura de Archivos de Datos Existente
```
src/lib/content/
├── types.ts            # Interfaces: Fabric, Category, Technology
├── fabrics.ts          # FABRICS: 31 telas (as const satisfies)
├── categories.ts       # CATEGORIES: 8 categorias
├── technologies.ts     # TECHNOLOGIES: 14 tecnologias (expandir aqui)
├── helpers.ts          # 6 funciones helper existentes
├── styles.ts           # CATEGORY_STYLE_MAP
├── index.ts            # Barrel export
├── personalization.ts  # NUEVO: DATA-01
└── collars.ts          # NUEVO: DATA-02
```

### Pattern 1: Static Data with `as const satisfies`
**What:** Todo el contenido es TypeScript estatico, sin CMS ni API.
**When to use:** Siempre — este proyecto usa datos estaticos exclusivamente.
**Example (patron establecido en v1.0):**
```typescript
// Patron ya usado en fabrics.ts, categories.ts, technologies.ts
export const PERSONALIZATION_OPTIONS = [
  {
    id: 'dibujos-exclusivos',
    name: 'Dibujos Nuevos y Exclusivos',
    description: 'Creacion de disenos unicos...',
    image: '/images/content/page15-95.webp',
  },
  // ...
] as const satisfies readonly PersonalizationOption[];
```

### Pattern 2: Inverse Relationship via Computed Helper
**What:** La relacion inversa tecnologia->telas se calcula desde los datos existentes, no se duplica.
**When to use:** DATA-03 requiere que cada tecnologia liste sus telas.
**Example:**
```typescript
// En helpers.ts — nueva funcion
export function getFabricsByTechnology(techId: string): typeof FABRICS[number][] {
  return FABRICS.filter(f => {
    const techs: readonly string[] = f.technologies;
    return techs.includes(techId);
  });
}
```

### Pattern 3: Image Mapping Strategy (CRITICAL for DEBT-01)
**What:** Las 14 imagenes de producto son hero shots de CATEGORIA, no de tela individual. Cada pagina del PDF (4-12) tiene 1-2 fotos compartidas por todas las telas de esa categoria.
**Mapping verificado visualmente:**

| Imagen | Pagina PDF | Categoria | Contenido visual |
|--------|-----------|-----------|-----------------|
| page04-0.webp | p.4 | Sudaderas (foto 1) | Dos ninos con chaquetas azules tipo varsity |
| page04-2.webp | p.4 | Sudaderas (foto 2) | Nina con chaqueta verde + nino con blazer |
| page05-5.webp | p.5 | Sudaderas cont. | Dos ninos con conjunto deportivo azul/amarillo |
| page06-8.webp | p.6 | Camisetas-Polos | Nina y nino con polos blancos |
| page07-11.webp | p.7 | Uniforme Deportivo | Ninos con uniforme deportivo azul |
| page08-14.webp | p.8 | Uniforme Diario | Nina con blazer azul + falda tartán |
| page08-16.webp | p.8 | Uniforme Diario (2) | Nina adicional uniforme diario |
| page09-20.webp | p.9 | Buzos-Hoodies | Ninos con buzos verde/azul |
| page09-22.webp | p.9 | Buzos-Hoodies (2) | Alternativo buzos |
| page10-24.webp | p.10 | Chaquetas Prom | Pareja con chaquetas prom rojas/negras |
| page11-27.webp | p.11 | Blusas-Camisas (1) | Ninos con blusas/camisas |
| page11-29.webp | p.11 | Blusas-Camisas (2) | Alternativo blusas |
| page12-32.webp | p.12 | Delantales-Batas (1) | Persona con delantal + bata |
| page12-34.webp | p.12 | Delantales-Batas (2) | Alternativo delantales |

**Decision critica:** Dado que NO existen imagenes individuales por tela, TODAS las telas de una misma categoria comparten la misma imagen hero. El mapeo es categoria->imagen, no tela->imagen. Hay que asignar una de las 1-2 fotos disponibles a cada tela segun su categoria principal.

### Anti-Patterns to Avoid
- **Duplicar colores hex en dos sitios:** categories.ts ya tiene `color: '#1B3A5C'` y globals.css tiene `--color-cat-sudaderas: #1B3A5C`. Consolidar en una sola fuente de verdad.
- **Copiar texto del PDF con adaptaciones:** CONTEXT.md dice explicitamente "texto literal del PDF, sin resumir ni adaptar". No editar las descripciones.
- **Crear datos de relacion inversa como constante separada:** Calcularla con un helper desde los datos existentes, no duplicar.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Iconos de tecnologia | Dibujar SVGs manualmente | Extraer del PDF con pdfimages; Lucide como fallback | Los iconos ya existen en el PDF p.14, solo falta extraerlos |
| Relacion inversa tech->fabric | Array separado hardcoded | Helper function `getFabricsByTechnology()` | Datos ya existen en FABRICS.technologies, calcular evita desincronizacion |
| Color swatches de cuellos | Color picker component | Datos estaticos con hex + nombre | Solo 4 colores fijos, no interactivo |

**Key insight:** Esta fase es puramente de datos y limpieza. Ningun problema requiere una solucion tecnica nueva — todo se resuelve con los patrones ya establecidos en v1.0.

## Common Pitfalls

### Pitfall 1: Asumir que hay 1 imagen por tela
**What goes wrong:** Intentar mapear 14 imagenes a 31 telas individuales, buscando una relacion 1:1 que no existe.
**Why it happens:** El requirement dice "mapear 14 imagenes reales de producto a registros de fabrics.ts", lo que sugiere mapeo individual.
**How to avoid:** Las imagenes son hero shots de categoria. Asignar la misma imagen a todas las telas de una categoria. Las paginas con 2 fotos permiten elegir la mas representativa o usar ambas (primera foto = imagen principal).
**Warning signs:** Si te encuentras buscando "cual imagen es de cual tela especifica", estas en el camino equivocado.

### Pitfall 2: Colores hex de cuellos incorrectos
**What goes wrong:** Asignar colores hex arbitrarios a los 4 swatches de cuellos sin verificacion visual.
**Why it happens:** El PDF no especifica codigos hex, solo muestra colores + codigos de producto (194006, 110601, 181663, 194024).
**How to avoid:** Los colores son: negro (#000000 o cercano), blanco (#FFFFFF o cercano), rojo (rojo Lafayette ~#C42034 o similar), azul oscuro (azul Lafayette ~#1B3A5C o similar). Aproximar visualmente del PDF, no inventar.
**Warning signs:** Swatches que no coinciden visualmente con los del PDF p.16.

### Pitfall 3: NavLinks fix rompe la pagina /usos
**What goes wrong:** Cambiar `pathname.startsWith('/usos')` a `pathname.startsWith('/uso')` parece trivial, pero hay que considerar que `/usos` debe tambien activar el nav.
**Why it happens:** El fix requiere que `/usos` (pagina de listado) Y `/uso/[slug]` (paginas de categoria) activen el mismo nav item.
**How to avoid:** `pathname.startsWith('/uso')` funciona correctamente porque `/usos` empieza con `/uso`. Sin embargo, el approach actual en nav-links.tsx usa `pathname.startsWith(item.href)` donde `item.href = '/usos'`. El fix mas limpio es cambiar el href en NAV_ITEMS de `/usos` a `/uso`, o bien implementar logica custom para el item "Usos". NOTA: cambiar el href en nav.ts de `/usos` a `/uso` haria que el link de navegacion apunte a `/uso` en lugar de `/usos`, lo cual seria un 404 (no existe `/uso/page.tsx` directo). Hay que separar el href de navegacion de la logica de active state.
**Warning signs:** Si despues del fix, hacer clic en "Usos" en el nav lleva a 404 o si estar en `/usos` no muestra el nav activo.

### Pitfall 4: Remover CVA y romper el build
**What goes wrong:** `bun remove class-variance-authority` podria dejar imports huerfanos si CVA se usa en algun archivo no encontrado.
**Why it happens:** Busqueda de imports puede no cubrir todos los archivos.
**How to avoid:** Ya verificado con grep: 0 imports de `class-variance-authority` o `cva` en todo `src/`. Safe to remove. Verificar post-remove con `bun run build`.
**Warning signs:** Error de compilacion post-remove.

### Pitfall 5: Texto de tecnologias NO literal del PDF
**What goes wrong:** Resumir o adaptar las descripciones de tecnologias en lugar de copiar literal.
**Why it happens:** El instinto natural es "mejorar" el texto. CONTEXT.md dice explicitamente NO hacerlo.
**How to avoid:** Copiar exactamente el texto del PDF p.14 para cada tecnologia. Incluir la frase introductoria "Nuestras tecnologias textiles mejoran el desempeno y funcionalidad de la tela, ofreciendo asi innovacion, calidad y beneficios".
**Warning signs:** Si alguna descripcion suena como redaccion original en lugar de texto de catalogo industrial.

### Pitfall 6: Extraccion de iconos de tecnologia baja calidad
**What goes wrong:** Extraer iconos del PDF que salen pixelados, con artefactos, o con fondo coloreado no removido.
**Why it happens:** Los iconos del PDF estan incrustados en circulos de color (amarillo, azul, verde, rosa) con fondo no transparente.
**How to avoid:** Extraer con pdfimages, verificar calidad visual. Si el icono es ilegible o tiene artefactos severos, usar Lucide fallback. Los iconos del PDF son circulos con icono interior — puede que la extraccion no aisle solo el icono.
**Warning signs:** Iconos que se ven como circulos de color solido sin icono distinguible dentro.

## Code Examples

### DEBT-01: Image Mapping en fabrics.ts
```typescript
// ANTES (todas las telas):
image: '/images/products/placeholder.webp',

// DESPUES (asignar imagen de categoria):
// Sudaderas (p.4): page04-0.webp o page04-2.webp
image: '/images/products/page04-0.webp',

// Pattern: todas las telas de una categoria comparten la misma imagen
// Usar imagen principal (primera foto) para consistencia
```

**Mapeo imagen -> categoria propuesto:**
```typescript
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'sudaderas-chaquetas-pantalones': '/images/products/page04-0.webp',
  'camisetas-polos': '/images/products/page06-8.webp',
  'uniforme-deportivo': '/images/products/page07-11.webp',
  'uniforme-diario-faldas-blazers': '/images/products/page08-14.webp',
  'buzos-hoodies-perchados': '/images/products/page09-20.webp',
  'chaquetas-prom': '/images/products/page10-24.webp',
  'blusas-camisas': '/images/products/page11-27.webp',
  'delantales-batas-laboratorio': '/images/products/page12-32.webp',
};
```

**Problema de telas compartidas:** Algunas telas aparecen en multiples categorias (ej: `orion-clororresistente` en Sudaderas, Chaquetas Prom, Delantales). `fabrics.ts` tiene un solo campo `image` por tela. Solucion: asignar la imagen de la PRIMERA categoria donde aparece la tela (la categoria "principal"). Las demas categorias donde aparece la misma tela mostraran la misma foto.

### DEBT-02: NavLinks Active State Fix
```typescript
// En src/lib/nav.ts, el href actual es '/usos'
// En nav-links.tsx linea 35: const isActive = pathname.startsWith(item.href)
// '/usos'.startsWith('/usos') = true  (OK para /usos)
// '/uso/sudaderas-chaquetas-pantalones'.startsWith('/usos') = false (BUG)

// FIX OPTION A: Agregar campo activePrefix al NavItem
export type NavItem = {
  readonly href: string
  readonly label: string
  readonly icon: string
  readonly activePrefix?: string  // NUEVO
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/usos', label: 'Usos', icon: 'LayoutGrid', activePrefix: '/uso' },
  { href: '/tecnologias', label: 'Tecnologias', icon: 'Cpu' },
  { href: '/personalizacion', label: 'Personalizacion', icon: 'Palette' },
  { href: '/cuellos', label: 'Cuellos', icon: 'Shirt' },
] as const

// En nav-links.tsx:
const isActive = pathname.startsWith(item.activePrefix ?? item.href)

// FIX OPTION B: Logica especial directa
// const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
//    || (item.href === '/usos' && pathname.startsWith('/uso/'))
// Menos limpio pero funcional.
```

### DEBT-03: Remover CVA
```bash
bun remove class-variance-authority
# Verificar:
bun run build
# Debe completar sin errores
```

### DEBT-04: Consolidar Colores
```typescript
// ANTES en categories.ts:
{ id: 'sudaderas-chaquetas-pantalones', color: '#1B3A5C', foregroundColor: '#FFFFFF', ... }

// OPCION: Los colores ya estan en globals.css como CSS variables
// Las CategoryHeader y CategorySidebar usan CATEGORY_STYLE_MAP (bg-cat-*, text-cat-*-fg)
// El campo `color` en categories.ts se usa para inline styles en algun lugar?
```

Verificacion: `color` y `foregroundColor` en `categories.ts` NO se usan actualmente en ningun componente. `CATEGORY_STYLE_MAP` en `styles.ts` mapea los Tailwind classes (bg-cat-*, text-cat-*-fg) que referencian las CSS variables. Los campos `color`/`foregroundColor` en categories.ts son datos muertos duplicados. Se pueden remover de la interfaz y datos, o mantener como metadata para uso futuro (Phase 6 podria necesitarlos para inline styles en fichas tecnicas).

**Recomendacion:** Mantener `color`/`foregroundColor` en categories.ts PERO agregar un comentario que la fuente de verdad para estilos son los tokens CSS en globals.css. Removerlos ahora podria ser prematuro si Phase 6 necesita inline styles para badges dinamicos.

### DEBT-06: Extraccion de Iconos de Tecnologia
```bash
# Extraer todas las imagenes de la pagina 14 del PDF
pdfimages -f 14 -l 14 -j Uniformes_Colegios.pdf /tmp/tech-icons/icon

# Inspeccionar los resultados y identificar los 3 faltantes:
# algodon, antimanchas, solidez-a-la-luz
# Comparar visualmente con los iconos del PDF p.14

# Si calidad es buena: copiar a public/images/tech/ con nombre kebab-case
# Si calidad es mala: usar Lucide fallback
```

**Lucide fallbacks si la extraccion falla:**
```typescript
// algodon -> Lucide: Flower2 (planta de algodon) o Leaf
// antimanchas -> Lucide: ShieldCheck o Droplets
// solidez-a-la-luz -> Lucide: Sun o SunMedium
```

**Verificacion visual del PDF p.14:** Los 14 iconos de tecnologia son circulos de colores con iconos graficos dentro. Los que actualmente faltan (icon: ''):
- **Algodon:** Circulo amarillo con icono de planta de algodon - EXISTE en PDF
- **Antimanchas:** Circulo amarillo con icono de gota/escudo - EXISTE en PDF
- **Solidez a la Luz:** Circulo amarillo con icono de sol - EXISTE en PDF

Los iconos de "Beneficios" (Duracion del Color, Secado Rapido, Planchado Rapido, Durabilidad, Resistencia) son secciones separadas en el PDF. Las tecnologias mapeadas en el data layer son las 14 del area "Nuestras Tecnologias Textiles", no los beneficios.

### DATA-01: Modelo de Personalizacion
```typescript
// src/lib/content/types.ts - nueva interfaz
export interface PersonalizationOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
}

// src/lib/content/personalization.ts
import type { PersonalizationOption } from './types';

export const PERSONALIZATION_OPTIONS = [
  {
    id: 'dibujos-exclusivos',
    name: 'Dibujos Nuevos y Exclusivos',
    description: 'Creacion de disenos unicos para instituciones que requieren una tela diferente segun sus necesidades particulares.',
    image: '/images/content/page15-95.webp', // Sello "ORIGINAL"
  },
  {
    id: 'estampacion-digital',
    name: 'Disenos de Alta Definicion con Estampacion Digital',
    description: '', // Texto literal del PDF - solo titulo, sin descripcion adicional visible
    image: '/images/content/page15-94.webp', // Flores tropicales
  },
  {
    id: 'estampacion-davos',
    name: 'Estampacion Tipo Davos (Marca de Agua)',
    description: 'Proceso que por temperatura y presion graba un diseno sobre la tela.',
    image: '/images/content/page15-96.webp', // Tela roja con marca de agua
  },
  {
    id: 'desarrollo-color',
    name: 'Desarrollo de un Nuevo Color',
    description: 'Programacion de un color exclusivo que no se encuentre en el portafolio de linea vigente.',
    image: '/images/content/page15-93.webp', // Paleta de colores/telas
  },
] as const satisfies readonly PersonalizationOption[];
```

**Mapeo de imagenes de personalizacion verificado visualmente:**
| Opcion | Imagen PDF p.15 | Archivo extraido | Verificacion visual |
|--------|----------------|-----------------|---------------------|
| Dibujos Exclusivos | Sello rojo "ORIGINAL" | page15-95.webp | Coincide |
| Estampacion Digital | Patron flores tropicales | page15-94.webp | Coincide |
| Tipo Davos | Tela roja con marca de agua Lafayette | page15-96.webp | Coincide |
| Desarrollo de Color | Paleta de colores/telas | page15-93.webp | Coincide |

### DATA-02: Modelo de Cuellos
```typescript
// src/lib/content/types.ts - nuevas interfaces
export interface CollarColor {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
  readonly productCode: string;
}

export interface CollarSize {
  readonly size: string;
  readonly collarMeasure: string;
  readonly cuffMeasure: string;
}

export interface CollarData {
  readonly material: string;
  readonly guarantee: string;
  readonly technologies: readonly string[];
  readonly colors: readonly CollarColor[];
  readonly sizes: {
    readonly children: readonly CollarSize[];
    readonly adolescentsAdults: readonly CollarSize[];
  };
  readonly commercialNotes: readonly string[];
}

// src/lib/content/collars.ts
export const COLLAR_DATA: CollarData = {
  material: 'Cuellos 100% hilaza poliester Lafayette con garantia de',
  guarantee: 'Duracion de color, Resistencia, Calidad',
  technologies: ['desempeno', 'proteccion-solar', 'control-humedad'],
  colors: [
    { id: 'negro', name: 'Negro', hex: '#1a1a1a', productCode: '194006' },
    { id: 'blanco', name: 'Blanco', hex: '#FFFFFF', productCode: '110601' },
    { id: 'rojo', name: 'Rojo', hex: '#C42034', productCode: '181663' },
    { id: 'azul', name: 'Azul Oscuro', hex: '#1B3A5C', productCode: '194024' },
  ],
  sizes: {
    children: [
      { size: 'Talla 2 - 4', collarMeasure: '28"7', cuffMeasure: '28"3' },
      { size: 'Talla 6 - 8', collarMeasure: '30"7', cuffMeasure: '28"3' },
      { size: 'Talla 10 - 12', collarMeasure: '32"7', cuffMeasure: '28"3' },
      { size: 'Talla 14 - 16', collarMeasure: '34"7', cuffMeasure: '28"3' },
    ],
    adolescentsAdults: [
      { size: 'Talla XS', collarMeasure: '36"8', cuffMeasure: '37"3' },
      { size: 'Talla S', collarMeasure: '38"8', cuffMeasure: '37"3' },
      { size: 'Talla M', collarMeasure: '40"8', cuffMeasure: '37"3' },
      { size: 'Talla L', collarMeasure: '42"8', cuffMeasure: '37"3' },
      { size: 'Talla XL', collarMeasure: '44"8', cuffMeasure: '37"3' },
      { size: 'Talla 2XL', collarMeasure: '46"8', cuffMeasure: '37"3' },
    ],
  },
  commercialNotes: [
    'Es imprescindible tener un pedido de tela para acompanar el pedido de cuellos.',
    'Otros colores diferentes a los que tienen disponibilidad inmediata, se deben solicitar por programacion.',
    'Ofrecemos el juego de cuellos y punos por programacion.',
  ],
} as const;
```

### DATA-03: Tecnologias Expandidas
```typescript
// Modificar Technology interface existente:
export interface Technology {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly expandedDescription?: string;  // NUEVO: texto largo del PDF
}

// En technologies.ts, agregar expandedDescription a cada entry
// La relacion inversa se implementa como helper function, no como dato estatico:
export function getFabricsByTechnology(techId: string): typeof FABRICS[number][] {
  return FABRICS.filter(f => {
    const techs: readonly string[] = f.technologies;
    return techs.includes(techId);
  });
}
```

**Nota sobre contenido expandido:** El PDF p.14 muestra nombres y circulos de iconos para las tecnologias, pero las "descripciones expandidas" son limitadas. Lo que hay:
- Seccion de titulo: "Nuestras tecnologias textiles mejoran el desempeno y funcionalidad de la tela, ofreciendo asi innovacion, calidad y beneficios"
- Cada tecnologia solo tiene su nombre bajo el icono
- La seccion "Beneficios" tiene 5 items adicionales: Duracion del Color, Secado Rapido, Planchado Rapido, Durabilidad, Resistencia
- La seccion "Cuidados" tiene instrucciones de lavado

La "descripcion expandida" debera construirse con el nombre de la tecnologia y el contexto visual/funcional que transmite el icono. No hay parrafos de texto por tecnologia en el PDF.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `as const` sin `satisfies` | `as const satisfies readonly T[]` | TypeScript 4.9+ | Type safety + literal inference, ya establecido en v1.0 |
| next/image con string src | next/image con typed paths | Next.js 16 | El campo `image` en Fabric es `string`, funcional pero sin validacion de existencia |
| Suspense boundaries | Server Components por default | Next.js 13+ / React 19 | SkeletonCard es un artifact de planning anticipado, no se necesita para SSG puro |

**Deprecated/outdated:**
- `class-variance-authority`: Instalada en Phase 1, nunca usada. La funcionalidad que CVA provee (variant management) no se necesita en este proyecto — los estilos se manejan con `cn()` (clsx + tailwind-merge).

## Open Questions

1. **Telas compartidas entre categorias: cual imagen usar?**
   - What we know: 10 telas aparecen en multiples categorias (ej: `orion-clororresistente` en 3 categorias). `fabrics.ts` tiene un solo campo `image`.
   - What's unclear: Asignar imagen de la primera categoria? O la mas "natural" para la tela?
   - Recommendation: Asignar basado en la categoria donde la tela aparece PRIMERO en el PDF. Esto asegura que la imagen mas representativa se use. La primera aparicion en el PDF es tipicamente la categoria "principal" de la tela.

2. **DEBT-04: Remover o mantener colores hex en categories.ts?**
   - What we know: `color`/`foregroundColor` en categories.ts estan duplicados con globals.css pero NO se usan directamente en ningun componente actual. `CATEGORY_STYLE_MAP` en styles.ts usa classes de Tailwind.
   - What's unclear: Phase 6 (fichas tecnicas) podria necesitar colores hex para inline styles (badges, bordes dinamicos).
   - Recommendation: Mantener `color`/`foregroundColor` en categories.ts como metadata pero agregar un comentario `// Source of truth for styles: globals.css @theme tokens`. Esto evita romper futuros usos sin justificacion.

3. **DEBT-05: SkeletonCard — mantener o remover?**
   - What we know: SkeletonCard existe, tiene CSS shimmer animation, pero no esta importado en ningun lugar. Phase 8 (FilterableFabricGrid como Client Component) necesitara loading states.
   - What's unclear: Si Phase 8 usara SkeletonCard tal cual o necesitara una version diferente.
   - Recommendation: Mantener el componente. Agregar un export en un barrel si no existe. No invertir tiempo en usarlo ahora — Phase 8 decidira su destino. El success criterion dice "integrar como Suspense fallback o remover". Dado que no hay Client Components actualmente que necesiten Suspense, lo correcto es mantenerlo documentado como "reservado para Phase 8".

4. **Calidad de extraccion de iconos del PDF p.14**
   - What we know: Los iconos estan dentro de circulos de color. La extraccion con pdfimages puede dar el circulo completo, no solo el icono interior.
   - What's unclear: Si la calidad sera suficiente para uso en web a tamano pequeno (~24px).
   - Recommendation: Intentar extraccion primero. Si el resultado no es usable como imagen de icono limpia, usar Lucide fallback inmediatamente sin gastar mas tiempo.

5. **Descripciones "expandidas" de tecnologias: que tan expandidas?**
   - What we know: El PDF p.14 solo tiene nombres de tecnologias bajo iconos. No hay parrafos descriptivos por tecnologia. Los `description` actuales en technologies.ts son frases cortas inventadas ("Proteccion contra rayos UV", etc.).
   - What's unclear: Si el usuario espera textos largos que no existen en el PDF.
   - Recommendation: Mantener las descripciones actuales (cortas, funcionales) como `description`. Agregar `expandedDescription` SOLO si se encuentra texto adicional en el PDF. Si no hay texto expandido, `expandedDescription` puede ser undefined o igual a `description`. El requirement dice "texto literal del PDF" — si el PDF no tiene texto expandido, no inventar.

## Sources

### Primary (HIGH confidence)
- Codebase actual: lectura directa de todos los archivos en `src/lib/content/`, `src/components/`, `src/app/`
- PDF Uniformes_Colegios.pdf paginas 4-17: lectura visual directa de contenido, iconos, tablas
- `package.json`: dependencias verificadas (CVA instalada, lucide-react 0.575.0, Next.js 16.1.6)
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md`: audit completa de tech debt con severidad y fix propuestos
- `bun run build`: verificado exitoso sin warnings (59 paginas SSG en 200ms)

### Secondary (MEDIUM confidence)
- Mapeo imagen-categoria: verificacion visual cruzando PDF pp.4-12 con archivos en `public/images/products/`
- Mapeo imagen-personalizacion: verificacion visual cruzando PDF p.15 con archivos en `public/images/content/page15-*.webp`
- Colores hex de cuellos: aproximacion visual del PDF p.16 (negro, blanco, rojo, azul oscuro) comparados con palette Lafayette existente

### Tertiary (LOW confidence)
- Calidad de extraccion de iconos de tecnologia: no verificable hasta ejecucion real de pdfimages en p.14
- Texto "expandido" de tecnologias: el PDF puede no tener texto mas alla de los nombres; se necesita verificacion durante implementacion

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - todo ya esta instalado, no hay dependencias nuevas
- Architecture: HIGH - patrones establecidos en v1.0 (`as const satisfies`, barrel exports, helpers)
- Pitfalls: HIGH - bugs y fixes documentados en audit con exactitud de linea/archivo
- Data content (PDF): MEDIUM - contenido visual verificado pero extraccion de iconos no testeable hasta runtime
- Image mapping: MEDIUM - mapeo categoria->imagen verificado pero telas compartidas requieren decision

**Research date:** 2026-02-22
**Valid until:** 2026-03-22 (dominio estable, no hay dependencias fast-moving)
