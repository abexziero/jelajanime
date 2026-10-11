import { SkeletonRow } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="h-[72vh] min-h-[540px] w-full animate-pulse bg-surface-2/60" />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
}
