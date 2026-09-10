import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type { Category } from "@/types";

export const getCategoryTree = () => apiGet<{ categories: Category[] }>("/categories");

/* ---------- admin ---------- */

export interface CategoryPayload {
  name: string;
  image?: { url: string; publicId: string };
  parentCategory?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export const createCategory = (body: CategoryPayload) => apiPost<{ category: Category }>("/categories", body);

export const updateCategory = (id: string, body: Partial<CategoryPayload>) =>
  apiPut<{ category: Category }>(`/categories/${id}`, body);

export const deleteCategory = (id: string) => apiDelete<undefined>(`/categories/${id}`);
