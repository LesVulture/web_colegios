import type { Category } from '@/lib/content/types'
import { CATEGORY_STYLE_MAP } from '@/lib/content/styles'

export function CategoryHeader({
  category,
  fabricCount,
}: {
  category: Category
  fabricCount: number
}) {
  const colors = CATEGORY_STYLE_MAP[category.id]

  return (
    <div className={`${colors.bg} ${colors.fg} rounded-xl p-6 md:p-8 lg:p-10`}>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
        {category.name}
      </h1>
      {'description' in category && category.description && (
        <p className="opacity-90 text-sm md:text-base mt-1">
          {category.description}
        </p>
      )}
      <p className="mt-2 text-sm opacity-80">
        {fabricCount} telas disponibles
      </p>
    </div>
  )
}
