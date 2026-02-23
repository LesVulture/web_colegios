import type { Metadata } from 'next'
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

      <RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECHNOLOGIES.map((tech, i) => {
            const fabrics = getFabricsByTechnology(tech.id)

            return (
              <article
                key={tech.id}
                className="group overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
              >
                {/* Navy hero — logo as protagonist */}
                <div className="bg-brand-primary px-5 pt-6 pb-5 flex flex-col items-center">
                  <div className="size-28 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                    <TechIcon icon={tech.icon} size={80} className="inline-block" />
                  </div>
                  <h2 className="font-heading font-bold text-white text-base text-center leading-tight">
                    {tech.name}
                  </h2>
                  <p className="text-xs text-white/65 mt-1 text-center">
                    {tech.description}
                  </p>
                </div>

                {/* Red accent divider */}
                <div className="h-1 bg-brand-accent" />

                {/* White content — fabric pills */}
                {fabrics.length > 0 && (
                  <div className="bg-background px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary/50 mb-3">
                      {fabrics.length} {fabrics.length === 1 ? 'tela' : 'telas'}
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
                            className="rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 text-xs text-foreground/70 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors duration-200"
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
