import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ordersApi from "@/lib/api/orders.api";
import type { CreateOrderPayload } from "@/types";

export const useOrders = (params: { page?: number; status?: string } = {}) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.listOrders(params),
  });

export const useOrder = (id: string | undefined) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrder(id as string),
    enabled: Boolean(id),
  });

export const useCreateOrder = () =>
  useMutation({
    mutationFn: (body: CreateOrderPayload) => ordersApi.createOrder(body),
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => ordersApi.cancelOrder(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
};

export const useTrackOrder = () =>
  useMutation({
    mutationFn: (params: { orderNumber: string; phone?: string; email?: string }) => ordersApi.trackOrder(params),
  });
