import type { PersonalizationOption } from './types';

export const PERSONALIZATION_OPTIONS = [
  {
    id: 'estampacion-davos',
    name: 'Davos',
    description:
      'Proceso que por temperatura y presión graba un diseño sobre la tela, creando un efecto tipo marca de agua.',
    image: '/images/content/personalizacion-davos.webp',
    color: '#E05A4E',
  },
  {
    id: 'rotativa',
    name: 'Rotativa',
    description:
      'Estampación mediante cilindros grabados que permiten diseños repetitivos de alta precisión sobre la tela.',
    image: '/images/content/personalizacion-rotativa.webp',
    color: '#E8909A',
  },
  {
    id: 'sublimacion',
    name: 'Sublimación',
    description:
      'Impresión de alta definición mediante tecnología de sublimación digital, ideal para diseños detallados y policromías complejas.',
    image: '/images/content/personalizacion-sublimacion.webp',
    color: '#4A9EAF',
  },
  {
    id: 'desarrollo-color',
    name: 'Desarrollo color',
    description:
      'Programación de un color exclusivo que no se encuentre en el portafolio de línea vigente.',
    image: '/images/content/personalizacion-desarrollo-color.webp',
    color: '#3A8A8A',
  },
] as const satisfies readonly (PersonalizationOption & { color: string })[];
