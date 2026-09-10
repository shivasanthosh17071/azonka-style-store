import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as shippingApi from "@/lib/api/shipping.api";
import * as couponsApi from "@/lib/api/coupons.api";
import * as usersApi from "@/lib/api/users.api";
import { useAuth } from "@/context/AuthProvider";

export const useCheckServiceability = () =>
  useMutation({
    mutationFn: (pincode: string) => shippingApi.checkServiceability(pincode),
  });

export const useApplyCoupon = () =>
  useMutation({
    mutationFn: (body: { code: string; items?: { product: string; sku: string; qty: number }[]; fromCart?: boolean }) =>
      couponsApi.applyCoupon(body),
  });

export const useAddresses = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => usersApi.listAddresses().then((r) => r.addresses),
    enabled: isAuthenticated,
  });
};

export const useAddressMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const add = useMutation({
    mutationFn: usersApi.addAddress,
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof usersApi.updateAddress>[1] }) =>
      usersApi.updateAddress(id, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: usersApi.deleteAddress,
    onSuccess: invalidate,
  });

  return { add, update, remove };
};
