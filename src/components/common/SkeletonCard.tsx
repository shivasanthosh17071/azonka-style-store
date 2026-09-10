import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-none" />
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <Skeleton className="mt-4 h-10 w-full rounded-none" />
    </div>
  );
}
