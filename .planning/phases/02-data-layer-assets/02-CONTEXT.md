# Phase 2: Data Layer & Assets - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Modelar todo el contenido del catálogo Lafayette Uni For Me Colegios como datos TypeScript tipados (~40 telas, 8 categorías, 12-13 tecnologías) y extraer/optimizar las imágenes de producto desde el PDF de 37MB para uso con next/image. No incluye UI, navegación ni presentación visual.

</domain>

<decisions>
## Implementation Decisions

### Fuente de imágenes
- El PDF de 37MB es la ÚNICA fuente de imágenes de producto — no hay originales aparte
- Las imágenes son fotos de producto (prendas confeccionadas), no swatches de textura
- Si la calidad extraída es baja (menos de 400px), se usan como estén — lo importante es que la imagen esté presente
- Los 13 logos de tecnología YA EXISTEN como archivos PNG separados con nombres legibles (no se extraen del PDF)

### Datos del catálogo
- Todas las ~40 telas tienen datos COMPLETOS en el PDF: nombre, composición, tejido, peso, ancho, tecnologías, rutas de estampación
- "Rutas de estampación" son TIPOS de estampación compatibles (sublimación, serigrafía, etc.), no paths de archivo
- Cada tela tiene un subconjunto específico de tecnologías aplicables (no todas aplican a todas)
- La web muestra EXACTAMENTE la misma información del PDF, sin contenido adicional (sin descripciones de marketing ni datos extras)

### Relación tela-categoría
- Una tela puede pertenecer a MÚLTIPLES categorías de uso (relación muchos-a-muchos)
- No hay categoría "principal" — todas las categorías de una tela son iguales
- Las 8 categorías y sus nombres exactos se toman del PDF
- El mapeo tela→categoría está EXPLÍCITO en el PDF (no requiere inferencia)

### Convenciones de nombres
- Los nombres de telas se muestran TAL CUAL aparecen en el PDF, sin modificaciones
- Los nombres de categorías se muestran TAL CUAL del PDF, sin simplificar
- Cada tela tiene un CÓDIGO BASE único en el PDF que sirve como identificador
- Los 13 logos de tecnología son PNG con nombres legibles, listos para renombrar a kebab-case

### Claude's Discretion
- Estructura de archivos TypeScript (un archivo monolítico vs módulos separados)
- Método de extracción de imágenes del PDF
- Formato de optimización de imágenes (WebP/AVIF)
- Convención de slugs internos generados a partir de los nombres del PDF

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Los datos se toman exactamente como están en el PDF.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-data-layer-assets*
*Context gathered: 2026-02-21*
