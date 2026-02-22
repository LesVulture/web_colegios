import type { Metadata } from 'next'
import Image from 'next/image'
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
              className={`group block rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-lg ${colors.bgLight}`}
            >
              {/* Image area — clean, no overlay */}
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: (category as unknown as { imagePosition?: string }).imagePosition ?? 'center' }}
                />
              </div>

              {/* Category name bar */}
              <div className={`${colors.bg} px-3 py-2 md:px-4 md:py-2.5`}>
                <h2 className={`text-xs md:text-sm lg:text-base font-heading font-bold uppercase leading-tight tracking-wide text-center ${colors.fg}`}>
                  {category.name}
                </h2>
              </div>

              {/* Fabric count */}
              <div className="px-3 py-2 md:px-4 md:py-3 text-center">
                <p className="text-sm md:text-base font-semibold text-foreground">
                  {fabricCount} telas
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
