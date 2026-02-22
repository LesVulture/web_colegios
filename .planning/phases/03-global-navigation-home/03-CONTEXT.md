# Phase 3: Global Navigation & Home - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Header global con logo Lafayette y menú de 4 secciones principales, home page con hero y grid de 4 items, y página intermedia `/usos` con grid de 8 categorías de uso. No incluye las páginas individuales de categoría (Phase 4) ni las secciones de contenido (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Header y navegación
- Items del menú con texto + iconos representativos para cada sección (Usos, Tecnologías, Personalización, Cuellos)
- Comportamiento del header en tablet: hamburger menu (patrón de despliegue a criterio de Claude)

### Claude's Discretion — Header
- Header sticky vs estático (considerar contexto de presentación en reunión)
- Fondo del header (sólido, transparente, o adaptativo)
- Patrón de despliegue del menú mobile/tablet (sidebar, dropdown, overlay)

### Hero y home page
- Hero con foto grande de uniformes escolares como visual principal
- Branding "Lafayette Uni For Me Colegios" sobre el hero
- Sin call-to-action / botón en el hero — solo branding visual
- Grid de 4 secciones: cards con imagen de fondo representativa de cada sección
- Layout del grid: 4 columnas en fila (horizontal) en desktop

### Grid de categorías /usos
- Layout: 4 columnas x 2 filas para las 8 categorías en desktop
- Cards con fondo completo del color distintivo de cada categoría
- Página /usos va directo al grid, sin intro ni hero — solo título y cards

### Claude's Discretion — Cards /usos
- Información mostrada en cada card de categoría (nombre, imagen, conteo de telas — lo que sea más útil para el vendedor)

### Tono visual general
- Estética vibrante y colorida — los 8 colores de categoría como protagonistas
- Balance imagen-texto en el layout (ni imágenes dominantes ni solo texto)
- Densidad de contenido: punto medio — suficiente espacio sin desperdiciar pantalla
- Referencia visual: el PDF original de Lafayette como base, pero modernizado para web

</decisions>

<specifics>
## Specific Ideas

- "Quiero que el sitio se sienta como una versión digital del PDF actual de Lafayette, pero modernizada" — mantener la identidad visual del catálogo existente
- Los 8 colores de categoría deben ser protagonistas visuales en todo el sitio, especialmente en /usos
- El vendedor debe poder navegar rápido: header con iconos para reconocimiento inmediato, /usos directo al grid sin introducción

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-global-navigation-home*
*Context gathered: 2026-02-21*
