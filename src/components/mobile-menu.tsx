'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { NavLinks } from '@/components/nav-links'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change (pitfall 4)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground/70 hover:text-foreground transition-colors"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay + Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <nav
            className="absolute right-0 top-0 h-full w-72 bg-background p-6 shadow-xl transition-transform duration-300 overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            {/* Close button inside panel */}
            <div className="mb-8 flex items-center justify-between">
              <Image
                src="/images/logo-lafayette.png"
                alt="Lafayette"
                width={120}
                height={40}
                className="h-auto w-[120px]"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            <NavLinks
              orientation="vertical"
              onNavigate={() => setIsOpen(false)}
            />
          </nav>
        </div>
      )}
    </div>
  )
}
