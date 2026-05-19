function SkeletonCard() {
  return (
    <div className="bg-darkCard rounded-xl overflow-hidden border border-white/5">
      <div className="aspect-[3/4] shimmer-bg"/>
      <div className="p-3 space-y-2"><div className="h-3 shimmer-bg rounded w-full"/><div className="h-3 shimmer-bg rounded w-3/4"/></div>
    </div>
  )
}
export default function LoadingSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i}/>)}
    </div>
  )
}
