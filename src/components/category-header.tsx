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
    <div className={`${colors.bg} ${colors.fg} rounded-lg p-6 lg:p-8`}>
      <h1 className="text-2xl lg:text-3xl font-heading font-bold">
        {category.name}
      </h1>
      {'description' in category && (
        <p className="opacity-80 text-sm mt-1">{category.description as string}</p>
      )}
      <p className="mt-2 text-sm opacity-70">{fabricCount} telas disponibles</p>
    </div>
  )
}
