import { apiGet } from "./client";
import type { CategorySplitRow, DashboardSummary, Order, SalesChartPoint, TopProduct } from "@/types";

export const getDashboardSummary = () => apiGet<DashboardSummary>("/admin/dashboard/summary");

export const getSalesChart = (params: { range?: "7d" | "30d" | "12m"; groupBy?: "day" | "week" | "month" } = {}) =>
  apiGet<{ range: string; groupBy: string; points: SalesChartPoint[] }>("/admin/dashboard/sales-chart", { params });

export const getTopProducts = (limit = 10) =>
  apiGet<{ products: TopProduct[] }>("/admin/dashboard/top-products", { params: { limit } });

export const getCategorySplit = () => apiGet<{ split: CategorySplitRow[] }>("/admin/dashboard/category-split");

export const getRecentOrders = (limit = 10) =>
  apiGet<{ orders: Order[] }>("/admin/dashboard/recent-orders", { params: { limit } });
