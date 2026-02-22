export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
