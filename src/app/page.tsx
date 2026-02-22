import Image from 'next/image'
import Link from 'next/link'
import { LayoutGrid, Cpu, Palette, Shirt } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Cpu,
  Palette,
  Shirt,
}

/** Maps each nav section href to its representative background image */
const sectionImages: Record<string, string> = {
  '/usos': '/images/content/page14-45.webp',
  '/tecnologias': '/images/content/page13-43.webp',
  '/personalizacion': '/images/content/page13-38.webp',
  '/cuellos': '/images/content/page16-103.webp',
}

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      {/* Hero Section */}
      <section className="relative h-[320px] overflow-hidden rounded-lg md:h-[400px] lg:h-[500px]">
        <Image
          src="/images/content/page17-105.webp"
          alt="Uniformes escolares Lafayette"
          fill
          sizes="100vw"
          className="object-cover"
          preload
        />
        <div className="absolute inset-0 bg-brand-primary/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <h1 className="text-center font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Lafayette Uni For Me
          </h1>
          <p className="mt-2 text-center font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Colegios
          </p>
          <p className="mt-4 text-center text-lg text-white/80">
            Soluciones textiles para uniformes escolares
          </p>
        </div>
      </section>

      {/* Grid de 4 Secciones */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const bgImage = sectionImages[item.href]

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative h-48 cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] md:h-52 lg:h-56"
            >
              {bgImage ? (
                <Image
                  src={bgImage}
                  alt={item.label}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-brand-primary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 text-white">
                {Icon && <Icon size={24} />}
                <span className="text-lg font-semibold">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
