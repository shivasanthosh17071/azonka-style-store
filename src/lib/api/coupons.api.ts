import { apiDelete, apiGetWithMeta, apiPost, apiPut } from "./client";
import type { ApplyCouponResult, Coupon, CouponPayload, PaginationMeta } from "@/types";

export const applyCoupon = (body: {
  code: string;
  items?: { product: string; sku: string; qty: number }[];
  fromCart?: boolean;
}) => apiPost<ApplyCouponResult>("/coupons/apply", body);

/* ---------- admin ---------- */

export const listCoupons = async (params: { page?: number; limit?: number } = {}) => {
  const { data, meta } = await apiGetWithMeta<{ coupons: Coupon[] }>("/coupons", { params });
  return { coupons: data.coupons, meta: meta as PaginationMeta };
};

export const createCoupon = (body: CouponPayload) => apiPost<{ coupon: Coupon }>("/coupons", body);

export const updateCoupon = (id: string, body: Partial<CouponPayload>) =>
  apiPut<{ coupon: Coupon }>(`/coupons/${id}`, body);

export const deleteCoupon = (id: string) => apiDelete<undefined>(`/coupons/${id}`);
