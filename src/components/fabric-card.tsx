import Link from 'next/link'
import { getTechnologyById } from '@/lib/content'
import { TechIcon } from '@/components/tech-icon'
import type { Fabric } from '@/lib/content/types'

export function FabricCard({
  fabric,
  categorySlug,
}: {
  fabric: Fabric
  categorySlug: string
}) {
  return (
    <Link
      href={`/uso/${categorySlug}/${fabric.id}`}
      className="group block rounded-lg border border-border bg-background overflow-hidden transition-[transform,box-shadow] duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-foreground leading-tight">
            {fabric.name}
          </h3>
          {fabric.isNew && (
            <span className="shrink-0 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent-foreground">
              Nuevo
            </span>
          )}
        </div>

        <p className="mt-1.5 text-sm text-muted-foreground">
          {fabric.composition}
        </p>

        {/* Technical specs */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground/70">{fabric.weave}</span>
          </span>
          <span className="text-border">|</span>
          <span>{fabric.weight.replace(/\s*\+.*/, '')}</span>
          <span className="text-border">|</span>
          <span>{fabric.width.replace(/\s*\+.*/, '')}</span>
        </div>

        {/* Technology chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {fabric.technologies.map((techId) => {
            const tech = getTechnologyById(techId)
            return tech ? (
              <span
                key={techId}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                <TechIcon icon={tech.icon} />
                {tech.name}
              </span>
            ) : null
          })}
        </div>
      </div>
    </Link>
  )
}
