# Phase 5: Tech Debt & Data Foundation - Context

**Gathered:** 2026-02-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Resolver deuda técnica de v1.0 (imágenes 404, nav bugs, dependencias muertas, iconos faltantes) y crear los modelos de datos completos para Personalización, Cuellos y Tecnologías expandidas. No hay UI nueva — esta fase entrega un data layer correcto y completo que alimenta las fases 6 y 7.

</domain>

<decisions>
## Implementation Decisions

### Datos de Personalización (DATA-01)
- Modelo básico: nombre + descripción + imagen por cada opción
- 4 opciones: dibujos exclusivos, estampación digital, tipo Davos, desarrollo de color
- Todas las opciones tienen imagen asociada en el PDF (p.15) — deben ser extraídas del PDF
- Descripciones: texto literal del PDF, sin resumir ni adaptar

### Datos de Cuellos (DATA-02)
- Colores mostrados como swatches visuales (círculos de color + nombre), no lista de texto
- Valores hex deben aproximarse visualmente del PDF (no hay códigos hex explícitos)
- Tabla de tallas: dos grupos confirmados — niños y adolescentes/adultos
- Info comercial: Claude decide qué incluir según lo que aparezca relevante en pp.16-17

### Contenido de Tecnologías (DATA-03)
- Descripciones expandidas: texto literal del PDF (p.14), sin resumir
- Incluir relación inversa: cada tecnología lista qué telas la usan (facilita navegación cruzada)
- No distinguir tecnologías propias vs estándar — tratarlas todas igual
- Claude verifica cuáles tecnologías tienen icono en el PDF y cuáles no

### Iconos de Tecnología (DEBT-06)
- Los iconos SÍ existen en el PDF (p.14) — la tarea es extraerlos, no inventar fallbacks
- Extraer iconos reales del PDF para las tecnologías faltantes (algodón, antimanchas, solidez a la luz)
- Si la extracción produce calidad ilegible: usar icono Lucide representativo como fallback
- Formato de extracción: Claude decide (SVG si posible, PNG/WebP si no)

### Claude's Discretion
- Formato de iconos extraídos (SVG vs PNG/WebP según calidad)
- Qué información comercial incluir en el modelo de cuellos
- Verificar cuáles tecnologías tienen icono propio en el PDF
- Estructura exacta de la relación inversa tecnología→telas

</decisions>

<specifics>
## Specific Ideas

- "Usa los iconos que están en la página 14 del PDF" — el usuario confirma que los iconos existen, solo falta extraerlos
- Swatches de color para cuellos — presentación visual tipo color picker, no lista textual
- Todo el contenido textual (descripciones de personalización, tecnologías) debe ser literal del PDF, no adaptado

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-tech-debt-data-foundation*
*Context gathered: 2026-02-22*
