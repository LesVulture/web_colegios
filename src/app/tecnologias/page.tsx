import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tecnologías Textiles - Lafayette Uni For Me',
  description: 'Tecnologías textiles para uniformes escolares',
}

export default function TecnologiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Tecnologías Textiles
      </h1>
      <p className="text-muted-foreground mt-4">
        Esta sección está en construcción. Próximamente podrás explorar las 12
        tecnologías textiles de Lafayette.
      </p>
    </div>
  )
}
