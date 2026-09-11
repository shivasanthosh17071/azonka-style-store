import { useQuery } from "@tanstack/react-query";
import * as reelsApi from "@/lib/api/reels.api";

/** Public, storefront-facing reels — active only. */
export const useReels = () =>
  useQuery({
    queryKey: ["reels"],
    queryFn: () => reelsApi.listReels().then((r) => r.reels),
    staleTime: 60 * 1000,
  });
