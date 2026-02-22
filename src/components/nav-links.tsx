'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Cpu, Palette, Shirt } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Cpu,
  Palette,
  Shirt,
}

export function NavLinks({
  orientation = 'horizontal',
  onNavigate,
}: {
  orientation?: 'horizontal' | 'vertical'
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex items-center',
        orientation === 'horizontal' ? 'gap-6' : 'flex-col items-start gap-4'
      )}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon]
        const isActive = pathname.startsWith(item.activePrefix ?? item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center font-medium transition-colors',
              orientation === 'horizontal'
                ? 'gap-2 text-sm'
                : 'gap-3 py-2 text-lg',
              isActive
                ? 'text-brand-accent font-semibold'
                : 'text-foreground/70 hover:text-foreground'
            )}
          >
            {Icon && (
              <Icon size={orientation === 'horizontal' ? 18 : 22} />
            )}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
