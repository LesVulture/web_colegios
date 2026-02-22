import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CATEGORIES, getCategoryBySlug, getFabricsByCategory } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'
import { CategoryHeader } from '@/components/category-header'
import { CategorySidebar } from '@/components/category-sidebar'
import { FilterableFabricGrid } from '@/components/filterable-fabric-grid'

export const dynamicParams = false

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} - Lafayette Uni For Me`,
    description: `Telas para ${category.name.toLowerCase()} en uniformes escolares`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const fabrics = getFabricsByCategory(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Usos', href: '/usos' },
          { label: category.name },
        ]}
      />

      <div className="mt-4">
        <CategoryHeader category={category} fabricCount={fabrics.length} />
      </div>

      <div className="mt-8 lg:flex lg:gap-8">
        <CategorySidebar />

        <div className="flex-1">
          <FilterableFabricGrid fabrics={fabrics} categorySlug={slug} />
        </div>
      </div>
    </div>
  )
}
