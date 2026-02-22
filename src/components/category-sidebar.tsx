'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/content'
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'
import { cn } from '@/lib/utils'

export function CategorySidebar() {
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-56 lg:shrink-0">
        <nav className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === currentSlug
            const colors = CATEGORY_STYLE_MAP[cat.id]
            return (
              <Link
                key={cat.id}
                href={`/uso/${cat.id}`}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? `${colors.bg} ${colors.fg}`
                    : 'text-foreground/70 hover:bg-muted'
                )}
              >
                {cat.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Tablet horizontal scroll bar */}
      <div className="lg:hidden mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === currentSlug
            const colors = CATEGORY_STYLE_MAP[cat.id]
            return (
              <Link
                key={cat.id}
                href={`/uso/${cat.id}`}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? `${colors.bg} ${colors.fg}`
                    : 'text-foreground/70 bg-muted hover:bg-muted/80'
                )}
              >
                {cat.name}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
