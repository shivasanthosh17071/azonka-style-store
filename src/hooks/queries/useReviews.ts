import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as reviewsApi from "@/lib/api/reviews.api";

export const useReviews = (productId: string | undefined, page = 1) =>
  useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: () => reviewsApi.getProductReviews(productId as string, { page, limit: 10 }),
    enabled: Boolean(productId),
  });

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; comment?: string }) =>
      reviewsApi.createReview({ product: productId, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};
