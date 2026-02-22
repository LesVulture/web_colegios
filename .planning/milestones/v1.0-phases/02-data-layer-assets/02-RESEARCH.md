# Phase 2: Data Layer & Assets - Research

**Researched:** 2026-02-21
**Domain:** TypeScript data modeling + PDF image extraction + asset optimization
**Confidence:** HIGH

## Summary

Esta fase requiere dos flujos de trabajo independientes: (1) modelar los datos del catalogo como constantes TypeScript tipadas, y (2) extraer y optimizar las imagenes de producto del PDF para uso con next/image.

La investigacion revela que el PDF contiene **31 telas unicas** (no ~40) con 43 apariciones totales a traves de 8 categorias (confirmando la relacion muchos-a-muchos). Las imagenes de producto estan embebidas en CMYK con mascaras de transparencia (smask) que contienen transparencia real (valores 0-255). La herramienta `pdfimages` (poppler-utils v26.02, ya instalada) puede extraer directamente a PNG con conversion automatica CMYK->RGB. Los 13 logos de tecnologia existen como PNG de ~945x828px con nombres que necesitan normalizacion a kebab-case.

TypeScript 5.9 con el patron `as const satisfies` es la herramienta correcta para modelar datos estaticos preservando tipos literales con validacion de estructura. Los datos se estructuran mejor en modulos separados (`technologies.ts`, `fabrics.ts`, `categories.ts`) con un barrel export desde `lib/content/index.ts`.

**Primary recommendation:** Usar `pdfimages -png -p` para extraccion con conversion automatica CMYK->RGB, luego `cwebp` para optimizacion WebP, y `as const satisfies` para el modelo de datos TypeScript.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- El PDF de 37MB es la UNICA fuente de imagenes de producto -- no hay originales aparte
- Las imagenes son fotos de producto (prendas confeccionadas), no swatches de textura
- Si la calidad extraida es baja (menos de 400px), se usan como esten -- lo importante es que la imagen este presente
- Los 13 logos de tecnologia YA EXISTEN como archivos PNG separados con nombres legibles (no se extraen del PDF)
- Todas las ~40 telas tienen datos COMPLETOS en el PDF: nombre, composicion, tejido, peso, ancho, tecnologias, rutas de estampacion
- "Rutas de estampacion" son TIPOS de estampacion compatibles (sublimacion, serigrafia, etc.), no paths de archivo
- Cada tela tiene un subconjunto especifico de tecnologias aplicables (no todas aplican a todas)
- La web muestra EXACTAMENTE la misma informacion del PDF, sin contenido adicional (sin descripciones de marketing ni datos extras)
- Una tela puede pertenecer a MULTIPLES categorias de uso (relacion muchos-a-muchos)
- No hay categoria "principal" -- todas las categorias de una tela son iguales
- Las 8 categorias y sus nombres exactos se toman del PDF
- El mapeo tela->categoria esta EXPLICITO en el PDF (no requiere inferencia)
- Los nombres de telas se muestran TAL CUAL aparecen en el PDF, sin modificaciones
- Los nombres de categorias se muestran TAL CUAL del PDF, sin simplificar
- Cada tela tiene un CODIGO BASE unico en el PDF que sirve como identificador
- Los 13 logos de tecnologia son PNG con nombres legibles, listos para renombrar a kebab-case

### Claude's Discretion
- Estructura de archivos TypeScript (un archivo monolitico vs modulos separados)
- Metodo de extraccion de imagenes del PDF
- Formato de optimizacion de imagenes (WebP/AVIF)
- Convencion de slugs internos generados a partir de los nombres del PDF

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-02 | Modelo de datos TypeScript para telas (nombre, base, composicion, tejido, peso, ancho, tecnologias, rutas), categorias (nombre, slug, color, descripcion), y tecnologias (nombre, icono, descripcion) | Patron `as const satisfies` con TS 5.9, estructura modular en `lib/content/`, 31 telas unicas con 14 tecnologias y 8 categorias verificadas contra el PDF. Datos exactos extraidos y reconciliados. |
| FOUND-03 | Imagenes extraidas del PDF (37MB) y optimizadas para web (WebP/AVIF via next/image) | `pdfimages -png -p` para extraccion CMYK->RGB automatica, composicion de canal alfa con Pillow, conversion a WebP con `cwebp`, sharp ya instalado para next/image. 14 imagenes de producto >=1200px de ancho en paginas 4-12. |
</phase_requirements>

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|-------------|---------|---------|--------------|
| TypeScript | 5.9.3 | Tipado del modelo de datos | Ya instalado en el proyecto, soporta `satisfies` + `as const` |
| pdfimages (poppler-utils) | 26.02.0 | Extraccion de imagenes del PDF | Ya instalado via Homebrew, convierte CMYK->RGB automaticamente con `-png` |
| Pillow (Python) | 12.0.0 | Composicion de canal alfa (smask) | Ya instalado, necesario para fusionar imagen+mascara de transparencia |
| cwebp (libwebp) | Instalado | Conversion PNG->WebP | Ya instalado via Homebrew, compresion con perdida configurable |
| sips (macOS) | Built-in | Validacion de dimensiones y color space | Herramienta nativa macOS para verificar propiedades de imagen |
| sharp | Instalado en node_modules | Optimizacion runtime por next/image | Ya instalado como dependencia del proyecto |

