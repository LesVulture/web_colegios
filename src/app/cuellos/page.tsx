import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cuellos - Lafayette Uni For Me',
  description: 'Opciones de cuellos para uniformes escolares',
}

export default function CuellosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Cuellos
      </h1>
      <p className="text-muted-foreground mt-4">
        Esta sección está en construcción. Próximamente podrás consultar colores,
        tallas y opciones de cuellos.
      </p>
    </div>
  )
}
