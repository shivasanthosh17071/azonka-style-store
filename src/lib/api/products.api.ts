import { apiDelete, apiGet, apiGetWithMeta, apiPatch, apiPost, apiPut } from "./client";
import type { PaginationMeta, Product, ProductListParams, ProductPayload } from "@/types";

export const listProducts = async (params: ProductListParams = {}) => {
  const { data, meta } = await apiGetWithMeta<{ products: Product[] }>("/products", { params });
  return { products: data.products, meta: meta as PaginationMeta };
};

export const getProductBySlug = (slug: string) => apiGet<{ product: Product }>(`/products/${slug}`);

export const getRelatedProducts = (id: string) => apiGet<{ products: Product[] }>(`/products/${id}/related`);

/* ---------- admin ---------- */

export const createProduct = (body: ProductPayload) => apiPost<{ product: Product }>("/products", body);

export const updateProduct = (id: string, body: Partial<ProductPayload>) =>
  apiPut<{ product: Product }>(`/products/${id}`, body);

export const deleteProduct = (id: string) => apiDelete<{ product: Product }>(`/products/${id}`);

export const updateVariantStock = (id: string, variantId: string, body: { stock?: number; delta?: number }) =>
  apiPatch<{ variant: Product["variants"][number] }>(`/products/${id}/variants/${variantId}/stock`, body);