### Supporting
| Library/Tool | Version | Purpose | When to Use |
|-------------|---------|---------|-------------|
| next/image | 16.1.6 (via Next.js) | Renderizado optimizado de imagenes | Fases posteriores (UI), pero la estructura de `/public/images/` se prepara ahora |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pdfimages (poppler) | PyMuPDF (fitz) | PyMuPDF no esta instalado; pdfimages ya funciona perfectamente y esta instalado |
| cwebp CLI | sharp CLI/script | sharp no tiene CLI instalado; cwebp esta disponible y es mas directo |
| WebP | AVIF | AVIF tiene mejor compresion pero next/image convierte a WebP/AVIF en runtime de todos modos; WebP como formato source es suficiente |
| Modulos separados | Archivo monolitico | Monolitico seria +500 lineas, dificil de navegar; modulos permiten importar solo lo necesario |

**Installation:**
```bash
# Todo ya instalado. Solo se necesita pip para script de composicion:
pip3 install Pillow  # Ya instalado (12.0.0)
# No se necesita instalar nada nuevo con bun
```

## Architecture Patterns

### Recommended Project Structure
```
src/
└── lib/
    └── content/
        ├── index.ts           # Barrel export: fabrics, categories, technologies, helpers
        ├── types.ts           # Interfaces/tipos: Fabric, Category, Technology, PrintRoute, WeaveType
        ├── technologies.ts    # TECHNOLOGIES array (14 tecnologias) as const satisfies
        ├── fabrics.ts         # FABRICS array (31 telas unicas) as const satisfies
        ├── categories.ts      # CATEGORIES array (8 categorias) con mapping tela->categoria
        └── helpers.ts         # Funciones: getFabricsByCategory, getCategoriesByFabric, getFabricBySlug, etc.
public/
└── images/
    ├── products/             # Imagenes de producto extraidas del PDF (WebP)
    │   ├── vendaval-crushed-r.webp
    │   ├── orion-clororresistente.webp
    │   └── ...
    └── tech/                 # Logos de tecnologia (PNG renombrados a kebab-case)
        ├── proteccion-solar.png
        ├── impermeabilidad.png
        └── ...
```

### Pattern 1: `as const satisfies` para datos estaticos
**What:** Combinar `as const` (preserva tipos literales) con `satisfies` (valida estructura) para obtener autocomplete exacto Y validacion de tipos.
**When to use:** Siempre que se definan arrays/objetos de datos estaticos que se usan en el codigo.
**Example:**
```typescript
// Source: TypeScript 5.9 official docs
// types.ts
export type WeaveType = 'Plano' | 'Punto';

export type PrintRoute =
  | 'Unicolor'
  | 'Rotativa'
  | 'Davos'
  | 'Sublimacion';

export interface Technology {
  readonly id: string;           // kebab-case slug
  readonly name: string;         // Nombre display tal cual del PDF
  readonly icon: string;         // Path relativo a /public/images/tech/
  readonly description: string;  // Descripcion del PDF
}

export interface Fabric {
  readonly id: string;           // kebab-case slug generado del nombre
  readonly name: string;         // Nombre tal cual del PDF
  readonly base: string;         // Codigo BASE unico (ej: "23243")
  readonly composition: string;  // Composicion textual
  readonly weave: WeaveType;     // Tipo de tejido
  readonly weight: string;       // Peso con tolerancia (ej: "110 +-10 g/m2")
  readonly width: string;        // Ancho con tolerancia (ej: "151 +- 2 cm")
  readonly technologies: readonly string[];  // IDs de tecnologias aplicables
  readonly printRoutes: readonly PrintRoute[];  // Rutas de estampacion
  readonly image: string;        // Path relativo a /public/images/products/
  readonly isNew?: boolean;      // Flag "NUEVA" (solo Apolo y Celta)
}

export interface Category {
  readonly id: string;           // kebab-case slug
  readonly name: string;         // Nombre tal cual del PDF
  readonly color: string;        // Hex color del design system
  readonly foregroundColor: string; // Color de texto WCAG AA
  readonly fabricIds: readonly string[];  // IDs de telas en esta categoria
  readonly description?: string; // Subtitulo si aplica
}

// fabrics.ts
import type { Fabric } from './types';

export const FABRICS = [
  {
    id: 'vendaval-crushed-r',
    name: 'Vendaval Crushed R',
    base: '23243',
    composition: '100% poliester reciclado',
    weave: 'Plano',
    weight: '110 +-10 g/m2',
    width: '151 +- 2 cm',
    technologies: ['impermeabilidad', 'sostenible', 'antifluido-repelencia', 'proteccion-solar', 'clororresistente'],
    printRoutes: ['Unicolor', 'Davos'],
    image: '/images/products/vendaval-crushed-r.webp',
    isNew: false,
  },
  // ... 30 telas mas
] as const satisfies readonly Fabric[];
```

