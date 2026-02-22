import type { Metadata } from 'next'
import Image from 'next/image'
import { PERSONALIZATION_OPTIONS } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'
import { RevealSection } from '@/components/reveal-section'

export const metadata: Metadata = {
  title: 'Personalización - Lafayette Uni For Me',
  description:
    'Opciones de personalización de uniformes escolares: Davos, Rotativa, Sublimación y Desarrollo de color.',
}

export default function PersonalizacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Personalización' },
        ]}
      />

      <div className="mt-6 pt-6 section-divider">
        <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
          Personalización de Uniformes
        </h1>
      </div>

      <RevealSection className="mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {PERSONALIZATION_OPTIONS.map((option, i) => (
            <div
              key={option.id}
              className="rounded-2xl overflow-hidden bg-surface border border-border animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-square">
                <Image
                  src={option.image}
                  alt={option.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="px-3 py-2.5 md:px-4 md:py-3 text-center">
                <h2 className="text-sm md:text-base font-heading font-bold text-foreground">
                  {option.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  )
}
