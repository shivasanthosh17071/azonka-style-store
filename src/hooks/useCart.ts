import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import * as cartApi from "@/lib/api/cart.api";
import { useAuth } from "@/context/AuthProvider";
import { useGuestCart, type GuestCartItem } from "@/context/GuestCartProvider";
import { ApiException } from "@/lib/api/client";

export interface UnifiedCartLine {
  key: string; // cart itemId when authenticated, sku when guest
  productId: string;
  slug: string;
  name: string;
  image?: string;
  size: string;
  color: string;
  sku: string;
  qty: number;
  price: number;
  lineTotal: number;
  stock?: number;
  inStock: boolean;
}

export interface UnifiedCartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  isEstimate: boolean;
}

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const guest = useGuestCart();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 10_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["cart"] });

  const addMutation = useMutation({
    mutationFn: (body: { product: string; sku: string; qty?: number }) => cartApi.addCartItem(body),
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not add to cart"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) => cartApi.updateCartItem(itemId, qty),
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not update quantity"),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartApi.removeCartItem(itemId),
    onSuccess: invalidate,
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: invalidate,
  });

  const lines: UnifiedCartLine[] = useMemo(() => {
    if (isAuthenticated) {
      return (cartQuery.data?.items || []).map((item) => ({
        key: item._id,
        productId: item.product._id,
        slug: item.product.slug,
        name: item.product.name,
        image: item.product.image,
        size: item.variant.size,
        color: item.variant.color,
        sku: item.variant.sku,
        qty: item.qty,
        price: item.price,
        lineTotal: item.price * item.qty,
        stock: item.stock,
        inStock: item.inStock,
      }));
    }
    return guest.items.map((item) => ({
      key: item.sku,
      productId: item.product,
      slug: item.slug,
      name: item.name,
      image: item.image,
      size: item.size,
      color: item.color,
      sku: item.sku,
      qty: item.qty,
      price: item.price,
      lineTotal: item.price * item.qty,
      inStock: true,
    }));
  }, [isAuthenticated, cartQuery.data, guest.items]);

  const totals: UnifiedCartTotals = useMemo(() => {
    if (isAuthenticated && cartQuery.data) {
      return { ...cartQuery.data.totals, isEstimate: false };
    }
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    return { subtotal, discount: 0, shippingFee: 0, tax: 0, totalAmount: subtotal, isEstimate: true };
  }, [isAuthenticated, cartQuery.data, lines]);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const addItem = (args: { productId: string; sku: string; qty?: number; snapshot: Omit<GuestCartItem, "product" | "sku" | "qty"> }) => {
    const qty = args.qty ?? 1;
    if (isAuthenticated) {
      addMutation.mutate({ product: args.productId, sku: args.sku, qty });
    } else {
      guest.addItem({ product: args.productId, sku: args.sku, qty, ...args.snapshot });
      toast.success("Added to cart");
    }
  };

  const updateQty = (key: string, qty: number) => {
    if (isAuthenticated) updateMutation.mutate({ itemId: key, qty });
    else guest.updateQty(key, qty);
  };

  const removeItem = (key: string) => {
    if (isAuthenticated) removeMutation.mutate(key);
    else guest.removeItem(key);
  };

  const clear = () => {
    if (isAuthenticated) clearMutation.mutate();
    else guest.clear();
  };

  /** Pushes every guest-cart line into the server cart; call once right after login/register. */
  const mergeGuestCartIntoServer = async () => {
    if (!guest.items.length) return;
    const results = await Promise.allSettled(
      guest.items.map((item) => cartApi.addCartItem({ product: item.product, sku: item.sku, qty: item.qty })),
    );
    const failed = results.filter((r) => r.status === "rejected").length;
    guest.clear();
    await invalidate();
    if (failed > 0) {
      toast.info(`${failed} item(s) from your earlier cart could not be added (out of stock or unavailable)`);
    }
  };

  return {
    lines,
    totals,
    count,
    isLoading: isAuthenticated && cartQuery.isLoading,
    addItem,
    updateQty,
    removeItem,
    clear,
    mergeGuestCartIntoServer,
  };
}