### Pattern 2: Helper functions tipadas para queries
**What:** Funciones puras que consultan los arrays de datos para obtener relaciones (telas por categoria, categorias por tela, etc.)
**When to use:** Cualquier componente que necesite filtrar o relacionar datos.
**Example:**
```typescript
// helpers.ts
import { FABRICS } from './fabrics';
import { CATEGORIES } from './categories';

export function getFabricsByCategory(categoryId: string): typeof FABRICS[number][] {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  return FABRICS.filter(f => category.fabricIds.includes(f.id));
}

export function getCategoriesByFabric(fabricId: string): typeof CATEGORIES[number][] {
  return CATEGORIES.filter(c => c.fabricIds.includes(fabricId));
}

export function getFabricBySlug(slug: string): typeof FABRICS[number] | undefined {
  return FABRICS.find(f => f.id === slug);
}

export function getFabricByBase(base: string): typeof FABRICS[number] | undefined {
  return FABRICS.find(f => f.base === base);
}
```

### Pattern 3: Colores de categoria sincronizados con design system
**What:** Los colores de categoria en los datos TypeScript deben referenciar los mismos valores hex que ya estan en `globals.css` (definidos en Phase 1).
**When to use:** Al definir las categorias.
**Example:**
```typescript
// categories.ts - los colores DEBEN coincidir con globals.css @theme
import type { Category } from './types';

export const CATEGORIES = [
  {
    id: 'sudaderas-chaquetas-pantalones',
    name: 'Sudaderas - Chaquetas - Pantalones',
    color: '#1B3A5C',      // --color-cat-sudaderas
    foregroundColor: '#FFFFFF', // --color-cat-sudaderas-fg
    fabricIds: [
      'vendaval-crushed-r', 'orion-clororresistente', 'gorek',
      'glou-crushed', 't180', 'universal-clororresistente',
      'microtec-clororresistente', 'microprince', 'fastrack'
    ],
  },
  // ... 7 categorias mas
] as const satisfies readonly Category[];
```

### Anti-Patterns to Avoid
- **Duplicar datos de telas por categoria:** NO copiar los datos completos de una tela en cada categoria donde aparece. Usar IDs y funciones helper para resolver la relacion muchos-a-muchos.
- **Hardcodear paths de imagenes en multiples lugares:** Definir el path UNA vez en el objeto Fabric y referenciarlo siempre desde ahi.
- **Crear un CMS o JSON externo:** Los datos son estaticos y cambian 1-2 veces al ano. TypeScript tipado es superior a JSON porque valida en tiempo de compilacion.
- **Ignorar el canal alfa de las imagenes:** Las imagenes del PDF tienen mascaras de transparencia reales. Si se ignoran, las imagenes tendran fondos negros o corruptos.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Extraccion de imagenes del PDF | Script custom con pypdf/fitz | `pdfimages` CLI (poppler) | Maneja CMYK, smask, multiples formatos; robusto y ya instalado |
| Conversion CMYK->RGB | Script manual de conversion de color | `pdfimages -png` (convierte automaticamente) | Conversion de color profesional con perfiles ICC |
| Composicion de canal alfa | Intentar con ImageMagick/sips | Pillow (Python) `Image.putalpha()` | Pillow ya instalado, API simple y confiable para composicion RGBA |
| Conversion a WebP | sharp script o ImageMagick | `cwebp` CLI | Ya instalado, optimizado para batch, opciones granulares de calidad |
| Validacion de tipos de datos | Tests manuales de datos | `as const satisfies` de TypeScript | El compilador valida que cada tela tiene todos los campos requeridos |

