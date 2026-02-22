import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personalización - Lafayette Uni For Me',
  description: 'Opciones de personalización para uniformes escolares',
}

export default function PersonalizacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Personalización de Uniformes
      </h1>
      <p className="text-muted-foreground mt-4">
        Esta sección está en construcción. Próximamente podrás ver las opciones
        de personalización disponibles.
      </p>
    </div>
  )
}
