import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as dashboardApi from "@/lib/api/dashboard.api";
import * as productsApi from "@/lib/api/products.api";
import * as categoriesApi from "@/lib/api/categories.api";
import * as ordersApi from "@/lib/api/orders.api";
import * as couponsApi from "@/lib/api/coupons.api";
import * as reviewsApi from "@/lib/api/reviews.api";
import * as customersApi from "@/lib/api/customers.api";
import * as inventoryApi from "@/lib/api/inventory.api";
import * as settingsApi from "@/lib/api/settings.api";
import type { CategoryPayload } from "@/lib/api/categories.api";
import type { OrderListParams } from "@/lib/api/orders.api";
import type { CouponPayload, OrderStatus, ProductListParams, ProductPayload, StoreSettings } from "@/types";

/* ---------- dashboard ---------- */

export const useDashboardSummary = () =>
  useQuery({ queryKey: ["admin", "dashboard-summary"], queryFn: dashboardApi.getDashboardSummary });

export const useSalesChart = (range: "7d" | "30d" | "12m", groupBy: "day" | "week" | "month") =>
  useQuery({
    queryKey: ["admin", "sales-chart", range, groupBy],
    queryFn: () => dashboardApi.getSalesChart({ range, groupBy }),
  });

export const useTopProducts = (limit = 5) =>
  useQuery({ queryKey: ["admin", "top-products", limit], queryFn: () => dashboardApi.getTopProducts(limit) });

export const useCategorySplit = () =>
  useQuery({ queryKey: ["admin", "category-split"], queryFn: dashboardApi.getCategorySplit });

export const useRecentOrders = (limit = 8) =>
  useQuery({ queryKey: ["admin", "recent-orders", limit], queryFn: () => dashboardApi.getRecentOrders(limit) });

/* ---------- products ---------- */

export const useAdminProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => productsApi.listProducts({ includeInactive: true, ...params }),
    placeholderData: (prev) => prev,
  });

export const useAdminProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: ["admin", "product", slug],
    queryFn: () => productsApi.getProductBySlug(slug as string).then((r) => r.product),
    enabled: Boolean(slug),
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductPayload) => productsApi.createProduct(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ProductPayload> }) => productsApi.updateProduct(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
};

export const useUpdateVariantStock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, body }: { productId: string; variantId: string; body: { stock?: number; delta?: number } }) =>
      productsApi.updateVariantStock(productId, variantId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["admin", "low-stock"] });
    },
  });
};

/* ---------- categories ---------- */

export const useAdminCategories = () =>
  useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => categoriesApi.getCategoryTree().then((r) => r.categories),
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CategoryPayload) => categoriesApi.createCategory(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CategoryPayload> }) => categoriesApi.updateCategory(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

/* ---------- orders ---------- */

export const useAdminOrders = (params: OrderListParams = {}) =>
  useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => ordersApi.listOrders(params),
    placeholderData: (prev) => prev,
  });

export const useAdminOrder = (id: string | undefined) =>
  useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => ordersApi.getOrder(id as string),
    enabled: Boolean(id),
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
      ordersApi.updateStatus(id, status, note),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "order", vars.id] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard-summary"] });
    },
  });
};

export const useUpdateCourier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof ordersApi.updateCourier>[1] }) =>
      ordersApi.updateCourier(id, body),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["admin", "order", vars.id] }),
  });
};

export const useRefundOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: string; body?: { amount?: number; reason?: string } }) =>
      ordersApi.refundOrder(orderId, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "order", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

/* ---------- coupons ---------- */

export const useAdminCoupons = (params: { page?: number; limit?: number } = {}) =>
  useQuery({ queryKey: ["admin", "coupons", params], queryFn: () => couponsApi.listCoupons(params) });

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CouponPayload) => couponsApi.createCoupon(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CouponPayload> }) => couponsApi.updateCoupon(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
};

/* ---------- reviews ---------- */

export const usePendingReviews = (params: { page?: number; limit?: number } = {}) =>
  useQuery({ queryKey: ["admin", "pending-reviews", params], queryFn: () => reviewsApi.listPendingReviews(params) });

export const useModerateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) => reviewsApi.moderateReview(id, isApproved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "pending-reviews"] }),
  });
};

/* ---------- customers ---------- */

export const useAdminCustomers = (params: { page?: number; limit?: number; search?: string } = {}) =>
  useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: () => customersApi.listCustomers(params),
    placeholderData: (prev) => prev,
  });

export const useAdminCustomer = (id: string | undefined) =>
  useQuery({
    queryKey: ["admin", "customer", id],
    queryFn: () => customersApi.getCustomer(id as string),
    enabled: Boolean(id),
  });

/* ---------- inventory ---------- */

export const useLowStock = (threshold?: number) =>
  useQuery({ queryKey: ["admin", "low-stock", threshold], queryFn: () => inventoryApi.getLowStock(threshold) });

/* ---------- settings ---------- */

export const useAdminSettings = () => useQuery({ queryKey: ["admin", "settings"], queryFn: settingsApi.getSettings });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<StoreSettings>) => settingsApi.updateSettings(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
};
