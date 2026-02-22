import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/content'
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'

export const metadata: Metadata = {
  title: 'Usos - Lafayette Uni For Me',
  description: 'Categorías de uso para uniformes escolares',
}

export default function UsosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Categorías de Uso
      </h1>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {CATEGORIES.map((category) => {
          const colors = CATEGORY_STYLE_MAP[category.id]
          const fabricCount = category.fabricIds.length

          return (
            <Link
              key={category.id}
              href={`/uso/${category.id}`}
              className={`${colors.bg} ${colors.fg} block rounded-lg p-6 md:p-7 lg:p-8 min-h-[140px] md:min-h-[150px] lg:min-h-[160px] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
            >
              <h2 className="text-lg lg:text-xl font-heading font-semibold">
                {category.name}
              </h2>
              <p className="text-sm opacity-80 mt-2">
                {fabricCount} telas
              </p>
              {'description' in category && (
                <p className="text-sm opacity-70 mt-1">
                  {category.description as string}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
