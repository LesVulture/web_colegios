import Image from 'next/image'
import Link from 'next/link'
import { getTechnologyById } from '@/lib/content'
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
      className="group block rounded-lg border border-border bg-background overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={fabric.image}
          alt={fabric.name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground">
          {fabric.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {fabric.technologies.map((techId) => {
            const tech = getTechnologyById(techId)
            return tech ? (
              <span
                key={techId}
                className="inline-block rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tech.name}
              </span>
            ) : null
          })}
        </div>
      </div>
    </Link>
  )
}
