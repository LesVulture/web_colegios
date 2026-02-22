# Phase 7: Content Section Pages - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Las 3 paginas restantes del menu principal (/tecnologias, /personalizacion, /cuellos) pasan de placeholders vacios a contenido real del PDF. Los datos ya existen en TypeScript (technologies.ts, personalization.ts, collars.ts). Esta fase construye las paginas que los presentan.

</domain>

<decisions>
## Implementation Decisions

### Grid de Tecnologias
- Cross-navigation: cada tecnologia debe listar las telas que la usan, con links navegables a las fichas de tela
- Las telas ya tienen `technologies` array en sus datos — se puede hacer lookup inverso

### Showcase de Personalizacion
- Solo mostrar las 4 opciones directamente, sin texto introductorio ni contexto adicional
- Las imagenes reales existen (page15-93/94/95/96.webp en /images/content/)
- La personalizacion depende de la tela — algunas opciones solo aplican a ciertas telas. Las telas ya tienen `stampingRoutes` pero el mapeo a las 4 opciones de personalizacion no es directo — el researcher debe investigar como vincularlos

### Tabla de Cuellos y Tallas
- No hay imagenes de cuellos — pagina puramente informativa con colores y tablas
- Las dos tablas de tallas (Ninos y Adolescentes/Adultos) deben mostrarse simultaneamente, ambas visibles sin tabs
- Datos disponibles: 4 colores con hex codes, medidas de cuello y puno por talla, material, garantia, tecnologias asociadas, notas comerciales

### Consistencia y Navegacion
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

</decisions>

<specifics>
## Specific Ideas

- Las paginas se usan en reuniones comerciales — el vendedor navega y muestra al cliente. Debe verse profesional e impresionante, no como una hoja de datos
- Componentes existentes reutilizables: TechIcon, CategoryHeader, Breadcrumb, FabricCard (adaptable)
- Grid patterns y CSS-only tooltips ya implementados en fichas de tela

</specifics>

<deferred>
## Deferred Ideas

- Mapeo explicito de stampingRoutes a opciones de personalizacion por tela — si el researcher identifica que es viable, incluir en esta fase; si requiere cambios de modelo de datos significativos, diferir a fase futura
- Paginas individuales por tecnologia con catalogo de telas asociadas (ya listado como ADV-05 en v2)

</deferred>

---

*Phase: 07-content-section-pages*
*Context gathered: 2026-02-22*
