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
              className="group relative block rounded-xl overflow-hidden transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            >
              {/* Background image */}
              <div className="relative aspect-[3/4] md:aspect-[4/5]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: (category as import('@/lib/content/types').Category).imagePosition ?? 'center' }}
                />
                {/* Color overlay */}
                <div
                  className={`absolute inset-0 ${colors.bg} opacity-60 transition-opacity duration-200 group-hover:opacity-50`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Text content */}
              <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-5 lg:p-6 ${colors.fg}`}>
                <h2 className="text-base md:text-lg lg:text-xl font-heading font-semibold leading-tight">
                  {category.name}
                </h2>
                <p className="text-sm opacity-80 mt-1">
                  {fabricCount} telas
                </p>
                {'description' in category && (
                  <p className="text-xs opacity-70 mt-0.5 hidden md:block">
                    {category.description as string}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
