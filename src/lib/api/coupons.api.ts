import { apiPost } from "./client";
import type { ApplyCouponResult } from "@/types";

export const applyCoupon = (body: {
  code: string;
  items?: { product: string; sku: string; qty: number }[];
  fromCart?: boolean;
}) => apiPost<ApplyCouponResult>("/coupons/apply", body);
