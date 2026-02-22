import type { Metadata } from 'next'
import Image from 'next/image'
import { PERSONALIZATION_OPTIONS } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'Personalizacion - Lafayette Uni For Me',
  description:
    'Opciones de personalizacion de uniformes escolares: disenos exclusivos, estampacion digital, estampacion Davos y desarrollo de color.',
}

export default function PersonalizacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Personalizacion' },
        ]}
      />

      <h1 className="mt-6 text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Personalizacion de Uniformes
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {PERSONALIZATION_OPTIONS.map((option, i) => (
          <div
            key={option.id}
            className="group overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Image
              src={option.image}
              alt={option.name}
              width={600}
              height={400}
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {option.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
