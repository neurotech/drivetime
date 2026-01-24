import { Skeleton } from "@/components/ui/skeleton";

interface TripListSkeletonProps {
  count?: number;
  height?: string;
}

export function TripListSkeleton({
  count = 3,
  height = "h-16",
}: TripListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't reorder
        <Skeleton key={i} className={`${height} w-full`} />
      ))}
    </div>
  );
}