**Key insight:** Las herramientas CLI ya instaladas (`pdfimages`, `cwebp`, `sips`) cubren todo el pipeline de imagenes. No se necesita instalar nada nuevo ni escribir scripts complejos.

## Common Pitfalls

### Pitfall 1: Imagenes CMYK sin convertir a sRGB
**What goes wrong:** Las imagenes del PDF estan en CMYK (4 canales, espacio de color para impresion). Los navegadores web esperan sRGB. Imagenes CMYK se ven desaturadas, con colores incorrectos, o simplemente no se renderizan.
**Why it happens:** `pdfimages -j` (flag -j) extrae JPEG nativo que mantiene CMYK. next/image y los navegadores no manejan CMYK correctamente.
**How to avoid:** Usar `pdfimages -png` que convierte automaticamente CMYK->RGB. Verificar con `sips -g space archivo.png` que el resultado es "RGB".
**Warning signs:** Colores apagados o verdosos en las fotos de producto; errores de next/image al procesar.

### Pitfall 2: Ignorar las mascaras de transparencia (smask)
**What goes wrong:** `pdfimages` extrae la imagen RGB y la mascara alfa como archivos SEPARADOS. Si solo se usa la imagen RGB, se pierde la transparencia y los productos aparecen con fondos negros o con artefactos.
**Why it happens:** Las imagenes de producto en el PDF tienen recorte/transparencia (smask con valores 0-255, verificado).
**How to avoid:** Usar Pillow para componer la imagen RGB + mascara alfa en un PNG con canal alfa, y luego decidir si se necesita fondo blanco (WebP con fondo) o transparencia (PNG/WebP con alfa).
**Warning signs:** Fondos negros o rectangulares alrededor de las fotos de producto.

### Pitfall 3: Inconsistencia en slugs entre datos y archivos
**What goes wrong:** El slug generado para el nombre de tela no coincide con el nombre del archivo de imagen. next/image da 404.
**Why it happens:** Nombres con caracteres especiales (acentos, "R", "+"), espacios, o inconsistencias en la funcion de slugificacion.
**How to avoid:** Definir UNA funcion de slugificacion (ej: `slugify()`) y usarla TANTO para generar `id` en los datos COMO para nombrar archivos de imagenes. Usar la misma funcion en el script de extraccion y en el codigo TypeScript.
**Warning signs:** Imagenes que no cargan, 404 en network tab, nombres de archivo que no matchean con los datos.

### Pitfall 4: Duplicar datos de telas que aparecen en multiples categorias
**What goes wrong:** Si se copian los datos completos de "Universal Clororresistente" en las 3 categorias donde aparece, cualquier correccion debe hacerse en 3 lugares. Se introduce inconsistencia.
**Why it happens:** El PDF repite la informacion de la tela en cada pagina de categoria.
**How to avoid:** Definir cada tela UNA vez en `FABRICS[]`. Las categorias solo referencian telas por ID. Funciones helper resuelven la relacion.
**Warning signs:** Datos diferentes para la misma tela en distintas categorias.

### Pitfall 5: Nombres de tecnologia no coinciden entre datos y assets
**What goes wrong:** El nombre de la tecnologia en los datos TypeScript no corresponde al archivo de logo disponible.
**Why it happens:** Los nombres en el PDF (ej: "Antifluido/Repelencia") no coinciden directamente con los nombres de archivo (ej: "LOGO_TECNOLOGIA_ANTIFLUIDO.png"). Ademas, hay tecnologias del PDF que NO tienen logo (ej: Algodon, Antimanchas, Solidez a la luz).
**How to avoid:** Crear un mapeo explicito tecnologia->archivo y marcar las que no tienen logo. Ver seccion "Datos Verificados" abajo.
**Warning signs:** Iconos faltantes o incorrectos en las fichas de tecnologia.

### Pitfall 6: "Punto" vs "PUNTO" en tipo de tejido
**What goes wrong:** El PDF usa inconsistentemente "Punto" (7 veces) y "PUNTO" (4 veces) para el mismo tipo de tejido. Si se copian tal cual, TypeScript los trata como strings diferentes.
**Why it happens:** Inconsistencia tipografica en el PDF original.
**How to avoid:** Normalizar a "Punto" en el tipo `WeaveType = 'Plano' | 'Punto'`. Transformar al ingresar datos.
**Warning signs:** Filtros por tipo de tejido que no encuentran todas las telas de punto.

## Code Examples

