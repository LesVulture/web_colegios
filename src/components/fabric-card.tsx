import Image from 'next/image'
import Link from 'next/link'
import { icons } from 'lucide-react'
import { getTechnologyById } from '@/lib/content'
import type { Fabric } from '@/lib/content/types'

function TechIcon({ icon }: { icon: string }) {
  if (!icon) return null

  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        width={14}
        height={14}
        className="inline-block"
      />
    )
  }

  const LucideIcon = icons[icon as keyof typeof icons]
  return LucideIcon ? <LucideIcon size={14} /> : null
}

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
