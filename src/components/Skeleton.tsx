export function SkeletonCard() {
  return (
    <div className="aspect-[2/3] rounded-2xl bg-[#0E1015] border border-[#1F232D] skeleton-pulse" />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-3 px-4 md:px-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[50vh] bg-[#0E1015] rounded-2xl mb-8" />
      <div className="space-y-4 px-4 md:px-8">
        <div className="h-8 bg-[#0E1015] rounded w-1/3" />
        <div className="h-4 bg-[#0E1015] rounded w-2/3" />
        <div className="h-4 bg-[#0E1015] rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonEpisodes() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#0E1015] rounded-xl border border-[#1F232D]" />
      ))}
    </div>
  );
}
