# Phase 6: Fabric Detail Pages - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Fichas técnicas completas de cada tela con specs, tecnologías, badges y navegación cruzada. El vendedor muestra al cliente la información técnica de cualquier tela durante la reunión comercial. La página es principalmente de lectura/presentación.

</domain>

<decisions>
## Implementation Decisions

### Layout de la ficha
- **Sin imagen por tela individual** — Las imágenes actuales son genéricas (misma foto de estudiantes repetida para todas las telas de una categoría). NO incrustar imagen en la ficha de detalle de cada tela. La imagen de uso ya se ve a nivel de categoría.
- Diseño centrado en specs técnicas con buenas prácticas de UI/UX, sin repetir la misma foto para Vendaval Crush, Orion, Gorek, etc.
- Botón de "volver a categoría" prominente para navegación rápida durante la reunión
- Breadcrumb completo arriba (Usos > Sudaderas > Vendaval Crush) + botón de volver separado

### Specs técnicas
- Formato **tabla de propiedades** de 2 columnas (propiedad | valor): composición, gramaje (g/m²), ancho (cm), tipo de tejido (Plano/Punto), base
- Rutas de estampación (Unicolor, Rotativa, Davos, Sublimación) mostradas como **tags/chips separados** debajo de la tabla de specs — no dentro de la tabla
- Los datos existentes son suficientes, no se necesitan campos adicionales

### Tecnologías y tooltips
- Tooltips CSS-only al hacer hover con nombre y descripción de la tecnología
- Debe funcionar en **laptop (hover) y tablet (tap)** — mix de dispositivos en reuniones de ventas
- Telas marcadas como nuevas (`isNew`) muestran badge "Nuevo" visible

### Claude's Discretion
- Layout general (dos columnas vs imagen arriba): Claude elige lo más apropiado dado que no hay imagen por tela
- Tono visual (ficha técnica vs e-commerce): Claude decide lo que mejor encaje con el sitio existente
- Imagen con zoom o estática: decisión de Claude según practicidad
- Formato de tecnologías (chips con tooltip vs lista): Claude elige lo que mejor comunique
- Nivel de detalle del tooltip (descripción corta vs expandida): Claude decide
- Visibilidad de descripciones de tecnología (tooltip-only vs siempre visible): Claude decide
- Ubicación de navegación cruzada (final de ficha vs junto a info principal): Claude elige
- Destino de links cruzados (categoría vs misma tela en otra categoría): Claude decide
- Comportamiento cuando tela tiene solo 1 categoría (ocultar sección vs mostrar): Claude decide
- Posición y estilo del badge "Nuevo": Claude decide
- Loading skeleton, spacing, tipografía exacta

</decisions>

<specifics>
## Specific Ideas

- El vendedor mostró que la imagen actual de las FabricCards es la misma foto genérica de estudiantes para todas las telas de una categoría (screenshot adjunto). No aporta valor repetirla en cada ficha individual.
- Para las categorías/usos (Sudaderas, Chaquetas, Pantalones), la imagen general a nivel de categoría es suficiente. La ficha individual se enfoca en datos técnicos.
- La ficha debe permitir navegación rápida de vuelta a la categoría — contexto de reunión comercial donde el vendedor navega entre telas frecuentemente.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-fabric-detail-pages*
*Context gathered: 2026-02-22*
