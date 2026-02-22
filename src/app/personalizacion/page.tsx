import type { Metadata } from 'next'
import Image from 'next/image'
import { PERSONALIZATION_OPTIONS } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'

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

      <h1 className="mt-6 text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Personalización de Uniformes
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 max-w-3xl mx-auto">
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
    </div>
  )
}