### Script de extraccion de imagenes del PDF
```bash
#!/bin/bash
# extract-images.sh - Extraer imagenes de producto del PDF
# Ejecutar desde la raiz del proyecto

PDF="Uniformes_Colegios.pdf"
OUT_DIR="public/images/products"
TEMP_DIR="/tmp/lafayette-extract"

mkdir -p "$OUT_DIR" "$TEMP_DIR"

# Paso 1: Extraer imagenes como PNG (CMYK -> RGB automatico)
# Paginas 4-12 contienen las fotos de producto
pdfimages -png -p -f 4 -l 12 "$PDF" "$TEMP_DIR/img"

# Paso 2: Componer imagen + mascara alfa con Pillow
python3 << 'PYEOF'
import os, glob
from PIL import Image

temp = "/tmp/lafayette-extract"
out = "public/images/products"

# Las imagenes vienen en pares: img-NNN-XXX.png (RGB) + img-NNN-YYY.png (mascara gris)
# Identificar pares por pagina y tamano
pngs = sorted(glob.glob(f"{temp}/img-*.png"))

# Agrupar por pagina
from collections import defaultdict
by_page = defaultdict(list)
for p in pngs:
    basename = os.path.basename(p)
    page = basename.split('-')[1]  # ej: "004"
    by_page[page].append(p)

for page, files in by_page.items():
    for i in range(0, len(files) - 1, 2):
        color_path = files[i]
        mask_path = files[i + 1]

        color = Image.open(color_path)
        mask = Image.open(mask_path).convert('L')

        # Solo componer si las dimensiones coinciden
        if color.size == mask.size:
            color = color.convert('RGBA')
            color.putalpha(mask)
            # Guardar como PNG con transparencia
            outname = f"page{page}-{i//2}.png"
            color.save(f"{out}/{outname}")
            print(f"Composited: {outname} ({color.size[0]}x{color.size[1]})")

PYEOF

# Paso 3: Convertir PNG a WebP
for f in "$OUT_DIR"/*.png; do
  name=$(basename "$f" .png)
  cwebp -q 80 "$f" -o "$OUT_DIR/$name.webp"
done

# Paso 4: Limpiar PNGs intermedios (mantener solo WebP)
# rm "$OUT_DIR"/*.png  # Descomentar despues de verificar calidad

echo "Extraccion completa. Verificar calidad en $OUT_DIR/"
```

### Modelo de datos - Technology con mapeo a assets
```typescript
// technologies.ts
import type { Technology } from './types';

export const TECHNOLOGIES = [
  {
    id: 'proteccion-solar',
    name: 'Proteccion Solar',
    icon: '/images/tech/proteccion-solar.png',
    description: 'Proteccion contra rayos UV',
  },
  {
    id: 'impermeabilidad',
    name: 'Impermeabilidad',
    icon: '/images/tech/impermeabilidad.png',
    description: 'Resistencia al agua',
  },
  {
    id: 'durabilidad',
    name: 'Durabilidad',
    icon: '/images/tech/durabilidad.png',  // Archivo: antirrasgado.png
    description: 'Resistencia al desgaste y rasgado',
  },
  {
    id: 'antifluido-repelencia',
    name: 'Antifluido/Repelencia',
    icon: '/images/tech/antifluido.png',
    description: 'Repelencia de fluidos',
  },
  {
    id: 'libertad-de-movimiento',
    name: 'Libertad de Movimiento',
    icon: '/images/tech/elasticidad-stretch.png',
    description: 'Elasticidad y comodidad',
  },
  {
    id: 'algodon',
    name: 'Algodon',
    icon: '',  // SIN LOGO DISPONIBLE
    description: 'Mezcla con algodon natural',
  },
  {
    id: 'desempeno',
    name: 'Desempeno',
    icon: '/images/tech/desempeno.png',
    description: 'Alto rendimiento textil',
  },
  {
    id: 'control-humedad',
    name: 'Control de Humedad',
    icon: '/images/tech/secado-rapido.png',
    description: 'Gestion de humedad y secado rapido',
  },
  {
    id: 'antibacterial',
    name: 'Antibacterial',
    icon: '/images/tech/antibacterial.png',
    description: 'Proteccion antibacteriana',
  },
  {
    id: 'antimanchas',
    name: 'Antimanchas',
    icon: '',  // SIN LOGO DISPONIBLE
    description: 'Resistencia a manchas',
  },
  {
    id: 'clororresistente',
    name: 'Clororresistente',
    icon: '/images/tech/clororresistente.png',
    description: 'Resistencia al cloro',
  },
  {
    id: 'termico',
    name: 'Termico',
    icon: '/images/tech/termico.png',
    description: 'Regulacion termica',
  },
  {
    id: 'solidez-a-la-luz',
    name: 'Solidez a la Luz',
    icon: '',  // SIN LOGO DISPONIBLE
    description: 'Resistencia a la decoloracion por luz',
  },
  {
    id: 'sostenible',
    name: 'Sostenible',
    icon: '/images/tech/sostenible-hilos-reciclados.png',
    description: 'Elaborado con hilos reciclados',
  },
] as const satisfies readonly Technology[];
```

