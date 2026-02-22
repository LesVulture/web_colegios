# Phase 1: Project Foundation - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffolding de Next.js 16 con App Router, design system con tokens de 8 colores de categoría en Tailwind v4, y paleta de marca Lafayette. El proyecto queda con `bun run dev` funcional, TypeScript estricto, y un design system listo para construir componentes en fases posteriores. No se construyen páginas ni componentes de UI visibles — solo la base técnica y los tokens de diseño.

</domain>

<decisions>
## Implementation Decisions

### Personalidad visual
- Estilo **catálogo editorial**: se siente como hojear una revista de producto, con protagonismo de las imágenes
- Densidad **híbrida**: páginas de navegación (home, categorías) respiradas y espaciadas; páginas de detalle/fichas más densas con información técnica
- **Producto protagonista**: el branding Lafayette está presente pero discreto. El foco visual son las telas, imágenes y colores de categoría, no el logo o colores corporativos
- Sin referencia visual específica — Claude interpreta el estilo editorial con densidad híbrida

### Tipografía
- Fuentes elegidas por el usuario: **Raleway** y **Montserrat** (ambas sans-serif geométricas, Google Fonts)
- Claude decide la combinación óptima (cuál para headings, cuál para cuerpo) priorizando legibilidad de specs técnicas
- Títulos **funcionales y claros**: legibles pero no exagerados, el foco queda en el contenido
- No hay fuente corporativa Lafayette — Raleway/Montserrat aplican a todo el sitio

### Uso de color
- Fondo base **claro** (blanco/gris muy claro). Los colores de categoría y las imágenes resaltan sobre fondo limpio
- **Color-coding fuerte** por categoría: cada categoría tiñe visualmente su página (header con fondo de color, bordes, chips coloreados). Inmersión visual por categoría
- Rojo acento Lafayette usado como **branding sutil**: solo en logo y pequeños detalles de marca, NO como color funcional de UI (no en botones ni CTAs)
- Los 8 colores de categoría + azul/rojo de marca se **extraen del PDF** del catálogo durante implementación

### Estilo de componentes
- Bordes **redondeados y suaves** (border-radius generoso 12-16px). Se siente moderno y amigable
- Superficies **flat con borde**: sin box-shadow, delimitación por borde sutil. Limpio y minimal
- Chips de tecnología **neutros** (gris/outline): no compiten visualmente con los colores de categoría ni las imágenes
- **Sin animaciones**: todo instantáneo. Velocidad pura para que el vendedor navegue rápido sin esperar transiciones

### Claude's Discretion
- Combinación exacta de Raleway/Montserrat (headings vs body)
- Escala tipográfica (sizes, weights, line-heights)
- Valor exacto del border-radius (dentro del rango 12-16px)
- Estilo del borde en superficies (color, grosor)
- Espaciado interno de componentes base

</decisions>

<specifics>
## Specific Ideas

- El usuario mencionó Raleway y Montserrat como fuentes preferidas — ambas de Google Fonts, no requieren licencia
- El PDF de 37MB es la fuente de verdad para los colores (8 de categoría + azul oscuro + rojo acento)
- "Catálogo editorial" como referencia de sensación — tipo revista de producto, no dashboard ni landing page
- "Producto protagonista" — las telas y sus imágenes son lo que importa, Lafayette es el marco discreto

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-foundation*
*Context gathered: 2026-02-21*
