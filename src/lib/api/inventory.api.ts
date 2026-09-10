import { apiGet } from "./client";
import type { LowStockRow } from "@/types";

export const getLowStock = (threshold?: number) =>
  apiGet<{ threshold: number; variants: LowStockRow[] }>("/admin/inventory/low-stock", {
    params: threshold ? { threshold } : undefined,
  });
