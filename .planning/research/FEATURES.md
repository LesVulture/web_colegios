# Feature Research

**Domain:** Catálogo de producto textil para habilitación de ventas (sales enablement) — uniformes escolares
**Researched:** 2026-02-21
**Confidence:** MEDIUM-HIGH (dominio B2B de nicho; pocas referencias directas de catálogos textiles para sales enablement, pero patrones UX de catálogos B2B y herramientas de ventas están bien documentados)

## Feature Landscape

### Table Stakes (El Vendedor Espera Esto)

Features que el vendedor asume que existen. Si faltan, la herramienta se siente incompleta y vuelve al PDF.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Navegación por categorías de uso** | El vendedor piensa en "¿qué necesita este colegio?" (sudaderas, camisetas, etc.), no en nombres de tela. Las 8 categorías son el modelo mental del vendedor. | LOW | Rutas estáticas `/categoria/[slug]`. Color distintivo por categoría (ya definido en PROJECT.md). Menú principal con las 8 categorías. |
| **Fichas técnicas de tela (Product Detail)** | Cada tela necesita mostrar composición, gramaje, tecnologías, usos. El vendedor responde preguntas técnicas del cliente en la reunión. Sin esto, abre el PDF. | MEDIUM | Componente reutilizable `FabricCard` con: nombre, composición, gramaje (si disponible), tecnologías (iconos), categorías de uso. Datos estáticos del PDF. |
| **Product cards responsivos en grid** | Dentro de cada categoría, las telas se presentan en tarjetas escaneables. El vendedor necesita ver de un vistazo todas las opciones para una categoría. | LOW | Grid responsive (3 cols desktop, 2 cols tablet). Imagen, nombre de tela, chips de tecnologías. Patrón bien documentado con CSS Grid/Tailwind. |
| **Imágenes de producto** | Las fotos del PDF son la referencia visual que el vendedor muestra al cliente. Sin imágenes el catálogo pierde toda su utilidad como herramienta de presentación. | LOW | Extraer del PDF. next/image con optimización. Una imagen principal por tela como mínimo. |
| **Sección de Tecnologías Textiles** | El vendedor explica ventajas competitivas de Lafayette con las 12 tecnologías (Protección Solar, Antibacterial, etc.). Es argumento de venta clave. | LOW | Página `/tecnologias` con grid de 12 cards con icono (assets ya disponibles) + descripción. |
| **Sección de Personalización** | Las 4 opciones de personalización (estampación digital, dibujos exclusivos, etc.) son un diferenciador comercial que el vendedor debe poder mostrar. | LOW | Página `/personalizacion` con 4 bloques descriptivos + imágenes del PDF. |
| **Sección de Cuellos** | Complemento para polos. Colores, tallas, info comercial. El vendedor necesita mostrar opciones disponibles. | LOW | Página `/cuellos` con tabla de tallas y colores disponibles. |
| **Header global con logo y navegación** | Branding Lafayette siempre visible. Navegación rápida entre secciones. Estándar de cualquier sitio web profesional. | LOW | Logo top-left (12px offset, per PROJECT.md). Nav responsive desktop/tablet. |
| **Home page con hero y acceso a categorías** | Punto de entrada profesional. El vendedor abre el sitio y el cliente ve marca + estructura clara. Acceso rápido a cualquier categoría. | MEDIUM | Hero de marca "Uni For Me Colegios" + grid de 8 categorías con color e imagen representativa. Primer impresión cuenta en reuniones. |
| **Diseño desktop-first, responsive a tablet** | El vendedor usa laptop en la reunión, ocasionalmente tablet. Debe funcionar bien en ambos. No se necesita mobile phone. | LOW | Tailwind con breakpoints `lg` (desktop) y `md` (tablet). Ignorar `sm`/mobile. |
| **Color-coding por categoría** | Cada categoría tiene su color distintivo (definido en PDF). Orientación visual inmediata para el vendedor y el cliente. | LOW | CSS variables o Tailwind config con los 8 colores del PROJECT.md. Aplicar en headers, bordes de cards, fondos de sección. |
| **Carga rápida** | En reuniones no hay paciencia para esperas. El sitio debe cargar en < 2 segundos. | LOW | Next.js SSG (Static Site Generation) por defecto. Imágenes optimizadas. Datos estáticos = no hay fetching. |

