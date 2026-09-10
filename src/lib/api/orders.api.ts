import { apiGetWithMeta, apiPatch, apiPost, http } from "./client";
import type { CreateOrderPayload, Order, OrderStatus, PaginationMeta, TrackedOrder } from "@/types";

export const createOrder = (body: CreateOrderPayload) =>
  apiPost<{ order: Order; nextStep: string | null }>("/orders", body);

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
}

export const listOrders = async (params: OrderListParams = {}) => {
  const { data, meta } = await apiGetWithMeta<{ orders: Order[] }>("/orders", { params });
  return { orders: data.orders, meta: meta as PaginationMeta };
};

export const getOrder = async (id: string) => {
  const res = await http.get<{ data: { order: Order } }>(`/orders/${id}`);
  return res.data.data.order;
};

export const trackOrder = async (params: { orderNumber: string; phone?: string; email?: string }) => {
  const res = await http.get<{ data: { order: TrackedOrder } }>("/orders/track", { params });
  return res.data.data.order;
};

export const cancelOrder = (id: string, reason: string) =>
  apiPatch<{ order: Order }>(`/orders/${id}/cancel`, { reason });

/* ---------- admin ---------- */

export const updateStatus = (id: string, status: OrderStatus, note?: string) =>
  apiPatch<{ order: Order }>(`/orders/${id}/status`, { status, note });

export const updateCourier = (
  id: string,
  body: { name: string; awbNumber: string; trackingUrl?: string; estimatedDelivery?: string },
) => apiPatch<{ order: Order }>(`/orders/${id}/courier`, body);

export const refundOrder = (orderId: string, body: { amount?: number; reason?: string } = {}) =>
  apiPost<{ order: Order; refund: { id: string; status: string } }>(`/payments/${orderId}/refund`, body);

/** Invoice is a protected PDF stream, so it needs the bearer token — a plain <a href> would 401. */
export const downloadInvoice = async (id: string, orderNumber: string) => {
  const res = await http.get(`/orders/${id}/invoice`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
