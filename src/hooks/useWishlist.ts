import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import * as usersApi from "@/lib/api/users.api";
import { useAuth } from "@/context/AuthProvider";

/**
 * Wishlist is server-backed only (no guest endpoint exists) — tapping the heart while
 * logged out should route to /login rather than silently no-op; see `toggle`'s return value.
 */
export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => usersApi.getWishlist().then((r) => r.wishlist),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["wishlist"] });

  const addMutation = useMutation({
    mutationFn: usersApi.addToWishlist,
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: usersApi.removeFromWishlist,
    onSuccess: invalidate,
  });

  const productIds = useMemo(
    () => new Set((wishlistQuery.data || []).map((p) => p._id)),
    [wishlistQuery.data],
  );

  const isWishlisted = (productId: string) => productIds.has(productId);

  /** Returns false (and the caller should redirect to /login) when the user isn't signed in. */
  const toggle = (productId: string): boolean => {
    if (!isAuthenticated) return false;
    if (isWishlisted(productId)) removeMutation.mutate(productId);
    else {
      addMutation.mutate(productId);
      toast.success("Added to wishlist");
    }
    return true;
  };

  return {
    products: wishlistQuery.data || [],
    isLoading: isAuthenticated && wishlistQuery.isLoading,
    isWishlisted,
    toggle,
  };
}
