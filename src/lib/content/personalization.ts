import type { PersonalizationOption } from './types';

export const PERSONALIZATION_OPTIONS = [
  {
    id: 'dibujos-exclusivos',
    name: 'Dibujos Nuevos y Exclusivos',
    description:
      'Creación de diseños únicos para instituciones que requieren una tela diferente según sus necesidades particulares.',
    image: '/images/content/page15-95.webp',
  },
  {
    id: 'estampacion-digital',
    name: 'Diseños de Alta Definición con Estampación Digital',
    description:
      'Impresión de alta definición sobre tela mediante tecnología de sublimación digital, ideal para diseños detallados y policromías complejas.',
    image: '/images/content/page15-94.webp',
  },
  {
    id: 'estampacion-davos',
    name: 'Estampación Tipo Davos (Marca de Agua)',
    description:
      'Proceso que por temperatura y presión graba un diseño sobre la tela.',
    image: '/images/content/page15-96.webp',
  },
  {
    id: 'desarrollo-color',
    name: 'Desarrollo de un Nuevo Color',
    description:
      'Programación de un color exclusivo que no se encuentre en el portafolio de línea vigente.',
    image: '/images/content/page15-93.webp',
  },
] as const satisfies readonly PersonalizationOption[];
