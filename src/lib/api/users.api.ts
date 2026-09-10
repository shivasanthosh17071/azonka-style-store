import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type { Address, Product, User } from "@/types";

export const listAddresses = () => apiGet<{ addresses: Address[] }>("/users/me/addresses");

export const addAddress = (body: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }) =>
  apiPost<{ address: Address }>("/users/me/addresses", body);

export const updateAddress = (id: string, body: Partial<Omit<Address, "_id">>) =>
  apiPut<{ address: Address }>(`/users/me/addresses/${id}`, body);

export const deleteAddress = (id: string) => apiDelete<undefined>(`/users/me/addresses/${id}`);

export const updateProfile = (body: { name?: string; email?: string; phone?: string }) =>
  apiPut<{ user: User }>("/users/me/profile", body);

export const getWishlist = () => apiGet<{ wishlist: Product[] }>("/users/me/wishlist");

export const addToWishlist = (productId: string) => apiPost<undefined>(`/users/me/wishlist/${productId}`);

export const removeFromWishlist = (productId: string) => apiDelete<undefined>(`/users/me/wishlist/${productId}`);
