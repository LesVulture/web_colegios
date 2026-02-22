import type { Metadata } from 'next'
import { COLLAR_DATA, getTechnologyById } from '@/lib/content'
import { TechIcon } from '@/components/tech-icon'
import { Breadcrumb } from '@/components/breadcrumb'

export const metadata: Metadata = {
  title: 'Cuellos - Lafayette Uni For Me',
  description:
    'Cuellos y punos para uniformes escolares: colores disponibles, tablas de tallas y notas comerciales.',
}

export default function CuellosPage() {
  const technologies = COLLAR_DATA.technologies
    .map((id) => getTechnologyById(id))
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[{ label: 'Inicio', href: '/' }, { label: 'Cuellos' }]}
      />

      {/* Page header */}
      <h1 className="mt-6 text-3xl lg:text-4xl font-heading font-semibold text-foreground">
        Cuellos y Punos
      </h1>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        <p>{COLLAR_DATA.material}</p>
        <p>
          <span className="font-medium text-foreground">Garantia:</span>{' '}
          {COLLAR_DATA.guarantee}
        </p>
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {technologies.map((tech) =>
            tech ? (
              <span
                key={tech.id}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <TechIcon icon={tech.icon} size={16} />
                {tech.name}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Colors section */}
      <section className="mt-10">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Colores Disponibles
        </h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLLAR_DATA.colors.map((color, i) => (
            <div
              key={color.id}
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span
                className="size-12 shrink-0 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-foreground">{color.name}</p>
                <p className="text-xs text-muted-foreground">
                  Ref. {color.productCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size tables section */}
      <section className="mt-10">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Tabla de Tallas
        </h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Children table */}
          <div className="rounded-lg border border-border overflow-hidden animate-fade-in-up">
            <div className="bg-surface px-4 py-3">
              <h3 className="font-heading font-semibold text-foreground">
                Ninos
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Talla
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Cuello
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Puno
                  </th>
                </tr>
              </thead>
              <tbody>
                {COLLAR_DATA.sizes.children.map((row) => (
                  <tr key={row.size} className="border-b border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.size}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.collarMeasure}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.cuffMeasure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adolescents/Adults table */}
          <div
            className="rounded-lg border border-border overflow-hidden animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="bg-surface px-4 py-3">
              <h3 className="font-heading font-semibold text-foreground">
                Adolescentes y Adultos
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Talla
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Cuello
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Puno
                  </th>
                </tr>
              </thead>
              <tbody>
                {COLLAR_DATA.sizes.adolescentsAdults.map((row) => (
                  <tr key={row.size} className="border-b border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.size}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.collarMeasure}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.cuffMeasure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Commercial notes section */}
      <section className="mt-10">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Informacion Importante
        </h2>
        <div className="mt-4 rounded-lg border-l-4 border-brand-primary bg-surface p-6 animate-fade-in-up">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {COLLAR_DATA.commercialNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
