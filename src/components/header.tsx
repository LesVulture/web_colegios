import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '@/components/nav-links'
import { MobileMenu } from '@/components/mobile-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 pb-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo-lafayette.png"
            alt="Lafayette Uni For Me"
            width={150}
            height={50}
            className="h-auto w-[140px] lg:w-[160px]"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <NavLinks orientation="horizontal" />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </header>
  )
}
