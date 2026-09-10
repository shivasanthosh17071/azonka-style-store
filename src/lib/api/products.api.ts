import { apiGet, apiGetWithMeta } from "./client";
import type { PaginationMeta, Product, ProductListParams } from "@/types";

export const listProducts = async (params: ProductListParams = {}) => {
  const { data, meta } = await apiGetWithMeta<{ products: Product[] }>("/products", { params });
  return { products: data.products, meta: meta as PaginationMeta };
};

export const getProductBySlug = (slug: string) => apiGet<{ product: Product }>(`/products/${slug}`);

export const getRelatedProducts = (id: string) => apiGet<{ products: Product[] }>(`/products/${id}/related`);
