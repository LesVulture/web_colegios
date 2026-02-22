# Feature Landscape: v1.1 Catalogo Completo

**Domain:** Catalogo de producto textil para sales enablement — uniformes escolares (segundo milestone)
**Researched:** 2026-02-22
**Confidence:** MEDIUM-HIGH
**Scope:** Solo features NUEVAS de v1.1. Excluye lo ya construido en v1.0 (home, nav, categorias, cards, data layer).

---

## Context: What Already Exists (v1.0)

Antes de definir features nuevas, inventario de lo que ya esta funcional:

| Existing Feature | Status | Route/Component |
|-----------------|--------|-----------------|
| Home page con hero + grid 4 items | SHIPPED | `/` (page.tsx) |
| Navegacion global responsive | SHIPPED | header.tsx, nav-links.tsx, mobile-menu.tsx |
| 8 paginas de categoria con product cards | SHIPPED | `/uso/[slug]` (8 rutas) |
| FabricCard con nombre + chips tecnologia | SHIPPED | fabric-card.tsx |
| Data layer: 31 telas, 8 categorias, 14 tecnologias | SHIPPED | lib/content/*.ts |
| Color-coding por categoria (8 colores) | SHIPPED | styles.ts + globals.css |
| SSG con generateStaticParams (51 rutas) | SHIPPED | Build pipeline |
| Fabric detail page placeholder | PLACEHOLDER | `/uso/[slug]/[fabricId]` |
| Tecnologias page placeholder | PLACEHOLDER | `/tecnologias` |
| Personalizacion page placeholder | PLACEHOLDER | `/personalizacion` |
| Cuellos page placeholder | PLACEHOLDER | `/cuellos` |

**Known tech debt que afecta v1.1:**
- 31 fabrics apuntan a `placeholder.webp` (404) -- 14 imagenes reales sin mapear
- NavLinks active state no captura `/uso/*`
- CVA instalada sin uso, SkeletonCard huerfano
- 3 tecnologias sin icono (algodon, antimanchas, solidez-a-la-luz)

---

## Table Stakes (Sin Esto v1.1 No Tiene Sentido)

Features que definen el milestone. Sin estas, no hay razon para un v1.1 -- el vendedor sigue abriendo el PDF para la info que falta.

### TS-01: Ficha Tecnica Completa de Tela (Fabric Detail Page)

| Aspect | Detail |
|--------|--------|
| **Why Expected** | La FabricCard ya enlaza a `/uso/[slug]/[fabricId]` pero muestra "en construccion". El vendedor hace click y no encuentra nada. Es la promesa incumplida mas visible de v1.0. Sin fichas tecnicas, el vendedor abre el PDF para responder preguntas de composicion, gramaje o rutas de estampacion. |
| **Complexity** | MEDIUM |
| **Depends On** | Mapeo correcto de imagenes (resolver tech debt placeholder.webp), datos existentes en fabrics.ts |

**Contenido minimo de la ficha (extraido del PDF y ya modelado en types.ts):**

| Campo | Fuente | Ya en Data Layer | Display |
|-------|--------|-----------------|---------|
| Nombre de tela | `fabric.name` | Si | H1, prominente |
| Base (referencia interna) | `fabric.base` | Si | Texto secundario, util para el vendedor |
| Composicion | `fabric.composition` | Si | Texto, ej: "100% poliester reciclado" |
| Tipo de tejido | `fabric.weave` | Si | Badge: "Plano" o "Punto" |
| Gramaje | `fabric.weight` | Si | Texto con unidad, ej: "110 +-10 g/m2" |
| Ancho | `fabric.width` | Si | Texto con unidad, ej: "151 +- 2 cm" |
| Tecnologias | `fabric.technologies[]` | Si | Iconos clickeables con nombre (link a /tecnologias o tooltip) |
| Rutas de estampacion | `fabric.printRoutes[]` | Si | Chips: Unicolor, Rotativa, Davos, Sublimacion |
| Imagen de producto | `fabric.image` | Si (roto) | next/image prominente, ocupando ~40-50% del viewport |
| Badge "Nuevo" | `fabric.isNew` | Si | Badge visual si isNew === true |
| Categorias donde aplica | Via `getCategoriesByFabric()` | Si (helper existe, sin consumidor) | Links a las categorias, color-coded |

**Layout recomendado:**

Layout de dos columnas (desktop) basado en patrones B2B de Baymard Institute:
- **Columna izquierda (40-50%):** Imagen de producto grande. En este caso una sola imagen (limitante del PDF), pero con espacio para futuras adiciones.
- **Columna derecha (50-60%):** Nombre, base, composicion, gramaje, ancho, tejido como specs en formato tabla/lista de definicion scannable. Tecnologias como iconos horizontales. Rutas de estampacion como chips.
- **Debajo (full-width):** Categorias donde aplica esta tela (navegacion cruzada). Link de retorno a la categoria de origen.

En tablet (md breakpoint): las dos columnas colapsan a una sola columna, imagen arriba, specs abajo.

**Patron Baymard clave:** Evitar tabs horizontales para organizar specs. Usar secciones verticales colapsables o simplemente mostrar toda la info visible (con 31 telas y campos limitados, no hay razon para ocultar nada detras de tabs).

**Confidence:** HIGH -- todos los datos ya existen en el data layer, la ruta SSG ya existe como placeholder, y el layout es un patron estandar de product detail page.

---

### TS-02: Seccion de Tecnologias Textiles

| Aspect | Detail |
|--------|--------|
| **Why Expected** | Los 4 items del menu principal son: Usos, Tecnologias, Personalizacion, Cuellos. 3 de 4 dicen "en construccion". Las tecnologias son el argumento de venta principal de Lafayette -- explican POR QUE elegir estas telas sobre la competencia. |
| **Complexity** | LOW |
| **Depends On** | Datos de TECHNOLOGIES[] ya completos en technologies.ts. 12 iconos PNG ya en /images/tech/. |

**Contenido de la pagina:**

Pagina `/tecnologias` mostrando las 14 tecnologias (no 12 como dice el PDF -- el data layer tiene 14 incluyendo variantes):

| Tecnologia | Icono Disponible | Descripcion en Data |
|-----------|-----------------|---------------------|
| Proteccion Solar | Si | "Proteccion contra rayos UV" |
| Impermeabilidad | Si | "Resistencia al agua" |
| Durabilidad | Si | "Resistencia al desgaste y rasgado" |
| Antifluido/Repelencia | Si | "Repelencia de fluidos" |
| Libertad de Movimiento | Si | "Elasticidad y comodidad de movimiento" |
| Algodon | **NO** (icon: '') | "Mezcla con algodon natural" |
| Desempeno | Si | "Alto rendimiento textil" |
| Control de Humedad | Si | "Gestion de humedad y secado rapido" |
| Antibacterial | Si | "Proteccion antibacteriana" |
| Antimanchas | **NO** (icon: '') | "Resistencia a manchas" |
| Clororresistente | Si | "Resistencia al cloro" |
| Termico | Si | "Regulacion termica" |
| Solidez a la Luz | **NO** (icon: '') | "Resistencia a la decoloracion por luz" |
| Sostenible | Si | "Elaborado con hilos reciclados" |

**Nota critica:** Las descripciones actuales son muy cortas (una linea). El PDF de Lafayette (pagina 14) tiene descripciones mas detalladas con beneficios. Se necesita expandir los datos o extraer mas texto del PDF.

**Layout recomendado:**

Grid de cards (3 columnas desktop, 2 columnas tablet), cada card con:
- Icono grande (o placeholder generico para las 3 sin icono)
- Nombre de la tecnologia
- Descripcion expandida (2-3 oraciones, extraidas del PDF)
- Contador: "X telas con esta tecnologia" (calculable con datos existentes)
- Links a las telas que usan esta tecnologia (opcional, alto valor, baja complejidad)

**Patron de la industria:** Klopman.com tiene una seccion de "key features" con iconos y descripciones. Milliken tiene fichas por linea de producto. Lafayette deberia seguir el patron de iconos + descripcion ya que los assets existen.

**Confidence:** HIGH para el layout y datos basicos. MEDIUM para las descripciones expandidas (depende de extraer mas texto del PDF).

---

### TS-03: Seccion de Personalizacion de Uniformes

| Aspect | Detail |
|--------|--------|
| **Why Expected** | Diferenciador comercial clave de Lafayette. Las 4 opciones de personalizacion son argumentos de cierre de venta: "podemos hacer el uniforme exactamente como lo quiere su colegio". |
| **Complexity** | LOW |
| **Depends On** | Contenido del PDF (pagina 15). No hay datos modelados en TypeScript aun para personalizacion. |

**Contenido (del PDF, pagina 15 -- 4 opciones):**

| Opcion | Que Es |
|--------|--------|
| Dibujos Exclusivos | Disenos personalizados para el colegio |
| Estampacion Digital | Impresion digital sobre tela |
| Tipo Davos | Patron tipo Davos personalizado |
| Desarrollo de Color | Colores exclusivos para el colegio |

**Layout recomendado:**

Pagina informativa con 4 bloques/cards grandes, cada uno con:
- Imagen representativa (extraida del PDF si hay, o imagen generica de contexto)
- Titulo de la opcion
- Descripcion de 2-3 parrafos explicando el proceso y beneficios
- Opcional: imagenes de ejemplo/antes-despues

Este es un contenido narrativo, no una ficha tecnica. El layout es tipo landing page de servicios.

**Nuevo dato necesario en data layer:** No existe un modelo de datos para personalizacion. Crear interface `PersonalizationOption` con id, name, description, image. Array `PERSONALIZATION_OPTIONS` en un nuevo archivo `personalization.ts`.

**Confidence:** MEDIUM -- el contenido depende completamente del PDF y no hay datos modelados aun. El layout es straightforward.

---

### TS-04: Seccion de Cuellos

| Aspect | Detail |
|--------|--------|
| **Why Expected** | Complemento para la categoria de Camisetas/Polos. Los cuellos vienen en colores y tallas especificos. El vendedor necesita mostrar opciones disponibles. |
| **Complexity** | LOW |
| **Depends On** | Contenido del PDF (paginas 16-17). No hay datos modelados en TypeScript aun para cuellos. |

**Contenido (del PDF, paginas 16-17):**

| Aspecto | Detalle |
|---------|---------|
| Colores disponibles | 4 colores (del PDF) |
| Tallas ninos | Rango de tallas infantiles |
| Tallas adolescentes/adultos | Rango de tallas mayores |
| Info comercial | Condiciones, minimos, disponibilidad |

**Layout recomendado:**

Pagina con:
- Header descriptivo sobre los cuellos Lafayette
- Grid/galeria de colores disponibles (swatches o fotos)
- Tabla de tallas con dos secciones: ninos y adolescentes/adultos
- Notas comerciales relevantes

**Nuevo dato necesario en data layer:** Crear interface `CollarOption` o estructura de datos para cuellos con colores, tallas, imagenes. Array `COLLARS` en un nuevo archivo `collars.ts`.

**Confidence:** MEDIUM -- contenido depende del PDF. La estructura de tabla de tallas es un patron muy estandar.

---

### TS-05: Resolucion de Tech Debt de Imagenes

| Aspect | Detail |
|--------|--------|
| **Why Expected** | Actualmente TODAS las FabricCards muestran imagen rota (404). La ficha tecnica de tela no puede existir sin imagen. Esto bloquea la feature mas importante de v1.1. |
| **Complexity** | LOW (mapeo, no creacion) |
| **Depends On** | Las 14 imagenes ya existen en /public/images/products/. Solo falta el mapeo en fabrics.ts. |

**Accion concreta:** Mapear las 14 imagenes existentes (`page04-0.webp` a `page12-34.webp`) a los 31 registros de fabrics.ts. Algunas telas pueden compartir imagen o quedar sin imagen dedicada si el PDF no tenia foto individual.

**Confidence:** HIGH -- es un problema conocido, con solucion clara.

---

### TS-06: Deploy Funcional en Vercel

| Aspect | Detail |
|--------|--------|
| **Why Expected** | Sin deploy, los vendedores no pueden usar la herramienta. Un sitio local no sirve para reuniones de ventas. |
| **Complexity** | LOW |
| **Depends On** | Proyecto Next.js con SSG ya configurado. Vercel es el deploy target natural. |

**Acciones:** `vercel deploy` o conectar repo a Vercel. SSG < 2s es el target de performance. Con 51+ rutas estaticas y next/image, Vercel maneja esto sin configuracion especial.

**Confidence:** HIGH -- Next.js + Vercel es el camino feliz documentado.

---

## Differentiators (Elevan v1.1 Sobre "Paginas Estaticas")

Features que transforman el catalogo de "un PDF bonito en web" a "herramienta de ventas interactiva".

### DF-01: Filtrado de Telas por Tecnologia

| Aspect | Detail |
|--------|--------|
| **Value Proposition** | El cliente pregunta "que telas tienen proteccion solar?" y el vendedor puede filtrar instantaneamente en la pagina de categoria. Reduce busqueda de minutos (hojeando PDF) a segundos. |
| **Complexity** | MEDIUM |
| **Depends On** | Paginas de categoria funcionando (v1.0), datos de tecnologia ya en fabrics.ts |

**Implementacion recomendada:**

- **Donde:** En cada pagina de categoria `/uso/[slug]`, encima del grid de FabricCards.
- **UI Pattern:** Chip/tag multi-select horizontal. Cada chip es una tecnologia (solo las presentes en esa categoria). Click para activar, click de nuevo para desactivar. Filtros acumulativos (AND logic: si seleccionas "Proteccion Solar" + "Antibacterial", muestra telas que tengan AMBAS).
- **Estado:** Client-side con React state. Los datos ya estan en memoria (SSG). Con 4-9 telas por categoria, el filtrado es instantaneo.
- **UX critico:** Mostrar contador de resultados. Si el filtro produce 0 resultados, mensaje claro "Ninguna tela en esta categoria tiene todas las tecnologias seleccionadas" con opcion de limpiar filtros.

**Por que chips horizontales y NO sidebar de filtros:**
- Con 4-9 telas por categoria, una sidebar de filtros es overkill.
- Chips son mas visuales e inmediatos para un contexto de presentacion de ventas.
- No hay suficientes dimensiones de filtrado para justificar sidebar (solo tecnologia; peso y ancho son datos que se leen, no se filtran tipicamente en una reunion).

**Implicacion tecnica:** La pagina de categoria actualmente es un Server Component puro. El filtrado requiere client-side interactivity. Opcion: convertir el grid area a Client Component (use client) manteniendo el layout como Server Component, o usar un wrapper Client Component para el estado de filtros.

**Confidence:** HIGH -- patron bien documentado, datos disponibles, complejidad baja en este contexto.

---

### DF-02: Ordenamiento de Telas (Sort)

| Aspect | Detail |
|--------|--------|
| **Value Proposition** | "Muestrame las telas mas livianas primero" o "ordena por ancho". Util cuando el cliente tiene restricciones tecnicas especificas. |
| **Complexity** | LOW |
| **Depends On** | Misma infraestructura de client-side state que el filtrado |

**Implementacion recomendada:**

- **Donde:** Junto a los chips de filtro, un select/dropdown de ordenamiento.
- **Opciones de sort:**
  - Por defecto (orden del PDF/catalogo -- como vienen en categories.ts)
  - Por gramaje (menor a mayor / mayor a menor)
  - Por ancho (menor a mayor / mayor a menor)
  - Alfabetico (A-Z)

**Nota tecnica:** Los valores de gramaje y ancho en fabrics.ts son strings con formato "110 +-10 g/m2". Para sortear, se necesita parsear el valor numerico base. Funcion helper: `parseWeight("110 +-10 g/m2") -> 110`. Esto es trivial pero debe hacerse.

**Confidence:** HIGH -- sort client-side de 4-9 items es trivial.

---

### DF-03: Busqueda Fuzzy por Nombre de Tela

| Aspect | Detail |
|--------|--------|
| **Value Proposition** | "Tienen la Montesimone?" -- el vendedor escribe el nombre (quizas mal escrito) y encuentra la tela directo. Evita navegar por categorias cuando ya sabe que busca. |
| **Complexity** | LOW-MEDIUM |
| **Depends On** | Data layer completo (ya existe) |

**Implementacion recomendada:**

- **Libreria:** Fuse.js (lightweight, zero dependencies, ideal para client-side fuzzy search de <100 items). No necesita backend. Probado extensamente con React y Next.js.
- **Donde:** Search input en el header global o en una barra de busqueda accesible desde cualquier pagina.
- **Comportamiento:**
  - Input con debounce de 300ms.
  - Dropdown de resultados debajo del input (overlay, no pagina nueva).
  - Buscar en: nombre de tela (`fabric.name`), base (`fabric.base`).
  - Cada resultado muestra: nombre de tela + categoria(s) donde aparece.
  - Click en resultado navega a la ficha tecnica de esa tela en su primera categoria.
  - Mostrar maximo 5-8 resultados (con 31 telas, no hay razon para paginacion).
- **Fuse.js config recomendada:**
  ```typescript
  const fuse = new Fuse(FABRICS, {
    keys: ['name', 'base'],
    threshold: 0.4,      // tolerancia moderada a typos
    includeScore: true,
    minMatchCharLength: 2,
  });
  ```
- **Atajo de teclado:** Ctrl+K o Cmd+K para abrir busqueda (patron estandar en herramientas internas). Opcional pero de bajo costo.

**Alternativa descartada:** No usar Algolia, Meilisearch, ni ningun servicio externo. Con 31 items, es absurdo. Fuse.js en client-side es la solucion correcta.

**Confidence:** HIGH -- Fuse.js esta bien documentado para este caso exacto (catalogo pequeno, client-side, React).

---

### DF-04: Tooltips de Tecnologia en Ficha de Tela

| Aspect | Detail |
|--------|--------|
| **Value Proposition** | En la ficha tecnica, cuando el vendedor pasa el cursor sobre un icono de tecnologia, aparece un tooltip con la descripcion. No necesita memorizar que significa cada icono. |
| **Complexity** | LOW |
| **Depends On** | Ficha tecnica de tela (TS-01), datos de tecnologia ya en TECHNOLOGIES[] |

**Implementacion:**
- Tooltip nativo con CSS (title attr) o componente tooltip con Radix UI / headlessui.
- Contenido: nombre de tecnologia + descripcion corta.
- Click opcional: navegar a `/tecnologias` para mas detalle.
- En tablet (sin hover): click/tap para mostrar el tooltip.

**Confidence:** HIGH -- componente trivial con datos existentes.

---

### DF-05: Navegacion Cruzada Tela-Categoria

| Aspect | Detail |
|--------|--------|
| **Value Proposition** | Una tela puede aparecer en multiples categorias (ej: "Orion Clororresistente" esta en Sudaderas, Chaquetas Prom, y Delantales). El vendedor necesita saber "en que mas se usa esta tela" para ofrecer opciones al cliente. |
| **Complexity** | LOW (la logica ya existe) |
| **Depends On** | Ficha tecnica de tela (TS-01) |

**Implementacion:**
- En la ficha tecnica, seccion "Tambien disponible en:" con links a las otras categorias donde aparece la tela.
- Usar `getCategoriesByFabric(fabricId)` que ya existe en helpers.ts (actualmente sin consumidor).
- Mostrar como badges/chips con el color de cada categoria.

**Confidence:** HIGH -- helper ya existe, solo necesita conectarse a la UI.

---

## Anti-Features (NO Construir en v1.1)

Features que pueden parecer logicas para este milestone pero deben evitarse.

| Anti-Feature | Why It Seems Logical | Why Problematic | What To Do Instead |
|--------------|---------------------|-----------------|-------------------|
| **Comparacion lado a lado de telas** | "El cliente duda entre dos telas, que las compare." | Los specs son pocos (composicion, gramaje, ancho, tecnologias). Una tabla comparativa con tan pocas filas no agrega valor sobre simplemente ver dos fichas. Ademas la UI de seleccion (checkboxes, panel de comparacion) es HIGH complexity. | Diferir a v2. Si se necesita, el vendedor abre dos pestanas. |
| **Galeria multi-imagen con zoom** | "Mostrar la tela en detalle." | Solo hay 1 imagen por tela (extraida del PDF). Un componente de galeria con 1 imagen es UX roto. El zoom sobre imagenes del PDF (baja resolucion) no revela mas detalle. | Imagen unica grande. Si en el futuro hay fotos profesionales multi-angulo, reconsiderar. |
| **Modo offline / PWA** | "Los colegios rurales no tienen WiFi." | Requiere Service Worker, caching strategy, testing de offline flows. Es una capa que se anade ENCIMA de un sitio completo. Hacerlo ahora distrae del objetivo de completar el catalogo. | Diferir a v1.2 o v2. Primero completar contenido, luego optimizar distribucion. |
| **Filtro por composicion** | "Quiero solo telas 100% poliester." | Las composiciones son strings libres ("100% poliester", "100% poliester reciclado", "60% poliester, 40% algodon", "85% poliester, 15% algodon"). Parsear esto para hacer filtros robustos es fragil. Solo hay 4 variantes de composicion -- no justifica un filtro dedicado. | Si el vendedor busca por composicion, usa busqueda fuzzy o simplemente escanea la pagina de categoria (4-9 telas es visual). |
| **Filtro por tipo de tejido (Plano/Punto)** | "Solo quiero telas de punto." | Solo hay 2 valores posibles. Un toggle binario para 2 opciones es over-engineering. La mayoria de las categorias tienen telas de un solo tipo (ej: Deportivo es todo Punto, Blusas es todo Plano). | Mostrar el tipo de tejido como badge en la card/ficha para referencia visual. No como filtro. |
| **Paginas individuales por tecnologia** | "Cada tecnologia con su pagina detallada." | No hay suficiente contenido unico por tecnologia para justificar una pagina. El PDF tiene 1-2 lineas por tecnologia. Crear 14 paginas con 2 lineas cada una es peor UX que una pagina consolidada. | Pagina unica `/tecnologias` con todas las tecnologias. Anchor links si se quiere deep linking. |
| **Animaciones de transicion de pagina** | "Para que se sienta premium." | View Transitions API aun tiene soporte limitado. Framer Motion anade peso al bundle. En un contexto de presentacion de ventas, la velocidad importa mas que las animaciones. | CSS transitions sutiles en hover/interaction (ya existen en FabricCard). No transiciones de pagina. |

---

## Feature Dependencies (v1.1 Scope)

```
[TS-05: Resolver imagenes placeholder] (blocker)
    |
    +--enables--> [TS-01: Ficha tecnica de tela]
    |                 |
    |                 +--enables--> [DF-04: Tooltips de tecnologia]
    |                 +--enables--> [DF-05: Navegacion cruzada tela-categoria]
    |
    +--enables--> [FabricCards visibles en categorias] (fix de v1.0)

[TS-02: Seccion Tecnologias] (independiente)
    |
    +--enhances--> [DF-04: Tooltips linkean a /tecnologias]

[TS-03: Seccion Personalizacion] (independiente)
    |
    +--requires--> [Nuevo data model: PersonalizationOption]
    +--requires--> [Extraer contenido del PDF pagina 15]

[TS-04: Seccion Cuellos] (independiente)
    |
    +--requires--> [Nuevo data model: CollarOption]
    +--requires--> [Extraer contenido del PDF paginas 16-17]

[DF-01: Filtrado por tecnologia] (independiente del detalle)
    |
    +--requires--> [Client Component wrapper en pagina de categoria]
    +--bundles-with--> [DF-02: Ordenamiento (sort)]

[DF-03: Busqueda fuzzy] (independiente)
    |
    +--requires--> [Instalar Fuse.js]
    +--requires--> [Client Component en header o layout]

[TS-06: Deploy Vercel] (final)
    |
    +--requires--> [Todo lo anterior funcional]
    +--requires--> [Build sin errores, SSG < 2s]
```

### Critical Path

```
Resolver imagenes --> Fichas tecnicas --> Filtros/Sort --> Busqueda --> Deploy
        |
        +-- Secciones Tecnologias/Personalizacion/Cuellos (paralelo)
```

### Notas de Dependencia

- **Imagenes es el blocker real.** Ninguna ficha tecnica ni FabricCard funcional sin imagenes mapeadas. Debe ser la primera tarea.
- **Secciones (Tecnologias, Personalizacion, Cuellos) son independientes entre si** y del flujo de fichas tecnicas. Se pueden hacer en paralelo.
- **Filtro y Sort van juntos.** Ambos requieren convertir parte de la pagina de categoria a Client Component. Hacerlos por separado duplica el trabajo de setup.
- **Busqueda es independiente de todo lo demas.** Puede implementarse en cualquier momento una vez que el data layer esta disponible (ya lo esta).
- **Deploy es la tarea final.** Requiere que todo compile y las rutas SSG se generen sin errores.

---

## Prioritization for v1.1

### Must Ship (definan el milestone)

| # | Feature | User Value | Cost | Rationale |
|---|---------|------------|------|-----------|
| 1 | TS-05: Resolver imagenes | CRITICAL | LOW | Blocker para todo. Fix de 30 min que desbloquea el milestone entero. |
| 2 | TS-01: Fichas tecnicas de tela | HIGH | MEDIUM | Feature principal de v1.1. Razon de existir del milestone. |
| 3 | TS-02: Seccion Tecnologias | HIGH | LOW | 1 de 3 paginas placeholder vacias. Datos y assets ya existen. |
| 4 | TS-03: Seccion Personalizacion | MEDIUM | LOW | Argumento de cierre de venta. Contenido requiere extraccion del PDF. |
| 5 | TS-04: Seccion Cuellos | MEDIUM | LOW | Complemento para polos. Contenido requiere extraccion del PDF. |
| 6 | TS-06: Deploy Vercel | HIGH | LOW | Sin esto nada llega al vendedor. |

### Should Ship (elevan la calidad)

| # | Feature | User Value | Cost | Rationale |
|---|---------|------------|------|-----------|
| 7 | DF-01: Filtrado por tecnologia | HIGH | MEDIUM | Diferenciador #1 vs PDF. Interactividad real. |
| 8 | DF-02: Ordenamiento (sort) | MEDIUM | LOW | Casi gratis si se hace junto con filtrado. |
| 9 | DF-03: Busqueda fuzzy | MEDIUM | LOW-MEDIUM | Atajos para vendedores experimentados. |
| 10 | DF-04: Tooltips tecnologia | MEDIUM | LOW | Polish con alto impacto. Bajo costo. |
| 11 | DF-05: Nav cruzada tela-categoria | MEDIUM | LOW | Helper ya existe. Solo conectar UI. |

### Tech Debt Resolution (incluido en milestone)

| Item | Severity | Cost | Phase |
|------|----------|------|-------|
| NavLinks active state bug | Functional bug | 5 min | Junto con cualquier cambio de nav |
| Remover CVA no usada | Cleanup | 5 min | Junto con dependency audit |
| Conectar o remover SkeletonCard | Cleanup | 10 min | Decidir si usarlo para Suspense o eliminarlo |
| Imagenes de producto sin mapear | Production-breaking | 30 min | PRIMERO (TS-05) |
| Colores hex duplicados (styles.ts + categories.ts) | Maintenance risk | 30 min | Junto con refactor de componentes |

---

## Recommended Phase Structure for v1.1

Basado en dependencias y complejidad:

**Phase 1: Data Fixes & Image Mapping**
- Resolver 404 de imagenes (mapear 14 existentes a fabrics.ts)
- Fix NavLinks active state
- Limpiar tech debt menor (CVA, SkeletonCard)
- Expandir datos: descripciones de tecnologias, datos de personalizacion, datos de cuellos
- **Outcome:** Data layer completo y funcional, FabricCards muestran imagenes

**Phase 2: Fabric Detail Pages**
- Implementar ficha tecnica completa (layout 2 columnas, specs, imagen)
- Tooltips de tecnologia
- Navegacion cruzada tela-categoria
- **Outcome:** Todas las 43 rutas fabric-detail tienen contenido real

**Phase 3: Content Sections**
- Pagina Tecnologias (grid de 14 tecnologias con iconos y descripciones)
- Pagina Personalizacion (4 opciones con descripciones)
- Pagina Cuellos (colores, tallas, info)
- **Outcome:** 0 paginas placeholder, menu completo

**Phase 4: Search, Filter & Sort**
- Filtrado por tecnologia en paginas de categoria
- Ordenamiento por gramaje/ancho
- Busqueda fuzzy global
- **Outcome:** Interactividad completa, diferenciacion vs PDF

**Phase 5: Polish & Deploy**
- Responsive verification (lg, md breakpoints)
- Performance verification (SSG < 2s)
- Deploy a Vercel
- **Outcome:** Herramienta accesible para vendedores

---

## Sources

**UX de product detail pages:**
- [Baymard Institute -- Product Page UX Best Practices 2025](https://baymard.com/blog/current-state-ecommerce-product-page-ux) -- MEDIUM confidence (paywall parcial, pero principios verificados)
- [SparkLayer -- B2B Product Pages UI Guide](https://www.sparklayer.io/blog/2024/11/06/b2b-product-pages-ui/) -- MEDIUM confidence
- Patron de dos columnas (imagen + specs) verificado en multiples catalgos B2B textiles (Klopman, Milliken)

**UX de filtros y busqueda:**
- [Baymard Institute -- Product List UX Best Practices 2025](https://baymard.com/blog/current-state-product-list-and-filtering) -- MEDIUM confidence
- [Algolia -- B2B Commerce Search & Filtering](https://www.algolia.com/blog/ecommerce/b2b-commerce-digital-transformation-search-filtering-sorting-and-navigation) -- MEDIUM confidence
- Chips horizontales para filtro validados en multiples fuentes para datasets pequenos

**Busqueda fuzzy:**
- [Fuse.js -- Official Documentation](https://www.fusejs.io/) -- HIGH confidence (fuente primaria)
- [Implementing client-side search in Next.js with Fuse.js](https://medium.com/@ketchasso72/implementing-client-side-search-in-next-js-with-fuse-js-7bbf241b874f) -- MEDIUM confidence
- [Perficient -- Implementing Fuzzy Search in React with Fuse.js](https://blogs.perficient.com/2025/03/17/implementing-a-fuzzy-search-in-react-js-using-fuse-js/) -- MEDIUM confidence

**Especificaciones textiles:**
- [Textile Industry -- Fabric Specification Sheet](https://www.textileindustry.net/fabric-specification-sheet/) -- MEDIUM confidence
- Analisis directo de la estructura de datos existente en `types.ts` y `fabrics.ts` -- HIGH confidence

**Competidores/referencia:**
- [Uniforme Lafayette -- Sitio publico](https://uniformelafayette.com/colegios/) -- HIGH confidence (verificacion directa: el sitio publico NO tiene catalogo tecnico, confirmando la necesidad de esta herramienta)
- [Klopman -- Fabric Finder](https://www.klopman.com/products) -- MEDIUM confidence (referencia de filtrado textil B2B)

---
*Feature research for: Lafayette Uni For Me Colegios v1.1 -- Catalogo Completo*
*Researched: 2026-02-22*
*Previous version: 2026-02-21 (v1.0 scope -- archived)*
