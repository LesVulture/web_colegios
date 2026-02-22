import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { TECHNOLOGIES, getFabricsByTechnology, getCategoriesByFabric } from '@/lib/content'
import { TechIcon } from '@/components/tech-icon'
import { Breadcrumb } from '@/components/breadcrumb'
import { RevealSection } from '@/components/reveal-section'

export const metadata: Metadata = {
  title: 'Tecnologías Textiles - Lafayette Uni For Me',
  description:
    'Conoce las 14 tecnologías textiles de Lafayette para uniformes escolares: protección solar, impermeabilidad, antibacterial, sostenibilidad y más.',
}

export default function TecnologiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[{ label: 'Inicio', href: '/' }, { label: 'Tecnologías' }]}
      />

      <header className="mt-6 mb-10 pt-6 section-divider">
        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
          Tecnologías Textiles
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Cada tela Lafayette incorpora tecnologías especializadas que garantizan
          rendimiento, durabilidad y confort en el uso diario de uniformes
          escolares.
        </p>
      </header>

      {/* LAFTECH seal */}
      <div className="mb-10 flex items-center gap-5 rounded-lg border border-border bg-surface p-5 md:p-6">
        <Image
          src="/images/content/laftech-sello.webp"
          alt="LAFTECH — Sello tecnológico Lafayette"
          width={898}
          height={222}
          sizes="(min-width: 768px) 120px, 80px"
          className="w-20 md:w-[120px] h-auto shrink-0"
        />
        <p className="text-sm md:text-base text-muted-foreground">
          <span className="font-semibold text-foreground">LAFTECH</span> es el sello tecnológico que reúne las tecnologías de Lafayette para todas las bases textiles que las contienen.
        </p>
      </div>

      <RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECHNOLOGIES.map((tech, i) => {
            const fabrics = getFabricsByTechnology(tech.id)

            return (
              <article
                key={tech.id}
                className="rounded-lg border border-border bg-background p-6 transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <TechIcon icon={tech.icon} size={28} />
                  </div>
                  <h2 className="font-heading font-semibold text-foreground text-lg">
                    {tech.name}
                  </h2>
                </div>

                <p className="text-sm text-muted-foreground mt-3">
                  {tech.description}
                </p>

                {fabrics.length > 0 && (
                  <div className="border-t border-border mt-4 pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Telas con esta tecnología
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {fabrics.map((fabric) => {
                        const categories = getCategoriesByFabric(fabric.id)
                        const firstCat = categories[0]
                        if (!firstCat) return null

                        return (
                          <Link
                            key={fabric.id}
                            href={`/uso/${firstCat.id}/${fabric.id}`}
                            className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            {fabric.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </RevealSection>
    </div>
  )
}