### Differentiators (Ventaja Competitiva)

Features que elevan la herramienta por encima de "un PDF en pantalla". No las esperan, pero las valoran.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Filtrado por tecnología/propiedad** | El cliente pregunta "¿qué telas tienen protección solar?" o "¿qué opciones son clororresistentes?". El vendedor puede filtrar instantáneamente en vez de hojear el PDF. Reduce el tiempo de búsqueda en reunión de minutos a segundos. | MEDIUM | Filtros laterales o superiores en páginas de categoría. Filtros: por tecnología (chips multi-select con iconos). Client-side filtering (datos estáticos, no API). Referencia: Klopman tiene "Fabric Finder" con filtros por categoría, tipo, peso y key features. |
| **Navegación cruzada tela-categoría** | Una tela puede aparecer en múltiples categorías (ej: "Alviero Stretch" en Uniforme Diario y Chaquetas Prom). El vendedor necesita navegar bidireccionalmente: desde la tela ver en qué categorías aplica, y desde la categoría ver todas las telas. | MEDIUM | Tags de categoría en la ficha de tela clickeables. Breadcrumbs contextuales. Requiere modelo de datos que soporte relación muchos-a-muchos (tela-categoría). |
| **Galería de imágenes con zoom** | Mostrar la textura de la tela en detalle al cliente. Múltiples ángulos o aplicaciones de la misma tela. | MEDIUM | Lightbox/modal con zoom. Dependiente de la calidad de imágenes extraídas del PDF (limitante real). Si solo hay 1 imagen por tela, el zoom solo es útil. Baymard Institute recomienda: full-screen option, numbering, zoom capability. |
| **Modo offline / PWA** | En reuniones en colegios rurales o con WiFi inestable, el vendedor necesita que el catálogo funcione sin conexión. Diferenciador real vs. abrir el PDF (que sí funciona offline). | MEDIUM-HIGH | Next.js + Service Worker (Serwist o next-pwa). Cache-first strategy para todo el contenido estático. Pre-cache de imágenes y páginas en install. IndexedDB no necesario (no hay datos dinámicos). Verificado: Next.js tiene guía oficial de PWA. |
| **Transiciones y animaciones sutiles** | Sensación de producto digital premium vs. PDF estático. Hover states en cards, transiciones de página, micro-interacciones. Impresión profesional en la reunión. | LOW | Framer Motion o CSS transitions. Sutil, no distractivo. Cuidar performance en tablet. |
| **Iconos de tecnología interactivos** | En la ficha de tela, al hacer hover/click en un icono de tecnología (ej: Antibacterial) se muestra tooltip o expande con explicación. El vendedor no necesita memorizar cada tecnología. | LOW | Tooltip component con descripción corta. Datos estáticos. Link opcional a la página de `/tecnologias`. |
| **Comparación lado a lado de telas** | El cliente duda entre dos telas. El vendedor selecciona 2-3 y las compara en tabla. Specs lado a lado: composición, tecnologías, categorías de uso. | HIGH | UI de selección (checkboxes en cards), panel/modal de comparación. Tabla responsive con specs alineados. Baymard: limitar a 3-5 items máximo. Smashing Magazine: priorizar features que importan al usuario. Requiere: product cards y fichas técnicas funcionando primero. |
| **Búsqueda por nombre de tela** | "¿Tienen la Montesimone?" — el vendedor puede buscar directamente en vez de navegar. | LOW-MEDIUM | Search input en header. Client-side fuzzy search (Fuse.js o similar). ~40 telas = no necesita backend. |

### Anti-Features (NO Construir)

