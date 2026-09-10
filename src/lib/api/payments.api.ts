import { apiPost } from "./client";
import type { Order, RazorpayOrderResult, VerifyPaymentPayload } from "@/types";

export const createRazorpayOrder = (orderId: string) =>
  apiPost<RazorpayOrderResult>("/payments/razorpay/create-order", { orderId });

export const verifyRazorpayPayment = (body: VerifyPaymentPayload) =>
  apiPost<{ order: Order }>("/payments/razorpay/verify", body);
