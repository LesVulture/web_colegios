import { Flower2, ShieldCheck, Sun } from 'lucide-react'

const LUCIDE_MAP: Record<string, typeof Flower2> = { Flower2, ShieldCheck, Sun }

export function TechIcon({
  icon,
  size = 14,
  className,
}: {
  icon: string
  size?: number
  className?: string
}) {
  if (!icon) return null

  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
        className={className ?? 'inline-block'}
      />
    )
  }

  const LucideIcon = LUCIDE_MAP[icon]
  return LucideIcon ? (
    <LucideIcon
      size={size}
      style={{ width: size, height: size }}
      className={className}
    />
  ) : null
}
