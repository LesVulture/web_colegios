import { icons } from 'lucide-react'

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

  const LucideIcon = icons[icon as keyof typeof icons]
  return LucideIcon ? <LucideIcon size={size} /> : null
}
