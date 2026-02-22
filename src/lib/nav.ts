export type NavItem = {
  readonly href: string
  readonly label: string
  readonly icon: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/usos', label: 'Usos', icon: 'LayoutGrid' },
  { href: '/tecnologias', label: 'Tecnologias', icon: 'Cpu' },
  { href: '/personalizacion', label: 'Personalizacion', icon: 'Palette' },
  { href: '/cuellos', label: 'Cuellos', icon: 'Shirt' },
] as const