Features que parecen buenas pero crean problemas en este contexto específico.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **E-commerce / Carrito / Pedidos** | "Ya que tienen el catálogo, que puedan pedir directo." | Fuera del modelo de negocio. Lafayette no vende directo a colegios online. El vendedor toma pedidos por otro canal. Añade complejidad masiva (auth, pagos, inventario). | Catálogo informativo puro. Si en el futuro se necesita, es otro proyecto. |
| **CRM / Formularios de contacto / Lead capture** | "Que el colegio pueda dejar sus datos." | El vendedor está presente en la reunión. No hay flujo online. Formularios son fricción innecesaria para una herramienta interna. | El vendedor captura la info él mismo en su CRM existente. |
| **Chat / WhatsApp widget** | "Para que el colegio se comunique después." | El vendedor ES el canal de comunicación. Un widget de chat en una herramienta interna de presentación no tiene sentido. | Nada. El vendedor da su tarjeta. |
| **Optimización mobile phone** | "Que funcione en celular también." | PROJECT.md explícitamente lo descarta. Se usa en laptop/tablet. Optimizar mobile consume tiempo en layout responsive sin beneficio real. | Desktop-first, responsive solo hasta tablet. |
| **SEO y meta tags públicos** | "Para que nos encuentren en Google." | Herramienta interna. No debe indexarse. SEO es esfuerzo desperdiciado y potencialmente expone info comercial. | `noindex, nofollow` y ya. |
| **Autenticación / Login** | "Proteger el contenido." | Añade fricción al vendedor en cada reunión. No hay datos sensibles que proteger. Complejidad innecesaria (auth, sesiones, forgot password). | Si se necesita protección básica, un simple password gate sin cuentas. Pero por ahora, no. |
| **CMS / Admin panel** | "Para que actualicen el contenido sin desarrollador." | El catálogo cambia 1-2 veces al año. Un CMS es over-engineering. Los datos son estáticos y pocos (~40 telas). | Datos en archivos TypeScript/JSON. Actualización por PR cuando cambie el catálogo. |
| **Multi-idioma** | "Para vendedores que hablen inglés." | El mercado es colegios colombianos. Todo es en español. i18n añade complejidad a cada componente sin beneficio. | Solo español. |
| **Integración con ERP/PIM** | "Para sincronizar inventario y precios." | No hay precios en el catálogo (se negocian por volumen). No hay inventario relevante para la presentación. Integración es proyecto de meses. | Datos estáticos. El vendedor maneja disponibilidad verbalmente. |
| **Analytics avanzado** | "Para saber qué telas miran más." | En una herramienta interna con ~20 vendedores, analytics sofisticados son over-engineering. | Vercel Analytics básico (gratis) si se quiere métricas simples. |

## Feature Dependencies

```
[Navegación por categorías] (P1)
    └──requires──> [Modelo de datos tela-categoría]
                       └──enables──> [Navegación cruzada tela-categoría] (P2)
                       └──enables──> [Filtrado por tecnología] (P2)

[Fichas técnicas de tela] (P1)
    └──requires──> [Modelo de datos de tela]
    └──requires──> [Imágenes de producto]
    └──enables──> [Comparación lado a lado] (P3)
    └──enables──> [Iconos de tecnología interactivos] (P2)

[Product cards en grid] (P1)
    └──requires──> [Imágenes de producto]
    └──requires──> [Modelo de datos de tela]
    └──enables──> [Filtrado por tecnología] (P2)

[Home page con hero] (P1)
    └──requires──> [Navegación por categorías]
    └──requires──> [Color-coding por categoría]

[Galería de imágenes con zoom] (P2)
    └──requires──> [Imágenes de producto]

[Modo offline / PWA] (P2-P3)
    └──requires──> [Todas las páginas de contenido funcionando]
    └──nota──> Se puede añadir en cualquier momento sobre el sitio existente

[Búsqueda por nombre de tela] (P2)
    └──requires──> [Modelo de datos de tela]

[Comparación lado a lado] (P3)
    └──requires──> [Fichas técnicas de tela]
    └──requires──> [Product cards en grid] (para UI de selección)
    └──enhances──> [Navegación por categorías]
```

### Dependency Notes

