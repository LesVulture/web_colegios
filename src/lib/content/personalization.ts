import type { PersonalizationOption } from './types';

export const PERSONALIZATION_OPTIONS = [
  {
    id: 'dibujos-exclusivos',
    name: 'Dibujos Nuevos y Exclusivos',
    description:
      'Creacion de disenos unicos para instituciones que requieren una tela diferente segun sus necesidades particulares.',
    image: '/images/content/page15-95.webp',
  },
  {
    id: 'estampacion-digital',
    name: 'Disenos de Alta Definicion con Estampacion Digital',
    description:
      'Impresion de alta definicion sobre tela mediante tecnologia de sublimacion digital, ideal para disenos detallados y policromias complejas.',
    image: '/images/content/page15-94.webp',
  },
  {
    id: 'estampacion-davos',
    name: 'Estampacion Tipo Davos (Marca de Agua)',
    description:
      'Proceso que por temperatura y presion graba un diseno sobre la tela.',
    image: '/images/content/page15-96.webp',
  },
  {
    id: 'desarrollo-color',
    name: 'Desarrollo de un Nuevo Color',
    description:
      'Programacion de un color exclusivo que no se encuentre en el portafolio de linea vigente.',
    image: '/images/content/page15-93.webp',
  },
] as const satisfies readonly PersonalizationOption[];
