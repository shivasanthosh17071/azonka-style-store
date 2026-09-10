import { apiGet } from "./client";
import type { Category } from "@/types";

export const getCategoryTree = () => apiGet<{ categories: Category[] }>("/categories");