### Renombrado de logos de tecnologia a kebab-case
```bash
#!/bin/bash
# rename-tech-logos.sh - Renombrar logos de Assets/ a public/images/tech/
SRC="Assets"
DEST="public/images/tech"
mkdir -p "$DEST"

# Mapeo explicito (original -> kebab-case)
cp "$SRC/LOGO_PROTECCIÓN_SOLAR.png" "$DEST/proteccion-solar.png"
cp "$SRC/LOGO_TECNOLOGIA_IMPERMEABLE.png" "$DEST/impermeabilidad.png"
cp "$SRC/LOGO_TECNOLOGIA_ANTIRRASGADO.png" "$DEST/durabilidad.png"
cp "$SRC/LOGO_TECNOLOGIA_ANTIFLUIDO.png" "$DEST/antifluido.png"
cp "$SRC/LOGO_TECNOLOGIA_ELASTICIDAD_STRETCH.png" "$DEST/elasticidad-stretch.png"
cp "$SRC/LOGO_TECNOLOGIA_DESEMPEÑO.png" "$DEST/desempeno.png"
cp "$SRC/LOGO_TECNOLOGIA_SECADO RÁPIDO.png" "$DEST/secado-rapido.png"
cp "$SRC/LOGO_TECNOLOGIA_ANTIBACTERIAL.png" "$DEST/antibacterial.png"
cp "$SRC/LOGO_TECNOLOGIA_CLORORRESISTENTE.png" "$DEST/clororresistente.png"
cp "$SRC/LOGO COBRANDING LAFTECH TÉRMICOS APLICACION_2_Mesa de trabajo 1.png" "$DEST/termico.png"
cp "$SRC/LOGO_TECNOLOGIA_SOSTENIBLE_HILOS_RECICLADOS.png" "$DEST/sostenible-hilos-reciclados.png"

# Logos adicionales (no tecnologia)
cp "$SRC/LOGO_PRINCIPAL_LAFAYETTE.png" "public/images/logo-lafayette.png"
cp "$SRC/LOGO_LAFTECH.png" "$DEST/laftech.png"

echo "13 logos copiados y renombrados a kebab-case"
```

## Verified Data

### Conteo exacto de entidades (verificado contra el PDF)

| Entidad | Conteo | Notas |
|---------|--------|-------|
| Telas unicas | 31 | 31 codigos BASE unicos (no ~40 como se estimaba) |
| Apariciones totales | 43 | 12 telas se repiten en multiples categorias |
| Categorias | 8 | Nombres exactos del PDF |
| Tecnologias en telas | 14 | Algunas con variacion de nombre (Antifluido/repelencia vs Antifluido/Repelencia) |
| Logos de tecnologia disponibles | 11 | 3 tecnologias SIN logo: Algodon, Antimanchas, Solidez a la Luz |
| Rutas de estampacion | 4 | Unicolor, Rotativa, Davos, Sublimacion |
| Tipos de tejido | 2 | Plano (28 apariciones), Punto (15 apariciones - normalizar PUNTO->Punto) |
| Telas marcadas "NUEVA" | 2 | Apolo (33622) y Celta (33615) |
| Logos totales en Assets/ | 13 | 11 tecnologia + 1 Lafayette principal + 1 Laftech |

### Mapeo tecnologia -> archivo de logo

| Tecnologia (PDF) | Archivo Logo | Disponible |
|-------------------|-------------|------------|
| Proteccion Solar | LOGO_PROTECCION_SOLAR.png | SI |
| Impermeabilidad | LOGO_TECNOLOGIA_IMPERMEABLE.png | SI |
| Durabilidad / Resistencia | LOGO_TECNOLOGIA_ANTIRRASGADO.png | SI |
| Antifluido/Repelencia | LOGO_TECNOLOGIA_ANTIFLUIDO.png | SI |
| Libertad de Movimiento | LOGO_TECNOLOGIA_ELASTICIDAD_STRETCH.png | SI |
| Algodon | -- | NO |
| Desempeno | LOGO_TECNOLOGIA_DESEMPENO.png | SI |
| Control de Humedad | LOGO_TECNOLOGIA_SECADO RAPIDO.png | SI |
| Antibacterial | LOGO_TECNOLOGIA_ANTIBACTERIAL.png | SI |
| Antimanchas | -- | NO |
| Clororresistente | LOGO_TECNOLOGIA_CLORORRESISTENTE.png | SI |
| Termico | LOGO COBRANDING LAFTECH TERMICOS...png | SI |
| Solidez a la Luz | -- | NO |
| Sostenible | LOGO_TECNOLOGIA_SOSTENIBLE_HILOS_RECICLADOS.png | SI |

