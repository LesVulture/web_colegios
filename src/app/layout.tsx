import type { Metadata } from 'next'
import { Raleway, Montserrat } from 'next/font/google'
import { Header } from '@/components/header'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lafayette Uni For Me - Colegios',
  description: 'Catálogo de soluciones textiles para uniformes escolares',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${raleway.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
