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
      <section className="overflow-hidden rounded-lg">
        <Image
          src="/images/hero-colegios.webp"
          alt="Lafayette Uni For Me — Soluciones textiles para uniformes de colegios"
          width={1147}
          height={634}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
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
