# Phase 4: Category Pages - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

8 páginas de categoría de uso accesibles vía `/uso/[slug]`, cada una mostrando las telas de esa categoría en un grid visual con color-coding por categoría. El vendedor navega entre categorías para mostrar opciones de telas durante reuniones con colegios. Las fichas técnicas completas de cada tela son Fase 5.

</domain>

<decisions>
## Implementation Decisions

### Diseño del product card
- Proporción imagen vs texto: Claude's discretion (elegir lo que mejor se vea)
- Chips de tecnología: badges con texto visible (no solo íconos). Cada chip muestra el nombre de la tecnología aplicable
- Hover: sombra/elevación sutil — la card sube ligeramente. Feedback profesional sin ser intrusivo
- Clic en card: enlaza a `/uso/[cat]/[tela]` (ruta de ficha técnica). En Fase 4 será placeholder, en Fase 5 tendrá la ficha completa

### Header de categoría
- Estilo del hero: Claude's discretion (elegir el estilo que mejor se integre con el diseño general)
- Descripción de categoría: Claude's discretion (decidir si incluir descripción breve o solo nombre + conteo)
- Imagen hero: Claude's discretion (elegir según las imágenes disponibles)
- Breadcrumb visible: SÍ, tipo "Usos > Sudaderas" arriba del header. Navegación de retorno clara

### Flujo entre categorías
- Sidebar con lista de las 8 categorías para cambio rápido sin volver a `/usos`
- Sidebar siempre visible vs colapsable: Claude's discretion (decidir según el layout disponible)
- Estilo del sidebar (indicador de color vs texto): Claude's discretion
- Comportamiento tablet del sidebar: Claude's discretion (elegir la mejor adaptación responsive)

### Estados y loading
- Loading de imágenes: skeleton cards con shimmer animation (imitando la forma de la card final)
- Categorías con pocas telas: Claude's discretion (decidir si cards más grandes o mantener tamaño estándar)
- Conteo de telas en header: Claude's discretion
- Animación de entrada de cards: Claude's discretion

### Claude's Discretion
El usuario delegó las siguientes decisiones de diseño visual:
- Proporción imagen/texto en cards
- Estilo del hero header (full-width vs contenido)
- Inclusión y contenido de descripción de categoría
- Tipo de imagen hero
- Sidebar visible vs colapsable y su styling
- Adaptación tablet del sidebar
- Manejo visual de categorías con pocas telas
- Conteo de telas en header
- Animaciones de entrada

</decisions>

<specifics>
## Specific Ideas

- El sitio es una herramienta de ventas para reuniones presenciales con colegios — el vendedor presenta telas en laptop/tablet
- El sidebar de categorías debe facilitar la navegación rápida durante la presentación (el vendedor salta entre categorías según la conversación)
- Los chips de tecnología deben ser legibles para el cliente del colegio que ve la pantalla junto al vendedor
- La ruta de ficha técnica ya debe existir como placeholder en Fase 4 para que el link funcione

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-category-pages*
*Context gathered: 2026-02-22*