### Dimensiones de logos de tecnologia
Todos los logos son ~945x828px PNG excepto:
- LOGO_TECNOLOGIA_IMPERMEABLE.png: 962x844px
- LOGO_LAFTECH.png: 812x198px (es un logo horizontal, no un icono de tecnologia)

### Imagenes de producto del PDF
- Paginas 4-12: 14 imagenes de producto >=1200px de ancho (muchas son 2240x3360 o 2016x3024)
- Espacio de color: CMYK (requiere conversion a RGB)
- Transparencia: SI - mascaras alfa con valores 0-255 (transparencia real, no binaria)
- Calidad: ALTA - todas superan con creces el minimo de 400px

### Las 8 categorias exactas del PDF

| # | Nombre Exacto (PDF) | Slug Propuesto | Color | Telas |
|---|---------------------|----------------|-------|-------|
| 1 | Sudaderas - Chaquetas - Pantalones | sudaderas-chaquetas-pantalones | #1B3A5C | 9 |
| 2 | Camisetas - Polos | camisetas-polos | #3FA9D5 | 5 |
| 3 | Uniforme Deportivo | uniforme-deportivo | #6CB33F | 4 |
| 4 | Uniforme Diario - Faldas - Blazers | uniforme-diario-faldas-blazers | #E91E8C | 6 |
| 5 | Buzos - Hoodies - Perchados | buzos-hoodies-perchados | #F7C948 | 4 |
| 6 | Chaquetas Prom | chaquetas-prom | #C42034 | 5 |
| 7 | Blusas - Camisas | blusas-camisas | #7B4B94 | 4 |
| 8 | Delantales - Batas de Laboratorio | delantales-batas-laboratorio | #F7941D | 6 |

**Nota sobre nombres de categoria:** Los subtitulos entre parentesis en el PDF (ej: "(Camisetas y Pantalonetas)" para Uniforme Deportivo) se almacenan como `description` opcional, no como parte del nombre principal.

### Las 31 telas unicas con sus codigos BASE

| Nombre | BASE | Tejido | Categorias |
|--------|------|--------|------------|
| Vendaval Crushed R | 23243 | Plano | 1 |
| Orion Clororresistente | 22564 | Plano | 1, 6, 8 |
| Gorek | 23093 | Plano | 1, 8 |
| Glou Crushed | 23091 | Plano | 1 |
| T180 | 22329 | Plano | 1, 8 |
| Universal Clororresistente | 22967 | Plano | 1, 6, 8 |
| Microtec Clororresistente | 22280 | Plano | 1, 6 |
| Microprince | 22149 | Plano | 1 |
| Fastrack | 33510 | Punto | 1, 5 |
| Apolo (NUEVA) | 33622 | Punto | 2 |
| Polux | 33470 | Punto | 2 |
| Zanetti | 33413 | Punto | 2 |
| Tikal R | 33583 | Punto | 2 |
| Cole Plus | 44672 | Punto | 2 |
| Montesimone R Antibacterial | 33590 | Punto | 3 |
| Montesimone | 33003 | Punto | 3 |
| Hydrotech | 33455 | Punto | 3 |
| Hydrotech Antibacterial | 33472 | Punto | 3 |
| Stefano R | 23195 | Plano | 4 |
| Dynamic | 22587 | Plano | 4 |
| Microdrill | 22215 | Plano | 4, 8 |
| Alviero Stretch | 22528 | Plano | 4, 6, 8 |
| Novastretch LC | 23156 | Plano | 4 |
| Universal Ripstop | 22240 | Plano | 4 |
| Celta (NUEVA) | 33615 | Punto | 5, 6 |
| Dual | 44665 | Punto | 5 |
| Microtitn Plus | 33492 | Punto | 5 |
| Metro LC | 22396 | Plano | 7 |
| Queen | 22693 | Plano | 7 |
| Andes R | 23192 | Plano | 7 |
| Alessio | 22293 | Plano | 7 |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tipos con type assertions (`as Type`) | `as const satisfies Type` | TypeScript 4.9+ (2022) | Preserva tipos literales Y valida estructura al mismo tiempo |
| Imagenes en `/public` referenciadas por string | Static imports con `next/image` para width/height automatico | Next.js 13+ | Builds mas seguros, pero para contenido estatico bulk `/public` con strings es aceptable |
| JSON archivos + esquemas JSON Schema | TypeScript constantes tipadas | N/A | Validacion en compile-time, autocomplete, refactoring seguro |