- **Modelo de datos de tela** es la dependencia fundacional. Definir el schema TypeScript de una tela (nombre, composición, tecnologías[], categorías[], imagen, gramaje) desbloquea prácticamente todo el resto.
- **Imágenes de producto** es una dependencia real pero con riesgo: la calidad de extracción del PDF es incierta. Debe abordarse temprano para detectar problemas.
- **Modo offline (PWA)** es independiente del contenido — es una capa que se añade encima. No bloquea nada, pero requiere que el sitio esté mayormente completo para que el pre-caching tenga sentido.
- **Comparación lado a lado** es la feature más compleja y depende de que las fichas técnicas y product cards estén estabilizados primero.
- **Filtrado por tecnología** depende de que los datos de tela incluyan la relación con tecnologías (ya contemplada en el modelo).

## MVP Definition

### Launch With (v1)

Minimum viable product — lo mínimo para que el vendedor deje de usar el PDF.

- [x] **Modelo de datos de tela en TypeScript** — fundamento de todo el catálogo
- [ ] **Home page con hero y grid de 8 categorías** — primera impresión profesional
- [ ] **8 páginas de categoría con product cards** — navegación principal del vendedor
- [ ] **Fichas técnicas de tela** — el vendedor necesita mostrar specs en la reunión
- [ ] **Imágenes de producto extraídas del PDF** — sin imágenes el catálogo no tiene sentido
- [ ] **Sección de Tecnologías Textiles** — argumento de venta clave con iconos
- [ ] **Sección de Personalización** — diferenciador comercial de Lafayette
- [ ] **Sección de Cuellos** — complemento necesario para la oferta completa
- [ ] **Header con navegación y logo** — branding y usabilidad básica
- [ ] **Color-coding por categoría** — orientación visual
- [ ] **Deploy en Vercel** — accesible para los vendedores

### Add After Validation (v1.x)

Features a añadir una vez que el core funciona y los vendedores lo están usando.

- [ ] **Filtrado por tecnología/propiedad** — trigger: vendedores piden buscar por tecnología, no solo por categoría
- [ ] **Navegación cruzada tela-categoría** — trigger: vendedores necesitan saber "¿dónde más se usa esta tela?"
- [ ] **Búsqueda por nombre de tela** — trigger: vendedores memorizan nombres de tela y quieren ir directo
- [ ] **Iconos de tecnología interactivos (tooltips)** — trigger: vendedores nuevos necesitan ayuda contextual
- [ ] **Galería de imágenes con zoom** — trigger: si se consiguen mejores fotos o más ángulos
- [ ] **Transiciones y animaciones sutiles** — trigger: polish después de que el contenido esté estable

### Future Consideration (v2+)

Features a diferir hasta validar que la herramienta se usa realmente.

- [ ] **Modo offline / PWA** — diferir hasta confirmar que el WiFi en colegios es realmente un problema recurrente
- [ ] **Comparación lado a lado de telas** — diferir hasta que haya suficientes specs cuantitativos por tela para que la comparación sea útil (hoy los datos del PDF son limitados)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Navegación por categorías | HIGH | LOW | P1 |
| Fichas técnicas de tela | HIGH | MEDIUM | P1 |
| Product cards en grid | HIGH | LOW | P1 |
| Imágenes de producto | HIGH | LOW | P1 |
| Home page con hero | HIGH | MEDIUM | P1 |
| Sección Tecnologías | HIGH | LOW | P1 |
| Sección Personalización | MEDIUM | LOW | P1 |
| Sección Cuellos | MEDIUM | LOW | P1 |
| Header + navegación | HIGH | LOW | P1 |
| Color-coding categorías | MEDIUM | LOW | P1 |
| Carga rápida (SSG) | HIGH | LOW | P1 (inherente a Next.js SSG) |
| Filtrado por tecnología | HIGH | MEDIUM | P2 |
| Navegación cruzada | MEDIUM | MEDIUM | P2 |
| Búsqueda por nombre | MEDIUM | LOW-MEDIUM | P2 |
| Tooltips tecnologías | MEDIUM | LOW | P2 |
| Galería con zoom | MEDIUM | MEDIUM | P2 |
| Transiciones/animaciones | LOW | LOW | P2 |
| Modo offline (PWA) | HIGH (si hay problema de WiFi) | MEDIUM-HIGH | P3 |
| Comparación lado a lado | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have para lanzar — sin esto el vendedor vuelve al PDF
- P2: Should have — mejora la experiencia, añadir post-lanzamiento
- P3: Nice to have — diferir hasta validar necesidad real

