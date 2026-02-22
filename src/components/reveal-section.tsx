'use client'

import { useInView } from '@/hooks/use-in-view'

export function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      data-visible={isInView}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  )
}
