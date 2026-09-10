import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/common/StarRating";
import { usePendingReviews, useModerateReview } from "@/hooks/queries/useAdmin";
import { formatDate } from "@/lib/format";
import { ApiException } from "@/lib/api/client";

export function ReviewsPage() {
  const { data, isLoading } = usePendingReviews({ limit: 50 });
  const moderate = useModerateReview();

  const handleModerate = (id: string, isApproved: boolean) => {
    moderate.mutate(
      { id, isApproved },
      {
        onSuccess: () => toast.success(isApproved ? "Review approved" : "Review rejected"),
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not moderate review"),
      },
    );
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Reviews</h1>
      <p className="mt-1 text-sm text-ink-soft">Pending moderation queue — reviews from verified purchases auto-approve.</p>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-ink-soft">Loading…</p>}
        {!isLoading && data?.reviews.length === 0 && (
          <div className="border border-line bg-background p-8 text-center text-sm text-ink-soft">Nothing pending review.</div>
        )}
        {data?.reviews.map((review) => {
          const product = typeof review.product === "object" ? review.product : null;
          const user = typeof review.user === "object" ? review.user : null;
          return (
            <div key={review._id} className="border border-line bg-background p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {product?.images?.[0] && <img src={product.images[0].url} alt="" className="size-12 shrink-0 object-cover" />}
                  <div>
                    <p className="text-sm font-semibold">{product?.name || "Product"}</p>
                    <p className="text-xs text-ink-soft">
                      {user?.name || "Customer"} · {formatDate(review.createdAt)}
                    </p>
                    <div className="mt-1">
                      <StarRating value={review.rating} />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" onClick={() => handleModerate(review._id, true)} className="rounded-none bg-brick hover:bg-brick-dark">
                    <Check className="size-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleModerate(review._id, false)} className="rounded-none text-destructive hover:bg-destructive/10">
                    <X className="size-3.5" /> Reject
                  </Button>
                </div>
              </div>
              {review.comment && <p className="mt-3 text-sm text-ink-soft">{review.comment}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
