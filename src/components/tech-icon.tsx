import { Flower2, ShieldCheck, Sun } from 'lucide-react'

const LUCIDE_MAP: Record<string, typeof Flower2> = { Flower2, ShieldCheck, Sun }

export function TechIcon({ icon, size = 14 }: { icon: string; size?: number }) {
  if (!icon) return null

  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        className="inline-block"
      />
    )
  }

  const LucideIcon = LUCIDE_MAP[icon]
  return LucideIcon ? <LucideIcon size={size} /> : null
}
