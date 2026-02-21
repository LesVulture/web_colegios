# Lafayette Uni For Me Colegios — Web Comercial

## What This Is

Sitio web catálogo para la fuerza de ventas de Lafayette, enfocado en presentar la oferta de soluciones textiles para uniformes escolares ("Uni For Me Colegios"). Es una herramienta interna que los vendedores usan en reuniones presenciales con colegios, mostrándola en laptop/tablet. No es pública ni requiere SEO.

## Core Value

El vendedor puede presentar toda la oferta de telas para uniformes escolares de forma visual, organizada y profesional, navegando fluidamente entre categorías de producto durante una reunión comercial.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home page con hero de marca y navegación a las 8 categorías de uso
- [ ] Página individual por cada categoría de uso (8 en total) con fichas técnicas de telas
- [ ] Sección de Tecnologías Textiles (12 tecnologías con iconos)
- [ ] Sección de Personalización de Uniformes (4 opciones)
- [ ] Sección de Cuellos (colores, tallas, info comercial)
- [ ] Header global con logo Lafayette top-left (12px offset) + navegación responsive
- [ ] Diseño web moderno 2025 usando la paleta de colores del PDF (cada categoría tiene su color)
- [ ] Fotos extraídas del PDF integradas con next/image
- [ ] Assets de logos de tecnologías integrados desde carpeta Assets/
- [ ] Desktop-first, responsive a tablet
- [ ] Compatible con Vercel deploy

### Out of Scope

- SEO y meta tags públicos — herramienta interna, no requiere indexación
- Formularios de contacto o leads — es solo catálogo informativo
- WhatsApp o chat — vendedor está presente en la reunión
- Secciones de Certificaciones, Etiquetas/Marquillas, Tiendas, Sostenibilidad — no prioritarias para v1
- Autenticación/login — no necesario por ahora
- E-commerce o carrito — no es transaccional
- Mobile phone optimization — se usa en laptop/tablet, no en celular

## Context

### Contenido Base
- PDF "Uniformes_Colegios.pdf" (24 páginas, 37MB) — fuente única de verdad para contenido y fotos
- 13 assets de logos de tecnologías en /Assets/

### Estructura del Catálogo (del PDF)
8 categorías de uso, cada una con color distintivo:

| # | Categoría | Color | Páginas PDF | Telas |
|---|-----------|-------|-------------|-------|
| 1 | Sudaderas - Chaquetas - Pantalones | Azul oscuro (#1B3A5C) | 4-5 | Vendaval Crushed R, Orión Clororresistente, Gorek, Glou Crushed, T180, Universal Clororresistente, Microtec Clororresistente, Microprince, Fastrack |
| 2 | Camisetas - Polos | Azul claro (#3FA9D5) | 6 | Apolo, Polux, Zanetti, Tikal R, Cole Plus |
| 3 | Uniforme Deportivo | Verde (#6CB33F) | 7 | Montesimone R Antibacterial, Montesimone, Hydrotech, Hydrotech Antibacterial |
| 4 | Uniforme Diario - Faldas - Blazers | Magenta (#E91E8C) | 8 | Stefano R, Dynamic, Microdrill, Alviero Stretch, Novastretch LC, Universal Ripstop |
| 5 | Buzos - Hoodies - Perchados | Amarillo (#F7C948) | 9 | Celta, Fastrack, Dual, Microtitán Plus |
| 6 | Chaquetas Prom | Rojo (#C42034) | 10 | Alviero Stretch, Universal Clororresistente, Orión Clororresistente, Microtec Clororresistente, Celta |
| 7 | Blusas - Camisas | Morado (#7B4B94) | 11 | Metro LC, Queen, Andes R, Alessio |
| 8 | Delantales - Batas de Laboratorio | Naranja (#F7941D) | 12 | T180, Universal Clororresistente, Orión Clororresistente, Gorek, Alviero Stretch, Microdrill |

### Secciones Adicionales
- **Tecnologías Textiles** (pág 14): 12 tecnologías (Protección Solar, Impermeabilidad, Resistencia, Antifluido/Repelencia, Libertad de Movimiento, Algodón, Desempeño, Control de Humedad, Antibacterial, Antimanchas, Clororresistente, Térmico, Solidez a la Luz, Sostenible) + 5 beneficios
- **Personalización** (pág 15): Dibujos exclusivos, Estampación digital, Estampación tipo Davos, Desarrollo de color
- **Cuellos** (pág 16-17): Complemento para polos, 4 colores disponibles, tallas niños y adolescentes/adultos

### Marca
- Logo principal: `Assets/LOGO_PRINCIPAL_LAFAYETTE.png`
- Submarca: "Lafayette Uni For Me" (no hay asset, usar tipografía)
- Colores primarios: azul oscuro (marca), rojo (acento Lafayette)
- Tipografía del PDF: sans-serif bold para títulos, regular para cuerpo

### Assets Disponibles
```
Assets/
├── LOGO_PRINCIPAL_LAFAYETTE.png
├── LOGO_LAFTECH.png
├── LOGO_PROTECCIÓN_SOLAR.png
├── LOGO_TECNOLOGIA_ANTIBACTERIAL.png
├── LOGO_TECNOLOGIA_ANTIFLUIDO.png
├── LOGO_TECNOLOGIA_ANTIRRASGADO.png
├── LOGO_TECNOLOGIA_CLORORRESISTENTE.png
├── LOGO_TECNOLOGIA_DESEMPEÑO.png
├── LOGO_TECNOLOGIA_ELASTICIDAD_STRETCH.png
├── LOGO_TECNOLOGIA_IMPERMEABLE.png
├── LOGO_TECNOLOGIA_SECADO RÁPIDO.png
├── LOGO_TECNOLOGIA_SOSTENIBLE_HILOS_RECICLADOS.png
└── LOGO COBRANDING LAFTECH TÉRMICOS...png
```

## Constraints

- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Deploy**: Vercel-compatible
- **Contenido**: Solo del PDF — no inventar texto ni especificaciones
- **Fotos**: Extraer del PDF (no hay originales en alta resolución)
- **Diseño**: Moderno web 2025, no réplica del PDF, pero mismos colores
- **Dispositivo**: Desktop-first, responsive a tablet (no se optimiza para celular)
- **Package manager**: Bun (no npm)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-page con rutas por categoría | El vendedor puede navegar directo a la categoría que el cliente pregunte, sin scroll largo. Mejor para reuniones con agenda cambiante. | — Pending |
| Diseño moderno 2025 (no réplica PDF) | El PDF es para impresión. La web debe sentirse como producto digital profesional, no como PDF en pantalla. | — Pending |
| Solo informativo (sin CTA/formularios) | El vendedor está presente en la reunión. No necesita captura de leads. | — Pending |
| Extraer imágenes del PDF | No hay originales disponibles. Calidad suficiente para presentación en pantalla. | — Pending |

---
*Last updated: 2025-02-21 after initialization*
