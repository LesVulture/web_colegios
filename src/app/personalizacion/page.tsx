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
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 max-w-3xl mx-auto">
          {PERSONALIZATION_OPTIONS.map((option, i) => (
            <div
              key={option.id}
              className="overflow-hidden rounded-xl animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Image
                src={option.image}
                alt={option.name}
                width={271}
                height={255}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  )
}
