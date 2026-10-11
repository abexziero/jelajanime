import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="h-10 w-56 animate-pulse rounded bg-surface-2" />
      <div className="mt-8">
        <SkeletonGrid count={18} />
      </div>
    </div>
  );
}
