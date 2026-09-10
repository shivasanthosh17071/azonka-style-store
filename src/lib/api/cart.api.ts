import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type { HydratedCart } from "@/types";

export const getCart = () => apiGet<HydratedCart>("/cart");

export const addCartItem = (body: { product: string; sku: string; qty?: number }) =>
  apiPost<HydratedCart>("/cart/items", body);

export const updateCartItem = (itemId: string, qty: number) =>
  apiPut<HydratedCart>(`/cart/items/${itemId}`, { qty });

export const removeCartItem = (itemId: string) => apiDelete<HydratedCart>(`/cart/items/${itemId}`);

export const clearCart = () => apiDelete<HydratedCart>("/cart");
