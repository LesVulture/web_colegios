'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-triggered visibility hook using Intersection Observer.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 * Once visible, stays visible (no re-triggering on scroll out).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}
