import { Star } from "lucide-react";

export function StarRating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const dims = size === "sm" ? "size-3" : "size-4";
  return (
    <div className="flex items-center gap-1 text-[11px]">
      <div className="flex text-brick">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={dims} fill={n <= Math.round(value) ? "currentColor" : "none"} strokeWidth={1.5} />
        ))}
      </div>
      {count !== undefined && <span className="text-ink-soft">({count})</span>}
    </div>
  );
}
