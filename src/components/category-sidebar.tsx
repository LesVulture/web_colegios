'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/content'
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'
import { cn } from '@/lib/utils'

export function CategorySidebar() {
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2]
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollHints = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  // Auto-scroll active pill into view on mount
  useEffect(() => {
    const el = activeRef.current
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' })
    }
    // Update hints after scroll
    requestAnimationFrame(updateScrollHints)
  }, [currentSlug, updateScrollHints])

  // Track scroll position for fade indicators
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollHints, { passive: true })
    updateScrollHints()
    return () => el.removeEventListener('scroll', updateScrollHints)
  }, [updateScrollHints])

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

      {/* Mobile/Tablet horizontal scroll bar */}
      <div className="lg:hidden mb-6 relative">
        {/* Left fade indicator */}
        <div
          className={cn(
            'pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white to-transparent transition-opacity duration-200',
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          )}
        />
        {/* Right fade indicator */}
        <div
          className={cn(
            'pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200',
            canScrollRight ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none -mx-4 px-4"
        >
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === currentSlug
              const colors = CATEGORY_STYLE_MAP[cat.id]
              return (
                <Link
                  key={cat.id}
                  ref={isActive ? activeRef : undefined}
                  href={`/uso/${cat.id}`}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
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
      </div>
    </>
  )
}