## Competitor Feature Analysis

| Feature | Klopman.com | Milliken.com | PDF Lafayette actual | Nuestra Approach |
|---------|-------------|--------------|---------------------|------------------|
| Navegación por categoría | Si (workwear, protective, corporate) | Si (por mercado/industria) | Si (por uso, 8 categorías) | 8 categorías de uso con color coding |
| Fichas técnicas | Si (composición, peso, acabados) | Si (ficha descargable PDF) | Parcial (nombre + descripción corta) | Ficha en página con todos los datos del PDF |
| Filtrado | Si ("Fabric Finder": categoría, tipo, peso, key feature, risk) | Básico (por mercado) | No (es PDF, no filtra) | Filtro por tecnología (client-side) |
| Product cards | Si (imagen + nombre + peso) | Si (imagen + nombre + categoría) | No aplica (layout de página impresa) | Card con imagen, nombre, chips de tecnología |
| Galería de imágenes | Limitada (1-2 fotos por tela) | Limitada (foto de muestra) | 1 foto por tela (del PDF) | 1 imagen + zoom. Escalar si hay más fotos |
| Comparación | No | No | No | Diferido a v2+ |
| Offline | No (web solo online) | No | Si (es PDF, siempre offline) | PWA con cache-first en v2 |
| Búsqueda | Si (integrada en fabric finder) | Si (search global) | No | Client-side fuzzy search en v1.x |
| Responsive | Si (desktop + mobile) | Si (full responsive) | No aplica | Desktop + tablet only |
| Tecnologías destacadas | Si (sección de features) | Si (por marca/línea) | Si (página de tecnologías con iconos) | Página dedicada + iconos en fichas de tela |

## Sources

**UX de catálogos y filtrado:**
- [Baymard Institute — Product List UX Best Practices 2025](https://baymard.com/blog/current-state-product-list-and-filtering) — MEDIUM confidence
- [Baymard — Comparison Features for Spec-Driven Industries](https://baymard.com/blog/provide-comparison-features) — MEDIUM confidence
- [Smashing Magazine — Designing The Perfect Feature Comparison Table](https://www.smashingmagazine.com/2017/08/designing-perfect-feature-comparison-table/) — MEDIUM confidence
- [NN/g — Comparison Tables for Products, Services, and Features](https://www.nngroup.com/articles/comparison-tables/) — MEDIUM confidence

**Catálogos textiles B2B (competidores):**
- [Klopman — Fabric Finder](https://www.klopman.com/products) — HIGH confidence (fuente primaria)
- [Milliken — Textile Products](https://www.milliken.com/en-us/textiles/products) — HIGH confidence (fuente primaria)

**Sales enablement y catálogos digitales:**
- [Paperflite — Sales Enablement Trends 2025](https://www.paperflite.com/blogs/sales-enablement-trends) — LOW confidence
- [Product Catalog Software vs PDF Catalogs 2025](https://thelinecard.com/product-catalog-software-vs.-pdf-catalogs-in-2025) — LOW confidence
- [Ingage — Digital Sales Presentations 2025](https://ingage.io/blog/digital-sales-presentations-trends-2025/) — LOW confidence

**PWA / Offline:**
- [Next.js — PWA Guide (oficial)](https://nextjs.org/docs/app/guides/progressive-web-apps) — HIGH confidence
- [LogRocket — Build Next.js 16 PWA with offline support](https://blog.logrocket.com/nextjs-16-pwa-offline-support/) — MEDIUM confidence
- [MDN — Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation) — HIGH confidence

**Especificaciones textiles:**
- [Textile Industry — Fabric Specification Sheet](https://www.textileindustry.net/fabric-specification-sheet/) — MEDIUM confidence

---
*Feature research for: Catálogo textil sales enablement Lafayette Uni For Me Colegios*
*Researched: 2026-02-21*
