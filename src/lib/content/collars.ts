import type { CollarData } from './types';

export const COLLAR_DATA: CollarData = {
  material: 'Cuellos 100% hilaza poliéster Lafayette',
  guarantee: 'Duración de color, Resistencia, Calidad',
  technologies: ['desempeno', 'proteccion-solar', 'control-humedad'],
  colors: [
    { id: 'negro', name: 'Negro', hex: '#1a1a1a', productCode: '194006' },
    { id: 'blanco', name: 'Blanco', hex: '#FFFFFF', productCode: '110601' },
    { id: 'rojo', name: 'Rojo', hex: '#C42034', productCode: '181663' },
    {
      id: 'azul',
      name: 'Azul Oscuro',
      hex: '#1B3A5C',
      productCode: '194024',
    },
  ],
  sizes: {
    children: [
      { size: 'Talla 2 - 4', collarMeasure: '28"7', cuffMeasure: '28"3' },
      { size: 'Talla 6 - 8', collarMeasure: '30"7', cuffMeasure: '28"3' },
      { size: 'Talla 10 - 12', collarMeasure: '32"7', cuffMeasure: '28"3' },
      { size: 'Talla 14 - 16', collarMeasure: '34"7', cuffMeasure: '28"3' },
    ],
    adolescentsAdults: [
      { size: 'Talla XS', collarMeasure: '36"8', cuffMeasure: '37"3' },
      { size: 'Talla S', collarMeasure: '38"8', cuffMeasure: '37"3' },
      { size: 'Talla M', collarMeasure: '40"8', cuffMeasure: '37"3' },
      { size: 'Talla L', collarMeasure: '42"8', cuffMeasure: '37"3' },
      { size: 'Talla XL', collarMeasure: '44"8', cuffMeasure: '37"3' },
      { size: 'Talla 2XL', collarMeasure: '46"8', cuffMeasure: '37"3' },
    ],
  },
  commercialNotes: [
    'Es imprescindible tener un pedido de tela para acompañar el pedido de cuellos.',
    'Otros colores diferentes a los que tienen disponibilidad inmediata, se deben solicitar por programación.',
    'Ofrecemos el juego de cuellos y puños por programación.',
  ],
} as const;
