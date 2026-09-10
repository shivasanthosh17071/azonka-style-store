import { apiDelete, apiGetWithMeta, apiPost, apiPut } from "./client";
import type { PaginationMeta, RatingBreakdown, Review } from "@/types";

export const getProductReviews = async (productId: string, params: { page?: number; limit?: number } = {}) => {
  const { data, meta } = await apiGetWithMeta<{ reviews: Review[]; ratingBreakdown: RatingBreakdown }>(
    `/reviews/product/${productId}`,
    { params },
  );
  return { reviews: data.reviews, ratingBreakdown: data.ratingBreakdown, meta: meta as PaginationMeta };
};

export const createReview = (body: { product: string; rating: number; comment?: string }) =>
  apiPost<{ review: Review }>("/reviews", body);

export const updateReview = (id: string, body: { rating?: number; comment?: string }) =>
  apiPut<{ review: Review }>(`/reviews/${id}`, body);

export const deleteReview = (id: string) => apiDelete<undefined>(`/reviews/${id}`);
