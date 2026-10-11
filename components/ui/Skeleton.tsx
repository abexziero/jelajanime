export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-surface-2" />
      <div className="mt-2 h-3.5 w-4/5 rounded bg-surface-2" />
      <div className="mt-2 h-3 w-2/5 rounded bg-surface-2" />
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-10">
      <div className="h-6 w-48 animate-pulse rounded bg-surface-2" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-40 shrink-0 animate-pulse">
            <div className="aspect-[2/3] rounded-xl bg-surface-2" />
            <div className="mt-2 h-3.5 w-4/5 rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
