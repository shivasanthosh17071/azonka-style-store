import { apiGet, apiGetWithMeta } from "./client";
import type { CustomerDetail, CustomerRow, PaginationMeta } from "@/types";

export const listCustomers = async (params: { page?: number; limit?: number; search?: string } = {}) => {
  const { data, meta } = await apiGetWithMeta<{ customers: CustomerRow[] }>("/admin/customers", { params });
  return { customers: data.customers, meta: meta as PaginationMeta };
};

export const getCustomer = (id: string) => apiGet<CustomerDetail>(`/admin/customers/${id}`);
