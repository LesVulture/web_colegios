const categories = [
  { name: 'Sudaderas', slug: 'sudaderas', hex: '#1B3A5C' },
  { name: 'Camisetas', slug: 'camisetas', hex: '#3FA9D5' },
  { name: 'Deportivo', slug: 'deportivo', hex: '#6CB33F' },
  { name: 'Diario', slug: 'diario', hex: '#E91E8C' },
  { name: 'Buzos', slug: 'buzos', hex: '#F7C948' },
  { name: 'Chaquetas Prom', slug: 'chaquetas-prom', hex: '#C42034' },
  { name: 'Blusas', slug: 'blusas', hex: '#7B4B94' },
  { name: 'Delantales', slug: 'delantales', hex: '#F7941D' },
] as const

const categoryColorMap: Record<string, { bg: string; fg: string }> = {
  sudaderas: { bg: 'bg-cat-sudaderas', fg: 'text-cat-sudaderas-fg' },
  camisetas: { bg: 'bg-cat-camisetas', fg: 'text-cat-camisetas-fg' },
  deportivo: { bg: 'bg-cat-deportivo', fg: 'text-cat-deportivo-fg' },
  diario: { bg: 'bg-cat-diario', fg: 'text-cat-diario-fg' },
  buzos: { bg: 'bg-cat-buzos', fg: 'text-cat-buzos-fg' },
  'chaquetas-prom': { bg: 'bg-cat-chaquetas-prom', fg: 'text-cat-chaquetas-prom-fg' },
  blusas: { bg: 'bg-cat-blusas', fg: 'text-cat-blusas-fg' },
  delantales: { bg: 'bg-cat-delantales', fg: 'text-cat-delantales-fg' },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8 lg:p-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-semibold text-brand-primary">
            Lafayette Uni For Me - Colegios
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Design System Preview
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Esta pagina muestra todos los tokens del design system funcionando:
            colores de categoria, paleta de marca, tipografia y border-radius.
            Es temporal y sera reemplazada por la home real en Phase 3.
          </p>
        </header>

        {/* 8 Category Colors */}
        <section className="mb-16">
          <h3 className="mb-6 text-xl font-medium text-foreground">
            Colores de Categoria (8)
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((cat) => {
              const colors = categoryColorMap[cat.slug]
              return (
                <div
                  key={cat.slug}
                  className={`${colors.bg} ${colors.fg} flex flex-col items-center justify-center rounded-lg p-6`}
                >
                  <span className="text-lg font-semibold">{cat.name}</span>
                  <span className="mt-1 text-sm opacity-80">{cat.hex}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Brand Colors */}
        <section className="mb-16">
          <h3 className="mb-6 text-xl font-medium text-foreground">
            Paleta de Marca
          </h3>
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center rounded-lg bg-brand-primary p-6 text-brand-primary-foreground">
              <span className="text-lg font-semibold">Primary</span>
              <span className="mt-1 text-sm opacity-80">#1B3A5C</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-brand-accent p-6 text-brand-accent-foreground">
              <span className="text-lg font-semibold">Accent</span>
              <span className="mt-1 text-sm opacity-80">#C42034</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-surface p-6 text-foreground ring-1 ring-border">
              <span className="text-lg font-semibold">Surface</span>
              <span className="mt-1 text-sm opacity-80">#FAFAFA</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-6 text-muted-foreground ring-1 ring-border">
              <span className="text-lg font-semibold">Muted</span>
              <span className="mt-1 text-sm opacity-80">#F5F5F5</span>
            </div>
          </div>
        </section>

        {/* Border Radius Tokens */}
        <section className="mb-16">
          <h3 className="mb-6 text-xl font-medium text-foreground">
            Border Radius Tokens
          </h3>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="size-24 rounded-sm bg-brand-primary" />
              <span className="text-sm text-muted-foreground">
                rounded-sm (0.5rem)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-24 rounded-md bg-brand-primary" />
              <span className="text-sm text-muted-foreground">
                rounded-md (0.75rem)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-24 rounded-lg bg-brand-primary" />
              <span className="text-sm text-muted-foreground">
                rounded-lg (1rem)
              </span>
            </div>
          </div>
        </section>

        {/* Typography Preview */}
        <section className="mb-16">
          <h3 className="mb-6 text-xl font-medium text-foreground">
            Tipografia
          </h3>
          <div className="space-y-4 rounded-lg bg-surface p-8 ring-1 ring-border">
            <h1 className="text-4xl font-semibold">
              h1 - Raleway SemiBold 2.5rem
            </h1>
            <h2 className="text-3xl font-semibold">
              h2 - Raleway SemiBold 2rem
            </h2>
            <h3 className="text-2xl font-medium">
              h3 - Raleway Medium 1.5rem
            </h3>
            <h4 className="text-xl font-medium">
              h4 - Raleway Medium 1.25rem
            </h4>
            <hr className="border-border" />
            <p className="text-base leading-relaxed">
              Body - Montserrat Regular 1rem. Este es un parrafo de ejemplo
              para verificar que la tipografia del cuerpo de texto se renderiza
              correctamente con Montserrat. Las especificaciones tecnicas de
              las telas se mostraran en este estilo.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Body Small - Montserrat Regular 0.875rem. Texto secundario para
              metadatos y descripciones complementarias.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
