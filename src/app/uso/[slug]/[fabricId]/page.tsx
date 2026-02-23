import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  CATEGORIES,
  getCategoryBySlug,
  getFabricBySlug,
  getCategoriesByFabric,
  getTechnologyById,
} from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'
import { TechIcon } from '@/components/tech-icon'

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

  const otherCategories = getCategoriesByFabric(fabricId).filter(
    (c) => c.id !== slug
  )

  const specs = [
    { label: 'Composición', value: fabric.composition },
    { label: 'Gramaje', value: fabric.weight },
    { label: 'Ancho', value: fabric.width },
    { label: 'Tipo de Tejido', value: fabric.weave },
    { label: 'Base', value: fabric.base },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Usos', href: '/usos' },
          { label: category.name, href: `/uso/${slug}` },
          { label: fabric.name },
        ]}
      />

      {/* Header: name + badge */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          {fabric.name}
        </h1>
        {'isNew' in fabric && fabric.isNew && (
          <span className="rounded-full bg-brand-accent text-brand-accent-foreground px-2.5 py-0.5 text-xs font-semibold">
            Nuevo
          </span>
        )}
      </div>

      {/* Specs table with alternating rows */}
      <section className="mt-8 pt-6 section-divider">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Especificaciones
        </h2>
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, i) => (
              <tr
                key={spec.label}
                className={`border-b border-border ${i % 2 === 0 ? 'bg-surface' : ''}`}
              >
                <td className="py-3 px-3 pr-4 font-medium text-muted-foreground w-40">
                  {spec.label}
                </td>
                <td className="py-3 px-3 text-foreground">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Print route chips */}
      <section className="mt-8 pt-6 section-divider">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-3">
          Rutas de Estampación
        </h2>
        <div className="flex flex-wrap gap-2">
          {fabric.printRoutes.map((route) => (
            <span
              key={route}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
            >
              {route}
            </span>
          ))}
        </div>
      </section>

      {/* Technology chips with CSS-only tooltips */}
      {fabric.technologies.length > 0 && (
        <section className="mt-8 pt-6 section-divider">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">
            Tecnologías
          </h2>
          <div className="flex flex-wrap gap-2">
            {fabric.technologies.map((techId) => {
              const tech = getTechnologyById(techId)
              if (!tech) return null
              const tooltipId = `tooltip-${tech.id}`
              return (
                <span key={techId} className="group relative inline-flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
                    aria-describedby={tooltipId}
                  >
                    <TechIcon icon={tech.icon} size={14} />
                    {tech.name}
                  </button>
                  <span
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[min(280px,calc(100vw-3rem))] rounded-md bg-foreground px-3 py-2 text-xs text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 z-10"
                  >
                    <span className="font-semibold">{tech.name}</span>
                    <br />
                    {tech.description}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                  </span>
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* Other uses — navigable links */}
      {otherCategories.length > 0 && (
        <section className="mt-8 rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            También disponible en
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/uso/${cat.id}/${fabricId}`}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-sm border border-border bg-muted text-muted-foreground hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <Link
        href={`/uso/${slug}`}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-foreground hover:bg-border transition-colors min-h-[44px]"
      >
        <ArrowLeft size={16} />
        Volver a {category.name}
      </Link>
    </div>
  )
}
