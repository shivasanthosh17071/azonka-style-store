import { useQuery } from "@tanstack/react-query";
import * as productsApi from "@/lib/api/products.api";
import * as categoriesApi from "@/lib/api/categories.api";
import type { ProductListParams } from "@/types";

export const useProducts = (params: ProductListParams = {}, enabled = true) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.listProducts(params),
    placeholderData: (prev) => prev,
    enabled,
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getProductBySlug(slug as string).then((r) => r.product),
    enabled: Boolean(slug),
  });

export const useRelatedProducts = (id: string | undefined) =>
  useQuery({
    queryKey: ["related-products", id],
    queryFn: () => productsApi.getRelatedProducts(id as string).then((r) => r.products),
    enabled: Boolean(id),
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategoryTree().then((r) => r.categories),
    staleTime: 5 * 60_000,
  });