**Deprecated/outdated:**
- `next/legacy/image`: Reemplazado por `next/image` (App Router). No usar.
- `satisfies` sin `as const`: Pierde los tipos literales. Siempre combinar ambos para datos estaticos.

## Open Questions

1. **Identificacion de imagenes por tela**
   - What we know: Las paginas 4-12 contienen 14 imagenes de producto grandes (>1200px). Hay 31 telas unicas.
   - What's unclear: Cada pagina del PDF tiene 1-2 imagenes de producto que cubren multiples telas. No hay una imagen 1:1 por tela. Habra que mapear manualmente que imagen corresponde a que tela(s), o usar una imagen por pagina de categoria.
   - Recommendation: Durante la extraccion, nombrar por pagina (ej: `page04-0.webp`, `page04-1.webp`). Luego mapear manualmente a telas en los datos TypeScript. Algunas telas compartiran imagen.

2. **Tecnologias sin logo (Algodon, Antimanchas, Solidez a la Luz)**
   - What we know: 3 de las 14 tecnologias que aparecen en los datos de telas NO tienen archivo de logo en Assets/.
   - What's unclear: Si Lafayette tiene estos logos y no los incluyo, o si deliberadamente no existen.
   - Recommendation: Definir `icon: ''` (string vacio) en el modelo de datos. La UI (fases posteriores) debera manejar este caso mostrando solo texto o un icono placeholder generico.

3. **Mapeo exacto Durabilidad vs Resistencia**
   - What we know: El PDF usa "Durabilidad" en unas telas y "Resistencia" en Universal Ripstop. El logo se llama "ANTIRRASGADO".
   - What's unclear: Si son la misma tecnologia con diferente nombre o son dos tecnologias distintas.
   - Recommendation: Tratar como la misma tecnologia con ID `durabilidad` y logo `antirrasgado.png`. Si el usuario corrige, es facil separar.

4. **Imagenes de la seccion Personalización y Cuellos**
   - What we know: Las paginas 15-17 tienen contenido de Personalizacion y Cuellos con imagenes propias (paginas 13, 15-19 del PDF).
   - What's unclear: Si se necesitan imagenes adicionales de esas secciones para esta fase o se extraen en una fase posterior.
   - Recommendation: Extraer todas las imagenes relevantes ahora (paginas 4-19) para evitar re-ejecutar el pipeline. Las secciones de contenido estan en Phase 6 pero los assets estaran listos.

## Sources

### Primary (HIGH confidence)
- **PDF Uniformes_Colegios.pdf** - Analizado directamente con `pdftotext` y `pdfimages -list`. Todos los datos de telas, tecnologias, categorias y dimensiones de imagenes verificados contra el PDF real.
- **Assets/ directory** - Inspeccionados directamente con `ls` y `sips`. Dimensiones y nombres de archivo verificados.
- **Proyecto existente** - `package.json`, `tsconfig.json`, `globals.css`, `layout.tsx` leidos directamente. TypeScript 5.9.3, Next.js 16.1.6, sharp instalado.

### Secondary (MEDIUM confidence)
- **TypeScript `as const satisfies`** - Patron bien documentado desde TS 4.9, verificado funcional con TS 5.9.3 del proyecto.
- **pdfimages CMYK->RGB** - Verificado empiricamente: `pdfimages -png` produce PNG en espacio RGB (confirmado con `sips -g space`). Composicion de alfa verificada con Pillow.
- **cwebp conversion** - Verificado empiricamente: conversion PNG->WebP funciona correctamente (150KB output para imagen de 2016x3024).

### Tertiary (LOW confidence)
- **Mapeo tecnologia "Durabilidad" = "Resistencia" = logo "Antirrasgado"** - Inferencia basada en contexto. Necesita confirmacion del usuario.
- **Que imagenes del PDF corresponden a que telas** - Las paginas tienen imagenes de multiples prendas, el mapeo exacto tela-imagen requiere inspeccion visual manual.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Todo verificado localmente, herramientas ya instaladas y probadas
- Architecture: HIGH - Patron `as const satisfies` es bien conocido, estructura modular es directa
- Data extraction: HIGH - Pipeline completo probado empiricamente (pdfimages -> Pillow -> cwebp)
- Data modeling: HIGH - 31 telas, 8 categorias, 14 tecnologias contados y verificados contra el PDF
- Pitfalls: HIGH - Todos descubiertos empiricamente (CMYK, smask, inconsistencia de nombres)
- Image-to-fabric mapping: LOW - Requiere inspeccion visual manual, no automatizable

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (datos estaticos, no cambian)
