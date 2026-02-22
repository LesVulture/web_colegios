import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES, getCategoryBySlug, getFabricBySlug } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'

export const dynamicParams = false

export function generateStaticParams() {
  const params: { slug: string; fabricId: string }[] = []
  for (const cat of CATEGORIES) {
    for (const fabricId of cat.fabricIds) {
      params.push({ slug: cat.id, fabricId })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; fabricId: string }>
}): Promise<Metadata> {
  const { slug, fabricId } = await params
  const category = getCategoryBySlug(slug)
  const fabric = getFabricBySlug(fabricId)
  if (!category || !fabric) return {}

  return {
    title: `${fabric.name} - ${category.name} - Lafayette Uni For Me`,
  }
}

export default async function FabricDetailPage({
  params,
}: {
  params: Promise<{ slug: string; fabricId: string }>
}) {
  const { slug, fabricId } = await params
  const category = getCategoryBySlug(slug)
  const fabric = getFabricBySlug(fabricId)
  if (!category || !fabric) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Usos', href: '/usos' },
          { label: category.name, href: `/uso/${slug}` },
          { label: fabric.name },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          {fabric.name}
        </h1>
        <p className="text-muted-foreground mt-4">
          Ficha técnica en construcción. Disponible próximamente en Fase 5.
        </p>
        <Link
          href={`/uso/${slug}`}
          className="inline-block mt-6 text-sm font-medium text-brand-primary hover:underline"
        >
          ← Volver a {category.name}
        </Link>
      </div>
    </div>
  )
}
